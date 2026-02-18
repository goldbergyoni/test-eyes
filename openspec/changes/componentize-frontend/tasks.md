## 1. Extract shared types

- [ ] 1.1 Create `apps/frontend/src/types.ts` with `AggregatedData`, `TestStats`, and `TestRow` interfaces (moved from App.tsx)

## 2. Extract data-fetching hook

- [ ] 2.1 Create `apps/frontend/src/hooks/useTestData.ts` — move the useEffect fetch logic and related useState calls into a `useTestData()` hook that returns `{ data, meta, loading, error }`
- [ ] 2.2 Import types from `../types` instead of defining them inline

## 3. Create SortableTable component

- [ ] 3.1 Create `apps/frontend/src/components/SortableTable.tsx` — a generic component that accepts `data`, `columns`, and optional `initialSorting`, calls `useReactTable` internally, and renders using `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` from `@test-eyes/design-system`
- [ ] 3.2 Include sort direction indicators (`↑`/`↓`) on clickable column headers

## 4. Create DashboardPage

- [ ] 4.1 Create `apps/frontend/src/pages/DashboardPage.tsx` — move column definitions (`overviewColumns`, `slowestColumns`) and the page layout (title, meta summary, table sections, loading/error/empty states) here
- [ ] 4.2 Use `useTestData` hook for data and `SortableTable` for rendering tables

## 5. Slim down App.tsx

- [ ] 5.1 Reduce `App.tsx` to a thin shell that imports and renders `DashboardPage`
- [ ] 5.2 Remove all old code (inline types, fetch logic, renderTable, raw HTML tables)

## 6. Verify

- [ ] 6.1 Run `pnpm --filter frontend build` to confirm TypeScript and Vite build pass with no errors
