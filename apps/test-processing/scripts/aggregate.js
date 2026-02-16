import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'

const DATA_DIR = process.argv[2] || 'data'
const OUTPUT_FILE = `${DATA_DIR}/main-test-data.json`

// Load existing aggregated data or create new
function loadExistingData() {
  if (existsSync(OUTPUT_FILE)) {
    return JSON.parse(readFileSync(OUTPUT_FILE, 'utf-8'))
  }
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

// Find raw files that haven't been processed yet
function findNewFiles(processedFiles) {
  const allFiles = readdirSync(DATA_DIR).filter(f =>
    f.endsWith('.json') &&
    f !== 'main-test-data.json' &&
    f !== 'index.json'
  )
  return allFiles.filter(f => !processedFiles.includes(f))
}

// Calculate p95 from array of values
function calculateP95(values) {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const index = Math.ceil(0.95 * sorted.length) - 1
  return sorted[Math.max(0, index)]
}

// Main aggregation
function aggregate() {
  const data = loadExistingData()
  const newFiles = findNewFiles(data.meta.processedFiles)

  if (newFiles.length === 0) {
    console.log('No new files to process')
    return false
  }

  console.log(`Processing ${newFiles.length} new files...`)

  // Store all durations per test for p95 calculation
  const durations = {}

  // First, collect existing durations (approximate from avg * runs)
  for (const [testName, stats] of Object.entries(data.tests)) {
    durations[testName] = Array(stats.totalRuns).fill(stats.avgDurationMs)
  }

  // Process each new file
  for (const filename of newFiles) {
    const filepath = `${DATA_DIR}/${filename}`
    const runData = JSON.parse(readFileSync(filepath, 'utf-8'))

    data.meta.totalRuns++
    data.meta.processedFiles.push(filename)

    for (const test of runData.tests) {
      const name = test.name

      if (!data.tests[name]) {
        data.tests[name] = {
          totalRuns: 0,
          passCount: 0,
          failCount: 0,
          avgDurationMs: 0,
          p95DurationMs: 0
        }
        durations[name] = []
      }

      const stats = data.tests[name]
      stats.totalRuns++

      if (test.status === 'passed') {
        stats.passCount++
      } else {
        stats.failCount++
      }

      durations[name].push(test.durationMs)
    }
  }

  // Recalculate averages and p95
  for (const [testName, stats] of Object.entries(data.tests)) {
    const testDurations = durations[testName]
    stats.avgDurationMs = Math.round(
      testDurations.reduce((a, b) => a + b, 0) / testDurations.length
    )
    stats.p95DurationMs = calculateP95(testDurations)
  }

  data.meta.lastAggregatedAt = new Date().toISOString()

  writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2))
  console.log(`Aggregated ${data.meta.totalRuns} runs, ${Object.keys(data.tests).length} tests`)
  console.log(`Output: ${OUTPUT_FILE}`)

  return true
}

aggregate()
