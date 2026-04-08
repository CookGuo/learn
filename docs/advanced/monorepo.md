# Monorepo 实践

Monorepo 是将多个相关项目放在同一个代码仓库中管理的模式，适合大型前端项目。

## 工具选择

| 工具 | 特点 | 适用场景 |
|------|------|----------|
| pnpm workspace | 轻量、快速 | 中小型项目 |
| Nx | 功能丰富、企业级 | 大型团队 |
| Turborepo | 缓存优化、Pipeline | 性能敏感 |
| Rush | 微软出品、严格 | 超大型项目 |

## pnpm Workspace 配置

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

```json
// package.json
{
  "name": "my-monorepo",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter app dev",
    "build": "pnpm -r run build",
    "lint": "pnpm -r run lint"
  },
  "devDependencies": {
    "@changesets/cli": "^2.0.0"
  }
}
```

## 目录结构

```
my-monorepo/
├── apps/
│   ├── web/              # 主应用
│   └── admin/            # 管理后台
├── packages/
│   ├── ui/               # UI 组件库
│   ├── utils/            # 工具函数
│   └── config/           # 共享配置
├── package.json
├── pnpm-workspace.yaml
└── turbo.json            # Turborepo 配置
```

## 包间依赖

```json
// packages/ui/package.json
{
  "name": "@myrepo/ui",
  "dependencies": {
    "@myrepo/utils": "workspace:*"
  }
}
```

```json
// apps/web/package.json
{
  "name": "@myrepo/web",
  "dependencies": {
    "@myrepo/ui": "workspace:*",
    "@myrepo/utils": "workspace:*"
  }
}
```

## Turborepo Pipeline

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false
    }
  }
}
```

## 版本管理

```bash
# 使用 Changesets 管理版本
npx changeset
npx changeset version
npx changeset publish
```

::: tip 最佳实践
- 合理划分包边界
- 统一依赖版本
- 使用 CI 自动化发布流程
:::
