## ADDED Requirements

### Requirement: GitHub Action for One-Step Installation

Users SHALL be able to add test-eyes to their repository by adding a single action step to their existing test workflow. The action MUST accept a path to a JUnit XML file and handle all data processing and dashboard deployment automatically.

#### Scenario: Basic action usage

- **GIVEN** a repository with a test workflow that produces JUnit XML output
- **WHEN** user adds the test-eyes action step with junit-path input
- **THEN** the action parses test results and deploys a dashboard to GitHub Pages

#### Scenario: Action accepts junit-path input

- **GIVEN** a workflow step using `goldbergyoni/test-eyes@v1`
- **WHEN** user provides `junit-path: './test-results.xml'`
- **THEN** the action reads and processes the specified JUnit XML file

#### Scenario: Action creates data branch if not exists

- **GIVEN** a repository without a `gh-data` branch
- **WHEN** the action runs for the first time
- **THEN** the action creates the `gh-data` branch and commits initial test data

#### Scenario: Action appends to existing data

- **GIVEN** a repository with existing test data on `gh-data` branch
- **WHEN** the action runs with new test results
- **THEN** new test data is added and aggregated with existing data

#### Scenario: Dashboard shows aggregated statistics

- **WHEN** the dashboard is deployed
- **THEN** it displays test overview table with: test name, average duration, failures, total runs
- **AND** it displays slowest tests table with: test name, p95 duration, average duration, total runs

### Requirement: Minimal User Configuration

The action SHALL require minimal configuration from the user. Users MUST only need to:
1. Enable GitHub Pages in repository settings
2. Add the action step to their workflow

#### Scenario: No additional dependencies required

- **GIVEN** a repository with Node.js tests
- **WHEN** user adds the action step
- **THEN** no additional npm packages or setup scripts are needed

#### Scenario: Required permissions are documented

- **WHEN** user sets up the action
- **THEN** documentation clearly specifies required permissions: `contents: write`, `pages: write`, `id-token: write`

### Requirement: Action Input Specification

#### Input: junit-path

- **Type**: string
- **Required**: yes
- **Description**: Path to the JUnit XML file produced by the test framework

#### Input: cache_duration_in_minutes

- **Type**: number
- **Required**: no
- **Default**: 60
- **Description**: Reserved for future caching implementation (not used in v1)

### Requirement: Action Output

The action SHALL produce a deployed GitHub Pages site at `https://<owner>.github.io/<repo>/` containing the test dashboard.

#### Scenario: Dashboard URL is accessible

- **WHEN** the action completes successfully
- **THEN** the dashboard is accessible at the repository's GitHub Pages URL
