/* ============================================================
   HelmDecoration.js — Ship Helm Board + Rotating Wheel
   Similar to Unity's UI decoration with rotating child element
   
   Renders the ship's wooden railing (helm board) across the 
   top of the screen and a continuously rotating steering wheel 
   centered on it.
   ============================================================ */

import { AssetManager } from '../AssetManager.js';
import { Game } from '../Game.js';

export class HelmDecoration {
    constructor() {
        // Helm board dimensions (from spec) — sits at the BOTTOM of the screen
        this.boardW = Game.WIDTH;  // 1920
        this.boardH = 180;
        this.boardX = 0;
        this.boardY = Game.HEIGHT - this.boardH;  // bottom edge

        // Steering wheel — slides horizontally across the board
        this.wheelSize = 240;
        this.minX = 200;                           // left limit
        this.maxX = Game.WIDTH - 200;              // right limit (1720)
        this.wheelCenterX = this.minX;             // start on the left
        this.wheelCenterY = this.boardY - 20;      // sits on top of the board

        // Wheel movement
        this.moveSpeed = 80;                      // pixels per second
        this.moveDirection = 1;                    // 1 = moving right, -1 = moving left

        // Wheel rotation
        this.wheelAngle = 0;                       // current angle in radians
        this.rotationSpeed = 0.8;                  // speed of rotation
    }

    /* ----------------------------------------------------------
       Update — Move and rotate the wheel
       ---------------------------------------------------------- */

    update(dt) {
        // Move the wheel horizontally
        this.wheelCenterX += this.moveSpeed * this.moveDirection * dt;

        // Check boundaries and reverse direction
        if (this.moveDirection === 1 && this.wheelCenterX >= this.maxX) {
            this.wheelCenterX = this.maxX;
            this.moveDirection = -1; // head back left
        } else if (this.moveDirection === -1 && this.wheelCenterX <= this.minX) {
            this.wheelCenterX = this.minX;
            this.moveDirection = 1;  // head back right
        }

        // Rotate the wheel based on movement direction
        // Clockwise (positive angle increase) when moving right, Counter-clockwise when moving left
        this.wheelAngle += this.rotationSpeed * this.moveDirection * dt;
    }

    /* ----------------------------------------------------------
       Render — Draw board + rotated wheel
       ---------------------------------------------------------- */

    render(ctx) {
        this._renderBoard(ctx);
        this._renderWheel(ctx);
    }

    _renderBoard(ctx) {
        const img = AssetManager.get('helm_board');

        if (img) {
            ctx.drawImage(img, this.boardX, this.boardY, this.boardW, this.boardH);
        } else {
            // Placeholder: wooden plank
            this._drawPlaceholderBoard(ctx);
        }
    }

    _renderWheel(ctx) {
        const img = AssetManager.get('helm_wheel');

        ctx.save();

        // Translate to wheel center, rotate, draw centered
        ctx.translate(this.wheelCenterX, this.wheelCenterY);
        ctx.rotate(this.wheelAngle);

        if (img) {
            ctx.drawImage(
                img,
                -this.wheelSize / 2,
                -this.wheelSize / 2,
                this.wheelSize,
                this.wheelSize
            );
        } else {
            // Placeholder: ship wheel shape
            this._drawPlaceholderWheel(ctx);
        }

        ctx.restore();
    }

    /* ----------------------------------------------------------
       Placeholder graphics
       ---------------------------------------------------------- */

    _drawPlaceholderBoard(ctx) {
        // Wooden plank gradient
        const grad = ctx.createLinearGradient(0, this.boardY, 0, this.boardY + this.boardH);
        grad.addColorStop(0, '#5c3a1e');
        grad.addColorStop(0.3, '#8b5e3c');
        grad.addColorStop(0.5, '#a0714f');
        grad.addColorStop(0.7, '#8b5e3c');
        grad.addColorStop(1, '#4a2e16');
        ctx.fillStyle = grad;
        ctx.fillRect(this.boardX, this.boardY, this.boardW, this.boardH);

        // Wood grain lines (deterministic — no flickering)
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 15; i++) {
            const ly = this.boardY + (i / 15) * this.boardH;
            const wave = Math.sin(i * 7.3) * 5;
            ctx.beginPath();
            ctx.moveTo(this.boardX, ly);
            ctx.lineTo(this.boardX + this.boardW, ly + wave);
            ctx.stroke();
        }

        // Metal studs along bottom edge of board
        ctx.fillStyle = '#8a8a6a';
        for (let sx = 40; sx < this.boardW; sx += 80) {
            ctx.beginPath();
            ctx.arc(sx, this.boardY + this.boardH - 15, 6, 0, Math.PI * 2);
            ctx.fill();
        }

        // Bottom rail
        ctx.fillStyle = '#3d2510';
        ctx.fillRect(0, this.boardY + this.boardH - 8, this.boardW, 8);

        // Label
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = '18px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('[ HELM BOARD — drop helm_board.png in assets/helm/ ]', this.boardW / 2, this.boardY + this.boardH / 2);
        ctx.textAlign = 'left';
    }

    _drawPlaceholderWheel(ctx) {
        const r = this.wheelSize / 2 - 10;
        const spokeCount = 8;

        // Outer ring
        ctx.strokeStyle = '#8b5e3c';
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();

        // Inner ring
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
        ctx.stroke();

        // Spokes
        ctx.lineWidth = 8;
        for (let i = 0; i < spokeCount; i++) {
            const angle = (Math.PI * 2 / spokeCount) * i;
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * r * 0.35, Math.sin(angle) * r * 0.35);
            ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
            ctx.stroke();
        }

        // Handle pegs on the outer ring
        ctx.fillStyle = '#5c3a1e';
        for (let i = 0; i < spokeCount; i++) {
            const angle = (Math.PI * 2 / spokeCount) * i;
            ctx.beginPath();
            ctx.arc(Math.cos(angle) * (r + 8), Math.sin(angle) * (r + 8), 8, 0, Math.PI * 2);
            ctx.fill();
        }

        // Center bolt
        ctx.fillStyle = '#666';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
    }
}
