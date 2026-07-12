============================================================
  ASSETS FOLDER — Drop your art files here
============================================================

This folder structure mirrors the DIGITALART/MOTHER folders.
When you finish drawing an asset, copy/export the PNG here.

Expected structure:

  assets/
  ├── menu_buttons/
  │   ├── new_game.png      (980×210)
  │   ├── load_game.png     (980×210)
  │   ├── collection.png    (980×210)
  │   ├── settings.png      (980×210)
  │   └── exit.png          (980×210)
  │
  ├── logo/
  │   ├── logo_main.png     (650×325)
  │   └── logo_loading.png  (800×400)
  │
  ├── ocean_loop/
  │   └── ocean_loop.png    (5472×984)
  │
  ├── helm/
  │   ├── helm_board.png    (1920×180)
  │   └── helm_wheel.png    (240×240)
  │
  └── door/
      ├── door_top.png      (1920×580)
      └── door_bottom.png   (1920×580)

Until you drop files here, the code renders colored
placeholders showing exact sizes and positions.

============================================================
HOW TO RUN:

  1. Open a terminal in CODE/MENU
  2. Run: python -m http.server 8080
     (or any local HTTP server)
  3. Open http://localhost:8080 in your browser
  4. You'll see: Title → Door animation → Menu

  NOTE: ES modules require a local server — you can't 
  just double-click index.html (CORS restriction).
============================================================
