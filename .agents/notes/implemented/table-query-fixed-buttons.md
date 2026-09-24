---
status: implemented
kind: project-specification
created_at: 2026-09-21
completed_at: 2026-09-21
modules:
  - packages/components/table/src/table-business.ts
  - packages/components/table/src/table-query-form.vue
  - packages/components/table/src/table.vue
  - packages/components/table/src/table-global-config.ts
  - packages/theme-chalk/src/table.scss
  - docs/components/table/query-forms-and-request-proxy.md
  - docs/zh/components/table/query-forms-and-request-proxy.md
supersedes: []
---

# Table query fixed buttons

## Contract

`TableQueryConfig.fixedButtons` is an ordered array of `submit`, `reset`, and `more`. The local default is `['submit', 'reset']`. `showActions: false` remains a deprecated compatibility alias for an empty list when `fixedButtons` is omitted.

`more` appears only when the configured Form items contain `visible: false`. It toggles those items without mutating the consumer's item definitions. Nested hidden items participate recursively. The custom `query-actions` slot receives the Table API, `busy`, `expanded`, `hasMore`, and `toggleMore()`; `fixedButtons: []` removes all built-ins while retaining the slot's fixed region.

`SConfigProvider.table.queryConfig.fixedButtons` supplies a reusable default only to Table instances that locally enable `queryConfig`. A global query-button default must not create an empty query form on unrelated tables. A local array, including `[]`, replaces the global array.

The fixed action region is a separate responsive grid track. On a wide query surface it preserves max-content width at the right while top-level query items auto-fit and share the remaining track. When the query container narrows below 560px, actions move to a separate row and remain right-aligned. The action region is bottom-aligned with the final field row and never shrinks its buttons to make fields fit.

Query reset continues to use the SForm baseline: each field deep-clones its model value when first mounted. `resetQuery()` restores those values, clears validation, requests page one, and emits a reset query snapshot. Table does not add a separate query `defaultValue` contract.

## Verification

- Table business, proxy, and opt-in suites — 3 files and 39 tests passed.
- Coverage includes button ordering, hidden-item expansion and collapse, reset after collapse, global defaults without global enablement, local empty-array override, and custom actions.
- Runtime Chromium verification confirmed a 764px query surface reserves a 203.8px fixed action track at the right and gives the remaining 548.2px to fields; at 464px the action region moves below the fields and remains flush right.
- `pnpm run build:theme` — passed.
- Targeted ESLint — passed.
- `pnpm run test:docs-examples` — 4 files and 14 tests passed.
- `pnpm run docs:build` — passed; 201 pages rendered.
- `pnpm run typecheck:web` reached only the pre-existing `packages/components/table/src/table-find-panel.vue:633` callback mismatch from unrelated unstaged work.
