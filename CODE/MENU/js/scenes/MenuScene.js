/* ============================================================
   MenuScene.js — Main Menu Screen
   Similar to Unity's main menu scene with UI Canvas
   
   Layout (matches the sketch):
   - Ocean loop background (fills inner area, scrolls)
   - Decorative border frame (48px, empty/transparent)
   - Logo (top-left, 520×260)
   - 5 menu buttons (stacked left side)
   - Helm board + rotating wheel (top, above border)
   ============================================================ */

import { Game } from '../Game.js';
import { AssetManager } from '../AssetManager.js';
import { OceanBackground } from '../components/OceanBackground.js';
import { HelmDecoration } from '../components/HelmDecoration.js';
import { MenuButton } from '../components/MenuButton.js';

export class MenuScene {
    constructor() {
        this.game = null;
        this.ctx = null;
        this.input = null;

        // Layout constants
        this.BORDER = 48;

        // Components (like Unity GameObjects)
        this.ocean = new OceanBackground();
        this.helm = new HelmDecoration();
        this.buttons = [];
        this.logoImage = null; // loaded from AssetManager

        // Elapsed time since scene started (for entrance animations)
        this.elapsedTime = 0;

        // Track last mouse position for dragging direction
        this.lastMouseX = 0;

        // Auto-panning state (for scrolling back and forth)
        this.scrollDirection = 1;  // 1 = panning right, -1 = panning left
        this.autoScrollSpeed = 45; // speed of auto-scroll in pixels per second
    }

    /* ----------------------------------------------------------
       Lifecycle
       ---------------------------------------------------------- */

    enter() {
        this.elapsedTime = 0;

        // Create the 5 menu buttons (matching the sketch layout)
        const startX = this.BORDER - 15;     // moved more to the left
        const startY = 375;                   // moved lower down to match larger logo
        const gap = 10;                       // vertical gap between buttons
        const buttonH = 105;                  // matches MenuButton.height

        const buttonDefs = [
            { label: 'NEW GAME',    asset: 'btn_new_game',   action: () => this._onNewGame() },
            { label: 'LOAD GAME',   asset: 'btn_load_game',  action: () => this._onLoadGame() },
            { label: 'COLLECTION',  asset: 'btn_collection', action: () => this._onCollection() },
            { label: 'SETTINGS',    asset: 'btn_settings',   action: () => this._onSettings() },
            { label: 'EXIT',        asset: 'btn_exit',       action: () => this._onExit() },
        ];

        this.buttons = buttonDefs.map((def, i) => {
            const y = startY + i * (buttonH + gap);
            return new MenuButton(def.label, def.asset, startX, y, i, def.action);
        });

        console.log('[MenuScene] Enter — menu ready');
    }

    exit() {
        console.log('[MenuScene] Exit');
    }

    /* ----------------------------------------------------------
       Update
       ---------------------------------------------------------- */

    update(dt) {
        this.elapsedTime += dt;
        this.input.updateHoldTime(dt);

        const maxScrollX = Math.max(1, this.ocean.imageW - this.ocean.displayW);

        // Check if the user is dragging the background
        if (this.ocean.isDragging) {
            // 1. DRAGGING MODE: Drag drives background scroll, which rotates the fixed wheel
            this.ocean.update(dt, this.input);

            // Calculate interpolation percentage (0 to 1) based on current scroll position
            const t = this.ocean.scrollX / maxScrollX;

            // Make the wheel rotate lock-to-lock in place (4 full rotations over the scroll width)
            this.helm.wheelAngle = t * (Math.PI * 8);

            // Synchronize the auto-scroll direction based on drag velocity
            if (this.input.mouseX !== this.lastMouseX) {
                this.scrollDirection = (this.input.mouseX < this.lastMouseX) ? 1 : -1;
            }
        } else {
            // 2. AUTO-PLAY MODE: Ocean scrolls back and forth, wheel rotates in place in sync
            this.ocean.scrollX += this.autoScrollSpeed * this.scrollDirection * dt;

            // Check scroll boundaries and reverse direction
            if (this.scrollDirection === 1 && this.ocean.scrollX >= maxScrollX) {
                this.ocean.scrollX = maxScrollX;
                this.scrollDirection = -1; // reverse panning left
            } else if (this.scrollDirection === -1 && this.ocean.scrollX <= 0) {
                this.ocean.scrollX = 0;
                this.scrollDirection = 1;  // reverse panning right
            }

            // Sync the wheel's rotation angle to the current scroll position
            const t = this.ocean.scrollX / maxScrollX;
            this.helm.wheelAngle = t * (Math.PI * 8);

            // Update ocean input detection to allow user to click and start dragging
            this.ocean.update(dt, this.input);
        }

        // Store last mouse position for drag direction tracking
        this.lastMouseX = this.input.mouseX;

        // Update menu buttons
        for (const btn of this.buttons) {
            btn.update(dt, this.input, this.elapsedTime);
        }
    }

    /* ----------------------------------------------------------
       Render — Layer order matters (back to front)
       ---------------------------------------------------------- */

    render(ctx) {
        const W = Game.WIDTH;
        const H = Game.HEIGHT;

        // 1. Clear to dark background
        ctx.fillStyle = '#0a0e1a';
        ctx.fillRect(0, 0, W, H);

        // 2. Ocean background (inside the border area)
        this.ocean.render(ctx);

        // 3. Decorative border frame
        this._renderBorder(ctx, W, H);

        // 4. Logo (top-left inside border)
        this._renderLogo(ctx);

        // 5. Menu buttons
        for (const btn of this.buttons) {
            btn.render(ctx);
        }

        // 6. Helm decoration (on top of everything)
        this.helm.render(ctx);
    }

    /* ----------------------------------------------------------
       Border Frame
       The green border from the sketch — an empty frame around
       the inner game area
       ---------------------------------------------------------- */

    _renderBorder(ctx, W, H) {
        const img = AssetManager.get('menu_border');

        if (img) {
            // Draw the high-quality digital art border frame over the entire screen
            ctx.drawImage(img, 0, 0, W, H);
        } else {
            const B = this.BORDER;

            // Outer edge of border
            ctx.strokeStyle = '#2a5a2a';  // dark green (from sketch)
            ctx.lineWidth = 4;

            // Draw the border as 4 rectangles (top, bottom, left, right)
            // This leaves the interior open for the ocean

            // Top border bar
            const topGrad = ctx.createLinearGradient(0, 0, 0, B);
            topGrad.addColorStop(0, '#1a3a1a');
            topGrad.addColorStop(0.5, '#2d5a2d');
            topGrad.addColorStop(1, '#1a3a1a');
            ctx.fillStyle = topGrad;
            ctx.fillRect(0, 0, W, B);

            // Bottom border bar
            ctx.fillRect(0, H - B, W, B);

            // Left border bar
            const sideGrad = ctx.createLinearGradient(0, 0, B, 0);
            sideGrad.addColorStop(0, '#1a3a1a');
            sideGrad.addColorStop(0.5, '#2d5a2d');
            sideGrad.addColorStop(1, '#1a3a1a');
            ctx.fillStyle = sideGrad;
            ctx.fillRect(0, B, B, H - B * 2);

            // Right border bar
            ctx.fillRect(W - B, B, B, H - B * 2);

            // Inner border line (gold/brass to contrast)
            ctx.strokeStyle = 'rgba(180, 150, 80, 0.5)';
            ctx.lineWidth = 2;
            ctx.strokeRect(B, B, W - B * 2, H - B * 2);

            // Outer border line
            ctx.strokeStyle = 'rgba(100, 160, 100, 0.6)';
            ctx.lineWidth = 3;
            ctx.strokeRect(2, 2, W - 4, H - 4);

            // Corner accents (like rivets/bolts)
            ctx.fillStyle = '#8a8a6a';
            const corners = [
                [B / 2, B / 2],
                [W - B / 2, B / 2],
                [B / 2, H - B / 2],
                [W - B / 2, H - B / 2],
            ];
            for (const [cx, cy] of corners) {
                ctx.beginPath();
                ctx.arc(cx, cy, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#666';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
    }

    /* ----------------------------------------------------------
       Logo (top-left corner)
       ---------------------------------------------------------- */

    _renderLogo(ctx) {
        const img = AssetManager.get('logo_main');
        const logoX = this.BORDER - 20;     // overlaps left border
        const logoY = this.BORDER - 10;     // overlaps top border
        const logoW = 650;                  // scaled up
        const logoH = 325;                  // aspect ratio preserved (2:1)

        if (img) {
            ctx.drawImage(img, logoX, logoY, logoW, logoH);
        } else {
            // Placeholder logo
            AssetManager.drawPlaceholder(ctx, logoX, logoY, logoW, logoH, '#cc7700', 'LOGO (650×325)');

            // Draw temp title in the placeholder
            ctx.save();
            ctx.fillStyle = '#f4c430';
            ctx.font = 'bold 64px "Pirata One", serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 8;
            ctx.fillText('60 SEC', logoX + logoW / 2, logoY + logoH / 2 - 15);
            ctx.font = 'bold 36px "Cinzel Decorative", serif';
            ctx.fillText('2.0', logoX + logoW / 2, logoY + logoH / 2 + 40);
            ctx.restore();
        }
    }

    /* ----------------------------------------------------------
       Button Actions (stubs — to be wired to game logic)
       ---------------------------------------------------------- */

    _onNewGame() {
        console.log('[Menu] NEW GAME clicked');
        // TODO: Transition to game start
    }

    _onLoadGame() {
        console.log('[Menu] LOAD GAME clicked');
        // TODO: Open save file browser
    }

    _onCollection() {
        console.log('[Menu] COLLECTION clicked');
        // TODO: Open collection screen
    }

    _onSettings() {
        console.log('[Menu] SETTINGS clicked');
        // TODO: Open settings panel
    }

    _onExit() {
        console.log('[Menu] EXIT clicked');
        // TODO: Close game / confirm exit
    }
}
