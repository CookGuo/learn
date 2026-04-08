import { defineConfig } from 'vitepress'
import { modules } from './modules.config'

function buildSidebar() {
  const sidebar: Record<string, any[]> = {}
  for (const mod of modules.filter(m => m.enabled)) {
    // Special handling for interview modules to match URL paths
    if (mod.id === 'interview') {
      sidebar['/interview/'] = mod.sidebar
    } else if (mod.id === 'interview-selection') {
      sidebar['/interview/selection/'] = mod.sidebar
    } else {
      sidebar[`/${mod.id}/`] = mod.sidebar
    }
  }
  return sidebar
}

function buildNav() {
  const nav = [
    { text: '🏠 首页', link: '/' },
    { text: '🌐 浏览器工作原理', link: '/browser/' },
    {
      text: '💼 面试合集',
      items: [
        { text: '📝 基础篇', link: '/interview/base/' },
        { text: '📝 进阶篇', link: '/interview/improve/' },
        { text: '📝 高频篇', link: '/interview/high-frequency/' },
        { text: '✍️ 手写篇', link: '/interview/handwritten/' },
        { text: '⚙️ 原理篇', link: '/interview/principle/react-router' },
        { text: '📋 面经篇', link: '/interview/experience.html' },
      ]
    },
    {
      text: '💼 精选篇',
      items: [
        { text: 'HTML模块', link: '/interview/selection/1-HTML' },
        { text: 'CSS模块', link: '/interview/selection/2-CSS' },
        { text: 'JS模块', link: '/interview/selection/3-JS' },
        { text: 'ES6模块', link: '/interview/selection/4-ES6' },
        { text: '浏览器模块', link: '/interview/selection/5-Browser' },
        { text: 'React模块', link: '/interview/selection/6-React' },
        { text: 'Vue模块', link: '/interview/selection/7-Vue' },
        { text: 'Node模块', link: '/interview/selection/8-Node' },
        { text: '前端工程模块', link: '/interview/selection/9-Engineering' },
        { text: '移动端开发', link: '/interview/selection/10-Mobile' },
        { text: '小程序模块', link: '/interview/selection/11-MiniApp' },
        { text: 'Uniapp模块', link: '/interview/selection/12-Uniapp' },
        { text: '前端安全模块', link: '/interview/selection/13-Security' },
        { text: '性能优化模块', link: '/interview/selection/14-Performance' },
        { text: 'HTTP模块', link: '/interview/selection/15-HTTP' },
        { text: '设计模式', link: '/interview/selection/16-DesignPattern' },
        { text: '框架通识', link: '/interview/selection/17-Framework' },
        { text: '排序算法', link: '/interview/selection/18-Algorithm' },
        { text: '计算机通识', link: '/interview/selection/19-Computer' }
      ]
    },
    { text: '✅ 自检篇', link: '/interview/self-check/' },
    { text: '📅 每日一题', link: '/interview/daily/' }
  ]
  return nav
}

export default defineConfig({
  title: '前端知识库',
  description: '系统化的前端知识体系',
  base: '/learn/',
  ignoreDeadLinks: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'author', content: 'Frontend Knowledge Team' }],
    [
      'meta',
      {
        name: 'keywords',
        content: '前端, HTML, CSS, JavaScript, Vue, React, 性能优化, 工程化'
      }
    ]
  ],

  themeConfig: {
    logo: '📚',

    nav: buildNav(),

    sidebar: buildSidebar(),

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },

    outline: {
      label: '页面导航',
      level: 'deep'
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    editLink: {
      pattern: 'https://github.com/CookGuo/learn/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    footer: {
      message: '基于 MIT 许可发布',
      copyright: `Copyright © ${new Date().getFullYear()} 前端知识库`
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/CookGuo/learn'
      }
    ]
  },

  markdown: {
    lineNumbers: true,
    config: md => {
      // 可以在这里添加 markdown-it 插件
    }
  }
})
