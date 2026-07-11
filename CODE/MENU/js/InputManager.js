/* ============================================================
   InputManager.js — Input System
   Similar to Unity's Input class
   
   Tracks mouse position (in game coordinates), clicks, and 
   hold state. Translates screen coords → game coords using 
   the current canvas scale.
   ============================================================ */

export class InputManager {
    constructor(canvas) {
        this.canvas = canvas;

        // Mouse state (like Input.mousePosition in Unity)
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseDown = false;       // Is button currently held? (like Input.GetMouseButton)
        this.mouseClicked = false;    // Was button pressed this frame? (like Input.GetMouseButtonDown)
        this.mouseReleased = false;   // Was button released this frame? (like Input.GetMouseButtonUp)
        this.mouseHoldTime = 0;       // How long the button has been held (seconds)

        // Scaling factors (screen → game coordinates)
        this.scaleX = 1;
        this.scaleY = 1;

        // --- Event listeners ---

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mouseX = (e.clientX - rect.left) * this.scaleX;
            this.mouseY = (e.clientY - rect.top) * this.scaleY;
        });

        canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // left click
                this.mouseDown = true;
                this.mouseClicked = true;
                this.mouseHoldTime = 0;
            }
        });

        canvas.addEventListener('mouseup', (e) => {
            if (e.button === 0) {
                this.mouseDown = false;
                this.mouseReleased = true;
            }
        });

        canvas.addEventListener('mouseleave', () => {
            this.mouseDown = false;
        });

        // Touch support (for testing on mobile)
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            this.mouseX = (touch.clientX - rect.left) * this.scaleX;
            this.mouseY = (touch.clientY - rect.top) * this.scaleY;
            this.mouseDown = true;
            this.mouseClicked = true;
            this.mouseHoldTime = 0;
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            this.mouseX = (touch.clientX - rect.left) * this.scaleX;
            this.mouseY = (touch.clientY - rect.top) * this.scaleY;
        });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.mouseDown = false;
            this.mouseReleased = true;
        });
    }

    /** Called by Game.js when canvas is resized */
    setScale(sx, sy) {
        this.scaleX = sx;
        this.scaleY = sy;
    }

    /** Update hold timer — call once per frame from the game loop */
    updateHoldTime(dt) {
        if (this.mouseDown) {
            this.mouseHoldTime += dt;
        } else {
            this.mouseHoldTime = 0;
        }
    }

    /** Reset per-frame flags (called at end of each frame) */
    endFrame() {
        this.mouseClicked = false;
        this.mouseReleased = false;
    }

    /* ----------------------------------------------------------
       Utility: Hit-test a rectangle (like Unity's RectTransform.Contains)
       ---------------------------------------------------------- */

    /** Returns true if the mouse is inside the given rect */
    isMouseOver(x, y, width, height) {
        return (
            this.mouseX >= x &&
            this.mouseX <= x + width &&
            this.mouseY >= y &&
            this.mouseY <= y + height
        );
    }
}
