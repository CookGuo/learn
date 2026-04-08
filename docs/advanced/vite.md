# Vite 原理

Vite 是下一代前端构建工具，利用浏览器原生 ES Module 支持实现极速的开发体验。

## 核心原理

### 开发模式

Vite 利用浏览器原生 ESM 支持，实现按需编译和快速冷启动。

### 生产构建

使用 Rollup 进行代码打包和优化。

## 配置示例

```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
});
```

::: tip 建议
Vite 适合新项目，老项目迁移需要评估兼容性。
:::
