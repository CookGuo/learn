---
layout: home

hero:
  name: 前端知识库
  text: 系统化的前端知识体系
  tagline: 从基础到进阶，从原理到实践，构建完整的前端技能树
  image:
    src: /logo.svg
    alt: Frontend Knowledge
  actions:
    - theme: brand
      text: 开始学习
      link: /browser/
    - theme: alt
      text: 在 GitHub 上查看
      link: https://github.com/CookGuo/learn

features:
  - icon: 🌐
    title: 浏览器工作原理
    details: 深入理解浏览器渲染管线、V8引擎、事件循环和网络栈，掌握前端性能优化的底层逻辑。
    link: /browser/
  - icon: 📖
    title: 基础篇
    details: 系统学习 HTML、CSS、JavaScript 核心知识，夯实前端开发基础，提升代码质量。
    link: /basic/
  - icon: 🚀
    title: 进阶篇
    details: 探索性能优化、工程化实践、安全防护等高级话题，成为专业的前端工程师。
    link: /advanced/
---

<script setup>
import { modules } from './.vitepress/modules.config'
import ModuleCard from './.vitepress/theme/components/ModuleCard.vue'
</script>

## 📚 模块导航

<div class="module-grid">
  <ModuleCard 
    v-for="mod in modules.filter(m => m.enabled).sort((a, b) => a.order - b.order)" 
    :key="mod.id" 
    :module="mod" 
  />
</div>

## 🎯 学习目标

本知识库旨在帮助前端开发者：

1. **建立知识体系** - 从零散的知识点中梳理出完整的前端知识图谱
2. **深入原理** - 不仅知其然，更要知其所以然
3. **实践导向** - 每个知识点都配有实际案例和最佳实践
4. **持续更新** - 跟随前端技术发展，不断更新内容

## 🛠️ 技术栈

- [VitePress](https://vitepress.dev/) - 静态站点生成器
- [Vue 3](https://vuejs.org/) - 渐进式 JavaScript 框架
- [pnpm](https://pnpm.io/) - 高效的包管理器

## 🤝 参与贡献

欢迎提交 Issue 和 Pull Request 来帮助改进这个知识库！

---

<div align="center">

**Made with ❤️ by Frontend Developers**

</div>
