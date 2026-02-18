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
- Shell steps call existing `apps/test-processing` scripts directly
- Simpler than Node action (no `@actions/core`, no `ncc build`)

## Structure

```
apps/github-action/
├── action.yml       # composite action definition
└── README.md        # installation guide

apps/test-processing/
└── scripts/         # existing scripts (unchanged)
```

## action.yml Steps

1. **Validate** - check junit-path exists (shell `test -f`)
2. **Parse** - call `apps/test-processing` parse script
3. **Git** - commit JSON to data branch
4. **Aggregate** - call `apps/test-processing` aggregate script

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `junit-path` | yes | - | Path to JUnit XML file |
| `data-branch` | no | `gh-data` | Branch for storing data |

## Out of Scope

- Caching
- Custom themes
- Branch protection
