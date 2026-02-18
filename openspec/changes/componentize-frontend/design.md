## Context

The frontend is a single `App.tsx` file (183 lines) containing data fetching, type definitions, column configs, table rendering, and page layout. The design system (`@test-eyes/design-system`) already exports `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, and `TableCell` components, but `App.tsx` uses raw HTML `<table>` elements with duplicated Tailwind classes instead.

There is no routing — the app is a single dashboard page. The entry point `main.tsx` renders `<App />`.

## Goals / Non-Goals

**Goals:**
- Break `App.tsx` into small, single-responsibility files
- Establish a clear folder convention (`pages/`, `components/`, `hooks/`)
- Replace raw HTML table markup with design system Table components
- Keep the exact same visual output and behavior

**Non-Goals:**
- Adding routing (single page is fine for now)
- Migrating from `useEffect` fetch to TanStack Query (separate change)
- Changing the data schema or adding new dashboard features
- Modifying the design system components themselves

## Decisions

### 1. Folder structure: `pages/`, `components/`, `hooks/`

Create three directories under `apps/frontend/src/`:

```
src/
  App.tsx                  # Thin shell — renders DashboardPage
  pages/
    DashboardPage.tsx      # Full page layout: header, meta, sections
  components/
    SortableTable.tsx      # Reusable table with TanStack Table + design system
  hooks/
    useTestData.ts         # Data fetching hook (fetch + state management)
  types.ts                 # Shared types (AggregatedData, TestStats, TestRow)
```

**Rationale**: Flat folders with clear naming. `pages/` holds page-level layouts, `components/` holds reusable UI pieces, `hooks/` holds custom hooks. Types get their own file since they're shared across modules. This is a standard React convention that scales when pages are added later.

**Alternative considered**: Co-locating everything in feature folders (e.g., `features/dashboard/`). Rejected because there's only one feature currently — the extra nesting adds complexity without benefit.

### 2. SortableTable wraps TanStack Table + design system primitives

`SortableTable` accepts `data`, `columns`, and optional initial sorting. Internally it calls `useReactTable` and renders using the design system's `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`. The sort indicator (`↑`/`↓`) rendering stays in this component.

**Rationale**: The current `renderTable` function already does this — we're just promoting it to a proper component and replacing raw HTML with design system primitives. This avoids two separate table instances sharing a render function via closure.

**Alternative considered**: Passing a pre-configured `useReactTable` instance as a prop. Rejected because it leaks TanStack Table internals to the caller — better to encapsulate the table library inside the component.

### 3. useTestData hook encapsulates all fetch logic

Extracts `useEffect`, `useState` for `data`/`meta`/`loading`/`error` into a single hook returning `{ data, meta, loading, error }`.

**Rationale**: Clean separation of data fetching from rendering. The hook is self-contained and can later be swapped to TanStack Query without touching any component code.

### 4. Column definitions stay co-located with DashboardPage

The `overviewColumns` and `slowestColumns` arrays move into `DashboardPage.tsx` (or a sibling `columns.ts` if the file gets long) rather than into `SortableTable`.

**Rationale**: Columns are page-specific configuration, not generic table logic. The `SortableTable` component should be column-agnostic.

### 5. Types extracted to `types.ts`

`AggregatedData`, `TestStats`, and `TestRow` move to a shared `types.ts` file.

**Rationale**: Multiple modules need these types (`useTestData` returns them, `DashboardPage` uses them for columns, `SortableTable` is generic over `TestRow`). A single source of truth avoids circular imports.

## Risks / Trade-offs

- **Slight increase in file count** (1 file → 5 files) → Mitigated by each file being small and focused. IDE navigation is easier with descriptive file names than scrolling a 183-line monolith.
- **Design system Table components may render slightly different markup** → Mitigated by reviewing the design system `Table.tsx` — it uses the same `w-full`, `border-b`, `p-3` patterns. Minor visual diffs (if any) should be verified after implementation.
