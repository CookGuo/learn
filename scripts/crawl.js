#!/usr/bin/env node
import axios from 'axios'
import * as cheerio from 'cheerio'
import TurndownService from 'turndown'
import { gfm } from 'turndown-plugin-gfm'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const SITE_RULES = {
  'developer.mozilla.org': {
    contentSelector: '.main-page-content article',
    removeSelectors: ['.prev-next', '.metadata', 'nav.breadcrumbs'],
    titleSelector: 'h1'
  },
  'juejin.cn': {
    contentSelector: '.article-content',
    removeSelectors: ['.copy-code-btn', '.tag-list'],
    titleSelector: '.article-title'
  },
  'interview.poetries.top': {
    contentSelector: '.theme-default-content, article, .content',
    removeSelectors: ['.page-nav, .cookie, aside, .sidebar, nav, footer, .page-edit'],
    titleSelector: 'h1'
  },
  'feinterview.poetries.top': {
    contentSelector: '.content__default, .markdown-body, article',
    removeSelectors: ['.page-nav, aside, .sidebar, nav, footer, .page-edit'],
    titleSelector: 'h1'
  },
  default: {
    contentSelector: 'article, main, .content, .post-content',
    removeSelectors: ['nav', 'header', 'footer', '.sidebar'],
    titleSelector: 'h1'
  }
}

async function crawl(url, outputPath) {
  console.log(`开始爬取: ${url}`)

  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 30000
    })

    const hostname = new URL(url).hostname.replace(/^www\./, '')
    const rule = SITE_RULES[hostname] || SITE_RULES.default

    const $ = cheerio.load(html)
    const pageTitle = $(rule.titleSelector).first().text().trim() || $('title').text().trim()

    // 清理 HTML
    rule.removeSelectors.forEach(selector => $(selector).remove())

    let contentHtml = ''
    for (const selector of rule.contentSelector.split(',')) {
      const el = $(selector.trim()).first()
      if (el.length && el.text().trim().length > 200) {
        contentHtml = el.html()
        break
      }
    }

    if (!contentHtml) {
      throw new Error('未能提取到内容')
    }

    // 转换为 Markdown
    const turndown = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced'
    })
    turndown.use(gfm)

    let markdown = turndown.turndown(contentHtml)
    markdown = markdown.replace(/\n{3,}/g, '\n\n').trim()

    const frontmatter = `---\ntitle: ${pageTitle}\nsource: ${url}\ncrawled: ${new Date().toISOString().split('T')[0]}\n---\n\n# ${pageTitle}\n\n> 原文: [${url}](${url})\n\n---\n\n`

    const finalContent = frontmatter + markdown

    const outputFile = outputPath
      ? path.resolve(__dirname, '..', 'docs', `${outputPath}.md`)
      : path.resolve(__dirname, '..', 'docs', pageTitle.replace(/[^\w\u4e00-\u9fa5]+/g, '-').toLowerCase() + '.md')

    const outputDir = path.dirname(outputFile)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    fs.writeFileSync(outputFile, finalContent, 'utf-8')
    console.log(`已保存: ${outputFile}`)

  } catch (error) {
    console.error('爬取失败:', error.message)
    process.exit(1)
  }
}

const [,, url, outputPath] = process.argv
if (!url) {
  console.log('用法: node scripts/crawl.js <URL> [输出路径]')
  console.log('示例: node scripts/crawl.js https://example.com/article interview/base/index')
  process.exit(1)
}

crawl(url, outputPath)
