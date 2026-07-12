/* ============================================================
   DoorTransition.js — Door Close/Open Reveal Animation
   Similar to Unity's transition/cutscene controller
   
   Flow:
   1. CLOSING — Top door slides DOWN, bottom door slides UP
   2. CLOSED  — Both doors held together for 1 second
   3. OPENING — Doors slide apart, revealing menu behind
   4. DONE    — Transition to MenuScene
   ============================================================ */

import { Game } from '../Game.js';
import { AssetManager } from '../AssetManager.js';
import { MenuScene } from './MenuScene.js';

/** Animation states (like Unity's Animator states) */
const DoorState = {
    CLOSING: 'CLOSING',
    CLOSED: 'CLOSED',
    OPENING: 'OPENING',
    DONE: 'DONE',
};

export class DoorTransition {
    constructor(fromScene) {
        this.game = null;
        this.input = null;

        // The scene we are transitioning from (e.g. TitleScene)
        this.fromScene = fromScene;

        // State machine
        this.state = DoorState.CLOSING;
        this.stateTime = 0; // time in current state

        // Door dimensions (from spec: each 1920×580, slight overlap)
        this.doorW = Game.WIDTH;    // 1920
        this.doorH = 580;

        // Door positions (Y coordinate of the top edge)
        // CLOSING start positions: off-screen
        this.topDoorY = -this.doorH;         // starts above screen
        this.bottomDoorY = Game.HEIGHT;      // starts below screen

        // CLOSED target positions:
        // Top door: its bottom edge at 540 (center - a bit higher)
        // Bottom door: its top edge at 500 (overlaps slightly)
        this.topDoorTarget = Game.HEIGHT / 2 - this.doorH + 40;    // = 540 - 580 + 40 = 0
        this.bottomDoorTarget = Game.HEIGHT / 2 - 40;              // = 500

        // Timing
        this.closeDuration = 1.2;  // seconds for doors to close
        this.holdDuration = 1.0;   // seconds doors stay closed
        this.openDuration = 1.0;   // seconds for doors to open

        // The menu scene we reveal when opening
        this.menuScene = null;
    }

    /* ----------------------------------------------------------
       Lifecycle
       ---------------------------------------------------------- */

    enter() {
        this.state = DoorState.CLOSING;
        this.stateTime = 0;

        // Initialize the menu scene early so it's ready when doors open
        this.menuScene = new MenuScene();
        this.menuScene.game = this.game;
        this.menuScene.ctx = this.game.ctx;
        this.menuScene.input = this.input;
        this.menuScene.enter();

        // Ensure fromScene has context references too
        if (this.fromScene) {
            this.fromScene.game = this.game;
            this.fromScene.ctx = this.game.ctx;
            this.fromScene.input = this.input;
        }

        console.log('[DoorTransition] Enter — doors closing');
    }

    exit() {
        console.log('[DoorTransition] Exit');
    }

    /* ----------------------------------------------------------
       Update — State machine
       ---------------------------------------------------------- */

    update(dt) {
        this.stateTime += dt;
        this.input.updateHoldTime(dt);

        // Update the active background scene
        if (this.state === DoorState.CLOSING) {
            if (this.fromScene && this.fromScene.update) {
                this.fromScene.update(dt);
            }
        } else {
            if (this.menuScene && this.menuScene.update) {
                this.menuScene.update(dt);
            }
        }

        switch (this.state) {
            case DoorState.CLOSING:
                this._updateClosing(dt);
                break;
            case DoorState.CLOSED:
                this._updateClosed(dt);
                break;
            case DoorState.OPENING:
                this._updateOpening(dt);
                break;
            case DoorState.DONE:
                // Switch to menu scene
                this.game.setScene(this.menuScene);
                break;
        }
    }

    _updateClosing(dt) {
        const progress = Math.min(1, this.stateTime / this.closeDuration);
        // Ease-in-out (smooth acceleration/deceleration)
        const eased = this._easeInOutCubic(progress);

        this.topDoorY = -this.doorH + (this.topDoorTarget + this.doorH) * eased;
        this.bottomDoorY = Game.HEIGHT - (Game.HEIGHT - this.bottomDoorTarget) * eased;

        if (progress >= 1) {
            this.state = DoorState.CLOSED;
            this.stateTime = 0;
            console.log('[DoorTransition] Doors closed — holding');
        }
    }

    _updateClosed(dt) {
        if (this.stateTime >= this.holdDuration) {
            this.state = DoorState.OPENING;
            this.stateTime = 0;
            console.log('[DoorTransition] Opening doors');
        }
    }

    _updateOpening(dt) {
        const progress = Math.min(1, this.stateTime / this.openDuration);
        const eased = this._easeInOutCubic(progress);

        // Doors slide back to off-screen positions
        this.topDoorY = this.topDoorTarget - (this.topDoorTarget + this.doorH) * eased;
        this.bottomDoorY = this.bottomDoorTarget + (Game.HEIGHT - this.bottomDoorTarget) * eased;

        if (progress >= 1) {
            this.state = DoorState.DONE;
            console.log('[DoorTransition] Doors fully open — transitioning to menu');
        }
    }

    /* ----------------------------------------------------------
       Render
       ---------------------------------------------------------- */

    render(ctx) {
        const W = Game.WIDTH;
        const H = Game.HEIGHT;

        // Draw the background scene behind the doors
        if (this.state === DoorState.CLOSING) {
            if (this.fromScene && this.fromScene.render) {
                this.fromScene.render(ctx);
            }
        } else {
            if (this.menuScene && this.menuScene.render) {
                this.menuScene.render(ctx);
            }
        }

        // Draw doors ON TOP
        this._renderDoor(ctx, 'door_top', 0, this.topDoorY, this.doorW, this.doorH, true);
        this._renderDoor(ctx, 'door_bottom', 0, this.bottomDoorY, this.doorW, this.doorH, false);

        // Seam glow only when doors are almost closed (distance between them < 60px)
        const doorDistance = this.bottomDoorY - (this.topDoorY + this.doorH);
        if (doorDistance < 60 && (this.state === DoorState.CLOSING || this.state === DoorState.CLOSED)) {
            const seamY = (this.topDoorY + this.doorH + this.bottomDoorY) / 2;
            const intensity = (1 - doorDistance / 60) * 0.25; // fade in as they meet
            const seamGrad = ctx.createLinearGradient(0, seamY - 20, 0, seamY + 20);
            seamGrad.addColorStop(0, 'rgba(255, 200, 80, 0)');
            seamGrad.addColorStop(0.5, `rgba(255, 200, 80, ${intensity})`);
            seamGrad.addColorStop(1, 'rgba(255, 200, 80, 0)');
            ctx.fillStyle = seamGrad;
            ctx.fillRect(0, seamY - 20, W, 40);
        }
    }

    _renderDoor(ctx, assetKey, x, y, w, h, isTop) {
        const img = AssetManager.get(assetKey);

        if (img) {
            ctx.drawImage(img, x, y, w, h);
        } else {
            // Placeholder door
            this._drawPlaceholderDoor(ctx, x, y, w, h, isTop);
        }
    }

    /* ----------------------------------------------------------
       Placeholder door graphics
       ---------------------------------------------------------- */

    _drawPlaceholderDoor(ctx, x, y, w, h, isTop) {
        // High visibility bright colors for layout/animation testing
        const grad = ctx.createLinearGradient(x, y, x, y + h);
        if (isTop) {
            grad.addColorStop(0, '#e67e22'); // Bright orange
            grad.addColorStop(1, '#d35400');
        } else {
            grad.addColorStop(0, '#3498db'); // Bright blue/teal
            grad.addColorStop(1, '#2980b9');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, w, h);

        // Thick white borders around the doors
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 6;
        ctx.strokeRect(x + 3, y + 3, w - 6, h - 6);

        // Hazard stripes along the meeting edge
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        const stripeWidth = 40;
        const stripeGap = 80;
        if (isTop) {
            // Draw diagonal stripes at the bottom of the top door
            for (let sx = -h; sx < w; sx += stripeGap) {
                ctx.beginPath();
                ctx.moveTo(sx, y + h - 50);
                ctx.lineTo(sx + stripeWidth, y + h - 50);
                ctx.lineTo(sx + stripeWidth + 50, y + h);
                ctx.lineTo(sx + 50, y + h);
                ctx.closePath();
                ctx.fill();
            }
        } else {
            // Draw diagonal stripes at the top of the bottom door
            for (let sx = -h; sx < w; sx += stripeGap) {
                ctx.beginPath();
                ctx.moveTo(sx, y);
                ctx.lineTo(sx + stripeWidth, y);
                ctx.lineTo(sx + stripeWidth + 50, y + 50);
                ctx.lineTo(sx + 50, y + 50);
                ctx.closePath();
                ctx.fill();
            }
        }

        // Metal hinges / handles
        ctx.fillStyle = '#ffffff';
        const hingeSize = 50;
        if (isTop) {
            // Hinges/locks at bottom edge (where doors meet)
            ctx.fillRect(x + 120, y + h - 30, hingeSize, 20);
            ctx.fillRect(x + w - 170, y + h - 30, hingeSize, 20);
        } else {
            // Hinges/locks at top edge
            ctx.fillRect(x + 120, y + 10, hingeSize, 20);
            ctx.fillRect(x + w - 170, y + 10, hingeSize, 20);
        }

        // Giant bold text labels
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Shadow for text
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 8;
        
        const label = isTop ? '🚪 TOP DOOR CLOSING/OPENING' : '🚪 BOTTOM DOOR CLOSING/OPENING';
        ctx.fillText(label, x + w / 2, y + h / 2);
        
        ctx.font = '20px monospace';
        ctx.fillStyle = '#dddddd';
        const fileLabel = isTop ? 'assets/door/door_top.png' : 'assets/door/door_bottom.png';
        ctx.fillText(`(Missing: ${fileLabel})`, x + w / 2, y + h / 2 + 50);

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
    }

    /* ----------------------------------------------------------
       Easing function
       ---------------------------------------------------------- */

    _easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
}
