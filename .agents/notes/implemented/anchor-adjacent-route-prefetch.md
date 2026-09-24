---
status: implemented
kind: project-specification
created_at: 2026-09-21
completed_at: 2026-09-21
modules:
  - packages/components/anchor
  - packages/components/config-provider
  - docs/.vuepress/theme
  - docs/components/anchor.md
  - docs/zh/components/anchor.md
supersedes: []
---

# Anchor adjacent-route prefetch

## Contract

Anchor route-module prefetching is opt-in. The local `routePrefetch` prop overrides the global `anchor.routePrefetch` setting, and the built-in default is `false` so existing applications never gain speculative network work implicitly.

Prefetching depends on the optional `AnchorRouterAdapter.prefetch(href)` method. Anchor owns only route-sequence selection and idle scheduling; the adapter owns framework-specific route-module loading. A prefetch must not navigate, mount the target component, or implicitly load page data.

When enabled, Anchor schedules the eligible previous and next route after the current route context settles. It canonicalizes and deduplicates paths, treats the mounted current route as already loaded, cancels stale idle work when route context changes or the component unmounts, and allows a rejected prefetch to be retried later.

The documentation site's Table outline enables local route prefetching and adapts VuePress `useRoutes()` page loaders. The same loader invocation requests source modules through Vite in development and route chunks in production. Non-Table documentation outlines keep prefetching disabled.

## Verification

- `pnpm exec vitest run packages/components/anchor/__tests__/anchor.test.ts --pool=threads --maxWorkers=1` — 1 file and 19 tests passed, including default-off, adjacent-only, route-change deduplication, global inheritance, and local disable coverage.
- Targeted ESLint for the changed Anchor, Config Provider, test, and documentation-theme files — passed.
- `pnpm run test:docs-examples` — 4 files and 14 tests passed.
- `pnpm run docs:build` — passed; 201 pages rendered through the production Vite build.
- `pnpm run typecheck:web` reached only the pre-existing `packages/components/table/src/table-find-panel.vue:633` callback mismatch from unrelated unstaged Table work; no changed Anchor file reported an error.
