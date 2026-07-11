/* ============================================================
   MenuButton.js — Interactive Menu Button
   Similar to Unity's UI.Button with custom art + text
   
   Each button:
   - Displays custom drawn art (or a placeholder)
   - Overlays text in Pirata One font
   - Has a subtle slide animation on hover
   - Has a hold-down animation (slight press + glow)
   ============================================================ */

import { AssetManager } from '../AssetManager.js';

export class MenuButton {
    /**
     * @param {string} label     - Display text (e.g., "NEW GAME")
     * @param {string} assetKey  - Key in AssetManager (e.g., "btn_new_game")
     * @param {number} x         - X position
     * @param {number} y         - Y position
     * @param {number} index     - Button index (0-4) for stagger animations
     * @param {Function} onClick - Callback when clicked
     */
    constructor(label, assetKey, x, y, index, onClick) {
        this.label = label;
        this.assetKey = assetKey;
        this.baseX = x;
        this.baseY = y;
        this.index = index;
        this.onClick = onClick;

        // Button size — spacious and readable
        this.width = 380;
        this.height = 80;

        // Current animation offsets
        this.slideOffset = 0;   // horizontal slide on hover
        this.scaleAnim = 1.0;   // scale on hold
        this.glowAlpha = 0;     // glow effect intensity
        this.pressOffset = 0;   // downward press offset

        // State
        this.isHovered = false;
        this.isPressed = false;
        this.wasPressed = false;

        // Animation targets (for smooth lerping)
        this.targetSlide = 0;
        this.targetScale = 1.0;
        this.targetGlow = 0;
        this.targetPress = 0;

        // Entrance animation
        this.entranceProgress = 0;  // 0 = offscreen, 1 = in place
        this.entranceDelay = index * 0.12; // stagger
    }

    /* ----------------------------------------------------------
       Update — Handle hover, click, and animations
       ---------------------------------------------------------- */

    update(dt, input, elapsedSinceEnter) {
        // Entrance animation (slide in from left)
        // In preview mode, appear instantly. In full mode, animate.
        const entranceTime = elapsedSinceEnter - this.entranceDelay;
        if (entranceTime > 0) {
            this.entranceProgress = Math.min(1, entranceTime / 0.3); // fast entrance
            this.entranceProgress = 1 - Math.pow(1 - this.entranceProgress, 3);
        }

        // Calculate current render position
        const renderX = this.baseX + (this.entranceProgress - 1) * -400; // slide from left
        const renderY = this.baseY;

        // Hit test
        this.isHovered = input.isMouseOver(renderX + this.slideOffset, renderY, this.width, this.height);
        this.isPressed = this.isHovered && input.mouseDown;

        // Click detection
        if (this.isHovered && input.mouseClicked && this.onClick) {
            this.onClick();
        }

        // Animation targets based on state
        if (this.isPressed) {
            this.targetSlide = 15;
            this.targetScale = 0.97;
            this.targetGlow = 0.6;
            this.targetPress = 2;
        } else if (this.isHovered) {
            this.targetSlide = 20;
            this.targetScale = 1.02;
            this.targetGlow = 0.3;
            this.targetPress = 0;
        } else {
            this.targetSlide = 0;
            this.targetScale = 1.0;
            this.targetGlow = 0;
            this.targetPress = 0;
        }

        // Smooth lerp towards targets
        const lerpSpeed = 8 * dt;
        this.slideOffset += (this.targetSlide - this.slideOffset) * lerpSpeed;
        this.scaleAnim += (this.targetScale - this.scaleAnim) * lerpSpeed;
        this.glowAlpha += (this.targetGlow - this.glowAlpha) * lerpSpeed;
        this.pressOffset += (this.targetPress - this.pressOffset) * lerpSpeed;
    }

    /* ----------------------------------------------------------
       Render — Draw button + text
       ---------------------------------------------------------- */

    render(ctx) {
        if (this.entranceProgress <= 0) return; // not visible yet

        const img = AssetManager.get(this.assetKey);
        const x = this.baseX - 400 * (1 - this.entranceProgress) + this.slideOffset;
        const y = this.baseY + this.pressOffset;
        const w = this.width;
        const h = this.height;

        ctx.save();

        // Apply scale from center of button
        const cx = x + w / 2;
        const cy = y + h / 2;
        ctx.translate(cx, cy);
        ctx.scale(this.scaleAnim, this.scaleAnim);
        ctx.translate(-cx, -cy);

        // Glow behind button
        if (this.glowAlpha > 0.01) {
            ctx.shadowColor = 'rgba(255, 180, 60, ' + this.glowAlpha + ')';
            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }

        if (img) {
            // Draw the custom button art
            ctx.drawImage(img, x, y, w, h);
        } else {
            // Placeholder button
            this._drawPlaceholder(ctx, x, y, w, h);
        }

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        // Draw text label on top of the button
        this._drawLabel(ctx, x, y, w, h);

        ctx.restore();
    }

    /* ----------------------------------------------------------
       Placeholder button (arrow/pentagon shape)
       ---------------------------------------------------------- */

    _drawPlaceholder(ctx, x, y, w, h) {
        const padding = 10;
        const arrowTip = 24;

        // Pentagon shape (pointed on the right)
        const px = x + padding;
        const py = y + padding;
        const pw = w - padding * 2;
        const ph = h - padding * 2;

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + pw - arrowTip, py);
        ctx.lineTo(px + pw, py + ph / 2);  // arrow tip
        ctx.lineTo(px + pw - arrowTip, py + ph);
        ctx.lineTo(px, py + ph);
        ctx.closePath();

        // Fill with gradient
        const grad = ctx.createLinearGradient(px, py, px, py + ph);
        if (this.isPressed) {
            grad.addColorStop(0, '#8b2500');
            grad.addColorStop(1, '#cc3700');
        } else if (this.isHovered) {
            grad.addColorStop(0, '#cc4400');
            grad.addColorStop(1, '#ff6633');
        } else {
            grad.addColorStop(0, '#a52a00');
            grad.addColorStop(1, '#d44000');
        }

        ctx.fillStyle = grad;
        ctx.fill();

        // Border
        ctx.strokeStyle = '#ff8844';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    /* ----------------------------------------------------------
       Text label (Pirata One font)
       ---------------------------------------------------------- */

    _drawLabel(ctx, x, y, w, h) {
        ctx.fillStyle = '#fff';
        ctx.font = '28px "Pirata One", "Cinzel Decorative", Georgia, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Text shadow for readability
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;

        ctx.fillText(this.label, x + w / 2 - 8, y + h / 2);

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
    }
}
