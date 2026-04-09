---
title: # koa-jsonp中间件
source: https://interview.poetries.top/fe-node-docs/nodejs-docs/koa2/-9.2 koa jsonp中间件.html
crawled: 2026-04-09
---

# # koa-jsonp中间件

> 原文: [https://interview.poetries.top/fe-node-docs/nodejs-docs/koa2/-9.2 koa jsonp中间件.html](https://interview.poetries.top/fe-node-docs/nodejs-docs/koa2/-9.2 koa jsonp中间件.html)

---

# [#](#koa-jsonp中间件) koa-jsonp中间件

koa.js 官方wiki中也介绍了不少jsonp的中间件

![](https://s.poetries.top/uploads/2025/10/0ede624ad34cf645.png)

其中koa-jsonp是支持koa2的，使用方式也非常简单，koa-jsonp的官方demo也很容易理解

## [#](#快速使用) 快速使用

demo地址

[https://github.com/poetries/daily-code-practice/tree/master/node/koa/koa2-demo/jsonp-use-middleware/ (opens new window)](https://github.com/poetries/daily-code-practice/tree/master/node/koa/koa2-demo/jsonp-use-middleware/)

### [#](#安装) 安装

```
npm install --save koa-jsonp
```

### [#](#简单例子) 简单例子

```
const Koa = require('koa')
const jsonp = require('koa-jsonp')
const app = new Koa()

// 使用中间件
app.use(jsonp())

app.use( async ( ctx ) => {
  
  let returnData = {
    success: true,
    data: {
      text: 'this is a jsonp api',
      time: new Date().getTime(),
    }
  }

  // 直接输出JSON
  ctx.body = returnData
})

app.listen(3000, () => {
  console.log('[demo] jsonp is starting at port 3000')
})

```

阅读全文