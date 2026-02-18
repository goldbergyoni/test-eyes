# Change: Extract Reusable GitHub Action

Based on: `openspec/research/extract-github-action.md`

## Goal

Extract test data collection logic from workflow into a reusable **composite action**.

```yaml
- uses: goldbergyoni/test-eyes@main
  with:
    junit-path: test-results.xml
```

## Why Composite Action

- `using: composite` - no build step, no bundling
- Shell steps call existing scripts directly
- Simpler than Node action (no `@actions/core`, no `ncc build`)

## Structure

```
apps/github-action/
├── action.yml       # composite action definition
└── README.md        # installation guide

# Existing scripts (unchanged):
apps/example-app/scripts/parse-junit.js     # JUnit XML → JSON
apps/test-processing/scripts/aggregate.js   # aggregate stats
```

## action.yml Steps

1. **Validate** - `test -f` with error message on failure
2. **Parse** - `node apps/example-app/scripts/parse-junit.js`
3. **Git** - config user, fetch/create data branch, commit JSON
4. **Aggregate** - `node apps/test-processing/scripts/aggregate.js`

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `junit-path` | yes | - | Path to JUnit XML file |
| `data-branch` | no | `gh-data` | Branch for storing data |

## Out of Scope

- Caching
- Custom themes
- Branch protection
