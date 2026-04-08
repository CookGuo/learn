# 渲染管线总览

浏览器将 HTML、CSS 和 JavaScript 转换为屏幕上的像素，这个过程称为**渲染管线**（Rendering Pipeline）。

## 渲染流程

```
HTML ──► DOM Tree ──┐
                    ├──► Render Tree ──► Layout ──► Paint ──► Composite
CSS ───► CSSOM ─────┘
```

### 1. 解析 HTML 构建 DOM

浏览器从上到下解析 HTML，构建 DOM（Document Object Model）树：

```html
<!DOCTYPE html>
<html>
<head>
  <title>示例</title>
</head>
<body>
  <div class="container">
    <p>Hello World</p>
  </div>
</body>
</html>
```

对应的 DOM 树：

```
Document
  └── html
      ├── head
      │   └── title
      │       └── "示例"
      └── body
          └── div.container
              └── p
                  └── "Hello World"
```

### 2. 解析 CSS 构建 CSSOM

CSS 对象模型（CSSOM）是 CSS 的内存表示。

### 3. 合成渲染树

DOM 和 CSSOM 结合形成渲染树，只包含可见元素。

::: warning 注意
`display: none` 的元素不会进入渲染树，`visibility: hidden` 会保留位置但不可见。
:::

### 4. 布局（Layout）

计算每个元素的位置和尺寸，也称为重排（Reflow）。

### 5. 绘制（Paint）

将渲染树转换为屏幕上的实际像素。

### 6. 合成（Composite）

将多个图层合成为最终页面。

## 关键渲染路径优化

1. **减少关键资源数量** - 延迟加载非关键 CSS
2. **压缩资源大小** - 启用 Gzip/Brotli
3. **优化加载顺序** - CSS 放头部，JS 放底部或异步加载

## 参考

- [Inside look at modern web browser](https://developers.google.com/web/updates/2018/09/inside-browser-part1)
