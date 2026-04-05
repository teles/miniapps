# Microapps

Microapps is a collection of small, focused productivity tools built as a multi-page web app.

The project currently includes:
- **Daily Pomodoros** (`/microapps/daily-pomodoro/`): a lightweight task + pomodoro flow.
- **Emoji Remover** (`/microapps/emoji-remover/`): clean text by removing all or selected emojis.

## Core Engineering Principles

This repository is intentionally built around the following characteristics:

- **SOLID-oriented architecture** where responsibilities are split into small modules.
- **Reusable foundation for new microapps** through shared design-system primitives and shell utilities.
- **Low coupling to Alpine**: UI state uses Alpine, but business logic is kept as framework-light as possible.
- **Mostly pure functions** for transformation and domain logic, with side effects isolated.
- **PWA capabilities** via `vite-plugin-pwa` (manifest + service worker generation).
- **Offline-first behavior**: microapps should run 100% offline unless an explicit external API is required.
- **Flexoki color palette** as the design-system visual baseline.
- **Storybook support** for design-system documentation and component development.

## Tech Stack

- Node.js **22.x**
- Vite (MPA)
- Alpine.js
- Vitest
- Storybook
- Tailwind CSS (utility usage)

## Getting Started

```bash
yarn install
yarn dev
```

Open `http://localhost:5173`.

## Available Scripts

```bash
yarn dev              # local development
yarn build            # production build to dist/
yarn preview          # preview built files
yarn test             # run unit tests
yarn storybook        # run Storybook locally
yarn storybook:build  # static Storybook build
```

## Project Structure

```text
src/
  index.html                  # launcher
  launcher/
  microapps/
    daily-pomodoro/
    emoji-remover/
  packages/
    design-system/
```

## PWA + Offline

PWA configuration lives in `vite.config.js` using `VitePWA`.

Current setup includes:
- generated web app manifest
- service worker with pre-caching for app assets (`js`, `css`, `html`, `svg`)
- navigation fallback for MPA behavior

## Deployment (Cloudflare Pages)

This repo is prepared for Cloudflare Pages deployment via GitHub Actions (`.github/workflows/cloudflare-pages.yml`).

Required repository secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

The workflow builds the project and deploys `dist/` to the Cloudflare Pages project `microapps`.

## Building New Microapps

When adding a new microapp, prefer this approach:
1. Keep core logic in plain modules and pure functions.
2. Reuse design-system tokens/components before adding custom styles.
3. Wire minimal Alpine glue only for view state and events.
4. Keep offline behavior by default.
5. Add unit tests for domain logic and edge cases.
