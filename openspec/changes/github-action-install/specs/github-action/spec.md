## Composite Action Spec

Location: `/action.yml` (repository root)

### Definition

```yaml
name: 'Test Eyes'
description: 'Collect test results and deploy analytics dashboard'

inputs:
  junit-path:
    description: 'Path to JUnit XML file'
    required: true
  cache_duration_in_minutes:
    description: 'Cache duration (reserved for future)'
    required: false
    default: '60'

runs:
  using: composite
  steps:
    - name: Validate input
      shell: bash
      run: |
        if [ ! -f "${{ inputs.junit-path }}" ]; then
          echo "::error::File not found: ${{ inputs.junit-path }}"
          exit 1
        fi

    - name: Parse JUnit XML
      shell: bash
      run: node ${{ github.action_path }}/apps/example-app/scripts/parse-junit.js "${{ inputs.junit-path }}" test-data.json

    - name: Commit to data branch
      shell: bash
      run: |
        git config user.name "github-actions[bot]"
        git config user.email "github-actions[bot]@users.noreply.github.com"
        git fetch origin gh-data || true
        git checkout gh-data || git checkout --orphan gh-data
        mkdir -p data
        cp test-data.json "data/$(date +%Y-%m-%d)_${GITHUB_SHA:0:7}.json"
        git add data/
        git commit -m "Add test data for ${GITHUB_SHA:0:7}" || echo "No changes"
        git push origin gh-data

    - name: Aggregate data
      shell: bash
      run: node ${{ github.action_path }}/apps/test-processing/scripts/aggregate.js data
```

### Error Handling

| Condition | Behavior |
|-----------|----------|
| `junit-path` missing | `::error::File not found: {path}` + exit 1 |
| Parse fails | Exit with parser error |
| Git push fails | Exit with git error |

### Usage

```yaml
name: Tests
on: [push, pull_request]

permissions:
  contents: write

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test -- --reporter=junit --outputFile=junit.xml
      - uses: goldbergyoni/test-eyes@v1
        with:
          junit-path: './junit.xml'
```

### Requirements

User must:
1. Enable GitHub Pages (Settings → Pages → GitHub Actions)
2. Grant `contents: write` permission
3. Node.js available (pre-installed on GitHub Actions runners)
