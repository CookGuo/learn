---
title: # POST请求参数获取
source: https://interview.poetries.top/fe-node-docs/nodejs-docs/koa2/-3.2 POST请求数据获取.html
crawled: 2026-04-09
---

# # POST请求参数获取

> 原文: [https://interview.poetries.top/fe-node-docs/nodejs-docs/koa2/-3.2 POST请求数据获取.html](https://interview.poetries.top/fe-node-docs/nodejs-docs/koa2/-3.2 POST请求数据获取.html)

---

# [#](#post请求参数获取) POST请求参数获取

## [#](#原理) 原理

对于POST请求的处理，koa2没有封装获取参数的方法，需要通过解析上下文context中的原生node.js请求对象req，将POST表单数据解析成query string（例如：`a=1&b=2&c=3`），再将query string 解析成JSON格式（例如：`{"a":"1", "b":"2", "c":"3"}`）

> 注意：ctx.request是context经过封装的请求对象，ctx.req是context提供的node.js原生HTTP请求对象，同理ctx.response是context经过封装的响应对象，ctx.res是context提供的node.js原生HTTP响应对象。

> 具体koa2 API文档可见 [https://github.com/koajs/koa/blob/master/docs/api/context.md#ctxreq (opens new window)](https://github.com/koajs/koa/blob/master/docs/api/context.md#ctxreq)

### [#](#解析出post请求上下文中的表单数据) 解析出POST请求上下文中的表单数据

demo源码

[https://github.com/poetries/daily-code-practice/tree/master/node/koa/koa2-demo/request/post.js (opens new window)](https://github.com/poetries/daily-code-practice/tree/master/node/koa/koa2-demo/request/post.js)

```
// 解析上下文里node原生请求的POST参数
function parsePostData( ctx ) {
  return new Promise((resolve, reject) => {
    try {
      let postdata = "";
      ctx.req.addListener('data', (data) => {
        postdata += data
      })
      ctx.req.addListener("end",function(){
        let parseData = parseQueryStr( postdata )
        resolve( parseData )
      })
    } catch ( err ) {
      reject(err)
    }
  })
}

// 将POST请求参数字符串解析成JSON
function parseQueryStr( queryStr ) {
  let queryData = {}
  let queryStrList = queryStr.split('&')
  console.log( queryStrList )
  for (  let [ index, queryStr ] of queryStrList.entries()  ) {
    let itemList = queryStr.split('=')
    queryData[ itemList[0] ] = decodeURIComponent(itemList[1])
  }
  return queryData
}
```

## [#](#举个例子) 举个例子

源码在 /demos/request/post.js中

### [#](#例子代码) 例子代码

```
const Koa = require('koa')
const app = new Koa()

app.use( async ( ctx ) => {

  if ( ctx.url === '/' && ctx.method === 'GET' ) {
    // 当GET请求时候返回表单页面
    let html = `
      <h1>koa2 request post demo</h1>
      <form method="POST" action="/">
        <p>userName</p>
        <input name="userName" /><br/>
        <p>nickName</p>
        <input name="nickName" /><br/>
        <p>email</p>
        <input name="email" /><br/>
        <button type="submit">submit</button>
      </form>
    `
    ctx.body = html
  } else if ( ctx.url === '/' && ctx.method === 'POST' ) {
    // 当POST请求的时候，解析POST表单里的数据，并显示出来
    let postData = await parsePostData( ctx )
    ctx.body = postData
  } else {
    // 其他请求显示404
    ctx.body = '<h1>404！！！ o(╯□╰)o</h1>'
  }
})

// 解析上下文里node原生请求的POST参数
function parsePostData( ctx ) {
  return new Promise((resolve, reject) => {
    try {
      let postdata = "";
      ctx.req.addListener('data', (data) => {
        postdata += data
      })
      ctx.req.addListener("end",function(){
        let parseData = parseQueryStr( postdata )
        resolve( parseData )
      })
    } catch ( err ) {
      reject(err)
    }
  })
}

// 将POST请求参数字符串解析成JSON
function parseQueryStr( queryStr ) {
  let queryData = {}
  let queryStrList = queryStr.split('&')
  console.log( queryStrList )
  for (  let [ index, queryStr ] of queryStrList.entries()  ) {
    let itemList = queryStr.split('=')
    queryData[ itemList[0] ] = decodeURIComponent(itemList[1])
  }
  return queryData
}

app.listen(3000, () => {
  console.log('[demo] request post is starting at port 3000')
})

```

### [#](#启动例子) 启动例子

```
node post.js
```

### [#](#访问页面) 访问页面

![](https://s.poetries.top/uploads/2025/10/df242e0c94c34bf7.png)

### [#](#提交表单发起post请求结果显示) 提交表单发起POST请求结果显示

![](https://s.poetries.top/uploads/2025/10/eef0b111d107b431.png)

阅读全文