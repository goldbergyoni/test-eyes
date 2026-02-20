import { describe, it, expect } from 'vitest'
import { calculateP95, calculateAverage, isValidRunData } from '../src/aggregate.js'

describe('calculateP95', () => {
  it('returns 0 for empty array', () => {
    expect(calculateP95([])).toBe(0)
  })

  it('calculates p95 correctly', () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    expect(calculateP95(values)).toBe(10)
  })

  it('handles single value', () => {
    expect(calculateP95([42])).toBe(42)
  })
})

describe('calculateAverage', () => {
  it('returns 0 for empty array', () => {
    expect(calculateAverage([])).toBe(0)
  })

  it('calculates average correctly', () => {
    expect(calculateAverage([10, 20, 30])).toBe(20)
  })
})

describe('isValidRunData', () => {
  it('returns true for valid run data', () => {
    const data = {
      runId: '2024-01-01_abc1234',
      prNumber: 1,
      commitSha: 'abc1234',
      createdAt: '2024-01-01T00:00:00Z',
      tests: [
        { name: 'test1', durationMs: 100, status: 'passed' }
      ]
    }
    expect(isValidRunData(data)).toBe(true)
  })

  it('returns false for invalid data', () => {
    expect(isValidRunData(null)).toBe(false)
    expect(isValidRunData({})).toBe(false)
    expect(isValidRunData({ runId: 123 })).toBe(false)
  })

  it('returns false for invalid test status', () => {
    const data = {
      runId: 'test',
      tests: [{ name: 'test1', durationMs: 100, status: 'unknown' }]
    }
    expect(isValidRunData(data)).toBe(false)
  })
})
