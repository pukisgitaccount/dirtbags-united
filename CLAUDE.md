# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Community-based climbing app to create and share topos (climbing route guides) for free. Built as an npm workspace monorepo with two apps:

- `apps/pwa` — React/TypeScript/Vite frontend (PWA)
- `apps/api` — Express/TypeScript backend

## Development Commands

All commands run from the repo root (`dirtbags-united/`):

```bash
npm run dev:pwa     # Start frontend (Vite dev server)
npm run dev:api     # Start backend (nodemon + tsx)
npm run dev         # Alias for dev:pwa
```

From `apps/pwa/`:

```bash
npm run build       # tsc + vite build
npm run lint        # eslint
npm run preview     # Preview production build
```

No test runner is configured yet (`test` scripts just echo an error).

## Architecture

### Frontend (`apps/pwa`)

React 19 SPA with React Router v7. The main layout in `src/App.tsx` wraps all routes inside a fixed-height column: a scrollable content area with a persistent `<Navbar>` at the bottom.

**Routing:**

- `/` → `MapPage` (main feature)
- `/logbook`, `/favorites`, `/profile` → stub pages
- `/styleguide` → component showcase at `StylePage`
- `/admin` - admin page to verify requests, check uploads etc.

**Map stack:** MapLibre GL via `maplibre-react-components` (`RMap`, `RGradientMarker`, `RPopup`). The map style uses the OpenMapTiles public endpoint. Marker click state is local (`useState` in `MapLibre.tsx`). Crags are currently hardcoded in `MapPage.tsx` — Supabase integration is not wired to the map yet.

**Supabase:** Client is initialized in `apps/pwa/utils/supabase.ts` using `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` env vars (see `apps/pwa/.env`). The client is not yet used in any component.

**Domain models** live in `src/domain/`:

- `Crag` — climbing area with lat/lng and optional parking coords
- `Sector` — sub-area within a crag
- `Route` — individual climb with grade and optional sector
- `Tick` — a logged ascent with tick type (`Rotpunkt`, `Flash`, `Onsight`, `Toprope`, `Go`)

**Styling:** Tailwind CSS v4 (via `@tailwindcss/vite` plugin — no `tailwind.config.js` needed). Uses the stone color palette throughout.

### Backend (`apps/api`)

Minimal Express 5 server at `src/index.ts`. Listens on `PORT` env var or 8000. Has only a root `GET /` route. Uses ES modules (`"type": "module"`), runs via `tsx` in dev with `nodemon` watching `src/`.

#### Login/Auth

JWT for logging in. Password encrypting by

### Database

Using supabase DB with migration schema.
Rate Limiting of 100 req per minute since low effort servers

## Key Conventions

- Tailwind v4 is configured entirely via the Vite plugin — no config file.
- The `maplibre-gl` CSS import is commented out in `MapLibre.tsx`; `maplibre-theme` CSS is used instead.
- `gradientMarkerPopupOffset` from `maplibre-react-components` must be passed to `RPopup` when anchoring to an `RGradientMarker`.
- The `packages/` workspace exists but contains only a root `package.json` — no shared packages yet.

## Claude Code instructions

- Keep answers short and simple
- dont show changed code in the CLI to save tokens
- dont make big code changes, one function at a time
