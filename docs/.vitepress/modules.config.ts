export interface SidebarItem {
  text: string
  link?: string
  items?: SidebarItem[]
}

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
        text: '概述',
        items: [
          { text: '模块介绍', link: '/browser/' },
        ],
      },
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
      {
        text: '网络',
        items: [
          { text: '网络协议栈', link: '/browser/network' },
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
      {
        text: '概述',
        items: [
          { text: '模块介绍', link: '/basic/' },
        ],
      },
      { 
        text: 'HTML', 
        items: [
          { text: '语义化与无障碍', link: '/basic/html-semantic' },
          { text: 'HTML5 新特性', link: '/basic/html5' },
        ] 
      },
      { 
        text: 'CSS', 
        items: [
          { text: 'BFC 与格式化上下文', link: '/basic/css-bfc' },
          { text: 'Flexbox 布局', link: '/basic/css-flexbox' },
          { text: 'Grid 布局', link: '/basic/css-grid' },
        ] 
      },
      { 
        text: 'JavaScript', 
        items: [
          { text: '原型与原型链', link: '/basic/js-prototype' },
          { text: 'Promise 与异步', link: '/basic/js-async' },
          { text: 'ES6+ 新特性', link: '/basic/js-es6' },
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
      {
        text: '概述',
        items: [
          { text: '模块介绍', link: '/advanced/' },
        ],
      },
      { 
        text: '性能优化', 
        items: [
          { text: '性能指标与测量', link: '/advanced/performance-metrics' },
          { text: '加载优化策略', link: '/advanced/performance-loading' },
        ] 
      },
      { 
        text: '工程化', 
        items: [
          { text: 'Webpack 原理', link: '/advanced/webpack' },
          { text: 'Vite 原理', link: '/advanced/vite' },
          { text: 'Monorepo 实践', link: '/advanced/monorepo' },
        ],
      },
      { 
        text: '安全', 
        items: [
          { text: 'XSS 与 CSRF', link: '/advanced/security-xss-csrf' },
          { text: '内容安全策略', link: '/advanced/security-csp' },
        ],
      },
    ],
  },
]
