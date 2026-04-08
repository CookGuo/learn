# Flexbox 布局

Flexbox（弹性盒子）是 CSS3 引入的一维布局模型，特别适合处理行或列上的布局。

## 基本概念

```
┌─────────────────────────────────────┐
│           Flex Container            │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│  │Item │ │Item │ │Item │ │Item │   │
│  │  1  │ │  2  │ │  3  │ │  4  │   │
│  └─────┘ └─────┘ └─────┘ └─────┘   │
│  ←──────── Main Axis ──────────→   │
│  ↑                                 │
│ Cross                              │
│ Axis                               │
└─────────────────────────────────────┘
```

## 容器属性

```css
.container {
  display: flex;           /* 块级 flex 容器 */
  /* 或 */
  display: inline-flex;    /* 行内 flex 容器 */
  
  /* 主轴方向 */
  flex-direction: row;     /* row | row-reverse | column | column-reverse */
  
  /* 换行 */
  flex-wrap: wrap;         /* nowrap | wrap | wrap-reverse */
  
  /* 简写 */
  flex-flow: row wrap;
  
  /* 主轴对齐 */
  justify-content: center; /* flex-start | flex-end | center | space-between | space-around | space-evenly */
  
  /* 交叉轴对齐 */
  align-items: center;     /* stretch | flex-start | flex-end | center | baseline */
  
  /* 多行对齐 */
  align-content: stretch;  /* stretch | flex-start | flex-end | center | space-between | space-around */
  
  /* 间距 */
  gap: 16px;
  row-gap: 16px;
  column-gap: 16px;
}
```

## 项目属性

```css
.item {
  /* 排序 */
  order: 0;                /* 整数，默认 0 */
  
  /* 放大比例 */
  flex-grow: 0;            /* 默认 0，不放大 */
  
  /* 缩小比例 */
  flex-shrink: 1;          /* 默认 1，空间不足时缩小 */
  
  /* 基础尺寸 */
  flex-basis: auto;        /* 默认 auto */
  
  /* 简写：flex-grow flex-shrink flex-basis */
  flex: 0 1 auto;
  flex: 1;                 /* 1 1 0% */
  flex: auto;              /* 1 1 auto */
  flex: none;              /* 0 0 auto */
  
  /* 单独对齐 */
  align-self: auto;        /* auto | flex-start | flex-end | center | baseline | stretch */
}
```

## 常见布局模式

### 水平垂直居中

```html
<style>
.center-container {
  display: flex;
  justify-content: center;  /* 水平居中 */
  align-items: center;      /* 垂直居中 */
  height: 300px;
}
</style>

<div class="center-container">
  <div>完全居中</div>
</div>
```

### 等高布局

```html
<style>
.equal-height {
  display: flex;
}

.equal-height > div {
  flex: 1;
  padding: 20px;
}
</style>

<div class="equal-height">
  <div style="background: #f00;">内容少</div>
  <div style="background: #0f0;">
    内容多<br>内容多<br>内容多<br>内容多
  </div>
  <div style="background: #00f;">内容中等</div>
</div>
```

### 粘性页脚

```html
<style>
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0;
}

main {
  flex: 1;  /* 占据剩余空间 */
}
</style>

<body>
  <header>头部</header>
  <main>内容</main>
  <footer>页脚</footer>
</body>
```

### 响应式导航

```html
<style>
.nav {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.nav-item {
  flex: 1 1 auto;  /* 可伸缩，基础大小 auto */
  min-width: 120px;
  padding: 10px;
  text-align: center;
}
</style>

<nav class="nav">
  <a class="nav-item">首页</a>
  <a class="nav-item">产品</a>
  <a class="nav-item">关于</a>
  <a class="nav-item">联系</a>
</nav>
```

::: tip Flexbox vs Grid
- **Flexbox**：一维布局（行或列），适合组件级布局
- **Grid**：二维布局（行和列），适合页面级布局
两者可以结合使用！
:::
