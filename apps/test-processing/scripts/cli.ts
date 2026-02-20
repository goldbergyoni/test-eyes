#!/usr/bin/env node
import { parseArgs } from 'util'
import { collectTestData, deployDashboard, aggregate } from '../src/index.js'

// ============================================================================
// CLI Commands
// ============================================================================

async function runCollect(args: string[]): Promise<void> {
  const { values } = parseArgs({
    args,
    options: {
      'junit-path': { type: 'string', short: 'j' },
      'output-path': { type: 'string', short: 'o', default: 'test-data.json' },
      'data-branch': { type: 'string', short: 'b', default: 'gh-data' },
      'commit-sha': { type: 'string', short: 'c' },
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

  const result = await collectTestData({
    junitPath,
    outputPath: values['output-path']!,
    dataBranch: values['data-branch']!,
    commitSha,
    prNumber
  })

  if (result.success) {
    console.log(`✓ ${result.message}`)
    console.log(`  Tests: ${result.testsFound}`)
    console.log(`  Total runs: ${result.aggregatedRuns}`)
  } else {
    console.error(`✗ ${result.message}`)
    process.exit(1)
  }
}

async function runDeploy(args: string[]): Promise<void> {
  const { values } = parseArgs({
    args,
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

  const result = await deployDashboard({
    distDir,
    dataDir: values['data-dir']!,
    commitSha,
    targetBranch: values['target-branch']
  })

  if (result.success) {
    console.log(`✓ ${result.message}`)
    if (result.url) {
      console.log(`  URL: ${result.url}`)
    }
  } else {
    console.error(`✗ ${result.message}`)
    process.exit(1)
  }
}

async function runAggregate(args: string[]): Promise<void> {
  const dataDir = args[0] || 'data'

  console.log(`Aggregating data from: ${dataDir}`)
  const result = await aggregate(dataDir)

  console.log(`✓ Aggregated ${result.totalRuns} runs, ${result.totalTests} tests`)
  console.log(`  New files processed: ${result.newFilesProcessed}`)
  console.log(`  Output: ${result.outputFile}`)
}

// ============================================================================
// Main
// ============================================================================

async function main(): Promise<void> {
  const [command, ...args] = process.argv.slice(2)

  switch (command) {
    case 'collect':
      await runCollect(args)
      break

    case 'deploy':
      await runDeploy(args)
      break

    case 'aggregate':
      await runAggregate(args)
      break

    case 'help':
    case '--help':
    case '-h':
      printHelp()
      break

    default:
      console.error(`Unknown command: ${command}`)
      printHelp()
      process.exit(1)
  }
}

function printHelp(): void {
  console.log(`
test-processing CLI

Commands:
  collect     Collect test data from JUnit XML and push to data branch
  deploy      Deploy dashboard to GitHub Pages
  aggregate   Aggregate test data files

Examples:
  tsx cli.ts collect --junit-path ./test-results.xml
  tsx cli.ts deploy --dist-dir ./dist --data-dir ./data
  tsx cli.ts aggregate ./data

Options:
  collect:
    --junit-path, -j    Path to JUnit XML file (required)
    --output-path, -o   Output JSON path (default: test-data.json)
    --data-branch, -b   Data branch name (default: gh-data)
    --commit-sha, -c    Commit SHA (default: GITHUB_SHA env)
    --pr-number, -p     PR number (default: 0)

  deploy:
    --dist-dir, -d      Frontend dist directory (required)
    --data-dir          Data directory (default: data)
    --commit-sha, -c    Commit SHA (default: GITHUB_SHA env)
    --target-branch, -t Target branch (default: gh-pages)
`)
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
