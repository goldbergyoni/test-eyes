# CLAUDE.md

This file provides guidance to Claude Code when working with code in this directory.

## Test Processing - Domain Layer

This is the **core domain layer** of test-eyes. All business logic for test data processing lives here as testable TypeScript functions.

## Structure

```
test-processing/
├── src/                      # Core business logic
│   ├── types.ts              # Shared TypeScript types
│   ├── aggregate.ts          # Test data aggregation (stats, p95, avg)
│   ├── junit-parser.ts       # JUnit XML parsing
│   ├── file-operations.ts    # File system operations
│   ├── git-operations.ts     # Git commands (fetch, commit, push)
│   ├── deploy.ts             # GitHub Pages deployment
│   ├── collector.ts          # High-level collection workflow
│   └── index.ts              # Public API exports
├── scripts/                  # CLI entry points
│   ├── cli.ts                # Main CLI with all commands
│   ├── action-collect.ts     # GitHub Action: collect test data
│   └── action-deploy.ts      # GitHub Action: deploy dashboard
└── tests/                    # Unit tests (vitest)
```

## Commands

```bash
# Run CLI
pnpm cli collect --junit-path ./test-results.xml
pnpm cli deploy --dist-dir ./dist
pnpm cli aggregate ./data

# Development
pnpm typecheck     # Type check all files
pnpm test          # Run tests
pnpm test:watch    # Watch mode
```

## Key Modules

### aggregate.ts
- `aggregate(dataDir)` - Aggregate all test data files
- `calculateP95(values)` - Calculate 95th percentile
- `isValidRunData(data)` - Validate run data structure

### git-operations.ts
- `configureGit(config)` - Set git user config
- `fetchBranches(branches)` - Fetch remote branches
- `checkoutOrCreateBranch(branch)` - Checkout or create orphan branch
- `commit(message)` - Stage and commit changes
- `push(branch)` - Push to remote

### collector.ts
- `collectTestData(options)` - Full collection workflow:
  1. Parse JUnit XML
  2. Save test data
  3. Aggregate statistics
  4. Commit and push to data branch

### deploy.ts
- `deployDashboard(options)` - Deploy to GitHub Pages:
  1. Prepare site directory
  2. Copy frontend + data
  3. Push to gh-pages branch

## Best Practices

- All functions are async and return typed results
- Git operations use child_process with proper error handling
- JSON files are validated before processing
- Functions are small (<20 lines) and focused
