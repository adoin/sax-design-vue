---
status: implemented
kind: project-specification
updated_at: 2026-09-20
completed_at: 2026-09-14
modules:
  - packages/components/config-provider
  - packages/hooks/use-global-config
  - packages/hooks/use-common-props
  - packages/components/table
  - packages/components/anchor/index.ts
  - packages/components/calendar/index.ts
  - packages/components/form
  - internal/build/src/tasks/types-definitions.ts
  - docs/guide/configuration.md
  - docs/zh/guide/configuration.md
supersedes: []
---

# Global component defaults

## Contract

`SConfigProvider` owns reusable application- or subtree-level defaults. Resolution order is an explicit component prop, the nearest Provider, outer Providers, then the component's built-in default. Nested Provider configuration objects merge recursively by field while arrays and scalar values replace inherited values.

Object-valued component props shallow-merge over their configured default. An explicit `false` disables a Boolean-or-object feature even when the Provider enables it, while explicit `true` enables it and retains configured option fields.

Global defaults never own instance data, controlled state, application content, slots, renderers, request functions, model-specific callbacks, validation rules, field mappings, or per-record permissions.

## Shared and component-specific defaults

- `size` applies only to components using the shared `small` / `default` / `large` scale.
- Existing `shape`, locale, time zone, date/time Now behavior, Anchor settings, namespace, z-index, and theme contracts remain intact.
- Anchor `activeStrategy` and `activeOffset` are reusable application/subtree policies. An explicit Anchor prop overrides the nearest configured field; `activeOffset` falls back to the established local `offset` when no dedicated value is supplied.
- `button`, `dialog`, `drawer`, `notification`, `pagination`, and direct `popper` usage expose only their reusable interaction and presentation policies.
- `table` accepts reusable feature configuration and presentation defaults through `TableGlobalConfig`.

## Table boundary

Eligible Table defaults are history, change-tracking enablement, validation behavior, editing behavior excluding record-specific permission callbacks, row-drag mechanics, keyboard behavior, cell-range mechanics, clipboard limits and shortcuts, find limits and shortcuts, chart limits, context-menu sizing, resizing, row-key convention, parent indicator, virtualization, multi-sort behavior, selection behavior, pagination presentation, overflow modes, header visibility, header and cell alignment, striped rows, and selection mode.

Table data, columns, virtual sources, controlled expansion/sort/filter/selection state, validation rules, renderers, row classes, record-specific permission and conversion callbacks, remote sort/filter behavior, detail loading, grouping, merging, footer aggregation, query forms, toolbars, and request proxies remain local because they depend on an instance's data or business model.

## Verification

- ConfigProvider precedence, local override, component policy, and nested recursive merge: 8 tests passed.
- Shared-size and affected interaction components: 10 files and 84 tests passed.
- Table: 62 files and 633 tests passed with one worker.
- Full `pnpm run typecheck` passed, including Web, Play, Node, Vite, Vitest, Table generic, and renderer-documentation projects.
- Targeted ESLint completed with no warnings or errors.
- `pnpm run build:theme` passed.
- `pnpm run build` passed, including module bundles, the full bundle, helpers, theme output, and declaration generation. Vue Macros still reports its existing non-fatal Table generic-resolution warnings during bundling.
- `pnpm run test:docs-examples`: 4 files and 12 tests passed.
- `pnpm run docs:build`: 201 pages rendered.
- Declaration generation uses opaque SFC implementation types for Anchor, Calendar, Form, and Form Group while their public contracts remain explicitly exported; this prevents private implementation state and oversized inferred types from blocking package publication.
- Anchor and ConfigProvider integration: 2 files and 17 tests passed. Form public-instance integration: 12 tests passed.
