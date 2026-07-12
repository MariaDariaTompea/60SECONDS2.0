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
import { AssetManager } from '../AssetManager.js';
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

        // Dynamic fire particles behind the logo
        this.fireParticles = [];
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

        // --- UPDATE FIRE PARTICLES ---
        // Spawn fire particles once the title logo starts fading in
        if (this.titleAlpha > 0.1) {
            const spawnCount = 3 + Math.floor(Math.random() * 3); // 3-5 per frame (denser fire!)
            const cx = Game.WIDTH / 2;
            const cy = Game.HEIGHT / 2 - 40; // center of logo: y = 500

            for (let i = 0; i < spawnCount; i++) {
                this.fireParticles.push({
                    x: cx + (Math.random() - 0.5) * 600,       // spread across logo width
                    y: cy + 90 + (Math.random() - 0.5) * 20,   // spawn slightly higher under the logo text
                    vx: (Math.random() - 0.5) * 50,           // slight horizontal drift
                    vy: -90 - Math.random() * 120,             // float up quickly
                    size: 25 + Math.random() * 35,             // larger size
                    maxLife: 1.0 + Math.random() * 0.8,        // longer life to rise nicely
                    life: 1.0 + Math.random() * 0.8,
                    hue: 35 + Math.random() * 20,              // yellow/gold tones (hue 35-55)
                });
            }
        }

        // Update active fire particles
        for (let i = this.fireParticles.length - 1; i >= 0; i--) {
            const p = this.fireParticles[i];
            p.life -= dt;
            if (p.life <= 0) {
                this.fireParticles.splice(i, 1);
                continue;
            }

            // Move
            p.x += p.vx * dt;
            p.y += p.vy * dt;

            // Drift / wobble
            p.vx += (Math.random() - 0.5) * 80 * dt;
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

        // Fire particles behind the logo
        if (this.titleAlpha > 0) {
            this._drawFire(ctx);
        }

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

        const img = AssetManager.get('logo_loading');

        if (img) {
            // Draw the high-quality loading logo centered
            const logoW = 800;
            const logoH = 400;
            const logoX = (W - logoW) / 2;
            const logoY = (H - logoH) / 2 - 40;

            ctx.drawImage(img, logoX, logoY, logoW, logoH);
        } else {
            // Fallback: Title text when image is not loaded
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
        }

        ctx.restore();
    }

    _drawSubtitle(ctx, W, H) {
        ctx.save();

        // Pulsing alpha
        const pulse = 0.4 + Math.sin(this.elapsedTime * 2.5) * 0.3;
        ctx.globalAlpha = this.subtitleAlpha * pulse;

        ctx.fillStyle = '#f4c430'; // golden yellow to match the logo theme
        ctx.font = '28px "Cinzel Decorative", Georgia, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('— Click to Continue —', W / 2, H / 2 + 160);

        ctx.restore();
    }

    _drawFire(ctx) {
        ctx.save();

        // Additive blend mode for glowing flame physics
        ctx.globalCompositeOperation = 'lighter';

        for (const p of this.fireParticles) {
            const lifeRatio = p.life / p.maxLife; // 1 (spawn) to 0 (death)
            
            // Fade the fire in quadratically/cubically relative to titleAlpha
            // This prevents bright particles from shining through the semi-transparent logo during initial fade-in
            const alpha = lifeRatio * Math.pow(this.titleAlpha, 3.0);
            const size = p.size * (0.4 + 0.6 * lifeRatio); // shrink over time

            // Radial gradient for smooth fireballs
            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
            const l = 50 + (1 - lifeRatio) * 30; // turns yellower/lighter as it rises

            grad.addColorStop(0, `hsla(${p.hue}, 100%, ${l}%, ${alpha})`);
            grad.addColorStop(0.3, `hsla(${p.hue - 12}, 100%, 50%, ${alpha * 0.6})`);
            grad.addColorStop(0.8, `hsla(0, 100%, 30%, ${alpha * 0.15})`);
            grad.addColorStop(1, `hsla(0, 100%, 0%, 0)`);

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}
