# Change: Test Search Filter

## Goal

Add a search input to filter tests by name in the dashboard.

**User story:** As a user with 100+ tests, I want to quickly find a specific test by typing part of its name.

## Design

```
┌─────────────────────────────────────────────┐
│ Test Eyes Dashboard                         │
│ 23 runs | Last updated: ...                 │
│                                             │
│ 🔍 [Search tests...________________]        │  ← NEW
│                                             │
│ Test Overview                               │
│ ┌─────────────────────────────────────────┐ │
│ │ Test Name    Avg Time   Failures   Runs │ │
│ │ payment...   1.70s      0          23   │ │
│ │ ...filtered results...                  │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

## Approach

**Client-side filtering** — data is already loaded, no backend needed.

### Components (Compositional)

```
src/
├── components/
│   ├── SearchInput.tsx      # Reusable search input
│   └── TestTable.tsx        # Extract table from App.tsx
├── hooks/
│   └── useTestFilter.ts     # Filter logic hook
└── App.tsx                  # Compose components
```

### Implementation

1. **SearchInput** — controlled input with debounce (300ms)
2. **useTestFilter** — custom hook: `(tests, query) => filteredTests`
3. **TestTable** — extract table rendering from App.tsx
4. **App.tsx** — compose: SearchInput + filtered data → TestTable

## Tech Details

- Use `getFilteredRowModel()` from TanStack Table (built-in)
- Or simple `Array.filter()` on state
- Case-insensitive search
- Highlight matches (optional, stretch goal)

## Out of Scope

- Fuzzy search
- Search history
- URL query params sync
- Backend filtering

## DoD

- [x] Search input visible above tables
- [x] Typing filters both tables
- [x] Empty query shows all tests
- [x] No results shows message
- [x] Works on mobile
