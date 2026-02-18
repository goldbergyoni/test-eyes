import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import type { TestRun, AggregatedData, TestStats } from './types.js'

const SCHEMA_VERSION = '1.0.0'

export function aggregate(dataDir: string): AggregatedData {
  const outputFile = `${dataDir}/main-test-data.json`
  const runsDir = `${dataDir}/runs`

  const data = loadExistingData(outputFile)
  const processedSet = new Set(data.meta.processedFiles)

  const newFiles = findNewFiles(runsDir, processedSet)
  if (newFiles.length === 0) {
    return data
  }

  const durations = initDurations(data.tests)

  for (const filename of newFiles) {
    const run = loadRun(`${runsDir}/${filename}`)
    processRun(run, data, durations)
    data.meta.processedFiles.push(filename)
  }

  recalculateStats(data.tests, durations)
  data.meta.lastAggregatedAt = new Date().toISOString()

  writeFileSync(outputFile, JSON.stringify(data, null, 2))
  return data
}

function loadExistingData(outputFile: string): AggregatedData {
  if (existsSync(outputFile)) {
    return JSON.parse(readFileSync(outputFile, 'utf-8'))
  }
  return {
    schemaVersion: SCHEMA_VERSION,
    meta: { totalRuns: 0, lastAggregatedAt: null, processedFiles: [] },
    tests: {}
  }
}

function findNewFiles(runsDir: string, processedSet: Set<string>): string[] {
  if (!existsSync(runsDir)) return []
  return readdirSync(runsDir)
    .filter(f => f.endsWith('.json') && !processedSet.has(f))
}

function loadRun(filepath: string): TestRun {
  return JSON.parse(readFileSync(filepath, 'utf-8'))
}

function initDurations(tests: Record<string, TestStats>): Map<string, number[]> {
  const durations = new Map<string, number[]>()
  for (const [name, stats] of Object.entries(tests)) {
    durations.set(name, Array(stats.totalRuns).fill(stats.avgDurationMs))
  }
  return durations
}

function processRun(
  run: TestRun,
  data: AggregatedData,
  durations: Map<string, number[]>
): void {
  data.meta.totalRuns++

  for (const test of run.tests) {
    if (!data.tests[test.name]) {
      data.tests[test.name] = {
        totalRuns: 0,
        passCount: 0,
        failCount: 0,
        avgDurationMs: 0,
        p95DurationMs: 0
      }
      durations.set(test.name, [])
    }

    const stats = data.tests[test.name]
    stats.totalRuns++
    if (test.status === 'passed') {
      stats.passCount++
    } else {
      stats.failCount++
    }

    durations.get(test.name)!.push(test.durationMs)
  }
}

function recalculateStats(
  tests: Record<string, TestStats>,
  durations: Map<string, number[]>
): void {
  for (const [name, stats] of Object.entries(tests)) {
    const values = durations.get(name) || []
    if (values.length === 0) continue

    stats.avgDurationMs = Math.round(
      values.reduce((a, b) => a + b, 0) / values.length
    )
    stats.p95DurationMs = calculateP95(values)
  }
}

function calculateP95(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const index = Math.ceil(0.95 * sorted.length) - 1
  return sorted[Math.max(0, index)]
}
