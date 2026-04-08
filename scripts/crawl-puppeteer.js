#!/usr/bin/env node
import puppeteer from 'puppeteer'
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
    contentSelector: '.content__default, .markdown-body, article, main',
    removeSelectors: ['.page-nav, aside, .sidebar, nav, footer, .page-edit'],
    titleSelector: 'h1'
  },
  default: {
    contentSelector: 'article, main, .content, .post-content',
    removeSelectors: ['nav', 'header', 'footer', '.sidebar'],
    titleSelector: 'h1'
  }
}

async function crawlWithBrowser(url, outputPath, cookie) {
  console.log(`[Browser] 开始爬取: ${url}`)

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  try {
    const page = await browser.newPage()

    // Set cookie if provided
    if (cookie) {
      const cookies = cookie.split(';').map(c => {
        const [name, ...valueParts] = c.trim().split('=')
        return {
          name: name.trim(),
          value: valueParts.join('=').trim(),
          domain: '.feinterview.poetries.top',
          path: '/'
        }
      })
      await page.setCookie(...cookies)
    }

    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000
    })

    // Scroll to trigger lazy loading and wait for content
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
    await new Promise(resolve => setTimeout(resolve, 2000))
    await page.evaluate(() => {
      window.scrollTo(0, 0)
    })
    await new Promise(resolve => setTimeout(resolve, 2000))

    const hostname = new URL(url).hostname.replace(/^www\./, '')
    const rule = SITE_RULES[hostname] || SITE_RULES.default

    // Debug: check page title and body text length
    const debugInfo = await page.evaluate(() => {
      return {
        title: document.title,
        bodyLength: document.body.textContent.length,
        hasLoading: document.body.textContent.includes('加载中'),
        hasContent: document.body.textContent.includes('有赞'),
        url: window.location.href
      }
    })
    console.log('[Browser] Debug:', debugInfo)

    // Get page content
    const content = await page.evaluate((selector) => {
      const el = document.querySelector(selector)
      return el ? el.innerHTML : ''
    }, rule.contentSelector.split(',')[0].trim())

    // Get title
    const title = await page.evaluate(() => {
      const h1 = document.querySelector('h1')
      return h1 ? h1.textContent.trim() : document.title
    })

    if (!content) {
      throw new Error('未能提取到内容')
    }

    // Convert to markdown
    const turndown = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced'
    })
    turndown.use(gfm)

    let markdown = turndown.turndown(content)
    // Remove loading text patterns
    markdown = markdown.replace(/加载中[\s\S]*?$/gm, '')
    // Clean up duplicate attributes (common issue with turndown)
    markdown = markdown.replace(/\s+target="_blank"\s+target="_blank"/g, ' target="_blank"')
    markdown = markdown.replace(/\s+class="[^"]*"\s+class="[^"]*"/g, (match) => {
      // Keep only the first class attribute
      const classes = match.match(/class="[^"]*"/g)
      return classes ? ' ' + classes[0] : ''
    })
    markdown = markdown.replace(/\n{3,}/g, '\n\n').trim()

    const frontmatter = `---\ntitle: ${title}\nsource: ${url}\ncrawled: ${new Date().toISOString().split('T')[0]}\n---\n\n# ${title}\n\n> 原文: [${url}](${url})\n\n---\n\n`

    const finalContent = frontmatter + markdown

    const outputFile = outputPath
      ? path.resolve(__dirname, '..', 'docs', `${outputPath}.md`)
      : path.resolve(__dirname, '..', 'docs', title.replace(/[^\w\u4e00-\u9fa5]+/g, '-').toLowerCase() + '.md')

    const outputDir = path.dirname(outputFile)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    fs.writeFileSync(outputFile, finalContent, 'utf-8')
    console.log(`[Browser] 已保存: ${outputFile}`)

  } finally {
    await browser.close()
  }
}

const [,, url, outputPath, cookie] = process.argv
if (!url) {
  console.log('用法: node scripts/crawl-puppeteer.js <URL> [输出路径] [cookie]')
  console.log('示例: node scripts/crawl-puppeteer.js https://example.com/article browser/event-loop "fe-token=xxx"')
  process.exit(1)
}

crawlWithBrowser(url, outputPath, cookie).catch(err => {
  console.error('[Browser] 爬取失败:', err.message)
  process.exit(1)
})
