# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this directory.

## Design System (`@test-eyes/design-system`)

Shared React component library consumed by the frontend via `workspace:*`.

- **No build step** — exports source TypeScript directly (`main` and `types` point to `src/index.ts`)
- Components: `Button`, `Title`, `Table` (with `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`)
- Uses `class-variance-authority` (cva) for variant definitions and `tailwind-merge` via `cn()` utility for class merging
- Peer dependency on React 18 or 19
