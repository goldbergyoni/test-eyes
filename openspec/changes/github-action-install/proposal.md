# Change: One-Step GitHub Action Installation

Based on: `openspec/research/extract-github-action.md`

Coding rules: `.claude/rules/golden-rules.md`

## Goal

Make test-eyes work with **two steps only**:

1. User enables GitHub Pages permissions
2. User adds one action step:

```yaml
- uses: goldbergyoni/test-eyes@v1
  with:
    junit-path: './junit.xml'
    cache_duration_in_minutes: 60
```

## Why Composite Action

- `using: composite` - no build step, no bundling
- Shell steps call existing scripts directly
- Simpler than Node action (no `@actions/core`, no `ncc build`)
- Minimize changes to existing codebase

## Structure

```text
/action.yml              # ROOT - composite action (NEW)

# Existing scripts (unchanged):
apps/example-app/scripts/parse-junit.js
apps/test-processing/scripts/aggregate.js
```

**Why root?** So users can call `uses: goldbergyoni/test-eyes@v1` directly.

## action.yml Steps

1. **Validate** - check junit-path file exists
2. **Parse** - `node apps/example-app/scripts/parse-junit.js`
3. **Git** - commit JSON to data branch
4. **Aggregate** - `node apps/test-processing/scripts/aggregate.js`

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `junit-path` | yes | - | Path to JUnit XML file |
| `cache_duration_in_minutes` | no | `60` | Reserved for future caching |

## Out of Scope

- Caching implementation (input reserved for future)
- Custom themes
- Branch protection
- Dashboard deployment (separate workflow)

## DoD

- [ ] Test repo with simple tests
- [ ] Video of action in use
- [ ] Link to deployed dashboard
