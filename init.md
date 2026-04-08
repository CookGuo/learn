# 前端知识网站 — 完整技术方案

> 目标：搭建一个包含多模块的前端知识网站，支持动态模块配置、访问权限控制、CI/CD 自动发布到 Gitee Pages，并附带 URL 爬虫脚本。

* * *

## 技术选型

| 层次    | 选型                                  | 理由                                       |
| ----- | ----------------------------------- | ---------------------------------------- |
| 站点框架  | VitePress                           | 专为文档/知识库设计，构建快，支持 Vue 组件扩展，Markdown 原生支持 |
| 包管理   | pnpm                                | 速度快，CI 友好                                |
| 样式    | VitePress 默认主题 + CSS 变量覆盖           | 开箱即用，后续可完全自定义                            |
| 代码托管  | Gitee                               | 需求指定                                     |
| 静态托管  | Gitee Pages                         | 免费，与 Gitee 集成                            |
| CI/CD | Gitee Go（官方 CI）                     | 推送 master 自动触发构建 → 部署                    |
| 爬虫脚本  | Node.js（axios + cheerio + turndown） | 轻量，无需 Python 环境                          |

* * *

## 目录结构（最终形态）

```
frontend-knowledge/
├── docs/                              # VitePress 根目录
│   ├── .vitepress/
│   │   ├── config.ts                  # 主配置（动态读 modules.config.ts）
│   │   ├── modules.config.ts          # ★ 模块注册表（增删改模块改这里）
│   │   └── theme/
│   │       ├── index.ts               # 自定义主题入口
│   │       ├── Layout.vue             # 全局布局（权限检查层）
│   │       └── components/
│   │           ├── ModuleCard.vue     # 首页模块卡片
│   │           └── AccessGuard.vue    # 权限守卫组件
│   ├── public/
│   │   └── favicon.ico
│   ├── index.md                       # 网站首页
│   ├── browser/                       # 模块：浏览器工作原理
│   │   ├── index.md
│   │   ├── rendering-pipeline.md
│   │   ├── v8-engine.md
│   │   └── network.md
│   ├── basic/                         # 模块：基础篇
│   │   ├── index.md
│   │   ├── html.md
│   │   ├── css.md
│   │   └── javascript.md
│   └── advanced/                      # 模块：进阶篇
│       ├── index.md
│       ├── performance.md
│       ├── security.md
│       └── engineering.md
├── scripts/
│   └── crawl.js                       # ★ 爬虫脚本
├── .gitee/
│   └── workflows/
│       └── deploy.yml                 # ★ Gitee Go CI/CD 配置
├── package.json
├── pnpm-lock.yaml
└── README.md
```

* * *

## Phase 1：项目初始化

### 1.1 创建仓库

```
mkdir frontend-knowledge && cd frontend-knowledge
git init
git remote add origin https://gitee.com/<你的用户名>/frontend-knowledge.git
```

### 1.2 package.json

```
{
  "name": "frontend-knowledge",
  "private": true,
  "scripts": {
    "dev": "vitepress dev docs",
    "build": "vitepress build docs",
    "preview": "vitepress preview docs"
  },
  "devDependencies": {
    "vitepress": "^1.3.0",
    "vue": "^3.4.0"
  },
  "dependencies": {
    "axios": "^1.7.0",
    "cheerio": "^1.0.0",
    "turndown": "^7.2.0",
    "turndown-plugin-gfm": "^1.0.2"
  }
}
```

### 1.3 初始化 VitePress

```
pnpm install
pnpm vitepress init  # 选择 docs 目录
```

* * *

## Phase 2：模块系统设计（核心）

### 2.1 modules.config.ts — 唯一配置入口

> **增删模块只需改这一个文件**，路由、侧边栏、首页卡片全部自动生成。

```
// docs/.vitepress/modules.config.ts

export interface ModuleConfig {
  id: string                    // 唯一 ID，同时是 URL 路径段
  title: string                 // 展示名称
  description: string           // 首页卡片描述
  icon: string                  // emoji 图标
  order: number                 // 排序
  enabled: boolean              // false = 整个模块不可访问
  access: 'public' | 'token'    // public = 完全开放；token = 需要访问码（预留）
  sidebar: SidebarItem[]        // 该模块的侧边栏结构
}

export const modules: ModuleConfig[] = [
  {
    id: 'browser',
    title: '浏览器工作原理',
    description: '渲染管线、V8引擎、事件循环、网络栈全解析',
    icon: '🌐',
    order: 1,
    enabled: true,
    access: 'public',
    sidebar: [
      {
        text: '渲染原理',
        items: [
          { text: '渲染管线总览', link: '/browser/rendering-pipeline' },
          { text: '重排与重绘', link: '/browser/reflow-repaint' },
        ],
      },
      {
        text: 'JS 引擎',
        items: [
          { text: 'V8 工作原理', link: '/browser/v8-engine' },
          { text: '事件循环', link: '/browser/event-loop' },
        ],
      },
    ],
  },
  {
    id: 'basic',
    title: '基础篇',
    description: 'HTML / CSS / JavaScript 核心知识体系',
    icon: '📖',
    order: 2,
    enabled: true,
    access: 'public',
    sidebar: [
      { text: 'HTML', items: [{ text: '语义化与无障碍', link: '/basic/html-semantic' }] },
      { text: 'CSS', items: [{ text: 'BFC 与格式化上下文', link: '/basic/css-bfc' }] },
      { text: 'JavaScript', items: [
          { text: '原型与原型链', link: '/basic/js-prototype' },
          { text: 'Promise 与异步', link: '/basic/js-async' },
        ],
      },
    ],
  },
  {
    id: 'advanced',
    title: '进阶篇',
    description: '性能优化、工程化、安全、框架原理',
    icon: '🚀',
    order: 3,
    enabled: true,
    access: 'public',
    sidebar: [
      { text: '性能优化', items: [{ text: '性能指标与测量', link: '/advanced/performance-metrics' }] },
      { text: '工程化', items: [
          { text: 'Webpack 原理', link: '/advanced/webpack' },
          { text: 'Vite 原理', link: '/advanced/vite' },
        ],
      },
    ],
  },
]
```

### 2.2 config.ts — 自动生成配置

```
// docs/.vitepress/config.ts
import { defineConfig } from 'vitepress'
import { modules } from './modules.config'

function buildSidebar() {
  const sidebar: Record<string, any[]> = {}
  for (const mod of modules.filter(m => m.enabled)) {
    sidebar[`/${mod.id}/`] = mod.sidebar
  }
  return sidebar
}

function buildNav() {
  return modules
    .filter(m => m.enabled)
    .sort((a, b) => a.order - b.order)
    .map(m => ({ text: `${m.icon} ${m.title}`, link: `/${m.id}/` }))
}

export default defineConfig({
  title: '前端知识库',
  description: '系统化的前端知识体系',
  base: '/frontend-knowledge/',   // Gitee Pages 仓库名
  themeConfig: {
    nav: [{ text: '首页', link: '/' }, ...buildNav()],
    sidebar: buildSidebar(),
    search: { provider: 'local' },
  },
})
```

* * *

## Phase 3：访问权限层（预留，当前全开放）

### 3.1 AccessGuard.vue

```
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { modules } from '../modules.config'

const route = useRoute()
const currentModule = computed(() => {
  const seg = route.path.split('/')[1]
  return modules.find(m => m.id === seg)
})

const hasAccess = computed(() => {
  const mod = currentModule.value
  if (!mod) return true
  if (!mod.enabled) return false
  if (mod.access === 'public') return true
  // token 模式预留：检查 localStorage
  return true
})
</script>

<template>
  <div v-if="!hasAccess" class="access-denied">
    <h2>🔒 暂无访问权限</h2>
    <p>该模块尚未开放，请联系管理员获取访问码</p>
  </div>
  <slot v-else />
</template>
```

### 3.2 权限控制方式

| 操作       | 改动位置                                   | 说明             |
| -------- | -------------------------------------- | -------------- |
| 关闭某模块    | `modules.config.ts` → `enabled: false` | 模块从导航消失，访问返回空白 |
| 开启某模块    | `modules.config.ts` → `enabled: true`  | 立即对所有人开放       |
| 限制访问（预留） | `access: 'token'` + 补全 AccessGuard 逻辑  | 需要访问码才能查看      |

* * *

## Phase 4：CI/CD 配置（Gitee Go）

### 4.1 workflow 文件

```
# .gitee/workflows/deploy.yml
name: Build and Deploy to Gitee Pages

on:
  push:
    branches:
      - master

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build VitePress
        run: pnpm build
        # 产物在 docs/.vitepress/dist/

      - name: Deploy to gh-pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITEE_TOKEN }}
          publish_dir: docs/.vitepress/dist
          publish_branch: gh-pages
          force_orphan: true
```

### 4.2 Gitee Pages 配置步骤

1.  仓库 → **服务** → **Gitee Pages**
1.  部署分支：`gh-pages`
1.  部署目录：`/`（根目录）
1.  勾选**强制 HTTPS** + **自动部署**
1.  点击**启动**

访问地址：`https://<用户名>.gitee.io/frontend-knowledge/`

### 4.3 设置 Gitee Token

1.  Gitee → 个人设置 → 私人令牌 → 生成（权限勾选 `projects`）
1.  仓库 → 设置 → CI/CD → 加密变量 → 添加 `GITEE_TOKEN`

* * *

## Phase 5：爬虫脚本（scripts/crawl.js）

### 5.1 使用方式

```
# 爬取 MDN 文章，保存到 docs/browser/event-loop.md
node scripts/crawl.js \
  https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Event_loop \
  browser/event-loop

# 爬取掘金文章
node scripts/crawl.js https://juejin.cn/post/xxxxxx advanced/webpack
```

### 5.2 核心代码

```
#!/usr/bin/env node
const axios = require('axios')
const cheerio = require('cheerio')
const TurndownService = require('turndown')
const { gfm, tables } = require('turndown-plugin-gfm')
const fs = require('fs')
const path = require('path')

// 各网站内容选择器配置
const SITE_RULES = {
  'developer.mozilla.org': {
    contentSelector: '.main-page-content article',
    removeSelectors: ['.prev-next', '.metadata', 'nav', '.ad'],
  },
  'juejin.cn': {
    contentSelector: '.article-content',
    removeSelectors: ['.copy-code-btn', '.tag-list'],
  },
  default: {
    contentSelector: 'article, main, .content, .post-content, #content',
    removeSelectors: ['nav', 'header', 'footer', 'script', 'style'],
  },
}

async function crawl(url, outputPath) {
  const { data: html } = await axios.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    timeout: 15000,
  })

  const hostname = new URL(url).hostname
  const rule = SITE_RULES[hostname] || SITE_RULES.default
  const $ = cheerio.load(html)
  const pageTitle = $('title').text().trim()

  rule.removeSelectors.forEach(sel => $(sel).remove())

  let contentHtml = ''
  for (const sel of rule.contentSelector.split(', ')) {
    const el = $(sel).first()
    if (el.length && el.html().trim().length > 200) {
      contentHtml = el.html()
      break
    }
  }

  const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' })
  td.use([gfm, tables])
  const markdown = td.turndown(contentHtml)

  const frontmatter = `---\ntitle: ${pageTitle}\nsource: ${url}\ncrawled: ${new Date().toISOString().split('T')[0]}\n---\n\n`
  const finalContent = frontmatter + markdown

  const outputFile = outputPath
    ? path.resolve('docs', `${outputPath}.md`)
    : path.resolve('docs', pageTitle.replace(/\s+/g, '-').toLowerCase() + '.md')

  fs.mkdirSync(path.dirname(outputFile), { recursive: true })
  fs.writeFileSync(outputFile, finalContent, 'utf-8')
  console.log(`✅ 已保存到: ${outputFile}`)
}

const [,, url, outputPath] = process.argv
if (!url) {
  console.error('用法：node scripts/crawl.js <URL> [输出路径]')
  process.exit(1)
}
crawl(url, outputPath).catch(err => { console.error(err.message); process.exit(1) })
```

* * *

## Phase 6：执行 Checklist

| 步骤      | 内容                                                 | 状态 |
| ------- | -------------------------------------------------- | -- |
| Step 1  | Gitee 创建仓库 `frontend-knowledge`（公开）                | ⬜  |
| Step 2  | 本地初始化项目，`pnpm install`                             | ⬜  |
| Step 3  | 配置 `modules.config.ts`、`config.ts`，跑通 `pnpm dev`   | ⬜  |
| Step 4  | 每个模块补充至少一篇 `index.md` 占位内容                         | ⬜  |
| Step 5  | 创建 `.gitee/workflows/deploy.yml`                   | ⬜  |
| Step 6  | Gitee 仓库设置 → 加密变量 → 添加 `GITEE_TOKEN`               | ⬜  |
| Step 7  | `git push origin master` → 观察 Gitee Go 流水线         | ⬜  |
| Step 8  | Gitee Pages 配置 `gh-pages` 分支，开启自动部署                | ⬜  |
| Step 9  | 访问 `https://<用户名>.gitee.io/frontend-knowledge/` 验证 | ⬜  |
| Step 10 | 测试爬虫脚本，确认输出 MD 文件格式正确                              | ⬜  |

* * *

## 后续可扩展方向

-   **评论系统**：接入 giscus（基于 Gitee/GitHub Discussions）
-   **全文搜索**：VitePress 内置 local search，大量内容后可迁移 Algolia DocSearch
-   **访问统计**：加入 umami 或百度统计脚本
-   **真正的权限控制**：引入 Cloudflare Access 或自建 Auth 服务，给 token 用户单独下发 JWT
-   **多人协作**：通过 PR 机制贡献内容，CI 自动预览

* * *

*文档创建日期：2026-03-24*
