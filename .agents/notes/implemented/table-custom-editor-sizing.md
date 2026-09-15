---
status: implemented
kind: project-specification
created_at: 2026-09-14
completed_at: 2026-09-14
modules:
  - packages/components/table
  - packages/components/textarea
  - packages/theme-chalk/src/table.scss
  - docs/.vuepress/components/table/editing-custom.vue
  - docs/.vuepress/components/table-zh/editing-custom.vue
supersedes: []
---

# Table custom-editor sizing

## Contract

Custom Table editors retain the semantics of the control selected by the application. A single-line Input keeps one line and scrolls long text internally; it does not request row growth. Multi-line values use Textarea with `auto-size`, which wraps within the cell and grows the editing row up to its configured limit.

Inside a Table editing cell, Textarea does not keep its standalone bottom margin or generic minimum field height. Its configured `minRows` and `maxRows` determine the footprint. Ordinary Table rows grow through normal layout, while virtual rows use the existing dynamic ResizeObserver measurement path because editing automatically enables dynamic row measurement.

The public custom-editor example demonstrates this distinction with an auto-sizing Textarea for the task name and Select for priority. English and Chinese rendered examples, Code source and Playground source remain synchronized and localized.

## Verification

- `pnpm exec vitest run packages/components/table/__tests__/table-edit.test.ts packages/components/textarea/__tests__/textarea.test.ts packages/components/virtual-list/__tests__/virtual-list.test.ts` — 3 files and 24 tests passed.
- `pnpm exec vitest run packages/components/table/__tests__ --pool=threads --maxWorkers=1` — 62 files and 633 tests passed.
- `pnpm run test:docs-examples` — 4 files and 12 tests passed.
- `pnpm exec eslint docs/.vuepress/components/table/editing-custom.vue docs/.vuepress/components/table-zh/editing-custom.vue --no-cache` — passed.
- `pnpm run typecheck:web` and `pnpm run build:theme` — passed.
- `pnpm run docs:build` — passed; 201 pages rendered.
- Browser verification in both locales confirmed the Textarea remains within its cell, uses `pre-wrap`, has zero editor-specific bottom margin and minimum height, and grows the row from 63.609375px to 78px for the long test value. Code and Playground contain the complete auto-sizing SFC and both previews render.
