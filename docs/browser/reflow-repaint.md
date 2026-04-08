# 重排与重绘

重排（Reflow）和重绘（Repaint）是影响页面性能的两个关键因素。

## 概念区别

| 类型 | 触发条件 | 性能影响 |
|------|----------|----------|
| **重排** | 元素尺寸、位置变化 | 高（需重新计算布局） |
| **重绘** | 外观变化不影响布局 | 低（只需重新绘制） |

## 触发重排的操作

```javascript
// 读取布局属性（强制同步布局）
const width = element.offsetWidth;  // 触发重排
const height = element.clientHeight; // 触发重排

// 修改布局属性
element.style.width = '100px';      // 触发重排
element.style.margin = '10px';      // 触发重排

// 其他操作
element.className = 'new-class';    // 可能触发重排
document.body.appendChild(newEl);   // 触发重排
```

## 常见属性分类

### 触发重排的属性和方法

- **位置**：offsetTop, offsetLeft, offsetWidth, offsetHeight
- **尺寸**：clientWidth, clientHeight, scrollWidth, scrollHeight
- **滚动**：scrollTop, scrollLeft, getComputedStyle()
- **DOM 操作**：appendChild, removeChild, insertBefore

### 仅触发重绘的属性

```css
/* 修改这些属性只会触发重绘 */
color
background-color
border-color
visibility
box-shadow
```

## 优化策略

### 1. 批量修改 DOM

```javascript
// 不推荐：多次操作，多次重排
const el = document.getElementById('app');
el.style.width = '100px';
el.style.height = '200px';
el.style.margin = '10px';

// 推荐：使用 CSS 类批量修改
.el-style {
  width: 100px;
  height: 200px;
  margin: 10px;
}
el.className = 'el-style';

// 或：使用 cssText
el.style.cssText = 'width:100px;height:200px;margin:10px';
```

### 2. 离线操作 DOM

```javascript
// 使用 DocumentFragment
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  fragment.appendChild(li);
}
list.appendChild(fragment);  // 只触发一次重排

// 或：先隐藏再操作
list.style.display = 'none';  // 触发 1 次重排
// ... 批量修改 ...
list.style.display = 'block'; // 触发 1 次重排
```

### 3. 使用 transform 和 opacity

```css
/* 这些属性可以触发 GPU 加速，跳过布局和绘制 */
.optimized {
  transform: translateX(100px);
  transform: scale(1.5);
  opacity: 0.5;
  will-change: transform;
}
```

::: tip 最佳实践
使用 `requestAnimationFrame` 来优化动画，确保在下一帧渲染前执行。
:::
