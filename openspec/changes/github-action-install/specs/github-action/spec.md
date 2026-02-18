## Composite Action Spec

Location: `apps/github-action/action.yml`

### Definition

```yaml
name: 'Test Eyes - Collect Test Data'
description: 'Parse JUnit XML and aggregate test statistics'

inputs:
  junit-path:
    description: 'Path to JUnit XML file'
    required: true
  data-branch:
    description: 'Branch for storing test data'
    required: false
    default: 'gh-data'

runs:
  using: composite
  steps:
    - name: Validate input
      shell: bash
      run: |
        if [ ! -f "${{ inputs.junit-path }}" ]; then
          echo "Error: File not found: ${{ inputs.junit-path }}"
          exit 1
        fi

    - name: Parse JUnit XML
      shell: bash
      run: node apps/example-app/scripts/parse-junit.js "${{ inputs.junit-path }}" test-data.json

    - name: Commit to data branch
      shell: bash
      run: |
        git config user.name "github-actions[bot]"
        git config user.email "github-actions[bot]@users.noreply.github.com"
        git fetch origin ${{ inputs.data-branch }} || true
        git checkout ${{ inputs.data-branch }} || git checkout --orphan ${{ inputs.data-branch }}
        mkdir -p data
        cp test-data.json "data/$(date +%Y-%m-%d)_${GITHUB_SHA:0:7}.json"
        git add data/
        git commit -m "Add test data for ${GITHUB_SHA:0:7}" || echo "No changes"
        git push origin ${{ inputs.data-branch }}

    - name: Aggregate data
      shell: bash
      run: node apps/test-processing/scripts/aggregate.js data
```

### Error Handling

| Condition | Behavior |
|-----------|----------|
| `junit-path` file missing | Fail with: "Error: File not found: {path}" |
| Parse fails | Fail with parser error message |
| Git push fails | Fail with git error |

### Usage Example

```yaml
- uses: goldbergyoni/test-eyes@main
  with:
    junit-path: test-results.xml
```

Requires permissions: `contents: write`
