import * as exec from '@actions/exec'
import * as core from '@actions/core'
import { existsSync, mkdirSync, cpSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export interface DeployOptions {
  repoUrl: string
  workDir: string
}

export async function setupGhPages(options: DeployOptions): Promise<string> {
  const { repoUrl, workDir } = options
  const ghPagesDir = join(workDir, 'gh-pages')

  await exec.exec('git', ['config', '--global', 'user.email', 'github-actions[bot]@users.noreply.github.com'])
  await exec.exec('git', ['config', '--global', 'user.name', 'github-actions[bot]'])

  const branchExists = await checkBranchExists(repoUrl, 'gh-pages')

  if (branchExists) {
    await exec.exec('git', ['clone', '--branch', 'gh-pages', '--single-branch', '--depth', '1', repoUrl, ghPagesDir])
  } else {
    mkdirSync(ghPagesDir, { recursive: true })
    await exec.exec('git', ['init'], { cwd: ghPagesDir })
    await exec.exec('git', ['checkout', '--orphan', 'gh-pages'], { cwd: ghPagesDir })
    await exec.exec('git', ['remote', 'add', 'origin', repoUrl], { cwd: ghPagesDir })
  }

  return ghPagesDir
}

async function checkBranchExists(repoUrl: string, branch: string): Promise<boolean> {
  try {
    await exec.exec('git', ['ls-remote', '--heads', repoUrl, branch], {
      silent: true,
      listeners: {
        stdout: () => {}
      }
    })
    const output = await exec.getExecOutput('git', ['ls-remote', '--heads', repoUrl, branch], { silent: true })
    return output.stdout.trim().length > 0
  } catch {
    return false
  }
}

export function ensureDataDir(ghPagesDir: string): string {
  const dataDir = join(ghPagesDir, 'data')
  const runsDir = join(dataDir, 'runs')
  mkdirSync(runsDir, { recursive: true })
  return dataDir
}

export function ensureFrontend(ghPagesDir: string): void {
  const indexPath = join(ghPagesDir, 'index.html')
  if (existsSync(indexPath)) {
    core.info('Frontend already exists, skipping copy')
    return
  }

  const staticDir = join(__dirname, '..', 'static')
  if (!existsSync(staticDir)) {
    core.warning('Static frontend files not found, creating placeholder')
    writeFileSync(indexPath, getPlaceholderHtml())
    return
  }

  core.info('Copying frontend files...')
  cpSync(staticDir, ghPagesDir, { recursive: true })
}

export async function commitAndPush(ghPagesDir: string, message: string): Promise<void> {
  await exec.exec('git', ['add', '.'], { cwd: ghPagesDir })

  const statusOutput = await exec.getExecOutput('git', ['status', '--porcelain'], { cwd: ghPagesDir })
  if (!statusOutput.stdout.trim()) {
    core.info('No changes to commit')
    return
  }

  await exec.exec('git', ['commit', '-m', message], { cwd: ghPagesDir })
  await exec.exec('git', ['push', 'origin', 'gh-pages'], { cwd: ghPagesDir })
}

function getPlaceholderHtml(): string {
  return `<!DOCTYPE html>
<html>
<head>
  <title>Test Eyes</title>
  <style>
    body { font-family: system-ui; max-width: 800px; margin: 50px auto; padding: 20px; }
    h1 { color: #333; }
    p { color: #666; }
  </style>
</head>
<body>
  <h1>Test Eyes Dashboard</h1>
  <p>Collecting test data... The dashboard will appear after the first test run.</p>
  <p>Check <code>data/aggregated.json</code> for raw data.</p>
</body>
</html>`
}
