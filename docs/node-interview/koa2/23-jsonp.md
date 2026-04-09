---
title: # 原生koa2实现jsonp
source: https://interview.poetries.top/fe-node-docs/nodejs-docs/koa2/-9.1 原生koa2实现JSONP.html
crawled: 2026-04-09
---

# # 原生koa2实现jsonp

> 原文: [https://interview.poetries.top/fe-node-docs/nodejs-docs/koa2/-9.1 原生koa2实现JSONP.html](https://interview.poetries.top/fe-node-docs/nodejs-docs/koa2/-9.1 原生koa2实现JSONP.html)

---

# [#](#原生koa2实现jsonp) 原生koa2实现jsonp

## [#](#前言) 前言

在项目复杂的业务场景，有时候需要在前端跨域获取数据，这时候提供数据的服务就需要提供跨域请求的接口，通常是使用JSONP的方式提供跨域接口。

## [#](#实现jsonp) 实现JSONP

demo地址

[https://github.com/poetries/daily-code-practice/tree/master/node/koa/koa2-demo/jsonp/ (opens new window)](https://github.com/poetries/daily-code-practice/tree/master/node/koa/koa2-demo/jsonp/)

### [#](#具体原理) 具体原理

```

  // 判断是否为JSONP的请求 
  if ( ctx.method === 'GET' && ctx.url.split('?')[0] === '/getData.jsonp') {
    // 获取jsonp的callback
    let callbackName = ctx.query.callback || 'callback'
    let returnData = {
      success: true,
      data: {
        text: 'this is a jsonp api',
        time: new Date().getTime(),
      }
    } 

    // jsonp的script字符串
    let jsonpStr = `;${callbackName}(${JSON.stringify(returnData)})`

    // 用text/javascript，让请求支持跨域获取
    ctx.type = 'text/javascript'

    // 输出jsonp字符串
    ctx.body = jsonpStr
  }  
```

### [#](#解析原理) 解析原理

*   JSONP跨域输出的数据是可执行的JavaScript代码
    *   ctx输出的类型应该是'text/javascript'
    *   ctx输出的内容为可执行的返回数据JavaScript代码字符串
*   需要有回调函数名callbackName，前端获取后会通过动态执行JavaScript代码字符，获取里面的数据

### [#](#效果截图) 效果截图

#### [#](#同域访问json请求) 同域访问JSON请求

![](https://s.poetries.top/uploads/2025/10/d095dad49867cb42.png)

#### [#](#跨域访问json请求) 跨域访问JSON请求

![](https://s.poetries.top/uploads/2025/10/f315fda2343e8416.png)

### [#](#完整demo代码) 完整demo代码

```
const Koa = require('koa')
const app = new Koa()

app.use( async ( ctx ) => {

  // 如果jsonp 的请求为GET
  if ( ctx.method === 'GET' && ctx.url.split('?')[0] === '/getData.jsonp') {

    // 获取jsonp的callback
    let callbackName = ctx.query.callback || 'callback'
    let returnData = {
      success: true,
      data: {
        text: 'this is a jsonp api',
        time: new Date().getTime(),
      }
    }

    // jsonp的script字符串
    let jsonpStr = `;${callbackName}(${JSON.stringify(returnData)})`

    // 用text/javascript，让请求支持跨域获取
    ctx.type = 'text/javascript'

    // 输出jsonp字符串
    ctx.body = jsonpStr

  } else {

    ctx.body = 'hello jsonp'

  }
})

app.listen(3000, () => {
  console.log('[demo] jsonp is starting at port 3000')
})

```

阅读全文