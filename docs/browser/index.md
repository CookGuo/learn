# 浏览器工作原理

浏览器是前端开发者最亲密的工作伙伴，深入理解浏览器的工作原理，能帮助我们写出更高效、更优雅的代码。

## 📋 内容概览

本模块系统讲解浏览器核心工作机制，共 36 篇文档，分为 6 个部分：

### 第一部分：Chrome 架构与进程
- [Chrome 架构](./guide/part01/lesson01) - 进程与线程模型
- [导航流程](./guide/part01/lesson02) - URL 到页面展示
- [渲染流程](./guide/part01/lesson03) - 渲染引擎工作原理
- [JS 引擎执行](./guide/part01/lesson04) - V8 执行机制
- [事件循环系统](./guide/part01/lesson05) - 宏任务与微任务
- [Compositor 合成](./guide/part01/lesson06) - 图层与合成

### 第二部分：JavaScript 执行
- [调用栈与执行上下文](./guide/part02/lesson07)
- [作用域与闭包](./guide/part02/lesson08)
- [this 指向法则](./guide/part02/lesson09)
- [原型与原型链](./guide/part02/lesson10)
- [Promise 与异步](./guide/part02/lesson11)

### 第三部分：CSS 渲染与动画
- [CSS 选择器与权重](./guide/part03/lesson12)
- [盒模型与布局](./guide/part03/lesson13)
- [重排与重绘优化](./guide/part03/lesson14)

### 第四部分：浏览器存储
- [Cookie 与 Session](./guide/part04/lesson15)
- [LocalStorage](./guide/part04/lesson16)
- [SessionStorage](./guide/part04/lesson17)
- [IndexedDB](./guide/part04/lesson18)
- [Cache API](./guide/part04/lesson19)
- [PWA 离线存储](./guide/part04/lesson20)

### 第五部分：网络请求
- [HTTP 协议基础](./guide/part05/lesson21)
- [TCP 三次握手](./guide/part05/lesson22)
- [HTTP 缓存机制](./guide/part05/lesson23)
- [跨域请求 CORS](./guide/part05/lesson24)
- [WebSocket 通信](./guide/part05/lesson25)
- [HTTP2 与 HTTP3](./guide/part05/lesson26)
- [网络安全 HTTPS](./guide/part05/lesson27)
- [CDN 与加速](./guide/part05/lesson28)

### 第六部分：性能优化
- [Performance API](./guide/part06/lesson29)
- [Core Web Vitals](./guide/part06/lesson30)
- [长任务优化](./guide/part06/lesson31)
- [内存管理与泄漏](./guide/part06/lesson32)
- [渲染优化策略](./guide/part06/lesson33)
- [首屏加载优化](./guide/part06/lesson34)
- [节流与防抖](./guide/part06/lesson35)
- [预加载与预取](./guide/part06/lesson36)

## 🧠 核心概念

浏览器的主要组件包括：

```
┌─────────────────────────────────────────┐
│              用户界面 (UI)                │
├─────────────────────────────────────────┤
│              浏览器引擎                   │
│         (协调 UI 与渲染引擎)              │
├─────────────────────────────────────────┤
│              渲染引擎                     │
│    (解析 HTML/CSS，生成渲染树)            │
├─────────────────────────────────────────┤
│  网络层  │  JS 引擎  │  数据存储          │
│  (HTTP) │  (V8)    │  (Cookie/Storage) │
└─────────────────────────────────────────┘
```

## 🎯 学习路径

1. **入门** - 先了解 Chrome 架构与导航流程
2. **进阶** - 深入学习 JS 引擎和事件循环
3. **实战** - 通过性能优化案例巩固知识

::: tip 提示
建议结合 Chrome DevTools 进行学习，通过 Performance 面板可以直观地看到浏览器的渲染过程。
:::
