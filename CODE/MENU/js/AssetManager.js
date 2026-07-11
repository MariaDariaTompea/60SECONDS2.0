/* ============================================================
   AssetManager.js — Asset Loading System
   Similar to Unity's Resources / AssetBundle system
   
   Loads images from the assets/ folder.
   If an image fails to load (file doesn't exist yet), it 
   stores null — components should render colored placeholders
   when the asset is null.
   ============================================================ */

export class AssetManager {
    /** @type {Map<string, HTMLImageElement|null>} */
    static assets = new Map();

    /** Whether all loads have been attempted (some may have failed) */
    static loaded = false;

    /* ----------------------------------------------------------
       Asset manifest — all images the menu needs
       ---------------------------------------------------------- */

    static MANIFEST = {
        // Buttons
        'btn_new_game':   'assets/menu_buttons/new_game.png',
        'btn_load_game':  'assets/menu_buttons/load_game.png',
        'btn_collection': 'assets/menu_buttons/collection.png',
        'btn_settings':   'assets/menu_buttons/settings.png',
        'btn_exit':       'assets/menu_buttons/exit.png',

        // Logo
        'logo':           'assets/logo/logo.png',

        // Ocean loop
        'ocean_loop':     'assets/ocean_loop/ocean_loop.png',

        // Helm
        'helm_board':     'assets/helm/helm_board.png',
        'helm_wheel':     'assets/helm/helm_wheel.png',

        // Doors
        'door_top':       'assets/door/door_top.png',
        'door_bottom':    'assets/door/door_bottom.png',
    };

    /* ----------------------------------------------------------
       Load all assets
       Returns a Promise that resolves when all loads complete.
       Failed loads resolve with null (no crash).
       ---------------------------------------------------------- */

    static loadAll() {
        const promises = [];

        for (const [key, path] of Object.entries(AssetManager.MANIFEST)) {
            const promise = new Promise((resolve) => {
                const img = new Image();

                img.onload = () => {
                    AssetManager.assets.set(key, img);
                    console.log(`[AssetManager] ✓ Loaded: ${key} (${path})`);
                    resolve();
                };

                img.onerror = () => {
                    AssetManager.assets.set(key, null);
                    console.warn(`[AssetManager] ✗ Missing: ${key} (${path}) — using placeholder`);
                    resolve(); // don't reject, just use placeholder
                };

                img.src = path;
            });

            promises.push(promise);
        }

        return Promise.all(promises).then(() => {
            AssetManager.loaded = true;
            console.log('[AssetManager] All asset loads attempted.');
        });
    }

    /* ----------------------------------------------------------
       Get an asset by key
       Returns the Image element, or null if not loaded.
       ---------------------------------------------------------- */

    /** @returns {HTMLImageElement|null} */
    static get(key) {
        return AssetManager.assets.get(key) || null;
    }

    /* ----------------------------------------------------------
       Placeholder Drawing Utility
       Draws a colored rectangle with a label when art is missing.
       ---------------------------------------------------------- */

    /**
     * Draws a placeholder rectangle with a label.
     * Use this when AssetManager.get() returns null.
     * 
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} x 
     * @param {number} y 
     * @param {number} w 
     * @param {number} h 
     * @param {string} color - fill color
     * @param {string} label - text label
     */
    static drawPlaceholder(ctx, x, y, w, h, color, label) {
        // Background — solid, bright, fully visible
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.85;
        ctx.fillRect(x, y, w, h);

        // Border — thick white
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.setLineDash([]);
        ctx.strokeRect(x, y, w, h);

        // Label — big and readable
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Text shadow for readability
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        ctx.fillText(label, x + w / 2, y + h / 2 - 12);

        // Size label below
        ctx.font = '16px monospace';
        ctx.fillStyle = '#ddd';
        ctx.fillText(`${w}×${h} px`, x + w / 2, y + h / 2 + 14);

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
    }
}
