import { readFileSync } from 'fs'
import { XMLParser } from 'fast-xml-parser'
import type { TestRun, TestResult } from './types.js'

interface JUnitTestCase {
  '@_classname'?: string
  '@_name': string
  '@_time'?: string
  failure?: unknown
}

interface JUnitTestSuite {
  testcase?: JUnitTestCase | JUnitTestCase[]
}

interface JUnitResult {
  testsuites?: { testsuite: JUnitTestSuite | JUnitTestSuite[] }
  testsuite?: JUnitTestSuite
}

export function parseJunit(junitPath: string, commitSha: string, prNumber: number): TestRun {
  const xml = readFileSync(junitPath, 'utf-8')
  const parser = new XMLParser({ ignoreAttributes: false })
  const result: JUnitResult = parser.parse(xml)

  const testsuites = result.testsuites?.testsuite || result.testsuite
  const suites = Array.isArray(testsuites) ? testsuites : testsuites ? [testsuites] : []

  const tests: TestResult[] = []

  for (const suite of suites) {
    if (!suite.testcase) continue
    const cases = Array.isArray(suite.testcase) ? suite.testcase : [suite.testcase]

    for (const tc of cases) {
      tests.push({
        name: `${tc['@_classname'] || ''} ${tc['@_name']}`.trim(),
        durationMs: Math.round(parseFloat(tc['@_time'] || '0') * 1000),
        status: tc.failure ? 'failed' : 'passed'
      })
    }
  }

  const shortSha = commitSha.slice(0, 7)
  const date = new Date().toISOString().split('T')[0]

  return {
    runId: `${date}_${shortSha}`,
    prNumber,
    commitSha,
    createdAt: new Date().toISOString(),
    tests
  }
}
