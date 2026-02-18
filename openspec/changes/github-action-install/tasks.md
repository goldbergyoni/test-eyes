## Tasks

### 1. Create composite action
- [ ] Create `apps/github-action/action.yml`
- [ ] Set `using: composite`
- [ ] Define inputs: `junit-path` (required), `data-branch` (default: `gh-data`)

### 2. Implement composite steps
- [ ] Validate: `test -f ${{ inputs.junit-path }} || (echo "Error: File not found: ${{ inputs.junit-path }}" && exit 1)`
- [ ] Parse: `node apps/example-app/scripts/parse-junit.js ${{ inputs.junit-path }} test-data.json`
- [ ] Git: config user, fetch/create data branch, commit JSON to `data/`
- [ ] Aggregate: `node apps/test-processing/scripts/aggregate.js data`

### 3. Update workflow
- [ ] Replace inline steps in `collect-test-data.yml` with action usage

### 4. Add README
- [ ] Installation guide in `apps/github-action/README.md`
- [ ] Usage example with permissions needed
