# 60 Seconds 2.0 — Wiki Website

The official wiki website for the game **60 Seconds 2.0**.
It provides character and item entries, news, and a community section for fans of the game.

## Tech Stack

**Backend**
- Node.js + Express
- Sequelize ORM + MySQL
- Steam OpenID authentication (JWT stored in an httpOnly cookie)

**Frontend**
- Vue 3 + TypeScript + Vite
- Vuetify (UI components)
- Pinia (state management) + TanStack Query (data fetching)

## Project Structure
```
BACKEND/
  api/
    models/          Sequelize models (characterItem, news, users, community_*)
    routes/          Express route definitions
    controllers/     Request handlers
    services/        Business logic
    repositories/    Database access layer
    config/          Passport (Steam) configuration
    middleware/      JWT authentication middleware
    database/        Sequelize connection (dbContext)
    uploadJsons/     One-time seed scripts (see below)
  character-images/  Source images for character seed data
  item-images/       Source images for item seed data
  app.js             Express app setup
  server.js          Server entry point

FRONTEND/
  src/
    views/           Page components (Characters, Items, News, Community, ...)
    layout/          Main layout with navigation
    api/             TanStack Query hooks per resource
    stores/          Pinia stores (auth)
    lib/             axios, query client, Vuetify setup
    router/          Vue Router configuration
    assets/          Static assets and global styles
    __tests__/       Unit tests
    App.vue          Root component
    main.ts          Application entry point
```

## Seed Scripts (`BACKEND/api/uploadJsons`)

These are **one-time scripts** used to populate the database with initial data.
They are run manually with Node, not part of the running server.

- **`upload-charitem.js`** — Reads the character and item images from the
  `character-images/` and `item-images/` folders, and uploads each entry into
  the shared `characteritems` table. It attaches the image (as a BLOB), sets the
  `type` (`character` or `item`), generates a `mention` handle from the name, and
  stores the entry's story, stats, and perks/tags in the `data` JSON column.

- **`upload-news.js`** — Populates the `news` table with news entries. Each entry
  has a title, excerpt, and block-based `content` (headings, paragraphs, lists),
  which supports inline formatting and `@mentions` that link to wiki entries.

To run a seed script:

```
node api/uploadJsons/upload-charitem.js
node api/uploadJsons/upload-news.js
```

## Features

- **Wiki entries** — Characters and items with images, stats, and story text.
- **Cross-referencing** — `@mentions` in text link directly to other wiki entries.
- **News system** — Block-based articles with formatting, search, and infinite scroll.
- **Search** — Debounced + enter-to-search filtering on characters, items, and news.
- **Steam login** — Sign in with Steam; session kept via a secure httpOnly cookie.
- **Community** *(in progress)* — Posts, comments, and likes/dislikes.