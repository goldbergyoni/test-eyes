## collect-test-data action

### Inputs

- `junit-path` (required) - path to JUnit XML
- `data-branch` (optional, default: `gh-data`)

### Behavior

1. Validate junit-path exists
2. Parse JUnit XML → JSON
3. Git: configure bot user, fetch/create orphan branch
4. Commit JSON as `{date}_{sha}.json`, update `index.json`
5. Push to data branch

### Scenarios

#### Missing file
- **WHEN** junit-path doesn't exist
- **THEN** fail with "JUnit file not found: {path}"

#### First run
- **WHEN** data branch doesn't exist
- **THEN** create orphan branch, commit data

#### Subsequent run
- **WHEN** data branch exists
- **THEN** add new JSON, update index
