/* ============================================================
   TitleScene.js — Opening Title Screen
   Similar to Unity's splash/title scene
   
   Flow:
   1. Black screen fades in with a vignette effect
   2. Game title appears centered (fades in)
   3. "Click to continue" pulses below
   4. On click → transitions to DoorTransition
   ============================================================ */

import { Game } from '../Game.js';
import { DoorTransition } from './DoorTransition.js';

export class TitleScene {
    constructor() {
        this.game = null; // injected by Game.setScene()
        this.input = null;

        // Animation state
        this.elapsedTime = 0;
        this.fadeProgress = 0;      // 0 = black, 1 = fully visible
        this.titleAlpha = 0;        // title text opacity
        this.subtitleAlpha = 0;     // "click to continue" opacity

        // Timing
        this.fadeInDuration = 1.5;    // seconds to fade from black
        this.titleDelay = 1.0;       // seconds before title starts appearing
        this.titleFadeDuration = 1.5; // seconds for title to fully appear
        this.subtitleDelay = 3.0;    // seconds before subtitle appears

        // Vignette parameters
        this.vignetteIntensity = 0.8;

        // Transition state
        this.transitioning = false;
    }

    /* ----------------------------------------------------------
       Scene Lifecycle (like Unity's Start)
       ---------------------------------------------------------- */

    enter() {
        this.elapsedTime = 0;
        this.transitioning = false;
        console.log('[TitleScene] Enter — showing title');
    }

    exit() {
        console.log('[TitleScene] Exit');
    }

    /* ----------------------------------------------------------
       Update
       ---------------------------------------------------------- */

    update(dt) {
        this.elapsedTime += dt;
        this.input.updateHoldTime(dt);

        // Fade in from black
        if (this.elapsedTime < this.fadeInDuration) {
            this.fadeProgress = this.elapsedTime / this.fadeInDuration;
        } else {
            this.fadeProgress = 1;
        }

        // Title fade in
        const titleTime = this.elapsedTime - this.titleDelay;
        if (titleTime > 0) {
            this.titleAlpha = Math.min(1, titleTime / this.titleFadeDuration);
        }

        // Subtitle fade in + pulse
        const subtitleTime = this.elapsedTime - this.subtitleDelay;
        if (subtitleTime > 0) {
            this.subtitleAlpha = Math.min(1, subtitleTime / 1.0);
        }

        // Check for click to transition (can click anywhere at any time to skip)
        if (this.elapsedTime > 0.2 && this.input.mouseClicked && !this.transitioning) {
            this.transitioning = true;
            this.game.setScene(new DoorTransition(this));
        }
    }

    /* ----------------------------------------------------------
       Render
       ---------------------------------------------------------- */

    render(ctx) {
        const W = Game.WIDTH;
        const H = Game.HEIGHT;

        // Background — dark deep ocean blue
        ctx.fillStyle = '#0a0e1a';
        ctx.fillRect(0, 0, W, H);

        // Subtle animated background particles (dust/stars)
        this._drawParticles(ctx, W, H);

        // Vignette effect
        this._drawVignette(ctx, W, H);

        // Title text
        if (this.titleAlpha > 0) {
            this._drawTitle(ctx, W, H);
        }

        // "Click to continue" subtitle
        if (this.subtitleAlpha > 0) {
            this._drawSubtitle(ctx, W, H);
        }

        // Fade-from-black overlay
        if (this.fadeProgress < 1) {
            ctx.fillStyle = `rgba(0, 0, 0, ${1 - this.fadeProgress})`;
            ctx.fillRect(0, 0, W, H);
        }
    }

    /* ----------------------------------------------------------
       Draw Helpers
       ---------------------------------------------------------- */

    _drawVignette(ctx, W, H) {
        // Radial gradient from center (transparent) to edges (black)
        const cx = W / 2;
        const cy = H / 2;
        const radius = Math.max(W, H) * 0.7;

        const grad = ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius);
        grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(0.5, `rgba(0, 0, 0, ${this.vignetteIntensity * 0.3})`);
        grad.addColorStop(1, `rgba(0, 0, 0, ${this.vignetteIntensity})`);

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
    }

    _drawParticles(ctx, W, H) {
        // Simple floating particles for atmosphere
        ctx.fillStyle = 'rgba(150, 180, 220, 0.15)';
        const time = this.elapsedTime;

        for (let i = 0; i < 40; i++) {
            // Deterministic pseudo-random positions based on index
            const seed = i * 137.5;
            const px = (Math.sin(seed) * 0.5 + 0.5) * W;
            const py = (Math.cos(seed * 0.7) * 0.5 + 0.5) * H;
            const drift = Math.sin(time * 0.3 + i * 0.5) * 30;
            const driftY = Math.cos(time * 0.2 + i * 0.3) * 20;
            const size = Math.max(1, 1 + Math.sin(seed * 0.3) * 1.5);

            ctx.globalAlpha = 0.1 + Math.sin(time + i) * 0.08;
            ctx.beginPath();
            ctx.arc(px + drift, py + driftY, size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    _drawTitle(ctx, W, H) {
        ctx.save();
        ctx.globalAlpha = this.titleAlpha;

        // Title glow
        ctx.shadowColor = 'rgba(255, 180, 60, 0.6)';
        ctx.shadowBlur = 40;

        // Main title
        ctx.fillStyle = '#f4c430'; // golden
        ctx.font = 'bold 96px "Pirata One", Georgia, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('60 SECONDS', W / 2, H / 2 - 30);

        // Subtitle / version
        ctx.font = 'bold 48px "Cinzel Decorative", Georgia, serif';
        ctx.fillStyle = '#e0a020';
        ctx.fillText('2.0', W / 2, H / 2 + 50);

        ctx.restore();
    }

    _drawSubtitle(ctx, W, H) {
        ctx.save();

        // Pulsing alpha
        const pulse = 0.4 + Math.sin(this.elapsedTime * 2.5) * 0.3;
        ctx.globalAlpha = this.subtitleAlpha * pulse;

        ctx.fillStyle = '#aabbcc';
        ctx.font = '28px "Cinzel Decorative", Georgia, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('— Click to Continue —', W / 2, H / 2 + 160);

        ctx.restore();
    }
}
