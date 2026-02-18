## Tasks

### 1. Create action app
- [ ] Create `apps/github-action/action.yml` (composite action)
- [ ] Define inputs: `junit-path`, `data-branch`

### 2. Add composite steps
- [ ] Step: validate junit-path exists
- [ ] Step: run parse script from `apps/test-processing`
- [ ] Step: git config + commit to data branch
- [ ] Step: run aggregate script from `apps/test-processing`

### 3. Update workflow
- [ ] Simplify `collect-test-data.yml` to use action

### 4. README
- [ ] Add installation guide with usage example
