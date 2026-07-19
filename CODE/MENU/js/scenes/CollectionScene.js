import { Game } from '../Game.js';
import { AssetManager } from '../AssetManager.js';
import { TextButton } from '../components/TextButton.js';
import { MenuScene } from './MenuScene.js';

export class CollectionScene {
    constructor() {
        this.game = null;
        this.ctx = null;
        this.input = null;
        
        // Scroll state
        this.scrollY = 0;
        this.targetScrollY = 0;
        this.isDragging = false;
        this.dragStartY = 0;
        this.dragScrollStartY = 0;
        
        this.characters = [
            { id: 'default', name: 'DEFAULT NAME', type: 'CHARACTER DEFAULT' }
        ];
        
        // Add some empty placeholders to make the grid scrollable
        for (let i = 0; i < 11; i++) {
            this.characters.push(null);
        }
        
        this.backButton = null;
        this.elapsedTime = 0;
    }
    
    enter() {
        this.elapsedTime = 0;
        
        // Back button
        this.backButton = new TextButton('BACK', 250, 100, () => {
            this.game.transitionTo(new MenuScene());
        });
        
        console.log('[CollectionScene] Entered');
    }
    
    exit() {
        console.log('[CollectionScene] Exited');
    }
    
    update(dt) {
        this.elapsedTime += dt;
        this.input.updateHoldTime(dt);
        
        // Back button
        this.backButton.update(dt, this.input);
        
        // Handle scrolling via mouse drag
        // Only drag if not hovering over the back button
        if (this.input.mouseDown && !this.backButton.isHovered) {
            if (!this.isDragging) {
                this.isDragging = true;
                this.dragStartY = this.input.mouseY;
                this.dragScrollStartY = this.targetScrollY;
            } else {
                const deltaY = this.input.mouseY - this.dragStartY;
                this.targetScrollY = this.dragScrollStartY - deltaY;
            }
        } else {
            this.isDragging = false;
        }

        // Handle scrolling via mouse wheel
        if (this.input.mouseScrollDelta !== 0) {
            this.targetScrollY += this.input.mouseScrollDelta;
        }
        
        // Calculate max scroll (depends on grid height)
        const cols = 3;
        const rows = Math.ceil(this.characters.length / cols);
        const cardH = 400;
        const gapY = 50;
        const totalHeight = 350 + rows * (cardH + gapY) + 100;
        const maxScroll = Math.max(0, totalHeight - Game.HEIGHT);
        
        // Clamp target
        if (this.targetScrollY < 0) this.targetScrollY = 0;
        if (this.targetScrollY > maxScroll) this.targetScrollY = maxScroll;
        
        // Smooth lerp
        this.scrollY += (this.targetScrollY - this.scrollY) * 15 * dt;
    }
    
    render(ctx) {
        const W = Game.WIDTH;
        const H = Game.HEIGHT;
        
        // 1. Draw Background
        const bg = AssetManager.get('collection_bg');
        if (bg) {
            // Draw stretched or cover
            // Let's preserve aspect ratio and cover
            const scale = Math.max(W / bg.naturalWidth, H / bg.naturalHeight);
            const drawW = bg.naturalWidth * scale;
            const drawH = bg.naturalHeight * scale;
            ctx.drawImage(bg, (W - drawW) / 2, (H - drawH) / 2, drawW, drawH);
        } else {
            ctx.fillStyle = '#0a1a2a';
            ctx.fillRect(0, 0, W, H);
            AssetManager.drawPlaceholder(ctx, W/2 - 200, H/2 - 100, 400, 200, '#154360', 'OCEAN_LOOP_2');
        }
        
        // Apply camera scroll offset
        ctx.save();
        ctx.translate(0, -this.scrollY);
        
        // Title
        ctx.fillStyle = '#f4c430';
        ctx.font = 'bold 80px "Pirata One", serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 10;
        ctx.fillText('COLLECTION', W / 2, 200);
        
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        
        // Draw Grid
        const cols = 3;
        const cardW = 300;
        const cardH = 400;
        const gapX = 100;
        const gapY = 60;
        
        const startX = (W - (cols * cardW + (cols - 1) * gapX)) / 2;
        const startY = 350;
        
        for (let i = 0; i < this.characters.length; i++) {
            const row = Math.floor(i / cols);
            const col = i % cols;
            
            const x = startX + col * (cardW + gapX);
            const y = startY + row * (cardH + gapY);
            
            // Render card
            this._renderCard(ctx, x, y, cardW, cardH, this.characters[i]);
        }
        
        ctx.restore();
        
        // Draw border overlay (fixed)
        const border = AssetManager.get('menu_border');
        if (border) {
            ctx.drawImage(border, 0, 0, W, H);
        }

        // Draw back button UI on top of scrollable content AND border
        this.backButton.render(ctx);
    }
    
    _renderCard(ctx, x, y, w, h, charData) {
        // Card background
        ctx.fillStyle = 'rgba(20, 30, 40, 0.7)';
        ctx.fillRect(x, y, w, h);
        
        // Frame
        ctx.strokeStyle = '#8a6a4a'; // brass/wood
        ctx.lineWidth = 6;
        ctx.strokeRect(x, y, w, h);
        
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        if (charData) {
            // Placeholder portrait
            ctx.fillStyle = '#2d1a10';
            ctx.fillRect(x + 10, y + 10, w - 20, h - 100);
            
            ctx.fillStyle = '#f4c430';
            ctx.font = 'bold 24px "Cinzel Decorative", serif';
            ctx.fillText('PORTRAIT', x + w / 2, y + (h - 100) / 2);
            
            // Name
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 32px "Pirata One", serif';
            ctx.fillText(charData.name, x + w / 2, y + h - 60);
            
            // Subtitle
            ctx.fillStyle = '#aaa';
            ctx.font = '20px "Cinzel Decorative", serif';
            ctx.fillText(charData.type, x + w / 2, y + h - 25);
        } else {
            // Empty slot
            ctx.fillStyle = '#555';
            ctx.font = 'bold 36px monospace';
            ctx.fillText('?', x + w / 2, y + h / 2);
            
            ctx.font = '18px monospace';
            ctx.fillStyle = '#888';
            ctx.fillText('EMPTY SLOT', x + w / 2, y + h / 2 + 40);
        }
    }
}
