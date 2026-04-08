# 性能指标与测量

Web 性能优化需要基于数据驱动，了解核心性能指标是优化的第一步。

## Core Web Vitals

Google 定义的三个核心性能指标：

| 指标 | 全称 | 良好标准 | 描述 |
|------|------|----------|------|
| **LCP** | Largest Contentful Paint | ≤ 2.5s | 最大内容绘制时间 |
| **FID** | First Input Delay | ≤ 100ms | 首次输入延迟 |
| **CLS** | Cumulative Layout Shift | ≤ 0.1 | 累积布局偏移 |

### LCP - 最大内容绘制

```javascript
// 使用 Performance Observer 测量 LCP
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    console.log('LCP:', entry.startTime);
    console.log('LCP Element:', entry.element);
  }
}).observe({ entryTypes: ['largest-contentful-paint'] });
```

**优化策略**：
- 优化服务器响应时间
- 预加载关键资源
- 优化图片大小和格式
- 使用 CDN

### FID/INP - 交互响应

```javascript
// 测量 FID
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    const delay = entry.processingStart - entry.startTime;
    console.log('FID:', delay);
  }
}).observe({ entryTypes: ['first-input'] });
```

**优化策略**：
- 减少主线程阻塞
- 分解长任务
- 使用 Web Workers

### CLS - 布局稳定性

```javascript
// 测量 CLS
let clsValue = 0;
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    if (!entry.hadRecentInput) {
      clsValue += entry.value;
    }
  }
  console.log('CLS:', clsValue);
}).observe({ entryTypes: ['layout-shift'] });
```

**优化策略**：
- 为图片/视频预留空间
- 避免插入未确定尺寸的内容
- 谨慎使用 Web 字体

## 其他重要指标

### TTFB - 首字节时间

```javascript
// 使用 Navigation Timing API
const navEntry = performance.getEntriesByType('navigation')[0];
const ttfb = navEntry.responseStart - navEntry.startTime;
console.log('TTFB:', ttfb);
```

### FCP - 首次内容绘制

```javascript
new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries();
  const fcp = entries[entries.length - 1];
  console.log('FCP:', fcp.startTime);
}).observe({ entryTypes: ['paint'] });
```

### TTI - 可交互时间

```javascript
// 使用 Lighthouse 或 web-vitals 库
import { getTTI } from 'web-vitals';

getTTI(console.log);
```

## 性能测量工具

### Chrome DevTools

```javascript
// 在控制台使用
// 1. Performance 面板 - 记录和分析运行时性能
// 2. Lighthouse 面板 - 生成性能报告
// 3. Network 面板 - 分析网络请求
```

### web-vitals 库

```bash
npm install web-vitals
```

```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);
  // 发送到分析服务
  navigator.sendBeacon('/analytics', body);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Real User Monitoring (RUM)

```javascript
// 收集真实用户数据
function measureWebVitals() {
  // LCP
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    analytics.track('LCP', lastEntry.startTime);
  }).observe({ entryTypes: ['largest-contentful-paint'] });
  
  // 其他指标...
}

// 页面加载完成后测量
if (document.readyState === 'complete') {
  measureWebVitals();
} else {
  window.addEventListener('load', measureWebVitals);
}
```

## 性能预算

```javascript
// 设置性能预算检查
const budget = {
  LCP: 2500,
  FID: 100,
  CLS: 0.1,
  TTI: 3500
};

function checkBudget(metrics) {
  for (const [metric, value] of Object.entries(metrics)) {
    if (value > budget[metric]) {
      console.warn(`${metric} 超出预算: ${value} > ${budget[metric]}`);
    }
  }
}
```

::: tip 优化原则
1. 测量先行 - 先确定瓶颈再优化
2. 目标导向 - 关注用户体验而非单纯的速度
3. 持续监控 - 建立性能监控系统
:::
