# Extract Reusable GitHub Action for Test Data Collection

## Before → After

```
BEFORE (workflow has everything inlined):
┌─────────────────────────────────────┐
│  collect-test-data.yml              │
│  ├── checkout, setup, install       │
│  ├── run tests                      │
│  ├── parse JUnit XML ←── extract ──┐│
│  └── git commit to branch ← ───── ┘│
└─────────────────────────────────────┘

AFTER (action extracted):
┌─────────────────────────────────────┐
│  collect-test-data.yml              │
│  ├── checkout, setup, install       │
│  ├── run tests                      │
│  └── uses: ./.github/actions/       │
│         collect-test-data ──────────┼──┐
└─────────────────────────────────────┘  │
                                         ▼
                          ┌──────────────────────────┐
                          │  Reusable Action          │
                          │  ├── parse JUnit → JSON   │
                          │  └── commit to gh-data    │
                          └──────────────────────────┘
```

## Consumer Usage

```yaml
# Any repo in the world:
- uses: test-eyes/test-eyes/.github/actions/collect-test-data@main
  with:
    junit-path: test-results.xml

# This repo:
- uses: ./.github/actions/collect-test-data
  with:
    junit-path: apps/example-app/test-results.xml
```

## Files to Create

```
.github/actions/collect-test-data/
├── action.yml       # inputs: junit-path, data-branch
├── package.json     # @actions/core, @actions/exec, fast-xml-parser
├── src/index.js     # parse XML + git commit (combines parse-junit.js + shell steps)
└── dist/index.js    # ncc bundle (committed, so consumers need no build)
```

## action.yml

- `using: node20`
- Inputs: `junit-path` (required), `data-branch` (default: `gh-data`)
- Main: `dist/index.js`

## src/index.js

Combines two existing pieces into one script:

1. **Parse JUnit XML** — same logic as `apps/example-app/scripts/parse-junit.js`, uses `fast-xml-parser`
2. **Git commit to data branch** — same shell steps from the workflow (configure bot user, fetch/create orphan branch, copy JSON, update index, commit, push)

Uses `@actions/core` for inputs and `@actions/exec` for git commands.

## Bundling

```bash
cd .github/actions/collect-test-data
npm install
npx ncc build src/index.js -o dist   # produces single dist/index.js
```

`dist/index.js` is committed to the repo — standard for JS GitHub Actions so consumers need no build step.
