# Aggregated Test Data Specification

## Overview
Single JSON file containing pre-computed statistics from all test runs.

## Schema (Minimal v1)

```json
{
  "schemaVersion": "1.0.0",
  "meta": {
    "totalRuns": 42,
    "lastAggregatedAt": "2026-02-16T12:00:00Z",
    "processedFiles": ["2026-02-13_abc123.json", "2026-02-14_def456.json"]
  },
  "tests": {
    "<testName>": {
      "totalRuns": 42,
      "passCount": 40,
      "failCount": 2,
      "avgDurationMs": 150,
      "p95DurationMs": 320
    }
  }
}
```

## Fields

### meta
- `totalRuns`: Number of test executions processed
- `lastAggregatedAt`: ISO timestamp of last aggregation
- `processedFiles`: Array of raw JSON filenames already incorporated (for incremental updates)

### tests
- Key: test name (string)
- `totalRuns`: How many times this test ran
- `passCount`: Number of passes
- `failCount`: Number of failures
- `avgDurationMs`: Average duration in milliseconds
- `p95DurationMs`: 95th percentile duration

## File Location
- Path: `data/main-test-data.json` on `gh-data` branch
- Raw files: `data/*.json` (except main-test-data.json and index.json)

## Aggregation Rules
1. Read existing `main-test-data.json` if exists
2. Find new files: all `data/*.json` not in `processedFiles`
3. For each new file, update test statistics
4. Recalculate avgDurationMs and p95DurationMs
5. Write updated `main-test-data.json`


// Yoni: What is this file about?, I assume we can delete it