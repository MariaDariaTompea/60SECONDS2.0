/* ============================================================
   OceanBackground.js — Scrolling Ocean Loop
   Similar to Unity's ScrollingBackground component
   
   Renders a seamless horizontal-looping ocean image that 
   slowly scrolls left→right. Supports mouse drag to "look 
   around" as if standing on a ship deck.
   ============================================================ */

import { AssetManager } from '../AssetManager.js';
import { Game } from '../Game.js';

export class OceanBackground {
    constructor() {
        // Scroll offset in pixels (how far into the image we are)
        this.scrollX = 0;

        // Auto-scroll speed (pixels per second) — very slow, ambient
        this.autoScrollSpeed = 30;

        // Drag scroll
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragScrollStartX = 0;

        // Display area (inside the border frame)
        this.BORDER = 48;
        this.displayX = this.BORDER;
        this.displayY = this.BORDER;
        this.displayW = Game.WIDTH - this.BORDER * 2;   // 1824
        this.displayH = Game.HEIGHT - this.BORDER * 2;  // 984

        // Ocean image dimensions (from spec)
        this.imageW = 5472;
        this.imageH = 984;
    }

    /* ----------------------------------------------------------
       Update (called every frame, like Unity's Update)
       ---------------------------------------------------------- */

    update(dt, input) {
        // Auto-scroll
        this.scrollX += this.autoScrollSpeed * dt;

        // Handle drag to "look around"
        if (input.mouseDown && input.isMouseOver(this.displayX, this.displayY, this.displayW, this.displayH)) {
            if (!this.isDragging) {
                // Start dragging
                this.isDragging = true;
                this.dragStartX = input.mouseX;
                this.dragScrollStartX = this.scrollX;
            } else {
                // Continue dragging — move the scroll based on mouse delta
                const dragDelta = input.mouseX - this.dragStartX;
                this.scrollX = this.dragScrollStartX - dragDelta * 0.5;
            }
        } else {
            this.isDragging = false;
        }

        // Wrap scroll (seamless loop)
        if (this.scrollX < 0) this.scrollX += this.imageW;
        if (this.scrollX >= this.imageW) this.scrollX -= this.imageW;
    }

    /* ----------------------------------------------------------
       Render (called every frame, like Unity's OnRenderObject)
       ---------------------------------------------------------- */

    render(ctx) {
        const img = AssetManager.get('ocean_loop');

        // Save context and clip to the inner area (inside the border)
        ctx.save();
        ctx.beginPath();
        ctx.rect(this.displayX, this.displayY, this.displayW, this.displayH);
        ctx.clip();

        if (img) {
            // Draw the ocean image, tiled to fill + scroll
            const sx = Math.floor(this.scrollX);

            // We need to draw enough copies to fill the display area
            // Start drawing from an offset so the image wraps seamlessly
            const startOffset = -(sx % this.imageW);

            for (let x = startOffset; x < this.displayW; x += this.imageW) {
                ctx.drawImage(
                    img,
                    this.displayX + x,
                    this.displayY,
                    this.imageW,
                    this.displayH
                );
            }

            // If startOffset is negative, we might need one more tile before
            if (startOffset > -this.imageW + this.displayW) {
                ctx.drawImage(
                    img,
                    this.displayX + startOffset - this.imageW,
                    this.displayY,
                    this.imageW,
                    this.displayH
                );
            }
        } else {
            // Placeholder: animated ocean gradient
            this._drawPlaceholderOcean(ctx);
        }

        ctx.restore();
    }

    /* ----------------------------------------------------------
       Placeholder ocean (when image hasn't been provided yet)
       Draws a simple animated wave gradient
       ---------------------------------------------------------- */

    _drawPlaceholderOcean(ctx) {
        const x = this.displayX;
        const y = this.displayY;
        const w = this.displayW;
        const h = this.displayH;

        // Sky gradient (top half)
        const skyGrad = ctx.createLinearGradient(x, y, x, y + h * 0.45);
        skyGrad.addColorStop(0, '#1a1a3e');
        skyGrad.addColorStop(0.5, '#2d2d6b');
        skyGrad.addColorStop(1, '#4a6fa5');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(x, y, w, h * 0.45);

        // Horizon line
        const horizonY = y + h * 0.45;

        // Water gradient (bottom half)
        const waterGrad = ctx.createLinearGradient(x, horizonY, x, y + h);
        waterGrad.addColorStop(0, '#1a5276');
        waterGrad.addColorStop(0.3, '#154360');
        waterGrad.addColorStop(1, '#0b2535');
        ctx.fillStyle = waterGrad;
        ctx.fillRect(x, horizonY, w, h * 0.55);

        // Animated waves
        ctx.strokeStyle = 'rgba(120, 200, 255, 0.15)';
        ctx.lineWidth = 2;
        const time = performance.now() / 1000;

        for (let waveRow = 0; waveRow < 8; waveRow++) {
            const waveY = horizonY + 30 + waveRow * (h * 0.55 / 8);
            ctx.beginPath();
            for (let wx = 0; wx <= w; wx += 3) {
                const waveOffset = Math.sin((wx + this.scrollX * 2) * 0.01 + time + waveRow) * (8 + waveRow * 2);
                if (wx === 0) {
                    ctx.moveTo(x + wx, waveY + waveOffset);
                } else {
                    ctx.lineTo(x + wx, waveY + waveOffset);
                }
            }
            ctx.stroke();
        }

        // Label
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = '24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('[ OCEAN LOOP — drop ocean_loop.png in assets/ocean_loop/ ]', x + w / 2, y + h / 2);
        ctx.textAlign = 'left';
    }
}
