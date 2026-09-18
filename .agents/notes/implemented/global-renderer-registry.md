---
status: implemented
kind: project-specification
updated_at: 2026-09-11
completed_at: 2026-09-08
modules:
  - packages/components/form/src/renderer.ts
  - packages/components/table/src/table-renderer.ts
  - packages/components/table/src/table-header-cell.vue
  - packages/components/button/src/renderer-buttons.vue
  - docs/.vuepress/app/component-categories.ts
  - docs/.vuepress/app/search.ts
  - docs/.vuepress/app/search.zh.ts
  - docs/.vuepress/theme/global-components/CodeVariants.vue
  - docs/.vuepress/example-sources/renderer*/status-*
  - docs/components/form.md
  - docs/components/renderer.md
  - docs/components/table.md
  - docs/zh/components/form.md
  - docs/zh/components/renderer.md
  - docs/zh/components/table.md
  - tsconfig.renderer-docs.json
---

# Global renderer registry

## Contract

`renderer` is the shared global registry used by Form and Table. `formRenderer` and `tableRenderer` reference the same store for compatibility. Consumers can extend it with `renderer.add(name, definition)` or `renderer.mixin(definitions)` and can inspect or remove entries with `get`, `has`, `entries`, and `delete`.

A renderer definition can implement `renderDefault`, `renderEdit`, `renderFormItem`, `renderFilter`, and `renderToolbar`. Form calls `renderFormItem`; Table resolves `renderDefault` for body cells, `renderEdit` for editors, `renderFilter` for filter panels, and `renderToolbar` for left or right toolbar entries. Table-local `renderers` continue to override a global entry with the same name.

`defineTableRenderer<Row, QueryForm>()` preserves the Table and query-form types across those global stages before registration. It is a type helper only; the returned definition is stored in the same shared registry and does not create a table-specific global store.

## Built-ins

The registry includes `$input`, `$textarea`, `$date`, `$dateRange`, `$time`, `$timePicker`, `$select`, `$radio`, `$checkbox`, `$checkboxGroup`, `$treeSelect`, `$cascader`, `$rate`, `$slider`, `$switch`, `$verCode`, and `$buttons`. Input renderers implement all four renderer methods. `$treeSelect` uses `STableSelect` with tree mode as its control surface. When Table invokes `renderEdit`, input-surface built-ins (`$input`, `$textarea`, date and time controls, `$select`, `$treeSelect`, `$cascader`, and `$verCode`) receive `shape: 'square'` by default; explicit renderer props override that default, and Form and Table filter rendering retain their normal shape resolution.

`$buttons` accepts action records through `options`. `props.maxVisible` keeps a chosen number inline and moves remaining actions into a shared `SPopper`; `props.trigger` accepts `click` or `hover`. Action state may be static or derived from renderer context. In Form, action codes `submit` and `reset` use the current Form methods when no explicit event handler is supplied. Table registers `button`, `$refresh`, `$columnConfig`, and `$find` for toolbar use. `button` accepts a direct action or child actions through `props`; `$columnConfig` mounts `STableColumnConfig`, while `$find` mounts the find-and-replace trigger and panel against the current Table context.

## Table filtering

`TableColumn.filterRender` selects a renderer by name and forwards `props`, `attrs`, `options`, and `events`. A column filter slot still has precedence. Renderer changes update the draft only; the existing confirm/reset actions retain ownership of applying or discarding filter state, and `filterMethod` retains ownership of row matching.

## Documentation adoption

Configuration-focused Form, FormGroup, Table query, remote query, primary editing, filtering, and operation-column examples use the built-in renderer names. Reusable custom definitions are registered once from the documentation application entry; example components only reference their names. Tree, virtual Table, TableSelect, and other one-off presentation examples use scoped slots instead of local renderer maps. Examples dedicated to custom editor slots or raw component composition retain those APIs so each extension point remains independently documented.

The dedicated Renderer page is the public source for global registration, usage locations, callback contracts, and built-in component mappings. Form and Table documentation link to that page and keep only context-specific renderer behavior beside their examples.

`RendererOptions<Model>` is the canonical shared configuration type used by Form, Table body cells, editors, filters, and toolbars. The former `FormItemRenderOptions<Model>` name remains as a deprecated compatibility alias. Renderer registration documentation presents TSX as the preferred syntax and provides an equivalent `h()` variant through an accessible in-page switch. Both variants explicitly annotate `RendererOptions`, the stage-specific Params type, and `VNodeChild` for every callback. The contract section publishes the complete `RendererOptions` structure and lists the fields available on each Params object without introducing a separate “stage-specific context” concept. Localized source modules are never executed by documentation components and are independently type-checked by `tsconfig.renderer-docs.json`.

## Verification

- Registry tests cover every built-in method and additional global registration.
- The Table suite passes: 63 files and 635 tests; focused Form renderer coverage also passes.
- Documentation example, renderer-source, and API metadata tests pass: 10 tests.
- Type checks for web, Vitest, and the isolated TSX/`h()` renderer documentation sources pass.
- The complete package build emits generic `RendererOptions<Model>` declarations and the deprecated `FormItemRenderOptions<Model>` compatibility alias in the ES, lib, and consolidated type outputs.
- The 201-page production documentation build passes, including both localized Renderer pages.
- Browser verification covers `$input` filter rendering, `$buttons` operation cells, Table left/right toolbar regions, `button`, `$refresh`, `$columnConfig`, the teleported overflow menu, Form `$buttons` validation, English anchor values in the Chinese documentation, and the Renderer page's default TSX view, `h()` switch, and stage-specific contract types.
