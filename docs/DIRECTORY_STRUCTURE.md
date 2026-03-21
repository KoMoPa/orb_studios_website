# Directory Structure Guide

## 1) **blocks** — Content layout components
Blocks are **page layout building blocks** managed in the Payload CMS admin. You create Pages with a "layout" field that's an array of blocks.
- **Where to implement:** Create a new folder in `src/blocks/YourBlock/` with a `Component.tsx` file
- **How to integrate:** Register it in `src/blocks/RenderBlocks.tsx` in the `blockComponents` object
- **Example:** `ContentBlock` renders rich text with optional columns/links

## 2) **components** — Reusable UI components
These are general React components used throughout the site—not managed via Payload.
- **Where to implement:** Place them directly in `src/components/` or organize in subfolders
- These are for navbar parts, cards, pagination, etc. Not tied to Payload CMS data
- **Examples:** `Card/`, `Link/`, `Pagination/`, `Logo/`, `RichText/`

## 3) **endpoints** — Custom API routes
Payload custom endpoints for backend logic.
- **The seed folder:** Safe to delete (it's bootstrap data for demo purposes—only needed if you want sample data populated on first run)

## 4) **fields** — Reusable Payload field configurations
These are factory functions that define form fields reused across collections.
- **Examples:** `link.ts` (group field with label, URL, appearance), `defaultLexical.ts` (rich text editor config)
- Used via: `collections/Pages.ts` would import and use `link()` in its schema

## 5) **Footer & Header** — Payload global configs + components
These are **Payload globals** (site-wide settings, not per-page data).
- **Edit here:** Your navbar (Header) and footer content/structure
- **Structure:** `config.ts` defines the Payload schema, `Component.tsx` renders it on the frontend, `RowLabel.tsx` displays labels in the admin
- Registered in `src/payload.config.ts` as globals

## 6) **heros** — Page hero section variants
Similar to blocks, but specifically for page headers.
- **Where to implement:** Create `src/heros/YourHero/Component.tsx`
- **How to integrate:** Register in `src/heros/RenderHero.tsx`
- **Examples:** `HighImpactHero`, `LowImpactHero`, `MediumImpactHero`, `PostHero`
- Editors in Payload select a hero type; the RenderHero component displays the right variant

## 7) **hooks** — Custom React hooks
Custom React hooks for reusable stateful logic.
- **Current examples:** `populatePublishedAt` (Payload hook), `revalidateRedirects` (Payload hook)

## 8) **lib** — Utility libraries & helpers
Currently contains `booking/` folder.
- This is for:
  - Booking logic, payment handlers, API clients
  - Shared utility libraries
  - Business logic (not UI-related)

## 9) **providers** — React context providers
React Context providers for global state.
- **Current setup:** `ThemeProvider` (light/dark mode), `HeaderThemeProvider` (header styling context)
- **How to use:** Wrapped at the root in your app layout

## 10) **search** — Payload search integration
This is for Payload's search functionality (admin panel search).
- Syncs collection data for admin searching
- Only remove if you don't need search in the Payload admin

## 11) **utilities** — Helper functions & constants
**Vitally important.** Pure functions and utilities.
- **Examples:** `getURL()`, `formatDateTime()`, `generateMeta()`, `getDocument()`, `ui.ts` (Tailwind `cn()` helper)
- **Stateless utilities:** formatters, validators, API helpers, constants