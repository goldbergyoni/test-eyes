#!/usr/bin/env node
/**
 * Entry point for GitHub Action - Deploy dashboard
 * This script is bundled to action-dist/scripts/deploy.mjs
 */
import { parseArgs } from 'util'
import { deployDashboard } from '../src/index.js'

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      'dist-dir': { type: 'string', short: 'd' },
      'data-dir': { type: 'string', default: 'data' },
      'commit-sha': { type: 'string', short: 'c' },
      'target-branch': { type: 'string', short: 't', default: 'gh-pages' }
    },
    allowPositionals: true
  })

  const distDir = values['dist-dir']
  if (!distDir) {
    console.error('Error: --dist-dir is required')
    process.exit(1)
  }

  const commitSha = values['commit-sha'] || process.env.GITHUB_SHA || 'local'
  const dataDir = values['data-dir'] || 'data'
  const targetBranch = values['target-branch'] || 'gh-pages'

  console.log('🚀 Test Eyes - Deploying dashboard...')
  console.log(`   Dist dir: ${distDir}`)
  console.log(`   Data dir: ${dataDir}`)
  console.log(`   Target branch: ${targetBranch}`)

  const result = await deployDashboard({
    distDir,
    dataDir,
    commitSha,
    targetBranch
  })

  if (result.success) {
    console.log(`✅ ${result.message}`)
    if (result.url) {
      console.log(`   URL: ${result.url}`)
    }
  } else {
    console.error(`❌ ${result.message}`)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
