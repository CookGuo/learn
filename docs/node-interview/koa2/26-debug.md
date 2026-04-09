---
title: # 开发debug
source: https://interview.poetries.top/fe-node-docs/nodejs-docs/koa2/-11.1 开发debug.html
crawled: 2026-04-09
---

# # 开发debug

> 原文: [https://interview.poetries.top/fe-node-docs/nodejs-docs/koa2/-11.1 开发debug.html](https://interview.poetries.top/fe-node-docs/nodejs-docs/koa2/-11.1 开发debug.html)

---

# [#](#开发debug) 开发debug

## [#](#快速开始) 快速开始

### [#](#环境) 环境

*   node环境 8.x +
*   chrome 60+

### [#](#启动脚本) 启动脚本

#### [#](#调试demo) 调试demo

[https://github.com/poetries/daily-code-practice/tree/master/node/koa/koa2-demo/start-quick/ (opens new window)](https://github.com/poetries/daily-code-practice/tree/master/node/koa/koa2-demo/start-quick/index.js)

```
node --inspect index.js
```

#### [#](#指令框显示) 指令框显示

> 指令框就会出现以下字样

```
Debugger listening on ws://127.0.0.1:9229/4c23c723-5197-4d23-9b90-d473f1164abe
For help see https://nodejs.org/en/docs/inspector
```

![](https://s.poetries.top/uploads/2025/10/ddaaf549b5676f1d.png)

#### [#](#访问chrome浏览器调试server) 访问chrome浏览器调试server

![](https://s.poetries.top/uploads/2025/10/774a228662668d6a.png)

> 打开浏览器调试窗口会看到一个node.js 的小logo

![](https://s.poetries.top/uploads/2025/10/1f646481c6f69a9a.png)

#### [#](#打开chrome浏览器的node调试窗口) 打开chrome浏览器的node调试窗口

![](https://s.poetries.top/uploads/2025/10/7c6c678388eba043.png)

![](https://s.poetries.top/uploads/2025/10/7ad6053b257a3d4b.png)

> 注意打开了node的调试窗口后，原来绿色的node按钮会变灰色，同时调试框会显示debug状态

![](https://s.poetries.top/uploads/2025/10/8fa94face0ae6102.png)

![](https://s.poetries.top/uploads/2025/10/5ecfd70e0ca2a663.png)

#### [#](#可以自定义打断点调试了) 可以自定义打断点调试了

![](https://s.poetries.top/uploads/2025/10/dbf54cb728304f99.png)

阅读全文