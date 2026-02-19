import { readFileSync, writeFileSync } from 'fs'
import { XMLParser } from 'fast-xml-parser'

const junitPath = process.argv[2] || 'test-results.xml'
const outputPath = process.argv[3] || 'test-data.json'

const xml = readFileSync(junitPath, 'utf-8')
const parser = new XMLParser({ ignoreAttributes: false })
const result = parser.parse(xml)

const testsuites = result.testsuites?.testsuite || [result.testsuite]
const suites = Array.isArray(testsuites) ? testsuites : [testsuites]

const tests = []
for (const suite of suites) {
  const cases = suite.testcase ? (Array.isArray(suite.testcase) ? suite.testcase : [suite.testcase]) : []
  for (const tc of cases) {
    tests.push({
      name: `${tc['@_classname']} ${tc['@_name']}`.trim(),
      durationMs: Math.round(parseFloat(tc['@_time'] || 0) * 1000),
      status: (tc.failure || tc.error || tc.skipped) ? 'failed' : 'passed'
    })
  }
}

const output = {
  runId: `${new Date().toISOString().split('T')[0]}_${process.env.GITHUB_SHA?.slice(0, 7) || 'local'}`,
  prNumber: parseInt(process.env.PR_NUMBER || '0'),
  commitSha: process.env.GITHUB_SHA || 'local',
  createdAt: new Date().toISOString(),
  tests
}

writeFileSync(outputPath, JSON.stringify(output, null, 2))
console.log(`Parsed ${tests.length} tests to ${outputPath}`)
