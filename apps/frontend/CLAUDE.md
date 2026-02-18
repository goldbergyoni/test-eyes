# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this directory.

## Frontend App

React 19 + Vite + Tailwind CSS v4 + TanStack Table dashboard. Deployed to GitHub Pages at `/test-eyes/`.

- Single-page app with no router — everything is in `src/App.tsx`
- Fetches pre-aggregated JSON from `{BASE_URL}/data/main-test-data.json` at runtime
- Uses `@test-eyes/design-system` (workspace dependency) for shared components
- Tailwind v4 uses the `@tailwindcss/vite` plugin (not PostCSS)
- Static HTML prototypes in `public/` (organization-view, repository-view) are design references

## Commands

```bash
pnpm dev       # Vite dev server
pnpm build     # tsc -b && vite build
pnpm lint      # ESLint
```

## Local Development Note

The `public/data/` directory contains sample JSON files for local dev. In production, data is copied from the `gh-data` branch during CI deploy.
