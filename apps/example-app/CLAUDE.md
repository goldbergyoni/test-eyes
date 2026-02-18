# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this directory.

## Example App

Sample test suite used to generate test data for the dashboard. Tests are **intentionally flaky and slow** to produce realistic analytics data — do not "fix" them.

- `tests/app.test.ts` — vitest tests with simulated flakiness (~30% fail rate) and slow tests (1.5s delay)
- `scripts/parse-junit.js` — converts JUnit XML output to the per-run JSON format consumed by test-processing

## Commands

```bash
pnpm test        # vitest run
pnpm test:ci     # vitest with JUnit XML output → test-results.xml
pnpm parse-junit # Convert JUnit XML to JSON
```
