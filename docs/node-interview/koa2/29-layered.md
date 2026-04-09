---
title: # 分层设计
source: https://interview.poetries.top/fe-node-docs/nodejs-docs/koa2/-12.3 分层操作.html
crawled: 2026-04-09
---

# # 分层设计

> 原文: [https://interview.poetries.top/fe-node-docs/nodejs-docs/koa2/-12.3 分层操作.html](https://interview.poetries.top/fe-node-docs/nodejs-docs/koa2/-12.3 分层操作.html)

---

# [#](#分层设计) 分层设计

## [#](#后端代码目录) 后端代码目录

```
└── server
    ├── controllers # 操作层 执行服务端模板渲染，json接口返回数据，页面跳转
    │   ├── admin.js
    │   ├── index.js
    │   ├── user-info.js
    │   └── work.js
    ├── models # 数据模型层 执行数据操作
    │   └── user-Info.js
    ├── routers # 路由层 控制路由
    │   ├── admin.js
    │   ├── api.js
    │   ├── error.js
    │   ├── home.js
    │   ├── index.js
    │   └── work.js
    ├── services # 业务层 实现数据层model到操作层controller的耦合封装
    │   └── user-info.js
    └── views # 服务端模板代码
        ├── admin.ejs
        ├── error.ejs
        ├── index.ejs
        └── work.ejs
```

阅读全文