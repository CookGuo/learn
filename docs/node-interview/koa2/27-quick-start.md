---
title: # 项目demo
source: https://interview.poetries.top/fe-node-docs/nodejs-docs/koa2/-12.1 快速启动.html
crawled: 2026-04-09
---

# # 项目demo

> 原文: [https://interview.poetries.top/fe-node-docs/nodejs-docs/koa2/-12.1 快速启动.html](https://interview.poetries.top/fe-node-docs/nodejs-docs/koa2/-12.1 快速启动.html)

---

# [#](#项目demo) 项目demo

## [#](#快速启动) 快速启动

### [#](#demo地址) demo地址

[https://github.com/poetries/daily-code-practice/tree/master/node/koa/koa2-demo/project/ (opens new window)](https://github.com/poetries/daily-code-practice/tree/master/node/koa/koa2-demo/project/)

### [#](#环境准备) 环境准备

### [#](#初始化数据库) 初始化数据库

*   安装MySQL5.6以上版本
*   创建数据库koa\_demo

```
create database koa_demo;
```

*   配置项目config.js

[https://github.com/poetries/daily-code-practice/tree/master/node/koa/koa2-demo/project/ (opens new window)](https://github.com/poetries/daily-code-practice/tree/master/node/koa/koa2-demo/project/)

```
const config = {
  // 启动端口
  port: 3001,

  // 数据库配置
  database: {
    DATABASE: 'koa_demo',
    USERNAME: 'root',
    PASSWORD: 'abc123',
    PORT: '3306',
    HOST: 'localhost'
  }
}

module.exports = config
```

### [#](#启动脚本) 启动脚本

```
# 安装淘宝镜像cnpm
npm install -g cnpm --registry=https://registry.npm.taobao.org

# 安装依赖
cnpm install

# 数据建库初始化
npm run init_sql

# 编译react.js源码
npm run start_static

# 启动服务
npm run start_server 
```

### [#](#访问项目demo) 访问项目demo

[http://localhost:3001/admin (opens new window)](http://localhost:3001/admin)

![](https://s.poetries.top/uploads/2025/10/4daf31231ba45cf4.png)

阅读全文