# 加载优化策略

页面加载速度直接影响用户体验和转化率。以下是系统化的加载优化策略。

## 资源优化

### 图片优化

```html
<!-- 响应式图片 -->
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="描述" loading="lazy">
</picture>
```

### 代码分割

```javascript
// 路由级代码分割
const Home = () => import('./views/Home.vue');
const About = () => import('./views/About.vue');

// 组件级代码分割
const Chart = defineAsyncComponent(() => import('./components/Chart.vue'));
```

## 加载策略

- **预加载关键资源**：`<link rel="preload">`
- **预解析 DNS**：`<link rel="dns-prefetch">`
- **预连接**：`<link rel="preconnect">`
- **预取**：`<link rel="prefetch">`

## 缓存策略

合理配置 HTTP 缓存头，利用 Service Worker 实现离线缓存。

::: tip 建议
使用 Lighthouse 定期进行性能审计，关注 Core Web Vitals 指标。
:::
