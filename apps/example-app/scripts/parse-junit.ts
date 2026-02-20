import { readFile, writeFile } from 'fs/promises'
import { XMLParser } from 'fast-xml-parser'

// ============================================================================
// Types
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

interface TestResult {
  name: string
  durationMs: number
  status: 'passed' | 'failed' | 'skipped'
}

interface OutputData {
  runId: string
  prNumber: number
  commitSha: string
  createdAt: string
  tests: TestResult[]
}

// ============================================================================
// Parsing
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

function parseJUnitXml(xml: string): TestResult[] {
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

// ============================================================================
// Output
// ============================================================================

function buildOutputData(tests: TestResult[]): OutputData {
  const sha = process.env.GITHUB_SHA || 'local'
  const date = new Date().toISOString().split('T')[0]

  return {
    runId: `${date}_${sha.slice(0, 7)}`,
    prNumber: parseInt(process.env.PR_NUMBER || '0', 10),
    commitSha: sha,
    createdAt: new Date().toISOString(),
    tests
  }
}

// ============================================================================
// Main
// ============================================================================

async function main(): Promise<void> {
  const junitPath = process.argv[2] || 'test-results.xml'
  const outputPath = process.argv[3] || 'test-data.json'

  try {
    const xml = await readFile(junitPath, 'utf-8')
    const tests = parseJUnitXml(xml)
    const output = buildOutputData(tests)

    await writeFile(outputPath, JSON.stringify(output, null, 2))
    console.log(`Parsed ${tests.length} tests to ${outputPath}`)
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`)
    }
    process.exit(1)
  }
}

main()
