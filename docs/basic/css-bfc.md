# BFC 与格式化上下文

BFC（Block Formatting Context，块级格式化上下文）是 CSS 中一个重要的概念，理解它有助于解决许多布局问题。

## 什么是 BFC

BFC 是一个独立的渲染区域，内部的元素布局不会影响外部，反之亦然。

```css
/* 创建 BFC 的方式 */
.container {
  /* 以下任一属性都可以创建 BFC */
  overflow: hidden;
  overflow: auto;
  display: flow-root;  /* 推荐，无副作用 */
  display: inline-block;
  position: absolute;
  position: fixed;
  float: left;
}
```

## BFC 的特性

### 1. 内部浮动被包含

```html
<style>
.float {
  float: left;
  width: 100px;
  height: 100px;
  background: #f00;
}

/* 问题：父元素高度塌陷 */
.parent1 {
  border: 2px solid #000;
}

/* 解决：创建 BFC */
.parent2 {
  border: 2px solid #000;
  overflow: hidden;  /* 创建 BFC */
}
</style>

<!-- 高度塌陷 -->
<div class="parent1">
  <div class="float"></div>
</div>

<!-- 正常包含 -->
<div class="parent2">
  <div class="float"></div>
</div>
```

### 2. 外边距不重叠

```html
<style>
.box {
  width: 100px;
  height: 50px;
  margin: 20px 0;
  background: #f00;
}

/* 外边距重叠：间距为 20px */
.normal .box {
  /* 默认行为 */
}

/* 外边距不重叠：间距为 40px */
.bfc {
  overflow: hidden;
}
</style>

<div class="normal">
  <div class="box"></div>
  <div class="box"></div>
</div>

<div class="bfc">
  <div class="box"></div>
</div>
<div class="bfc">
  <div class="box"></div>
</div>
```

### 3. 阻止元素被浮动覆盖

```html
<style>
.float {
  float: left;
  width: 100px;
  height: 100px;
  background: #f00;
}

/* 被浮动覆盖 */
.normal {
  width: 200px;
  height: 100px;
  background: #0f0;
}

/* 自适应剩余空间 */
.bfc {
  overflow: hidden;
  height: 100px;
  background: #0f0;
}
</style>

<div class="float"></div>
<div class="normal">被覆盖了</div>

<div class="float"></div>
<div class="bfc">自适应布局</div>
```

## 实际应用场景

### 清除浮动（现代方式）

```css
.clearfix {
  display: flow-root;  /* 创建 BFC，包含浮动 */
}
```

### 两栏自适应布局

```html
<style>
.sidebar {
  float: left;
  width: 200px;
  background: #f0f0f0;
}

.main {
  overflow: hidden;  /* 创建 BFC，自适应剩余空间 */
  background: #fff;
}
</style>

<div class="sidebar">侧边栏</div>
<div class="main">主内容区</div>
```

### 防止 margin 穿透

```html
<style>
.wrapper {
  overflow: hidden;  /* 创建 BFC */
}

.child {
  margin-top: 30px;  /* 不会穿透到 wrapper 外部 */
}
</style>

<div class="wrapper">
  <div class="child">内容</div>
</div>
```

::: tip 最佳实践
- 优先使用 `display: flow-root` 创建 BFC，无副作用
- 避免使用 `overflow: hidden` 可能带来的内容裁剪问题
- BFC 是解决布局问题的强大工具，但不是万能的
:::
