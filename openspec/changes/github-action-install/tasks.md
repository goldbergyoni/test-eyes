## Tasks

### 1. Create composite action in root
- [ ] Create `/action.yml` in repository root
- [ ] Set `using: composite`
- [ ] Define inputs:
  - `junit-path` (required)
  - `cache_duration_in_minutes` (optional, default: 60)

### 2. Implement composite steps
- [ ] Validate: `test -f` with clear error message
- [ ] Parse: `node apps/example-app/scripts/parse-junit.js`
- [ ] Git: config user, fetch/create data branch, commit JSON
- [ ] Aggregate: `node apps/test-processing/scripts/aggregate.js data`

### 3. Add README
- [ ] Installation guide in root README or separate doc
- [ ] Usage example with permissions needed
- [ ] Two-step setup instructions

### 4. Test in fresh repo
- [ ] Create test repo with simple vitest tests
- [ ] Add workflow with only test + action step
- [ ] Verify dashboard deploys
- [ ] Record video
