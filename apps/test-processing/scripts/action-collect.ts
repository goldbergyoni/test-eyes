#!/usr/bin/env node
/**
 * Entry point for GitHub Action - Collect test data
 * This script is bundled to action-dist/scripts/collector.mjs
 */
import { parseArgs } from 'util'
import { collectTestData } from '../src/index.js'

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      'junit-path': { type: 'string', short: 'j' },
      'commit-sha': { type: 'string', short: 'c' },
      'data-branch': { type: 'string', short: 'b', default: 'gh-data' },
      'pr-number': { type: 'string', short: 'p', default: '0' }
    },
    allowPositionals: true
  })

  const junitPath = values['junit-path']
  if (!junitPath) {
    console.error('Error: --junit-path is required')
    process.exit(1)
  }

  const commitSha = values['commit-sha'] || process.env.GITHUB_SHA || 'local'
  const prNumber = parseInt(values['pr-number'] || '0', 10)
  const dataBranch = values['data-branch'] || 'gh-data'

  console.log('📊 Test Eyes - Collecting test data...')
  console.log(`   JUnit path: ${junitPath}`)
  console.log(`   Commit SHA: ${commitSha}`)
  console.log(`   Data branch: ${dataBranch}`)

  const result = await collectTestData({
    junitPath,
    outputPath: 'test-data.json',
    dataBranch,
    commitSha,
    prNumber
  })

  if (result.success) {
    console.log(`✅ ${result.message}`)
    console.log(`   Tests found: ${result.testsFound}`)
    console.log(`   Total runs: ${result.aggregatedRuns}`)
  } else {
    console.error(`❌ ${result.message}`)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
