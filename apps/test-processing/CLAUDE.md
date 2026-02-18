// Yoni: Put local .claude
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this directory.

## Test Processing

Node.js script (`scripts/aggregate.js`) that reads raw per-run test JSON files and produces `main-test-data.json` with aggregated statistics.

- **Input**: Raw JSON files in a data directory (one per CI run), each containing test name, duration, pass/fail status
- **Output**: `main-test-data.json` with per-test pass/fail counts, avg duration, p95 duration
- Supports **incremental aggregation** — tracks `processedFiles` in metadata to skip already-incorporated runs
- Run with: `node scripts/aggregate.js <data-dir>`
- Schema defined in `specs/aggregated-data.spec.md` (root)
