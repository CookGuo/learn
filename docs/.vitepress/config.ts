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

    nav: [{ text: '🏠 首页', link: '/' }, ...buildNav()],

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
      pattern:
        'https://github.com/CookGuo/learn/edit/main/docs/:path',
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
