## Tasks

### 1. Create composite action
- [ ] Create `apps/github-action/action.yml`
- [ ] Set `using: composite`
- [ ] Define inputs: `junit-path` (required), `data-branch` (default: `gh-data`)

### 2. Implement composite steps
- [ ] Validate: `test -f ${{ inputs.junit-path }}` with clear error
- [ ] Parse: run existing script from `apps/test-processing`
- [ ] Git: config user, fetch/create data branch, commit JSON
- [ ] Aggregate: run existing aggregate script

### 3. Update workflow
- [ ] Replace inline steps in `collect-test-data.yml` with action usage

### 4. Add README
- [ ] Installation guide in `apps/github-action/README.md`
- [ ] Usage example with permissions needed
