import { readFile, writeFile, readdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// ============================================================================
// Types
// ============================================================================

interface TestStats {
  totalRuns: number
  passCount: number
  failCount: number
  avgDurationMs: number
  p95DurationMs: number
}

interface AggregatedMeta {
  totalRuns: number
  lastAggregatedAt: string | null
  processedFiles: string[]
}

interface AggregatedData {
  schemaVersion: string
  meta: AggregatedMeta
  tests: Record<string, TestStats>
}

interface TestResult {
  name: string
  durationMs: number
  status: 'passed' | 'failed'
}

interface RunData {
  runId: string
  prNumber: number
  commitSha: string
  createdAt: string
  tests: TestResult[]
}

// ============================================================================
// Utils
// ============================================================================

function calculateP95(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const index = Math.ceil(0.95 * sorted.length) - 1
  return sorted[Math.max(0, index)]
}

function isValidRunData(data: unknown): data is RunData {
  if (typeof data !== 'object' || data === null) return false
  const obj = data as Record<string, unknown>
  return (
    typeof obj.runId === 'string' &&
    Array.isArray(obj.tests) &&
    obj.tests.every(
      (t: unknown) =>
        typeof t === 'object' &&
        t !== null &&
        typeof (t as Record<string, unknown>).name === 'string' &&
        typeof (t as Record<string, unknown>).durationMs === 'number' &&
        ['passed', 'failed'].includes((t as Record<string, unknown>).status as string)
    )
  )
}

// ============================================================================
// Data Loading
// ============================================================================

async function loadExistingData(outputFile: string): Promise<AggregatedData> {
  if (!existsSync(outputFile)) {
    return {
      schemaVersion: '1.0.0',
      meta: {
        totalRuns: 0,
        lastAggregatedAt: null,
        processedFiles: []
      },
      tests: {}
    }
  }

  const content = await readFile(outputFile, 'utf-8')
  return JSON.parse(content) as AggregatedData
}

async function findNewFiles(dataDir: string, processedFiles: Set<string>): Promise<string[]> {
  const allFiles = await readdir(dataDir)
  return allFiles.filter(
    (f: string) =>
      f.endsWith('.json') &&
      f !== 'main-test-data.json' &&
      f !== 'index.json' &&
      !processedFiles.has(f)
  )
}

async function loadRunData(filepath: string): Promise<RunData | null> {
  try {
    const content = await readFile(filepath, 'utf-8')
    const data = JSON.parse(content)

    if (!isValidRunData(data)) {
      console.warn(`Invalid data format in ${filepath}, skipping`)
      return null
    }

    return data
  } catch (error) {
    console.warn(`Failed to parse ${filepath}: ${error}, skipping`)
    return null
  }
}

// ============================================================================
// Aggregation
// ============================================================================

function processTestRun(
  data: AggregatedData,
  durations: Map<string, number[]>,
  runData: RunData,
  filename: string
): void {
  data.meta.totalRuns++
  data.meta.processedFiles.push(filename)

  for (const test of runData.tests) {
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
    stats[test.status === 'passed' ? 'passCount' : 'failCount']++
    durations.get(test.name)!.push(test.durationMs)
  }
}

function recalculateStats(data: AggregatedData, durations: Map<string, number[]>): void {
  for (const [testName, stats] of Object.entries(data.tests)) {
    const testDurations = durations.get(testName) || []
    if (testDurations.length > 0) {
      stats.avgDurationMs = Math.round(
        testDurations.reduce((a, b) => a + b, 0) / testDurations.length
      )
      stats.p95DurationMs = calculateP95(testDurations)
    }
  }
}

// ============================================================================
// Main
// ============================================================================

async function aggregate(dataDir: string): Promise<boolean> {
  const outputFile = path.join(dataDir, 'main-test-data.json')
  const data = await loadExistingData(outputFile)

  // Use Set for O(1) lookup instead of Array.includes O(n)
  const processedSet = new Set(data.meta.processedFiles)
  const newFiles = await findNewFiles(dataDir, processedSet)

  if (newFiles.length === 0) {
    console.log('No new files to process')
    return false
  }

  console.log(`Processing ${newFiles.length} new files...`)

  // Reconstruct durations from existing stats (approximate)
  const durations = new Map<string, number[]>()
  for (const [testName, stats] of Object.entries(data.tests)) {
    durations.set(testName, Array(stats.totalRuns).fill(stats.avgDurationMs))
  }

  // Process each new file
  for (const filename of newFiles) {
    const filepath = path.join(dataDir, filename)
    const runData = await loadRunData(filepath)

    if (runData) {
      processTestRun(data, durations, runData, filename)
    }
  }

  recalculateStats(data, durations)
  data.meta.lastAggregatedAt = new Date().toISOString()

  await writeFile(outputFile, JSON.stringify(data, null, 2))

  console.log(`Aggregated ${data.meta.totalRuns} runs, ${Object.keys(data.tests).length} tests`)
  console.log(`Output: ${outputFile}`)

  return true
}

// Entry point
const dataDir = process.argv[2] || 'data'
aggregate(dataDir).catch(console.error)
