## 1. Create Action Definition

- [ ] 1.1 Create `action.yml` at repository root with:
  - Name: "Test Eyes - Test Dashboard"
  - Description: "Visualize test results with a GitHub Pages dashboard"
  - Inputs: `junit-path` (required), `cache_duration_in_minutes` (optional, default: 60)
  - Runs using composite action
- [ ] 1.2 Verify action.yml is valid YAML

## 2. Create Action Scripts Directory

- [ ] 2.1 Create `/action/` directory
- [ ] 2.2 Copy `parse-junit.js` from `apps/example-app/scripts/` to `/action/`
- [ ] 2.3 Copy `aggregate.js` from `apps/test-processing/scripts/` to `/action/`
- [ ] 2.4 Adapt scripts to work standalone (inline `fast-xml-parser` or use bundled version)

## 3. Create Entrypoint Script

- [ ] 3.1 Create `/action/entrypoint.sh` that:
  - Validates junit-path input exists
  - Parses JUnit XML to JSON using parse-junit.js
  - Commits parsed data to gh-data branch
  - Runs aggregation script
  - Copies frontend to deployment directory
  - Deploys to GitHub Pages
- [ ] 3.2 Make entrypoint.sh executable

## 4. Bundle Frontend

- [ ] 4.1 Build frontend with `pnpm --filter frontend build`
- [ ] 4.2 Copy dist output to `/action/frontend-dist/`
- [ ] 4.3 Ensure base path is configurable (default: `/test-eyes/`)

## 5. Create action.yml Composite Steps

- [ ] 5.1 Define steps in action.yml:
  - Setup Node.js 22
  - Run entrypoint.sh with inputs
  - Upload to GitHub Pages
- [ ] 5.2 Handle permissions requirements documentation

## 6. Documentation

- [ ] 6.1 Update README with usage instructions
- [ ] 6.2 Add example workflow snippet
- [ ] 6.3 Document required permissions

## 7. Testing

- [ ] 7.1 Create a test repository
- [ ] 7.2 Add simple test file with JUnit output
- [ ] 7.3 Add workflow using the action
- [ ] 7.4 Verify dashboard deploys correctly
- [ ] 7.5 Record demo video
