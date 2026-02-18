import * as github from '@actions/github'
import * as core from '@actions/core'
import type { AggregatedData, TestRun } from './types.js'

const COMMENT_MARKER = '<!-- test-eyes-report -->'

export interface CommentOptions {
  token: string
  owner: string
  repo: string
  prNumber: number
  reportUrl: string
  run: TestRun
  aggregated: AggregatedData
}

export async function postOrUpdateComment(options: CommentOptions): Promise<void> {
  const { token, owner, repo, prNumber, reportUrl, run, aggregated } = options

  if (!prNumber) {
    core.info('Not a PR, skipping comment')
    return
  }

  const octokit = github.getOctokit(token)
  const body = formatComment(reportUrl, run, aggregated)

  const existingComment = await findExistingComment(octokit, owner, repo, prNumber)

  if (existingComment) {
    await octokit.rest.issues.updateComment({
      owner,
      repo,
      comment_id: existingComment.id,
      body
    })
    core.info(`Updated comment #${existingComment.id}`)
  } else {
    const { data } = await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body
    })
    core.info(`Created comment #${data.id}`)
  }
}

async function findExistingComment(
  octokit: ReturnType<typeof github.getOctokit>,
  owner: string,
  repo: string,
  prNumber: number
): Promise<{ id: number } | null> {
  const { data: comments } = await octokit.rest.issues.listComments({
    owner,
    repo,
    issue_number: prNumber
  })

  const found = comments.find(c => c.body?.includes(COMMENT_MARKER))
  return found ? { id: found.id } : null
}

function formatComment(reportUrl: string, run: TestRun, aggregated: AggregatedData): string {
  const passed = run.tests.filter(t => t.status === 'passed').length
  const failed = run.tests.filter(t => t.status === 'failed').length
  const total = run.tests.length

  const statusEmoji = failed > 0 ? ':x:' : ':white_check_mark:'
  const statusText = failed > 0 ? `${failed} failed` : 'All passed'

  return `${COMMENT_MARKER}
## ${statusEmoji} Test Eyes Report

**This run:** ${passed}/${total} passed (${statusText})

| Metric | Value |
|--------|-------|
| Tests | ${total} |
| Passed | ${passed} |
| Failed | ${failed} |
| Historical runs | ${aggregated.meta.totalRuns} |

[:bar_chart: View Dashboard](${reportUrl})

<sub>Last updated: ${new Date().toISOString()}</sub>`
}
