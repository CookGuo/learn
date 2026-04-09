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
    id: 'node-interview',
    title: 'Node.js 面试',
    description: 'Node.js 基础、环境搭建、内置模块、Express、Koa2',
    icon: '🟢',
    order: 5,
    enabled: true,
    access: 'public',
    sidebar: [
      {
        text: '基础篇',
        items: [
          { text: '环境搭建与模块', link: '/node-interview/' },
          { text: 'Node部署', link: '/node-interview/base/02-node部署' },
          { text: '基础应用', link: '/node-interview/base/03-基础应用' },
        ],
      },
      {
        text: '内置模块',
        items: [
          { text: 'path 路径处理', link: '/node-interview/modules/01-path' },
          { text: 'fs 文件系统', link: '/node-interview/modules/02-fs' },
          { text: 'console 调试', link: '/node-interview/modules/03-console' },
          { text: 'http 网络服务', link: '/node-interview/modules/04-http' },
          { text: 'http response', link: '/node-interview/modules/04-http-res' },
          { text: 'http request', link: '/node-interview/modules/04-http-req' },
          { text: 'http server', link: '/node-interview/modules/04-http-server' },
          { text: 'http client', link: '/node-interview/modules/04-http-client' },
          { text: 'https', link: '/node-interview/modules/04-https' },
          { text: 'net TCP', link: '/node-interview/modules/04-net' },
          { text: 'dgram UDP', link: '/node-interview/modules/04-dgram' },
          { text: 'dns 域名解析', link: '/node-interview/modules/04-dns' },
          { text: 'url 地址解析', link: '/node-interview/modules/05-url' },
          { text: 'querystring 查询字符串', link: '/node-interview/modules/05-querystring' },
          { text: 'stream 流操作', link: '/node-interview/modules/06-stream' },
          { text: 'readline 逐行读取', link: '/node-interview/modules/06-readline' },
          { text: 'process 进程', link: '/node-interview/modules/07-process' },
          { text: 'child 子进程', link: '/node-interview/modules/07-child' },
          { text: 'buffer 二进制数据', link: '/node-interview/modules/08-buffer' },
          { text: 'string_decoder 解码', link: '/node-interview/modules/08-string-decoder' },
          { text: 'events 事件机制', link: '/node-interview/modules/09-events' },
          { text: 'util 工具模块', link: '/node-interview/modules/09-util' },
          { text: 'crypto 数据加密', link: '/node-interview/modules/09-crypto' },
          { text: 'zlib 资源压缩', link: '/node-interview/modules/09-zlib' },
          { text: 'cluster 集群', link: '/node-interview/modules/09-cluster' },
          { text: 'v8 引擎', link: '/node-interview/modules/09-v8' },
        ],
      },
      {
        text: '进阶篇',
        items: [
          { text: '非对称加密', link: '/node-interview/advance/01-asymmetric' },
          { text: 'HTTPS', link: '/node-interview/advance/02-https' },
          { text: 'async 控制并发', link: '/node-interview/advance/03-async' },
          { text: 'eventproxy 并发控制', link: '/node-interview/advance/04-eventproxy' },
          { text: '爬虫实战', link: '/node-interview/advance/05-scrapy' },
          { text: 'body-parser 中间件', link: '/node-interview/advance/07-body-parser' },
          { text: '日志模块 morgan', link: '/node-interview/advance/08-morgan' },
          { text: 'debug 调试', link: '/node-interview/advance/09-debug' },
          { text: 'log4js 日志', link: '/node-interview/advance/10-log4js' },
          { text: 'mocha 测试', link: '/node-interview/advance/11-mocha' },
          { text: 'cookie-parser', link: '/node-interview/advance/12-cookie-parser' },
          { text: 'crypto 理论', link: '/node-interview/advance/15-crypto-theory' },
          { text: 'cluster 进阶', link: '/node-interview/advance/16-cluster' },
          { text: 'NAPI 原生扩展', link: '/node-interview/advance/17-napi' },
          { text: 'DataURI', link: '/node-interview/advance/18-datauri' },
          { text: '字符编解码', link: '/node-interview/advance/19-charset' },
        ],
      },
      {
        text: 'Express',
        items: [
          { text: 'Express 概览', link: '/node-interview/express/01-overview' },
          { text: 'Express 基础', link: '/node-interview/express/02-express' },
        ],
      },
      {
        text: 'Koa2',
        items: [
          { text: 'Koa2 概览', link: '/node-interview/koa2/01-overview' },
          { text: '快速开始', link: '/node-interview/koa2/02-quickstart' },
          { text: 'async await', link: '/node-interview/koa2/03-async' },
          { text: 'Koa2 结构解析', link: '/node-interview/koa2/04-structure' },
          { text: '中间件开发', link: '/node-interview/koa2/05-middleware' },
          { text: '原生路由实现', link: '/node-interview/koa2/06-router' },
          { text: 'koa-router', link: '/node-interview/koa2/07-koa-router' },
          { text: 'GET 请求', link: '/node-interview/koa2/08-get' },
          { text: 'POST 请求', link: '/node-interview/koa2/09-post' },
          { text: 'bodyparser', link: '/node-interview/koa2/10-bodyparser' },
          { text: '静态资源服务器', link: '/node-interview/koa2/11-static' },
          { text: 'koa-static', link: '/node-interview/koa2/12-koa-static' },
          { text: 'Cookie/Session', link: '/node-interview/koa2/13-cookie' },
          { text: '模板引擎', link: '/node-interview/koa2/15-template' },
          { text: 'busboy', link: '/node-interview/koa2/17-busboy' },
          { text: '文件上传', link: '/node-interview/koa2/18-upload' },
          { text: 'MySQL', link: '/node-interview/koa2/20-mysql' },
          { text: 'async MySQL', link: '/node-interview/koa2/21-mysql-async' },
          { text: 'JSONP', link: '/node-interview/koa2/23-jsonp' },
          { text: '单元测试', link: '/node-interview/koa2/25-unit-test' },
          { text: 'Debug', link: '/node-interview/koa2/26-debug' },
          { text: '项目实战', link: '/node-interview/koa2/27-quick-start' },
          { text: '框架设计', link: '/node-interview/koa2/28-framework' },
          { text: '分层操作', link: '/node-interview/koa2/29-layered' },
          { text: '数据库设计', link: '/node-interview/koa2/30-database' },
          { text: '路由设计', link: '/node-interview/koa2/31-router' },
          { text: 'Webpack 环境', link: '/node-interview/koa2/32-webpack' },
          { text: '登录注册', link: '/node-interview/koa2/34-auth' },
          { text: 'Session 登录态', link: '/node-interview/koa2/35-session-auth' },
          { text: 'import/export', link: '/node-interview/koa2/36-import-export' },
        ],
      },
      {
        text: '其他',
        items: [
          { text: '数据库操作', link: '/node-interview/other/01-database' },
          { text: 'Session 与 Token', link: '/node-interview/other/02-session-token' },
          { text: 'Cookie/Session/Token/JWT', link: '/node-interview/other/03-cookie-session-token-jwt' },
          { text: 'Socket', link: '/node-interview/other/04-socket' },
        ],
      },
    ],
  },
  {
    id: 'interview-selection',
    title: '精选篇',
    description: '精选面试题模块',
    icon: '💼',
    order: 7,
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
    order: 8,
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
    order: 9,
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
  {
    id: 'engineering',
    title: '前端工程化',
    description: 'npm scripts、Webpack、Docker、CI/CD、Kubernetes',
    icon: '⚙️',
    order: 10,
    enabled: true,
    access: 'public',
    sidebar: [
      {
        text: '工程基础',
        items: [
          { text: 'npm scripts', link: '/engineering/npm-script' },
          { text: 'Webpack', link: '/engineering/webpack' },
          { text: 'Docker', link: '/engineering/docker' },
        ],
      },
      {
        text: 'CI/CD 持续集成',
        items: [
          { text: '什么是 CI/CD', link: '/engineering/ci/01-ci-cd' },
          { text: 'Docker 与 Jenkins', link: '/engineering/ci/02-docker-jenkins' },
          { text: 'Jenkins 构建镜像', link: '/engineering/ci/03-jenkins-image' },
          { text: '私有镜像库', link: '/engineering/ci/04-private-registry' },
          { text: '进入 CI 的世界', link: '/engineering/ci/05-ci-world' },
        ],
      },
      {
        text: 'Kubernetes 容器编排',
        items: [
          { text: 'K8s 入门', link: '/engineering/ci/06-kubernetes' },
          { text: 'K8s 部署应用', link: '/engineering/ci/07-k8s-deploy' },
          { text: '灰度发布与滚动发布', link: '/engineering/ci/08-k8s-rollout' },
          { text: '服务可用性探针', link: '/engineering/ci/09-k8s-probe' },
          { text: 'K8s Secret', link: '/engineering/ci/10-k8s-secret' },
          { text: 'K8s DNS', link: '/engineering/ci/11-k8s-dns' },
          { text: 'K8s ConfigMap', link: '/engineering/ci/12-k8s-configmap' },
          { text: 'K8s 污点与容忍', link: '/engineering/ci/13-k8s-taint' },
          { text: '实战部署', link: '/engineering/ci/14实战' },
        ],
      },
    ],
  },
  {
    id: 'vue-interview',
    title: 'Vue 面试',
    description: 'Vue.js 构建、实战、开发指南、拓展',
    icon: '💚',
    order: 11,
    enabled: true,
    access: 'public',
    sidebar: [
      {
        text: '基础 Vue',
        items: [
          { text: 'Vue CLI 3 项目构建', link: '/vue-interview/base/01-vue-cli' },
          { text: '包管理工具与配置项', link: '/vue-interview/base/02-package' },
          { text: 'Webpack 在 CLI 3 中的应用', link: '/vue-interview/base/03-webpack' },
          { text: 'env 文件与环境设置', link: '/vue-interview/base/04-env' },
          { text: '单页应用配置', link: '/vue-interview/action/05-spa' },
          { text: '多页应用构建', link: '/vue-interview/action/06-multi-page' },
          { text: '多页路由与模板解析', link: '/vue-interview/action/07-router-template' },
          { text: '项目整合与优化', link: '/vue-interview/action/08-optimize' },
          { text: '编码技巧与规范', link: '/vue-interview/guide/09-coding' },
          { text: '可复用性模块', link: '/vue-interview/guide/10-reusable' },
          { text: '容器组件与展示组件', link: '/vue-interview/guide/11-component' },
          { text: '数据驱动与拼图游戏', link: '/vue-interview/guide/12-data-driven' },
          { text: 'Vue API 盲点解析', link: '/vue-interview/guide/13-api' },
          { text: '开发工具扩充', link: '/vue-interview/other/14-tools' },
          { text: 'UI 第三方库', link: '/vue-interview/other/15-ui' },
          { text: '使用外部数据', link: '/vue-interview/other/16-external-data' },
        ],
      },
      {
        text: 'Vue 组件详解',
        items: [
          { text: 'Vue 组件详解', link: '/vue-interview/component' },
        ],
      },
    ],
  },
]
