import { readFile } from 'fs/promises'
import { XMLParser } from 'fast-xml-parser'
import type { TestResult, RunData } from './types.js'

// ============================================================================
// JUnit XML Types
// ============================================================================

interface JUnitTestCase {
  '@_classname'?: string
  '@_name': string
  '@_time'?: string
  failure?: unknown
  error?: unknown
  skipped?: unknown
}

interface JUnitTestSuite {
  '@_name'?: string
  '@_tests'?: string
  '@_failures'?: string
  '@_errors'?: string
  '@_time'?: string
  testcase?: JUnitTestCase | JUnitTestCase[]
}

interface JUnitReport {
  testsuites?: {
    testsuite: JUnitTestSuite | JUnitTestSuite[]
  }
  testsuite?: JUnitTestSuite
}

// ============================================================================
// Parsing Utilities
// ============================================================================

function normalizeToArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

function getTestStatus(testCase: JUnitTestCase): TestResult['status'] {
  if (testCase.skipped !== undefined) return 'skipped'
  if (testCase.failure !== undefined || testCase.error !== undefined) return 'failed'
  return 'passed'
}

function parseTestCase(testCase: JUnitTestCase): TestResult {
  const className = testCase['@_classname'] || ''
  const testName = testCase['@_name'] || 'unknown'
  const name = className ? `${className} ${testName}` : testName

  return {
    name: name.trim(),
    durationMs: Math.round(parseFloat(testCase['@_time'] || '0') * 1000),
    status: getTestStatus(testCase)
  }
}

// ============================================================================
// Main Parser
// ============================================================================

export function parseJUnitXml(xml: string): TestResult[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_'
  })

  const result = parser.parse(xml) as JUnitReport
  const tests: TestResult[] = []

  const testsuites = result.testsuites?.testsuite || result.testsuite
  const suites = normalizeToArray(testsuites)

  for (const suite of suites) {
    const testCases = normalizeToArray(suite.testcase)
    for (const testCase of testCases) {
      tests.push(parseTestCase(testCase))
    }
  }

  return tests
}

export async function parseJUnitFile(filepath: string): Promise<TestResult[]> {
  const xml = await readFile(filepath, 'utf-8')
  return parseJUnitXml(xml)
}

// ============================================================================
// Run Data Builder
// ============================================================================

export interface BuildRunDataOptions {
  commitSha?: string
  prNumber?: number
}

export function buildRunData(tests: TestResult[], options: BuildRunDataOptions = {}): RunData {
  const sha = options.commitSha || process.env.GITHUB_SHA || 'local'
  const date = new Date().toISOString().split('T')[0]

  return {
    runId: `${date}_${sha.slice(0, 7)}`,
    prNumber: options.prNumber ?? parseInt(process.env.PR_NUMBER || '0', 10),
    commitSha: sha,
    createdAt: new Date().toISOString(),
    tests
  }
}

export async function parseAndBuildRunData(
  junitPath: string,
  options: BuildRunDataOptions = {}
): Promise<RunData> {
  const tests = await parseJUnitFile(junitPath)
  return buildRunData(tests, options)
}
