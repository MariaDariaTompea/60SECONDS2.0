/* ============================================================
   Game.js — Core Game Engine
   Similar to Unity's Application + GameManager
   
   Responsibilities:
   - Canvas setup & aspect-ratio scaling
   - Main game loop (like Unity's Update cycle)
   - Scene management (like Unity's SceneManager)
   ============================================================ */

import { InputManager } from './InputManager.js';
import { TransitionManager } from './TransitionManager.js';

export class Game {
    // Design resolution (matches our art specs)
    static WIDTH = 1920;
    static HEIGHT = 1080;

    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Set internal resolution
        this.canvas.width = Game.WIDTH;
        this.canvas.height = Game.HEIGHT;

        // Input system
        this.input = new InputManager(this.canvas);

        // Transition system
        this.transition = new TransitionManager(this);

        // Scene management
        this.currentScene = null;
        this.pendingScene = null; // for safe scene transitions mid-frame

        // Timing
        this.lastTime = 0;
        this.deltaTime = 0;
        this.elapsedTime = 0;
        this.running = false;

        // Handle window resize
        this._resizeCanvas();
        window.addEventListener('resize', () => this._resizeCanvas());
    }

    /* ----------------------------------------------------------
       Scene Management (like Unity's SceneManager.LoadScene)
       ---------------------------------------------------------- */

    /** Queue a scene transition. Safe to call during update/render. */
    setScene(scene) {
        this.pendingScene = scene;

        // If the loop hasn't started yet, apply immediately
        if (!this.running) {
            this._applySceneChange();
        }
    }
    
    /** Trigger a scene transition with doors */
    transitionTo(scene) {
        this.transition.start(scene);
    }

    /** Internal: actually swap the scene */
    _applySceneChange() {
        if (!this.pendingScene) return;

        // Call exit on old scene (like OnDisable/OnDestroy in Unity)
        if (this.currentScene && this.currentScene.exit) {
            this.currentScene.exit();
        }

        // Swap
        this.currentScene = this.pendingScene;
        this.pendingScene = null;

        // Inject game reference (like GetComponent pattern)
        this.currentScene.game = this;
        this.currentScene.ctx = this.ctx;
        this.currentScene.input = this.input;

        // Call enter (like Start/Awake in Unity)
        if (this.currentScene.enter) {
            this.currentScene.enter();
        }
    }

    /* ----------------------------------------------------------
       Game Loop (like Unity's internal Update cycle)
       ---------------------------------------------------------- */

    start() {
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this._loop(t));
    }

    _loop(timestamp) {
        if (!this.running) return;

        // Calculate delta time in seconds (like Time.deltaTime in Unity)
        this.deltaTime = Math.min((timestamp - this.lastTime) / 1000, 0.1); // cap at 100ms
        this.lastTime = timestamp;
        this.elapsedTime += this.deltaTime;

        // Apply pending scene change (safe transition)
        this._applySceneChange();

        // UPDATE phase (like Unity's Update)
        if (this.currentScene && this.currentScene.update) {
            this.currentScene.update(this.deltaTime);
        }

        // RENDER phase (like Unity's OnRenderObject / OnGUI)
        this.ctx.clearRect(0, 0, Game.WIDTH, Game.HEIGHT);
        if (this.currentScene && this.currentScene.render) {
            this.currentScene.render(this.ctx);
        }

        // TRANSITION phase (always on top)
        this.transition.update(this.deltaTime);
        this.transition.render(this.ctx);

        // End-of-frame input cleanup
        this.input.endFrame();

        // Next frame
        requestAnimationFrame((t) => this._loop(t));
    }

    /* ----------------------------------------------------------
       Canvas Scaling (like Unity's CanvasScaler)
       Fits 1920×1080 into the viewport, letterboxed
       ---------------------------------------------------------- */

    _resizeCanvas() {
        const windowW = window.innerWidth;
        const windowH = window.innerHeight;
        const targetRatio = Game.WIDTH / Game.HEIGHT; // 16:9
        const windowRatio = windowW / windowH;

        let displayW, displayH;
        if (windowRatio > targetRatio) {
            // Window is wider than 16:9 → fit height, letterbox sides
            displayH = windowH;
            displayW = windowH * targetRatio;
        } else {
            // Window is taller than 16:9 → fit width, letterbox top/bottom
            displayW = windowW;
            displayH = windowW / targetRatio;
        }

        this.canvas.style.width = `${displayW}px`;
        this.canvas.style.height = `${displayH}px`;

        // Update input manager with new scale
        this.input.setScale(Game.WIDTH / displayW, Game.HEIGHT / displayH);
    }
}
