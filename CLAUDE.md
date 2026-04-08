# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a VitePress-based frontend knowledge base documentation site. Content is organized into modules (browser, basic, advanced), each with its own markdown files.

## Commands

```bash
pnpm dev      # Start dev server at http://localhost:5173
pnpm build    # Build production assets to docs/.vitepress/dist/
pnpm preview  # Preview production build locally
```

### Crawl Script

Save web articles to the knowledge base:

```bash
node scripts/crawl.js <URL> [output-path]
# Example: node scripts/crawl.js https://developer.mozilla.org/ browser/event-loop
```

## Architecture

### Module System

The site uses a module-based architecture configured in `docs/.vitepress/modules.config.ts`. Each module defines:
- `id` - URL path segment
- `title`, `icon`, `order` - navigation display
- `enabled` - whether the module is accessible
- `sidebar` - left navigation structure

To add a new article, add it to the appropriate module's sidebar array.

### Theme Components

Custom Vue 3 components in `docs/.vitepress/theme/`:
- `ModuleCard.vue` - renders module cards on homepage
- `AccessGuard.vue` - handles access control (for future token-based modules)

### Content Structure

```
docs/
├── index.md                    # Homepage
├── browser/                    # Browser internals module
├── basic/                      # HTML/CSS/JS fundamentals module
└── advanced/                   # Performance, engineering, security module
```

## Configuration

- `docs/.vitepress/config.ts` - VitePress site config (nav, sidebar, SEO)
- `docs/.vitepress/modules.config.ts` - Module definitions and sidebar structure
