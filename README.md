# 前端知识库

系统化的前端知识体系网站，基于 VitePress 构建。

## 特性

- 🌐 **浏览器工作原理** - 渲染管线、V8引擎、事件循环、网络栈
- 📖 **基础篇** - HTML、CSS、JavaScript 核心知识
- 🚀 **进阶篇** - 性能优化、工程化、安全
- 🔍 **本地搜索** - 快速定位知识点
- 🎨 **自定义主题** - 美观的阅读和导航体验
- 🔄 **CI/CD** - 自动构建部署到 GitHub Pages / Gitee Pages
- 🕷️ **爬虫工具** - 一键保存网络文章到知识库

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 9

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

访问 http://localhost:5173 查看网站

### 构建

```bash
pnpm build
```

构建产物在 `docs/.vitepress/dist/` 目录

### 预览构建

```bash
pnpm preview
```

## 项目结构

```
.
├── docs/                          # VitePress 文档目录
│   ├── .vitepress/
│   │   ├── config.ts              # 站点配置
│   │   ├── modules.config.ts      # 模块配置
│   │   └── theme/                 # 自定义主题
│   │       ├── index.ts
│   │       ├── Layout.vue
│   │       ├── style.css
│   │       └── components/
│   │           ├── ModuleCard.vue
│   │           └── AccessGuard.vue
│   ├── index.md                   # 首页
│   ├── browser/                   # 浏览器模块
│   ├── basic/                     # 基础篇模块
│   └── advanced/                  # 进阶篇模块
├── scripts/
│   └── crawl.js                   # 爬虫脚本
├── .github/
│   └── workflows/
│       └── deploy.yml             # GitHub Actions CI/CD 配置
├── .gitee/
│   └── workflows/
│       └── deploy.yml             # Gitee Go CI/CD 配置
└── package.json
```

## 爬虫工具

将网络文章保存到知识库：

```bash
# 基本用法
node scripts/crawl.js <URL> [输出路径]

# 示例
node scripts/crawl.js https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Event_Loop browser/event-loop
```

支持网站：MDN、掘金、知乎专栏、SegmentFault、博客园等

## CI/CD 配置

### GitHub Pages 部署

1. 在 GitHub 仓库设置中启用 GitHub Pages（Source: GitHub Actions）
2. 推送代码到 main 分支，GitHub Actions 自动构建部署
3. 访问 `https://<username>.github.io/<repo-name>/`

### Gitee Pages 部署

1. 在 Gitee 仓库中开启 Gitee Pages 服务
2. 配置部署分支为 `gh-pages`
3. 在仓库设置中添加 `GITEE_TOKEN` 密钥
4. 推送代码到 master 分支自动触发部署

### 手动部署

```bash
# 构建
pnpm build

# 部署到 Gitee Pages（需要配置 gitee-pages-cli）
gitee-pages deploy -b gh-pages -d docs/.vitepress/dist
```

## 模块配置

编辑 `docs/.vitepress/modules.config.ts` 添加或修改模块：

```typescript
export const modules: ModuleConfig[] = [
  {
    id: 'browser',
    title: '浏览器工作原理',
    description: '渲染管线、V8引擎、事件循环、网络栈全解析',
    icon: '🌐',
    order: 1,
    enabled: true,
    access: 'public',
    sidebar: [
      {
        text: '渲染原理',
        items: [
          { text: '渲染管线总览', link: '/browser/rendering-pipeline' },
        ],
      },
    ],
  },
]
```

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 技术栈

- [VitePress](https://vitepress.dev/) - 静态站点生成器
- [Vue 3](https://vuejs.org/) - 渐进式 JavaScript 框架
- [pnpm](https://pnpm.io/) - 包管理器

## 许可证

MIT License
