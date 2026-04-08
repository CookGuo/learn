# 内容安全策略

CSP（Content Security Policy）是一种有效的 XSS 防御机制，通过白名单控制资源加载。

## 基本配置

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self';
```

## 常用指令

| 指令 | 说明 |
|------|------|
| default-src | 默认策略 |
| script-src | JavaScript 来源 |
| style-src | CSS 来源 |
| img-src | 图片来源 |

## 推荐配置

```http
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' https://trusted-cdn.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
  font-src 'self' https://fonts.gstatic.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

::: tip 建议
先在 report-only 模式下测试：
Content-Security-Policy-Report-Only: ...
:::
