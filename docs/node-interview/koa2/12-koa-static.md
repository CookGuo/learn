---
title: # koa-static中间件使用
source: https://interview.poetries.top/fe-node-docs/nodejs-docs/koa2/-4.2 koa static中间件.html
crawled: 2026-04-09
---

# # koa-static中间件使用

> 原文: [https://interview.poetries.top/fe-node-docs/nodejs-docs/koa2/-4.2 koa static中间件.html](https://interview.poetries.top/fe-node-docs/nodejs-docs/koa2/-4.2 koa static中间件.html)

---

# [#](#koa-static中间件使用) koa-static中间件使用

## [#](#使用例子) 使用例子

demo源码

[https://github.com/poetries/daily-code-practice/tree/master/node/koa/koa2-demo/static-use-middleware/ (opens new window)](https://github.com/poetries/daily-code-practice/tree/master/node/koa/koa2-demo/static-use-middleware/)

```
const Koa = require('koa')
const path = require('path')
const static = require('koa-static')

const app = new Koa()

// 静态资源目录对于相对入口文件index.js的路径
const staticPath = './static'

app.use(static(
  path.join( __dirname,  staticPath)
))

app.use( async ( ctx ) => {
  ctx.body = 'hello world'
})

app.listen(3000, () => {
  console.log('[demo] static-use-middleware is starting at port 3000')
})

```

#### [#](#效果) 效果

##### [#](#访问http-localhost-3000) 访问[http://localhost:3000 (opens new window)](http://localhost:3000)

![](https://s.poetries.top/uploads/2025/10/7ed8af2f8a949739.png)

##### [#](#访问http-localhost-3000-index-html) 访问[http://localhost:3000/index.html (opens new window)](http://localhost:3000/index.html)

![](https://s.poetries.top/uploads/2025/10/6a7cca982718558b.png)

##### [#](#访问http-localhost-3000-js-index-js) 访问[http://localhost:3000/js/index.js (opens new window)](http://localhost:3000/js/index.js)

![](https://s.poetries.top/uploads/2025/10/60b1963c18cdaf9e.png)

阅读全文