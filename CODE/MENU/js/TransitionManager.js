import { Game } from './Game.js';
import { AssetManager } from './AssetManager.js';

export class TransitionManager {
    constructor(game) {
        this.game = game;
        
        // State
        this.isTransitioning = false;
        this.phase = 'idle'; // 'closing', 'holding', 'opening'
        
        this.pendingScene = null;
        
        // Timing
        this.timer = 0;
        this.HOLD_DURATION = 2.0; // seconds to stay closed
        this.ANIM_DURATION = 0.8; // seconds to slide doors
        
        // Door positions (0 to 1 progress)
        this.progress = 0; 
    }
    
    /** Trigger a scene change with the door transition */
    start(newScene) {
        if (this.isTransitioning) return;
        
        this.pendingScene = newScene;
        this.isTransitioning = true;
        this.phase = 'closing';
        this.progress = 0;
        this.timer = 0;
        
        // Block game input during transition
        this.game.input.endFrame(); // clear any clicks
    }
    
    update(dt) {
        if (!this.isTransitioning) return;
        
        if (this.phase === 'closing') {
            this.progress += dt / this.ANIM_DURATION;
            if (this.progress >= 1) {
                this.progress = 1;
                this.phase = 'holding';
                this.timer = 0;
                
                // SWAP SCENES HERE (while doors are fully closed)
                if (this.pendingScene) {
                    this.game.setScene(this.pendingScene);
                    this.pendingScene = null;
                }
            }
        } 
        else if (this.phase === 'holding') {
            this.timer += dt;
            if (this.timer >= this.HOLD_DURATION) {
                this.phase = 'opening';
            }
        }
        else if (this.phase === 'opening') {
            this.progress -= dt / this.ANIM_DURATION;
            if (this.progress <= 0) {
                this.progress = 0;
                this.phase = 'idle';
                this.isTransitioning = false;
            }
        }
    }
    
    render(ctx) {
        if (!this.isTransitioning) return;
        
        const W = Game.WIDTH;
        const H = Game.HEIGHT;
        
        // Easing function (easeOutQuad for closing, easeInQuad for opening)
        let t = this.progress;
        if (this.phase === 'closing') t = t * (2 - t);
        else if (this.phase === 'opening') t = t * t;
        else t = 1; // holding
        
        // We assume door images are 1920x540 (half height)
        const halfH = H / 2;
        
        // Y positions
        // Top door starts at -halfH (offscreen top), ends at 0
        const topY = -halfH + (halfH * t);
        
        // Bottom door starts at H (offscreen bottom), ends at halfH
        const bottomY = H - (halfH * t);
        
        const topImg = AssetManager.get('door_top');
        const bottomImg = AssetManager.get('door_bottom');
        
        ctx.save();
        
        // Draw top door
        if (topImg) {
            ctx.drawImage(topImg, 0, topY, W, halfH);
        } else {
            ctx.fillStyle = '#1e1008'; // dark wood
            ctx.fillRect(0, topY, W, halfH);
            ctx.strokeStyle = '#3a2318';
            ctx.lineWidth = 10;
            ctx.strokeRect(0, topY, W, halfH);
        }
        
        // Draw bottom door
        if (bottomImg) {
            ctx.drawImage(bottomImg, 0, bottomY, W, halfH);
        } else {
            ctx.fillStyle = '#1e1008';
            ctx.fillRect(0, bottomY, W, halfH);
            ctx.strokeStyle = '#3a2318';
            ctx.lineWidth = 10;
            ctx.strokeRect(0, bottomY, W, halfH);
        }
        
        // Draw a shadow/crack between them
        if (t > 0 && t < 1) {
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(0, topY + halfH, W, bottomY - (topY + halfH));
        }
        
        ctx.restore();
    }
}
