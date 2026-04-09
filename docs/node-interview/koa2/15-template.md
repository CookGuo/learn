---
title: # koa2加载模板引擎
source: https://interview.poetries.top/fe-node-docs/nodejs-docs/koa2/-6.1 koa2加载模板引擎.html
crawled: 2026-04-09
---

# # koa2加载模板引擎

> 原文: [https://interview.poetries.top/fe-node-docs/nodejs-docs/koa2/-6.1 koa2加载模板引擎.html](https://interview.poetries.top/fe-node-docs/nodejs-docs/koa2/-6.1 koa2加载模板引擎.html)

---

# [#](#koa2加载模板引擎) koa2加载模板引擎

## [#](#快速开始) 快速开始

### [#](#安装模块) 安装模块

```
# 安装koa模板使用中间件
npm install --save koa-views

# 安装ejs模板引擎
npm install --save ejs
```

### [#](#使用模板引擎) 使用模板引擎

demo源码

[https://github.com/poetries/daily-code-practice/tree/master/node/koa/koa2-demo/blob/master/demo/ejs/ (opens new window)](https://github.com/poetries/daily-code-practice/tree/master/node/koa/koa2-demo/blob/master/demo/ejs/)

#### [#](#文件目录) 文件目录

```
├── package.json
├── index.js
└── view
    └── index.ejs
```

#### [#](#index-js文件) ./index.js文件

```
const Koa = require('koa')
const views = require('koa-views')
const path = require('path')
const app = new Koa()

// 加载模板引擎
app.use(views(path.join(__dirname, './view'), {
  extension: 'ejs'
}))

app.use( async ( ctx ) => {
  let title = 'hello koa2'
  await ctx.render('index', {
    title,
  })
})

app.listen(3000)
```

#### [#](#view-index-ejs-模板) ./view/index.ejs 模板

```
<!DOCTYPE html>
<html>
<head>
    <title><%= title %></title>
</head>
<body>
    <h1><%= title %></h1>
    <p>EJS Welcome to <%= title %></p>
</body>
</html>
```

阅读全文