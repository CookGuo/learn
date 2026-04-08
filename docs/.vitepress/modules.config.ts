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
    id: 'interview',
    title: '面试合集',
    description: '基础篇、进阶篇、高频篇、手写篇、原理篇、面经篇',
    icon: '💼',
    order: 4,
    enabled: true,
    access: 'public',
    sidebar: [
      {
        text: '基础篇',
        items: [
          { text: 'HTML/HTTP/Web综合', link: '/interview/base/' },
        ],
      },
      {
        text: '进阶篇',
        items: [
          { text: '进阶题型', link: '/interview/improve/' },
        ],
      },
      {
        text: '高频篇',
        items: [
          { text: '高频面试题', link: '/interview/high-frequency/' },
        ],
      },
      {
        text: '手写篇',
        items: [
          { text: '手写代码题', link: '/interview/handwritten/' },
        ],
      },
      {
        text: '原理篇',
        items: [
          { text: 'React Router原理', link: '/interview/principle/react-router' },
        ],
      },
      {
        text: '面经篇',
        items: [
          { text: '面经汇总', link: '/interview/experience.html' },
        ],
      },
    ],
  },
  {
    id: 'interview-selection',
    title: '精选篇',
    description: '精选面试题模块',
    icon: '💼',
    order: 5,
    enabled: true,
    access: 'public',
    sidebar: [
      {
        text: '精选篇',
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
          { text: '计算机通识', link: '/interview/selection/19-Computer' },
        ],
      },
    ],
  },
  {
    id: 'self-check',
    title: '自检篇',
    description: '前端100题自检',
    icon: '✅',
    order: 6,
    enabled: true,
    access: 'public',
    sidebar: [
      {
        text: '自检篇',
        items: [
          { text: '前端100题自检', link: '/interview/self-check/' },
        ],
      },
    ],
  },
  {
    id: 'daily',
    title: '每日一题',
    description: '每日算法面试题',
    icon: '📅',
    order: 7,
    enabled: true,
    access: 'public',
    sidebar: [
      {
        text: '每日一题',
        items: [
          { text: '每日一题', link: '/interview/daily/' },
        ],
      },
    ],
  },
]
