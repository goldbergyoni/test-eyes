# Change: Extract Reusable GitHub Action for Test Data Collection

Based on: `openspec/research/extract-github-action.md` + Yoni's feedback

## Goal

Create composite action that calls existing `apps/test-processing` scripts:

```yaml
- uses: goldbergyoni/test-eyes@main
  with:
    junit-path: test-results.xml
```

## Structure

New app for the action, calls existing scripts:

```
apps/github-action/
└── action.yml       # composite action

apps/test-processing/
└── scripts/         # existing scripts (no changes)
```

## action.yml

Composite action (`using: composite`) with shell steps:
1. Parse JUnit XML → calls existing parse script
2. Git commit to data branch
3. Aggregate → calls existing aggregate script

No build step. No bundling. Just shell commands calling existing JS files.

## Inputs

- `junit-path` (required) - path to JUnit XML
- `data-branch` (optional, default: `gh-data`)

## Out of Scope

- Caching
- Custom themes
- Branch protection
