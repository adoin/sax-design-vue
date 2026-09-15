---
status: implemented
kind: project-specification
updated_at: 2026-09-10
completed_at: 2026-09-10
modules:
  - packages/components/types.ts
  - packages/components/form/src/form.ts
  - packages/components/form/src/renderer.ts
  - packages/components/table/src/table.ts
  - packages/components/table/src/table-business.ts
  - packages/components/table/src/table-renderer.ts
  - packages/components/table/index.ts
  - type-tests/table-generic.ts
  - type-tests/table-generic.vue
  - docs/components/table.md
  - docs/zh/components/table.md
---

# Table generic type chain

## Public entry

`SaxGridSetting<Row, QueryForm>` is the canonical type for a computed or plain configuration object passed to `STable` with `v-bind`. `Row` and `QueryForm` accept ordinary generated TypeScript interfaces without requiring an index signature. When a consumer omits either type argument, the public `Recordable<T = any>` dictionary is the open fallback.

`Row` flows through data, columns, field paths, row keys, sorting, filters, selection, tree loading, grouping, aggregates, footers, editing, validation, changes, row dragging, context menus, merging, local renderers, listener props, scoped slots, proxy results, toolbar contexts, and exposed methods. `QueryForm` flows through Form models, items and renderer events, query contexts, toolbar contexts, proxy query/save/delete requests, listener props, slots, and exposed query methods.

Concrete field names use `FieldPath<Row>` or `FieldPath<QueryForm>`. It validates top-level fields and paths through two nested object levels while arrays and other leaf values remain terminal. Dynamic `Recordable` models continue accepting arbitrary string paths. This bounded path type keeps editor and declaration-generation performance predictable.

## Vue and renderer integration

The exported `STable` value carries a generic Vue component signature. Passing `computed<SaxGridSetting<User, UserQueryForm>>()` through `v-bind` infers the same types in named Table slots without requiring a second runtime component or wrapper. `TableInstance<Row, QueryForm>`, `TableExposes<Row, QueryForm>`, `TableEmitFn<Row, QueryForm>`, and `TableSlots<Row, QueryForm>` provide the corresponding imperative and explicit annotation paths.

`defineTableRenderer<Row, QueryForm>()` types all stages of a reusable global renderer before the result is added to the shared `renderer` registry. It exposes typed rows and drafts for display/editing, the query model for Form items, typed columns for filters, and typed Table/query context for toolbars.

## Verification

- Dedicated TypeScript and Vue template contracts cover a plain `interface User`, a separate query interface, nested fields, columns, local and global renderers, aggregates, tree callbacks, query and proxy adapters, toolbar contexts, listener props, scoped slots, emitted events, and instance methods. Expected-error cases prove that invalid rows and fields do not degrade to `any`.
- `pnpm run typecheck:table-types` and `pnpm run typecheck:web` pass. After bounding field paths, each completes in about 18 seconds in the verification environment.
- The Table and Form behavior suites cover 63 files and 642 tests. Three virtualized tests that exceeded their five-second limit under the first parallel run pass when rerun serially; all assertions pass.
- Documentation source and metadata checks pass: 2 files and 9 tests. The 175-page VuePress production build passes.
- The complete package build passes, and final declaration generation exposes `Recordable`, `FieldPath`, `SaxGridSetting`, the generic `STable`, `TableEmitFn`, `TableInstance`, proxy types, and `defineTableRenderer`.
