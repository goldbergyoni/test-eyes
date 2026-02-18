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
    # 1. Validate input file exists
    # 2. Parse JUnit XML to JSON (calls test-processing)
    # 3. Git commit to data branch
    # 4. Aggregate data (calls test-processing)
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
