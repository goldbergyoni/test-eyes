# Test Eyes

Test analytics dashboard that collects test results from CI (JUnit XML), aggregates statistics over time, and displays them on GitHub Pages.

## Structure

| Package | Purpose |
|---------|---------|
| `apps/frontend` | React dashboard (Vite + Tailwind + TanStack Table) |
| `apps/test-processing` | Aggregation scripts for test data |
| `apps/example-app` | Sample app with tests for generating data |
| `libraries/design-system` | Shared UI components |

## Commands

```bash
pnpm install    # Install deps
pnpm dev        # Start dev servers
pnpm build      # Build all
pnpm test       # Run tests
```

## Rules

Before coding, read `.claude/rules/golden-rules.md`.
