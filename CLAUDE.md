# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Test Eyes

A test analytics dashboard that collects test results from CI (JUnit XML), aggregates statistics over time, and displays them on a GitHub Pages frontend. It tracks flaky tests, slow tests, and pass/fail trends.

## Monorepo Structure

- **pnpm workspaces** + **Turborepo** for orchestration
- Packages: `apps/*` and `libraries/*`

| Package | Purpose |
|---------|---------|
| `apps/frontend` | React dashboard (Vite + Tailwind v4 + TanStack Table) |
| `apps/test-processing` | Aggregation script that merges raw test JSON into `main-test-data.json` |
| `apps/example-app` | Sample app with intentionally flaky/slow tests for generating data |
| `libraries/design-system` | Shared React components (`@test-eyes/design-system`) |

## Commands

```bash
pnpm install                         # Install all deps
pnpm build                           # Build all packages (turbo)
pnpm dev                             # Dev servers (turbo)
pnpm test                            # Run all tests (turbo)

# Frontend only
pnpm --filter frontend dev           # Vite dev server
pnpm --filter frontend build         # TypeScript check + Vite build
pnpm --filter frontend lint          # ESLint

# Example app tests
pnpm --filter example-app test       # Run vitest
pnpm --filter example-app test:ci    # Run vitest with JUnit output

# Aggregation
node apps/test-processing/scripts/aggregate.js <data-dir>
```

## Data Pipeline

1. **Collect**: PR triggers CI → runs tests → JUnit XML → `parse-junit.js` → per-run JSON → committed to `gh-data` branch
2. **Aggregate**: `aggregate.js` reads raw JSONs from `gh-data`, computes stats (pass/fail counts, avg/p95 duration), writes `main-test-data.json`
3. **Deploy**: Frontend builds, aggregated data copied into `dist/data/`, deployed to GitHub Pages

Test data lives on the **`gh-data` branch**, not `main`. The frontend fetches from `{BASE_URL}/data/main-test-data.json`.

## Data Schema

See `specs/aggregated-data.spec.md` for the aggregated data format. Raw per-run files contain `{ runId, prNumber, commitSha, createdAt, tests: [{ name, durationMs, status }] }`.

## Key Architecture Details

- Frontend is a single-page app (`App.tsx`) — no routing currently
- Frontend base URL is `/test-eyes/` (configured in `vite.config.ts`)
- Design system uses `class-variance-authority` + `tailwind-merge` for component variants, exported as source TypeScript (no build step)
- Research docs in `openspec/research/` capture design decisions and future directions

## Key coding rules

- Each function must be underneath <20 lines
- 