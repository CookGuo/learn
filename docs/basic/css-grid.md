# Grid 布局

CSS Grid（网格布局）是首个真正的二维布局系统，可以同时处理行和列。

## 基本概念

```
┌─────┬─────┬─────┬─────┬─────┐
│  .  │  .  │  .  │  .  │  .  │  ← Grid Track (行)
├─────┼─────┼─────┼─────┼─────┤
│  .  │█████│█████│  .  │  .  │  ← Grid Cell
├─────┼█████│█████│─────┼─────┤
│  .  │█████│█████│  .  │  .  │  ← Grid Area (区域)
├─────┼─────┼─────┼─────┼─────┤
│  .  │  .  │  .  │  .  │  .  │
└─────┴─────┴─────┴─────┴─────┘
   ↑
Grid Track (列)

. = Grid Cell    █ = Grid Area
```

## 容器属性

```css
.container {
  display: grid;           /* 块级 grid */
  display: inline-grid;    /* 行内 grid */
  
  /* 定义列 */
  grid-template-columns: 200px 200px 200px;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-columns: repeat(3, 1fr);
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  
  /* 定义行 */
  grid-template-rows: 100px auto 100px;
  
  /* 间距 */
  gap: 20px;
  row-gap: 20px;
  column-gap: 20px;
  
  /* 区域命名 */
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  
  /* 对齐 */
  justify-items: stretch;  /* 单元格内水平对齐 */
  align-items: stretch;    /* 单元格内垂直对齐 */
  place-items: center;     /* 简写 */
  
  justify-content: start;  /* 网格水平对齐 */
  align-content: start;    /* 网格垂直对齐 */
}
```

## 项目属性

```css
.item {
  /* 跨列 */
  grid-column-start: 1;
  grid-column-end: 3;
  grid-column: 1 / 3;      /* 简写 */
  grid-column: span 2;     /* 跨 2 列 */
  
  /* 跨行 */
  grid-row: 1 / 3;
  
  /* 区域定位 */
  grid-area: header;
  grid-area: 1 / 1 / 3 / 4;  /* row-start / col-start / row-end / col-end */
  
  /* 自对齐 */
  justify-self: center;
  align-self: center;
}
```

## 常见布局

### 圣杯布局

```html
<style>
.layout {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  gap: 10px;
  min-height: 100vh;
}

.header {
  grid-column: 1 / -1;
  background: #f0f0f0;
  padding: 20px;
}

.footer {
  grid-column: 1 / -1;
  background: #f0f0f0;
  padding: 20px;
}

.main {
  background: #fff;
  padding: 20px;
}

.sidebar {
  background: #e0e0e0;
  padding: 20px;
}
</style>

<div class="layout">
  <header class="header">Header</header>
  <aside class="sidebar">Left</aside>
  <main class="main">Main Content</main>
  <aside class="sidebar">Right</aside>
  <footer class="footer">Footer</footer>
</div>
```

### 响应式网格

```html
<style>
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>

<div class="responsive-grid">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
  <div class="card">Card 4</div>
  <div class="card">Card 5</div>
</div>
```

### 杂志布局

```html
<style>
.magazine {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 200px);
  gap: 10px;
}

.featured {
  grid-column: span 2;
  grid-row: span 2;
  background: #ff6b6b;
}

.normal {
  background: #4ecdc4;
}
</style>

<div class="magazine">
  <div class="featured">Featured</div>
  <div class="normal">1</div>
  <div class="normal">2</div>
  <div class="normal">3</div>
  <div class="normal">4</div>
  <div class="normal">5</div>
</div>
```

::: tip 学习建议
1. 使用 [CSS Grid Generator](https://cssgrid-generator.netlify.app/) 可视化生成代码
2. 配合 Firefox DevTools 的 Grid 调试功能学习
3. Grid 适合整体布局，Flexbox 适合组件内部对齐
:::
