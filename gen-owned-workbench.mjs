import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createWorkspace, exportWorkspace } from './src/lib/workspace.js'

const here = resolve(fileURLToPath(new URL('.', import.meta.url)))
const root = here

const owner = 'mrxorz'
const repo = 'onebench-workbench'
const prompt = '我正在准备返回职场，微电子与数字芯片物理实现背景、6年经验；日常三块：搭建期权交易系统、学习AI agent、把六年工作笔记数字化成知识库并做脚本自动化。需要统一管理台，并把期权/投资和Agent入口放在首页。'

// 全部使用 onebench 已注册模块 id（见 src/data/modules.js），不造新模块
const moduleIds = [
  'tasks', 'schedule', 'goals', 'projects', 'learning', 'files',
  'agent-briefing', 'github-activity', 'finance', 'analytics', 'exchange-rates',
  'rss', 'bookmarks', 'quick-note', 'review', 'countdown', 'calendar', 'weather', 'focus',
  'inbox', 'reading', 'news', 'diary', 'appearance', 'profile', 'settings', 'sync',
]

const workspace = createWorkspace({
  packId: 'job-search',
  prompt,
  workspaceName: '人生管理台',
  moduleIds,
})

// 期权/投资 + Agent + 知识库 + 求职 核心模块放首页，其余进左侧栏
const homeIds = new Set([
  'tasks', 'schedule', 'goals', 'projects', 'learning', 'files',
  'agent-briefing', 'github-activity', 'finance', 'analytics', 'exchange-rates',
  'rss', 'bookmarks', 'quick-note', 'review', 'countdown', 'calendar', 'weather', 'focus',
])
workspace.modules = workspace.modules.map((m, i) => ({
  ...m,
  placement: homeIds.has(m.id) ? 'home' : 'sidebar',
  order: i,
}))

const ownership = {
  format: 'onebench-ownership/v1',
  repository: `${owner}/${repo}`,
  demoUrl: `https://${owner}.github.io/${repo}/`,
  upstream: 'diyiwuyan/onebench',
  deployment: 'github-pages-actions',
  registry: 'https://raw.githubusercontent.com/diyiwuyan/onebench/main/packages/community-registry/registry.json',
}

await writeFile(resolve(root, 'workspace.json'), `${exportWorkspace(workspace)}\n`, 'utf8')
await mkdir(resolve(root, '.onebench'), { recursive: true })
await writeFile(resolve(root, '.onebench/ownership.json'), `${JSON.stringify(ownership, null, 2)}\n`, 'utf8')
await writeFile(resolve(root, 'public/onebench-seed.json'), `${JSON.stringify({ workspace, edition: 'basic' }, null, 2)}\n`, 'utf8')
console.log(`已生成 ${ownership.repository} 工作台配置：${workspace.modules.length} 模块（home=${workspace.modules.filter(m => m.placement === 'home').length}, sidebar=${workspace.modules.filter(m => m.placement === 'sidebar').length}）`)
