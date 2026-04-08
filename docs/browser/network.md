# 网络协议栈

浏览器网络栈负责处理所有网络请求，从 DNS 解析到数据传输。

## 请求流程

```
输入 URL
   │
   ▼
DNS 解析 ──► TCP 连接 ──► TLS 握手（HTTPS）
   │           │              │
   ▼           ▼              ▼
发送 HTTP 请求 ──► 接收响应 ──► 渲染页面
```

## DNS 解析

```javascript
// URL: https://example.com/path

// 1. 浏览器缓存
// 2. 操作系统缓存
// 3. hosts 文件
// 4. DNS 服务器查询
//    - 递归查询：本地 DNS → 根域名 → 顶级域名 → 权威域名
```

### DNS 预解析

```html
<!-- 提前解析域名 -->
<link rel="dns-prefetch" href="//cdn.example.com">

<!-- 预建立连接 -->
<link rel="preconnect" href="https://cdn.example.com">
```

## TCP 连接

### 三次握手

```
客户端                    服务器
   │      SYN (seq=x)      │
   │ ─────────────────────>│
   │                       │
   │   SYN (seq=y, ack=x+1)│
   │ <─────────────────────│
   │                       │
   │      ACK (ack=y+1)    │
   │ ─────────────────────>│
   │                       │
   │        连接建立        │
```

### HTTP/1.1 vs HTTP/2

| 特性 | HTTP/1.1 | HTTP/2 |
|------|----------|--------|
| 连接 | 队头阻塞 | 多路复用 |
| 压缩 | 仅头部 | HPACK 头部压缩 |
| 传输 | 文本 | 二进制分帧 |
| 优先级 | 不支持 | 流优先级 |

```javascript
// HTTP/2 多路复用示意
// 一个 TCP 连接上同时传输多个请求/响应
Stream 1: Request 1 ──────────────────────> Response 1
Stream 3: Request 2 ───────> Response 2
Stream 5: Request 3 ─────> Response 3
```

## 缓存策略

### 缓存头部

```http
HTTP/1.1 200 OK
Cache-Control: max-age=31536000, immutable
ETag: "33a64df5"
Last-Modified: Wed, 21 Oct 2015 07:28:00 GMT
```

### 缓存流程

```javascript
浏览器请求
    │
    ▼
┌─────────────┐
│ 强制缓存检查？ │──否──► 协商缓存检查？
│ (Cache-Control)│         │ (ETag/Last-Modified)
└──────┬──────┘            │
       │是                 │否
       ▼                   ▼
   使用缓存              请求服务器
       │                   │
       ▼                   ▼
   返回缓存              更新缓存
```

::: tip 最佳实践
- 静态资源使用 `Cache-Control: max-age=31536000` + 文件名哈希
- HTML 文件使用 `Cache-Control: no-cache` 确保获取最新版本
:::

## 性能优化

```javascript
// 1. 资源预加载
<link rel="preload" href="critical.css" as="style">
<link rel="prefetch" href="next-page.js">

// 2. 延迟加载
<img loading="lazy" src="image.jpg">
<script defer src="app.js"></script>
<script async src="analytics.js"></script>
```
