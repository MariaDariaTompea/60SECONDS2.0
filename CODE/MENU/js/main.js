/* ============================================================
   main.js — Entry Point
   Similar to Unity's Bootstrap / GameManager initialization
   
   Loads all assets, creates the Game instance, and starts 
   the title screen scene.
   ============================================================ */

import { Game } from './Game.js';
import { AssetManager } from './AssetManager.js';
import { TitleScene } from './scenes/TitleScene.js';

// Wait for DOM and fonts to be ready
window.addEventListener('DOMContentLoaded', async () => {
    console.log('=== 60 Seconds 2.0 — Menu System ===');
    console.log('Canvas: 1920×1080 (16:9)');
    console.log('MODE: Full flow — TitleScene → Doors → MenuScene');
    console.log('');

    // Load all art assets (gracefully handles missing files)
    await AssetManager.loadAll();

    // Create game instance
    const game = new Game('gameCanvas');

    // Full scene flow: Title → Door transition → Menu
    game.setScene(new TitleScene());
    game.start();

    console.log('');
    console.log('Title scene loaded — click to continue after logo appears.');
});
