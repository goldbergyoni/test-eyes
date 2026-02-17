# Test Eyes

Dashboard for visualizing and analyzing test results from CI/CD pipelines.

## Project Structure

Monorepo using pnpm workspaces + Turborepo:

```
test-eyes/
├── apps/
│   ├── frontend/          # React dashboard (Vite + Tailwind)
│   ├── example-app/       # Example app with vitest
│   └── test-processing/   # Test data processing
├── libraries/
│   └── design-system/     # Shared UI components (@test-eyes/design-system)
├── specs/                 # Technical specifications
└── openspec/
    └── research/          # Research and concepts
```

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4, TanStack Table
- **Build**: Turborepo, pnpm
- **Testing**: Vitest
- **Design System**: class-variance-authority, clsx, tailwind-merge

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev servers
pnpm build            # Build all packages
pnpm test             # Run tests
```

## Data

Aggregated test data is stored as JSON (`data/main-test-data.json`) on the `gh-data` branch. Schema is defined in `specs/aggregated-data.spec.md`.

## Design

Using "Obsidian Pulse" concept - dark theme with electric mint accent (#00FF88). Details in `openspec/research/dashboard-designs.md`.

## Open Spec

For planning new features use the structure:

- `openspec/research/` - research and experiments
- `specs/` - finalized technical specifications

## Code Guidelines

- TypeScript strict mode
- Functional React components
- Tailwind for styling (no CSS modules)
- Use design-system components for UI consistency
