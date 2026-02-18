## Composite Action

### Inputs

- `junit-path` (required) - path to JUnit XML
- `data-branch` (optional, default: `gh-data`)

### Steps

1. Validate junit-path exists
2. Run `apps/test-processing` parse script
3. Git commit to data branch
4. Run `apps/test-processing` aggregate script

### Scenarios

#### Missing file
- **WHEN** junit-path doesn't exist
- **THEN** fail with clear error

#### First run
- **WHEN** data branch doesn't exist
- **THEN** create orphan branch, commit data

#### Subsequent run
- **WHEN** data branch exists
- **THEN** add new JSON, re-aggregate
