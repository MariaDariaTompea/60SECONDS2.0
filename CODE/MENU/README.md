# 60 Seconds 2.0 — Main Menu System

This directory contains the custom-built, Unity-like main menu system. It implements a nautical theme with a vignette opening title screen, door sliding transition animations, rotating helm, custom scrolling ocean background, and interactive menu buttons.

---

## 📐 Screen Layout (1920×1080, 16:9 Aspect Ratio)

The canvas is rendered inside an empty decorative green border frame. The helm board sits at the bottom edge, and the buttons are stacked neatly on the left.

```
┌───────────────────────────────────────────────────────────────────┐
│┌─────────────────────────────────────────────────────────────────┐│
││ BORDER FRAME (48px wide green border)                           ││
││                                                                 ││
││  ┌─────────────────┐                                            ││
││  │ LOGO (520×260)  │                                            ││
││  └─────────────────┘                                            ││
││                                                                 ││
││  ┌───────────────┐ (380×80px)                                   ││
││  │ NEW GAME    ▶ │                                              ││
││  └───────────────┘                                              ││
││    [32px Gap]              🌊 OCEAN LOOP BACKGROUND             ││
││  ┌───────────────┐         (Continually scrolling panorama)     ││
││  │ LOAD GAME   ▶ │                                              ││
││  └───────────────┘                                              ││
││    [32px Gap]                                                   ││
││  ┌───────────────┐                                              ││
││  │ COLLECTION  ▶ │                                              ││
││  └───────────────┘                                              ││
││    [32px Gap]                                                   ││
││  ┌───────────────┐                                              ││
││  │ SETTINGS    ▶ │                                              ││
││  └───────────────┘                                              ││
││    [32px Gap]                                                   ││
││  ┌───────────────┐                                              ││
││  │ EXIT        ▶ │                                              ││
││  └───────────────┘                                              ││
││                                                                 ││
│└─────────────────────────────────────────────────────────────────┘│
├───────────────────────────────────────────────────────────────────┤
│                  HELM BOARD (Wooden railing, 180px high)          │
│                      ⚙ WHEEL (240×240px, sways & rotates)         │
└───────────────────────────────────────────────────────────────────┘
```

---

## 🎬 Animation & Transition Sequence

Below is the state flow diagram of the menu start-up sequence:

```
[ Game Opens ]
      │
      ▼
┌──────────────┐
│  TitleScene  │ ◄─── (Centered glowing text & floating particles,
└──────┬───────┘       dark vignette background)
       │
       │ (User clicks anywhere after 0.2 seconds)
       ▼
┌──────────────────┐
│  DoorTransition  │
│  (State: CLOSE)  │ ◄─── (Orange & Teal prototype doors slide closed
└──────┬───────────┘       on top of TitleScene)
       │
       │ (Doors meet in middle: overlapping 80px, seam glow active)
       ▼
┌──────────────────┐
│  DoorTransition  │
│  (State: HOLD)   │ ◄─── (Background swaps to MenuScene behind the
└──────┬───────────┘       completely closed doors; holds for 1.0s)
       │
       ▼
┌──────────────────┐
│  DoorTransition  │
│  (State: OPEN)   │ ◄─── (Doors slide apart to top and bottom,
└──────┬───────────┘       revealing the fully active MenuScene)
       │
       ▼
┌─────────────┐
│  MenuScene  │ ◄─── (Buttons slide in from left, wheel oscillates,
└─────────────┘       ocean scrolls, menu is fully interactive!)
```

---

## 📂 Code Files Overview

*   **`index.html`**: Bootstraps the HTML5 Canvas and loads global assets and fonts.
*   **`js/main.js`**: Initial entry point. Initializes the asset loading, boots the `Game` engine, and loads the starting `TitleScene`.
*   **`js/Game.js`**: Core game engine. Manages the scene lifecycle (`enter`, `update`, `render`, `exit`), handles window resizing with letterbox constraints, and drives the central delta-time loop.
*   **`js/InputManager.js`**: Captures mouse and touch events, and coordinates scale factors for accurate coordinate translation inside the letterboxed canvas.
*   **`js/AssetManager.js`**: Handles downloading of files. Resolves missing files gracefully with high-visibility color blocks for layout checking.

### Scenes (`js/scenes/`)
1.  **`TitleScene.js`**: Opening splash screen. Shows floating air bubbles/particles, radial vignette shading, and the pulsing click invitation.
2.  **`DoorTransition.js`**: Coordinates the closing/hold/opening door states, handles correct background scene rendering swaps, and adds a center seam lighting glow.
3.  **`MenuScene.js`**: The main menu canvas. Arranges the border, the logo, the buttons, and delegates update/render ticks to active UI components.

### UI Components (`js/components/`)
*   **`MenuButton.js`**: Resizable arrow button (**450×95px**). Interpolates hover sliding animations, hold-down click feedback, and light glow shaders.
*   **`OceanBackground.js`**: Horizontal parallax ocean panorama. Scrolls automatically and supports mouse click-and-drag panning.
*   **`HelmDecoration.js`**: Sits at the bottom of the screen. Animates the wood railing and uses wave-based oscillation to rock the helm wheel.

---

## 🎨 Asset Integration Guide

To replace the colored layouts with final graphics, save your PNGs into the following paths:

| Component | Target File | Dimensions | Details |
| :--- | :--- | :--- | :--- |
| **Logo** | `assets/logo/logo.png` | 520 × 260 px | Game logo |
| **New Game Button** | `assets/menu_buttons/new_game.png` | **900 × 190 px** *(2x detail)* | Tentacle style button (renders at 450×95px) |
| **Load Game Button** | `assets/menu_buttons/load_game.png` | **900 × 190 px** *(2x detail)* | Tentacle style button (renders at 450×95px) |
| **Collection Button** | `assets/menu_buttons/collection.png` | **900 × 190 px** *(2x detail)* | Tentacle style button (renders at 450×95px) |
| **Settings Button** | `assets/menu_buttons/settings.png` | **900 × 190 px** *(2x detail)* | Tentacle style button (renders at 450×95px) |
| **Exit Button** | `assets/menu_buttons/exit.png` | **900 × 190 px** *(2x detail)* | Tentacle style button (renders at 450×95px) |
| **Ocean Loop** | `assets/ocean_loop/ocean_loop.png` | 5472 × 984 px | Seamless horizontal loop |
| **Helm Board** | `assets/helm/helm_board.png` | 1920 × 180 px | Bottom deck railing |
| **Helm Wheel** | `assets/helm/helm_wheel.png` | 240 × 240 px | Steering wheel |
| **Top Door** | `assets/door/door_top.png` | 1920 × 580 px | Sliding hatch half |
| **Bottom Door** | `assets/door/door_bottom.png` | 1920 × 580 px | Sliding hatch half |
