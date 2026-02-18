## Why

The entire frontend lives in a single 183-line `App.tsx` — data fetching, column definitions, table rendering, layout, and loading/error states are all mixed together. This makes the code hard to navigate, hard to test in isolation, and hard to extend (e.g., adding new pages or views). Additionally, `App.tsx` uses raw HTML `<table>/<th>/<td>` elements with inline Tailwind classes instead of the design system's `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, and `TableCell` components, duplicating styles that already exist in `@test-eyes/design-system`.

## What Changes

- Extract the data-fetching logic (useEffect + state) out of `App.tsx` into a dedicated hook (`useTestData`)
- Extract the sortable data table into a reusable `SortableTable` component that uses the design system's Table components instead of raw HTML
- Extract the dashboard page layout (header, meta info, sections) into a `DashboardPage` component
- Introduce a `src/pages/` directory for page-level components and a `src/components/` directory for shared UI components
- Slim down `App.tsx` to a thin shell that composes pages
- Replace all raw `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` usage with design system Table components

## Capabilities

### New Capabilities

- `frontend-component-structure`: Defines how the frontend organizes pages, components, and hooks into a clear file/folder structure with single-responsibility modules

### Modified Capabilities

_(none — no existing specs are affected)_

## Impact

- **Code**: `apps/frontend/src/App.tsx` will be significantly reduced; new files created under `apps/frontend/src/pages/`, `apps/frontend/src/components/`, and `apps/frontend/src/hooks/`
- **Dependencies**: No new external dependencies — uses existing `@test-eyes/design-system` Table components and `@tanstack/react-table`
- **Behavior**: No user-facing behavior changes — this is a pure refactor. The dashboard renders identically.
- **Design system**: Increases adoption of `@test-eyes/design-system`, replacing duplicated raw HTML table markup
