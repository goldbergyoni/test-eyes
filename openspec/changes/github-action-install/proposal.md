# Change: Extract Reusable GitHub Action for Test Data Collection

Based on: `openspec/research/extract-github-action.md`

Coding rules: `.claude/rules/golden-rules.md`

## Goal

Extract inline workflow steps into reusable Node action so any repo can use:

```yaml
- uses: goldbergyoni/test-eyes/.github/actions/collect-test-data@main
  with:
    junit-path: test-results.xml
```

## Architecture

```
BEFORE (inlined in workflow):
  collect-test-data.yml → parse JUnit + git commit

AFTER (extracted):
  collect-test-data.yml → uses: ./.github/actions/collect-test-data
```

## Structure

Keep existing folder structure. Action reuses `apps/test-processing`:

```
.github/actions/collect-test-data/
├── action.yml       # using: node20, inputs: junit-path, data-branch
├── package.json     # @actions/core, @actions/exec, fast-xml-parser
├── src/index.js     # imports from apps/test-processing
└── dist/index.js    # ncc bundle (committed)
```

Action is **Node-based** (`using: node20`), not composite. Bundled with `ncc`.

## Inputs

- `junit-path` (required) - path to JUnit XML
- `data-branch` (optional, default: `gh-data`)

## Out of Scope

- Caching
- Custom themes
- Branch protection
