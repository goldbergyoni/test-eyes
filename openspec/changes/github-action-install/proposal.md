# Change: One-Step GitHub Action Installation

## Why

Currently, users need to set up multiple workflows and scripts to use test-eyes. The goal is to make installation as simple as:

1. Assign GitHub Pages permissions
2. Add a single action step to their workflow

This reduces friction and makes test-eyes accessible to any project with JUnit test output.

## What Changes

Add a reusable GitHub Action (`action.yml`) at the repository root that users can call with:

```yaml
uses: goldbergyoni/test-eyes@v1
with:
  junit-path: './junit.xml'
  cache_duration_in_minutes: 60
```

The action will:
- Parse the provided JUnit XML file to JSON
- Commit raw test data to the `gh-data` branch
- Trigger aggregation of test statistics
- Deploy the dashboard to GitHub Pages

## Technical Approach

**Keep it simple - reuse existing scripts:**
- Use `parse-junit.js` from `apps/example-app/scripts/` (copy into action)
- Use `aggregate.js` from `apps/test-processing/scripts/` (copy into action)
- Bundle a minimal pre-built frontend for deployment

**Action structure:**
```
/
├── action.yml           # Action metadata and inputs
├── action/
│   ├── entrypoint.sh   # Main script orchestrating the flow
│   ├── parse-junit.js  # JUnit XML to JSON parser
│   └── aggregate.js    # Statistics aggregation
```

**Inputs:**
- `junit-path` (required): Path to JUnit XML file
- `cache_duration_in_minutes` (optional, default: 60): Not used in v1, reserved for future caching

## Impact

- **New files:**
  - `/action.yml` - GitHub Action definition
  - `/action/entrypoint.sh` - Main orchestration script
  - `/action/parse-junit.js` - Copied from example-app
  - `/action/aggregate.js` - Copied from test-processing
  - `/action/frontend-dist/` - Pre-built frontend files

- **No changes to existing code** - The action is self-contained

- **User requirements:**
  - Must enable GitHub Pages (Settings > Pages > GitHub Actions)
  - Must have `contents: write`, `pages: write`, `id-token: write` permissions

## Out of Scope (Keep Simple)

- No caching implementation in v1 (input reserved for future)
- No custom dashboard themes
- No branch protection handling
- No multi-repo aggregation
