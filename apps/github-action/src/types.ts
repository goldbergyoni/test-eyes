export interface TestResult {
  name: string
  durationMs: number
  status: 'passed' | 'failed'
}

export interface TestRun {
  runId: string
  prNumber: number
  commitSha: string
  createdAt: string
  tests: TestResult[]
}

export interface TestStats {
  totalRuns: number
  passCount: number
  failCount: number
  avgDurationMs: number
  p95DurationMs: number
}

export interface AggregatedMeta {
  totalRuns: number
  lastAggregatedAt: string | null
  processedFiles: string[]
}

export interface AggregatedData {
  schemaVersion: string
  meta: AggregatedMeta
  tests: Record<string, TestStats>
}
