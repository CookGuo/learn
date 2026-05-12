# Repository Guidelines

## Project Structure & Module Organization

This repository is a VitePress documentation site for frontend and Node.js interview knowledge. Primary content lives under `docs/` as Markdown files. Site configuration is in `docs/.vitepress/config.ts`, module and sidebar definitions are in `docs/.vitepress/modules.config.ts`, and custom Vue theme code lives in `docs/.vitepress/theme/`. Public assets are stored in `docs/public/`. Utility crawlers live in `scripts/`, including `scripts/crawl.js` for converting articles into Markdown. Generated output such as `docs/.vitepress/dist/` and cache files should not be edited directly.

## Build, Test, and Development Commands

- `pnpm install`: install dependencies. Use pnpm because the repository includes `pnpm-lock.yaml` and CI uses pnpm.
- `pnpm dev`: start the VitePress dev server at `http://localhost:5173`.
- `pnpm build`: build the production site into `docs/.vitepress/dist/`; run this before opening a PR.
- `pnpm preview`: preview the production build locally.
- `pnpm crawl -- <URL> [output-path]`: save a web article into `docs/`, for example `pnpm crawl -- https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Event_Loop browser/event-loop`.

## Coding Style & Naming Conventions

Use TypeScript, Vue 3, and Markdown patterns already present in the repo. Keep JS/TS/Vue code formatted with two-space indentation, single quotes, and no semicolons. Markdown files should use clear headings and concise sections. Follow existing file naming patterns within each module, such as numbered Markdown files (`docs/react-interview/01-preface.md`) or topic paths (`docs/browser/guide/part01/lesson01.md`). When adding a new article, also update the matching sidebar entry in `docs/.vitepress/modules.config.ts` when navigation should expose it.

## Testing Guidelines

There is no dedicated automated test suite yet. Treat `pnpm build` as the required validation step for content, config, links, and theme changes. For visual or navigation updates, also run `pnpm dev` and manually check the affected pages. Avoid committing generated directories or local cache output.

## Commit & Pull Request Guidelines

Recent history uses short Conventional Commit-style messages, especially `feat: ...`. Prefer concise commits such as `feat: add react scheduler notes` or `fix: update sidebar link`. Pull requests should describe the changed docs or theme behavior, list validation performed (`pnpm build`), link any related issue, and include screenshots for visible UI or theme changes.

## Security & Configuration Tips

Do not commit `.env*`, tokens, or local deployment credentials. GitHub Pages deployment runs from `.github/workflows/deploy.yml` on pushes to `main`, using Node 20 and pnpm 9.
