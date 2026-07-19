import { Game } from '../Game.js';

export class TextButton {
    constructor(label, x, y, onClick) {
        this.label = label;
        this.x = x;
        this.y = y;
        this.onClick = onClick;
        
        // Use the same font as the title
        this.font = 'bold 50px "Pirata One", serif';
        
        this.isHovered = false;
        this.isPressed = false;
        
        // Animation
        this.scaleAnim = 1.0;
        this.targetScale = 1.0;
        this.glowAlpha = 0;
        this.targetGlow = 0;
        
        // Approximate width for hit testing
        this.width = 150;
        this.height = 50;
    }
    
    update(dt, input) {
        // We approximate the hit area
        const hitX = this.x - this.width / 2;
        const hitY = this.y - this.height / 2;
        
        this.isHovered = input.isMouseOver(hitX, hitY, this.width, this.height);
        this.isPressed = this.isHovered && input.mouseDown;
        
        if (this.isHovered && input.mouseClicked && this.onClick) {
            this.onClick();
        }
        
        if (this.isPressed) {
            this.targetScale = 0.9;
            this.targetGlow = 0.8;
        } else if (this.isHovered) {
            this.targetScale = 1.1;
            this.targetGlow = 0.5;
        } else {
            this.targetScale = 1.0;
            this.targetGlow = 0;
        }
        
        const lerpSpeed = 10 * dt;
        this.scaleAnim += (this.targetScale - this.scaleAnim) * lerpSpeed;
        this.glowAlpha += (this.targetGlow - this.glowAlpha) * lerpSpeed;
    }
    
    render(ctx) {
        ctx.save();
        
        // Temporarily set font to measure width accurately
        ctx.font = this.font;
        this.width = ctx.measureText(this.label).width;
        
        ctx.translate(this.x, this.y);
        ctx.scale(this.scaleAnim, this.scaleAnim);
        ctx.translate(-this.x, -this.y);
        
        ctx.fillStyle = '#f4c430'; // yellow like title
        ctx.font = this.font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Glow effect
        if (this.glowAlpha > 0) {
            ctx.shadowColor = `rgba(244, 196, 48, ${this.glowAlpha})`;
            ctx.shadowBlur = 15;
            ctx.fillText(this.label, this.x, this.y);
        }
        
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 10;
        ctx.fillText(this.label, this.x, this.y);
        
        ctx.restore();
    }
}
