import { describe, it, expect } from 'vitest'
import { parseJUnitXml, buildRunData } from '../src/junit-parser.js'

describe('parseJUnitXml', () => {
  it('parses simple JUnit XML', () => {
    const xml = `
      <testsuite name="math" tests="2">
        <testcase classname="math" name="adds numbers" time="0.1"/>
        <testcase classname="math" name="subtracts numbers" time="0.2"/>
      </testsuite>
    `
    const tests = parseJUnitXml(xml)

    expect(tests).toHaveLength(2)
    expect(tests[0]).toEqual({
      name: 'math adds numbers',
      durationMs: 100,
      status: 'passed'
    })
  })

  it('detects failed tests', () => {
    const xml = `
      <testsuite name="math" tests="1">
        <testcase classname="math" name="fails" time="0.1">
          <failure message="Expected 1 to be 2"/>
        </testcase>
      </testsuite>
    `
    const tests = parseJUnitXml(xml)

    expect(tests[0].status).toBe('failed')
  })

  it('detects skipped tests', () => {
    const xml = `
      <testsuite name="math" tests="1">
        <testcase classname="math" name="skipped" time="0">
          <skipped/>
        </testcase>
      </testsuite>
    `
    const tests = parseJUnitXml(xml)

    expect(tests[0].status).toBe('skipped')
  })

  it('handles testsuites wrapper', () => {
    const xml = `
      <testsuites>
        <testsuite name="suite1">
          <testcase name="test1" time="0.1"/>
        </testsuite>
        <testsuite name="suite2">
          <testcase name="test2" time="0.2"/>
        </testsuite>
      </testsuites>
    `
    const tests = parseJUnitXml(xml)

    expect(tests).toHaveLength(2)
  })
})

describe('buildRunData', () => {
  it('builds run data with defaults', () => {
    const tests = [{ name: 'test1', durationMs: 100, status: 'passed' as const }]
    const runData = buildRunData(tests)

    expect(runData.tests).toEqual(tests)
    expect(runData.runId).toMatch(/^\d{4}-\d{2}-\d{2}_/)
    expect(runData.prNumber).toBe(0)
  })

  it('uses provided options', () => {
    const tests = [{ name: 'test1', durationMs: 100, status: 'passed' as const }]
    const runData = buildRunData(tests, { commitSha: 'abc123', prNumber: 42 })

    expect(runData.commitSha).toBe('abc123')
    expect(runData.prNumber).toBe(42)
    expect(runData.runId).toContain('abc123')
  })
})
