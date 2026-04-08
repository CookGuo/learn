# 语义化与无障碍

语义化 HTML 不仅有助于 SEO，还能提升网页的可访问性（Accessibility）。

## 什么是语义化

语义化是指使用恰当的 HTML 标签来描述内容的含义，而不仅仅是外观。

```html
<!-- 不推荐：无语义 -->
<div class="header">
  <div class="nav">
    <div class="nav-item">首页</div>
  </div>
</div>

<!-- 推荐：语义化 -->
<header>
  <nav>
    <a href="/">首页</a>
  </nav>
</header>
```

## HTML5 语义化标签

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>语义化示例</title>
</head>
<body>
  <header>
    <h1>网站标题</h1>
    <nav>
      <ul>
        <li><a href="#home">首页</a></li>
        <li><a href="#about">关于</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <header>
        <h2>文章标题</h2>
        <time datetime="2024-01-15">2024年1月15日</time>
      </header>
      <section>
        <h3>章节标题</h3>
        <p>内容段落...</p>
      </section>
    </article>

    <aside>
      <h3>相关链接</h3>
      <ul>
        <li><a href="#">链接1</a></li>
      </ul>
    </aside>
  </main>

  <footer>
    <p>&copy; 2024 版权所有</p>
  </footer>
</body>
</html>
```

### 常用语义化标签

| 标签 | 用途 |
|------|------|
| `<header>` | 页面或区块的头部 |
| `<nav>` | 导航链接区域 |
| `<main>` | 页面主要内容（每页唯一） |
| `<article>` | 独立的文章内容 |
| `<section>` | 文档中的节或区块 |
| `<aside>` | 侧边栏内容 |
| `<footer>` | 页面或区块的底部 |
| `<figure>` | 独立的流内容（如图表） |
| `<figcaption>` | `<figure>` 的标题 |

## 无障碍（A11y）

### ARIA 属性

```html
<!-- 为屏幕阅读器提供额外信息 -->
<button aria-label="关闭对话框" onclick="closeDialog()">
  <span aria-hidden="true">&times;</span>
</button>

<!-- 定义 landmark 角色 -->
<nav aria-label="主导航">
  <!-- 导航内容 -->
</nav>

<!-- 动态内容更新 -->
<div role="status" aria-live="polite">
  操作成功
</div>
```

### 表单可访问性

```html
<form>
  <div class="form-group">
    <label for="email">邮箱地址</label>
    <input 
      type="email" 
      id="email" 
      name="email"
      required
      aria-required="true"
      aria-describedby="email-error"
    >
    <span id="email-error" class="error" role="alert"></span>
  </div>
  
  <fieldset>
    <legend>选择订阅类型</legend>
    <label>
      <input type="radio" name="subscribe" value="daily">
      每日推送
    </label>
    <label>
      <input type="radio" name="subscribe" value="weekly">
      每周推送
    </label>
  </fieldset>
</form>
```

::: tip 可访问性检查清单
- [ ] 所有图片都有 `alt` 属性
- [ ] 表单元素都有关联的 `<label>`
- [ ] 颜色对比度符合 WCAG 标准
- [ ] 键盘可完全操作
- [ ] 使用语义化 HTML 标签
:::
