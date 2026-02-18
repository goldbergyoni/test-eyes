## Tasks

### 1. Create action structure
- [ ] Create `.github/actions/collect-test-data/`
- [ ] Create `action.yml` (using: node20, inputs: junit-path, data-branch)
- [ ] Create `package.json` with: `@actions/core`, `@actions/exec`, `fast-xml-parser`

### 2. Create src/index.js
- [ ] Import parse logic from `apps/test-processing`
- [ ] Add git commit logic (reuse from workflow, but in JS not bash)
- [ ] Add error: "JUnit file not found: {path}" when file missing
- [ ] Use `@actions/core` for inputs/logging, `@actions/exec` for git

### 3. Bundle
- [ ] `npx ncc build src/index.js -o dist`
- [ ] Commit `dist/index.js`

### 4. Update workflow
- [ ] Simplify `collect-test-data.yml` to use action

### 5. README
- [ ] Add installation guide with usage example and required permissions
