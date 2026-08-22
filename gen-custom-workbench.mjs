import { createWorkspace } from './src/lib/workspace.js'
import { defaultWorkspaceData } from './src/lib/local-data.js'
import { exportDesktopHtml } from './src/lib/local-export.js'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const prompt = '我正在准备返回职场，微电子与数字芯片物理实现背景、6年经验；日常三块：搭建期权交易系统、学习AI agent、把六年工作笔记数字化成知识库并做脚本自动化。需要统一管理台，并把期权/投资和Agent入口放在首页。'

// 全部使用 onebench 已注册模块 id（见 src/data/modules.js）
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

// 把期权/投资 + Agent + 知识库 + 求职 的核心模块放到首页，其余进左侧栏
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

const template = await readFile(resolve('public/standalone.html'), 'utf8')
const html = exportDesktopHtml(workspace, defaultWorkspaceData(workspace), template, { edition: 'basic' })
await writeFile('C:/Users/BAIJU/Desktop/人生管理台.html', html, 'utf8')
console.log(`done: ${workspace.modules.length} modules, home=${workspace.modules.filter(m => m.placement === 'home').length}, sidebar=${workspace.modules.filter(m => m.placement === 'sidebar').length}`)
