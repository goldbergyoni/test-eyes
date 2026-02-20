import { useMemo } from 'react'

interface TestRow {
  name: string
  totalRuns: number
  passCount: number
  failCount: number
  avgDurationMs: number
  p95DurationMs: number
}

export function useTestFilter(tests: TestRow[], query: string): TestRow[] {
  return useMemo(() => {
    if (!query.trim()) {
      return tests
    }

    const lowerQuery = query.toLowerCase().trim()

    return tests.filter((test) =>
      test.name.toLowerCase().includes(lowerQuery)
    )
  }, [tests, query])
}
