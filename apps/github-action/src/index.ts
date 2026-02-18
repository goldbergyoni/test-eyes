import * as core from '@actions/core'
import * as github from '@actions/github'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'

import { parseJunit } from './parse-junit.js'
import { aggregate } from './aggregate.js'
import { setupGhPages, ensureDataDir, ensureFrontend, commitAndPush } from './deploy.js'
import { postOrUpdateComment } from './comment.js'

async function run(): Promise<void> {
  try {
    const junitPath = core.getInput('junit-path', { required: true })
    const postComment = core.getInput('post-comment') !== 'false'
    const token = process.env.GITHUB_TOKEN || core.getInput('github-token')

    if (!token) {
      throw new Error('GITHUB_TOKEN is required. Add it to your workflow or pass github-token input.')
    }

    const { owner, repo } = github.context.repo
    const commitSha = github.context.sha
    const prNumber = github.context.payload.pull_request?.number || 0

    core.info(`Parsing JUnit file: ${junitPath}`)
    const testRun = parseJunit(junitPath, commitSha, prNumber)
    core.info(`Parsed ${testRun.tests.length} tests`)

    const workDir = join(tmpdir(), `test-eyes-${Date.now()}`)
    mkdirSync(workDir, { recursive: true })

    const repoUrl = `https://x-access-token:${token}@github.com/${owner}/${repo}.git`

    core.info('Setting up gh-pages branch...')
    const ghPagesDir = await setupGhPages({ repoUrl, workDir })

    const dataDir = ensureDataDir(ghPagesDir)
    core.info('Saving test run data...')
    const runFile = join(dataDir, 'runs', `${testRun.runId}.json`)
    writeFileSync(runFile, JSON.stringify(testRun, null, 2))

    core.info('Aggregating test data...')
    const aggregated = aggregate(dataDir)
    core.info(`Aggregated ${aggregated.meta.totalRuns} runs, ${Object.keys(aggregated.tests).length} tests`)

    ensureFrontend(ghPagesDir)

    core.info('Committing and pushing...')
    await commitAndPush(ghPagesDir, `test-eyes: add run ${testRun.runId}`)

    const reportUrl = `https://${owner}.github.io/${repo}/`
    core.setOutput('report-url', reportUrl)
    core.info(`Report URL: ${reportUrl}`)

    if (postComment && prNumber) {
      core.info('Posting PR comment...')
      await postOrUpdateComment({
        token,
        owner,
        repo,
        prNumber,
        reportUrl,
        run: testRun,
        aggregated
      })
    }

    core.info('Done!')
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed('An unexpected error occurred')
    }
  }
}

run()
