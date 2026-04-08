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
    description: '深入理解Chrome浏览器架构、渲染流程、JS引擎执行机制',
    icon: '🌐',
    order: 1,
    enabled: true,
    access: 'public',
    sidebar: [
      {
        text: '第一部分：Chrome架构与进程',
        items: [
          { text: 'Chrome架构', link: '/browser/guide/part01/lesson01' },
          { text: 'Chrome导航流程', link: '/browser/guide/part01/lesson02' },
          { text: 'Chrome渲染流程', link: '/browser/guide/part01/lesson03' },
          { text: 'JS引擎执行过程', link: '/browser/guide/part01/lesson04' },
          { text: '事件循环系统', link: '/browser/guide/part01/lesson05' },
          { text: 'Compositor合成', link: '/browser/guide/part01/lesson06' },
        ],
      },
      {
        text: '第二部分：JavaScript执行',
        items: [
          { text: '调用栈与执行上下文', link: '/browser/guide/part02/lesson07' },
          { text: '作用域与闭包', link: '/browser/guide/part02/lesson08' },
          { text: 'this指向法则', link: '/browser/guide/part02/lesson09' },
          { text: '原型与原型链', link: '/browser/guide/part02/lesson10' },
          { text: 'Promise与异步', link: '/browser/guide/part02/lesson11' },
        ],
      },
      {
        text: '第三部分：CSS渲染与动画',
        items: [
          { text: 'CSS选择器与权重', link: '/browser/guide/part03/lesson12' },
          { text: '盒模型与布局', link: '/browser/guide/part03/lesson13' },
          { text: '重排与重绘优化', link: '/browser/guide/part03/lesson14' },
        ],
      },
      {
        text: '第四部分：浏览器存储',
        items: [
          { text: 'Cookie与Session', link: '/browser/guide/part04/lesson15' },
          { text: 'LocalStorage', link: '/browser/guide/part04/lesson16' },
          { text: 'SessionStorage', link: '/browser/guide/part04/lesson17' },
          { text: 'IndexedDB', link: '/browser/guide/part04/lesson18' },
          { text: 'Cache API', link: '/browser/guide/part04/lesson19' },
          { text: 'PWA离线存储', link: '/browser/guide/part04/lesson20' },
        ],
      },
      {
        text: '第五部分：网络请求',
        items: [
          { text: 'HTTP协议基础', link: '/browser/guide/part05/lesson21' },
          { text: 'TCP三次握手', link: '/browser/guide/part05/lesson22' },
          { text: 'HTTP缓存机制', link: '/browser/guide/part05/lesson23' },
          { text: '跨域请求CORS', link: '/browser/guide/part05/lesson24' },
          { text: 'WebSocket通信', link: '/browser/guide/part05/lesson25' },
          { text: 'HTTP2与HTTP3', link: '/browser/guide/part05/lesson26' },
          { text: '网络安全HTTPS', link: '/browser/guide/part05/lesson27' },
          { text: 'CDN与加速', link: '/browser/guide/part05/lesson28' },
        ],
      },
      {
        text: '第六部分：性能优化',
        items: [
          { text: 'Performance API', link: '/browser/guide/part06/lesson29' },
          { text: 'Core Web Vitals', link: '/browser/guide/part06/lesson30' },
          { text: '长任务优化', link: '/browser/guide/part06/lesson31' },
          { text: '内存管理与泄漏', link: '/browser/guide/part06/lesson32' },
          { text: '渲染优化策略', link: '/browser/guide/part06/lesson33' },
          { text: '首屏加载优化', link: '/browser/guide/part06/lesson34' },
          { text: '节流与防抖', link: '/browser/guide/part06/lesson35' },
          { text: '预加载与预取', link: '/browser/guide/part06/lesson36' },
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
