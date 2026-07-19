import { AssetManager } from '../AssetManager.js';
import { Game } from '../Game.js';

export class SettingsPanel {
    constructor() {
        this.active = false;
        this.targetY = -1200;
        this.currentY = -1200; // start off-screen
        
        // Dimensions and layout
        this.width = 1000;
        this.height = 800;
        this.x = (Game.WIDTH - this.width) / 2;
        
        // Target active position (centered)
        this.activeY = (Game.HEIGHT - this.height) / 2;
        
        // Settings Data
        this.settings = {
            brightness: 0.8,
            music: 0.5,
            sfx: 0.7
        };
        
        // Slider definitions
        this.sliders = [
            { id: 'brightness', label: 'Brightness', yOffset: 250 },
            { id: 'music', label: 'Music Volume', yOffset: 400 },
            { id: 'sfx', label: 'SFX Volume', yOffset: 550 }
        ];
        
        this.activeSlider = null;
    }
    
    activate() {
        this.active = true;
        this.currentY = -this.height - 100; // reset to top
        this.targetY = this.activeY;
    }
    
    deactivate() {
        this.active = false;
        this.targetY = -this.height - 100;
    }
    
    update(dt, input) {
        // Smooth slide animation (lerp)
        const diff = this.targetY - this.currentY;
        this.currentY += diff * 10 * dt;
        
        // Deactivate completely when it slides off-screen
        if (!this.active && this.currentY < -this.height) {
            return;
        }
        
        // If it's mostly hidden, do not process input
        if (Math.abs(diff) > 50 && !this.active) return;
        
        // Input handling (only when active)
        if (this.active && Math.abs(diff) < 5) {
            this._handleInput(input);
        }
    }
    
    _handleInput(input) {
        const mx = input.mouseX;
        const my = input.mouseY;
        
        // Check Close button (top right area of the panel)
        const closeX = this.x + this.width - 150;
        const closeY = this.currentY + 120;
        const closeSize = 60;
        
        if (input.mouseClicked) {
            if (mx >= closeX - closeSize/2 && mx <= closeX + closeSize/2 &&
                my >= closeY - closeSize/2 && my <= closeY + closeSize/2) {
                this.deactivate();
                // We consume the input so it doesn't click other things
                input.mouseClicked = false;
                return;
            }
            
            // Check sliders
            for (const slider of this.sliders) {
                const sY = this.currentY + slider.yOffset;
                const sX = this.x + 400; // Start of slider track (moved right)
                const sW = 350; // Track width (slightly smaller)
                
                // Hitbox for slider
                if (mx >= sX - 20 && mx <= sX + sW + 20 &&
                    my >= sY - 30 && my <= sY + 30) {
                    this.activeSlider = slider.id;
                    break;
                }
            }
        }
        
        // Drag active slider
        if (input.mouseDown && this.activeSlider) {
            const slider = this.sliders.find(s => s.id === this.activeSlider);
            if (slider) {
                const sX = this.x + 400;
                const sW = 350;
                
                // Calculate percentage based on mouse position
                let pct = (mx - sX) / sW;
                pct = Math.max(0, Math.min(1, pct));
                
                this.settings[this.activeSlider] = pct;
                
                // TODO: Apply actual settings (e.g. adjust audio context or canvas filter)
            }
        } else {
            this.activeSlider = null;
        }
    }
    
    render(ctx) {
        // Hide if offscreen
        if (!this.active && this.currentY < -this.height) return;
        
        ctx.save();
        
        // Draw background overlay if almost fully dropped down
        if (this.currentY > -100) {
            const alpha = Math.min(0.6, (this.currentY + 100) / (this.activeY + 100) * 0.6);
            ctx.fillStyle = `rgba(0,0,0,${alpha})`;
            ctx.fillRect(0, 0, Game.WIDTH, Game.HEIGHT);
        }
        
        // Draw map background
        const bgImg = AssetManager.get('settings_bg');
        if (bgImg) {
            ctx.drawImage(bgImg, this.x, this.currentY, this.width, this.height);
        } else {
            AssetManager.drawPlaceholder(ctx, this.x, this.currentY, this.width, this.height, '#c2a878', 'MAP_BACKGROUND');
        }
        
        // Draw Content
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Title
        ctx.fillStyle = '#3a2318';
        ctx.font = 'bold 72px "Pirata One", serif';
        ctx.fillText('SETTINGS', this.x + this.width / 2, this.currentY + 130);
        
        // Draw Sliders
        for (const slider of this.sliders) {
            const sX = this.x + 400;
            const sY = this.currentY + slider.yOffset;
            const sW = 350;
            const val = this.settings[slider.id];
            
            // Label
            ctx.textAlign = 'right';
            ctx.font = 'bold 36px "Cinzel Decorative", serif';
            ctx.fillText(slider.label, sX - 40, sY);
            
            // Track background
            ctx.fillStyle = '#6d4c41';
            ctx.fillRect(sX, sY - 10, sW, 20);
            
            // Track fill
            ctx.fillStyle = '#3e2723';
            ctx.fillRect(sX, sY - 10, sW * val, 20);
            
            // Knob
            ctx.fillStyle = '#ffcc80';
            ctx.strokeStyle = '#3e2723';
            ctx.lineWidth = 4;
            
            ctx.beginPath();
            ctx.arc(sX + sW * val, sY, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // Percentage Text
            ctx.textAlign = 'left';
            ctx.fillStyle = '#3a2318';
            ctx.font = 'bold 28px monospace';
            ctx.fillText(Math.round(val * 100) + '%', sX + sW + 30, sY);
        }
        
        // Draw Close Button
        const closeX = this.x + this.width - 150;
        const closeY = this.currentY + 120;
        
        ctx.fillStyle = '#d32f2f';
        ctx.beginPath();
        ctx.arc(closeX, closeY, 30, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('X', closeX, closeY + 2);
        
        ctx.restore();
    }
}
