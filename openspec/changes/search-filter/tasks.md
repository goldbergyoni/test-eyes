## Tasks

### 1. Create SearchInput component
- [x] Create `src/components/SearchInput.tsx`
- [x] Props: `value`, `onChange`, `placeholder`
- [x] Style with Tailwind (dark theme)
- [x] Add search icon (optional)

### 2. Create useTestFilter hook
- [x] Create `src/hooks/useTestFilter.ts`
- [x] Input: `tests: TestRow[]`, `query: string`
- [x] Output: filtered tests (case-insensitive name match)
- [x] Handle empty query (return all)

### 3. Integrate in App.tsx
- [x] Add `searchQuery` state
- [x] Add SearchInput above tables
- [x] Use useTestFilter to filter data
- [x] Pass filtered data to tables

### 4. Handle edge cases
- [x] Empty results message
- [x] Clear search button
- [x] Mobile responsive

### 5. Test locally
- [ ] Type partial test name
- [ ] Verify both tables filter
- [ ] Verify sorting still works with filtered data
