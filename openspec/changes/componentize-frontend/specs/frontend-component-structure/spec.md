## ADDED Requirements

### Requirement: Frontend file structure follows pages/components/hooks convention

The frontend app SHALL organize source files into the following directories under `apps/frontend/src/`:
- `pages/` for page-level layout components
- `components/` for reusable UI components
- `hooks/` for custom React hooks
- `types.ts` for shared TypeScript type definitions

`App.tsx` SHALL serve only as the application shell that composes page components.

#### Scenario: File organization after refactor
- **WHEN** a developer inspects the `apps/frontend/src/` directory
- **THEN** they find `pages/`, `components/`, `hooks/` directories and a `types.ts` file
- **AND** `App.tsx` contains no data-fetching logic, no column definitions, and no table rendering

### Requirement: Data fetching is encapsulated in a custom hook

The test data fetching logic SHALL be extracted into a `useTestData` hook in `hooks/useTestData.ts`. The hook SHALL return `{ data, meta, loading, error }` and handle all fetch/state management internally.

#### Scenario: Hook provides test data to consumers
- **WHEN** a component calls `useTestData()`
- **THEN** it receives an object with `data` (array of test rows), `meta` (aggregation metadata or null), `loading` (boolean), and `error` (string or null)

#### Scenario: Hook fetches from the correct endpoint
- **WHEN** the hook runs on mount
- **THEN** it fetches from `{BASE_URL}/data/main-test-data.json`
- **AND** transforms the response into an array of `TestRow` objects

### Requirement: Tables use design system components

All data tables in the frontend SHALL use the design system's `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, and `TableCell` components from `@test-eyes/design-system`. Raw HTML `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` elements SHALL NOT be used for data display.

#### Scenario: SortableTable renders with design system primitives
- **WHEN** the `SortableTable` component renders a data table
- **THEN** it uses `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` from the design system
- **AND** no raw HTML table elements are present in its output

#### Scenario: Sort interaction preserved
- **WHEN** a user clicks a table column header
- **THEN** the table sorts by that column (toggling ascending/descending)
- **AND** a sort direction indicator (`↑` or `↓`) is displayed on the active sort column

### Requirement: Page layout is a dedicated component

The dashboard layout (title, metadata summary, table sections) SHALL be extracted into a `DashboardPage` component in `pages/DashboardPage.tsx`. This component SHALL handle loading states, error states, and the empty-data state.

#### Scenario: Dashboard renders all sections
- **WHEN** test data is loaded successfully and contains entries
- **THEN** `DashboardPage` renders the page title, run count and last-updated metadata, a "Test Overview" table, and a "Slowest Tests (by p95)" table

#### Scenario: Dashboard shows loading state
- **WHEN** data is still being fetched
- **THEN** `DashboardPage` displays a loading indicator

#### Scenario: Dashboard shows error state
- **WHEN** data fetching fails
- **THEN** `DashboardPage` displays the error message

#### Scenario: Dashboard shows empty state
- **WHEN** data is loaded but contains no test entries
- **THEN** `DashboardPage` displays a message indicating no test data is available

### Requirement: Shared types are defined in a single file

All shared TypeScript interfaces (`AggregatedData`, `TestStats`, `TestRow`) SHALL be defined in `types.ts` and imported by modules that need them. Type definitions SHALL NOT be duplicated across files.

#### Scenario: Types importable from types.ts
- **WHEN** a module needs `AggregatedData`, `TestStats`, or `TestRow`
- **THEN** it imports them from `../types` (or appropriate relative path to `types.ts`)
