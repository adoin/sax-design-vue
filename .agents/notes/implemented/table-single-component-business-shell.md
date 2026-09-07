---
status: implemented
kind: project-specification
updated_at: 2026-09-07
completed_at: 2026-09-07
modules:
  - packages/components/table
  - docs/components/table.md
  - docs/zh/components/table.md
supersedes: []
---

# Single-component table business shell

This focused specification extends the broader [Table component architecture](table-component-architecture.md).

## Contract

`STable` is the only public table component. It supports ordinary data tables and can add a query form, toolbar, or request proxy through `queryConfig`, `toolbarConfig`, and `proxyConfig`. Consumers do not switch to a second component when these capabilities are needed.

The shell remains absent when none of those configurations or related business slots are present. Core table props, events, slots, and exposed methods keep the same public `STable` contract in both modes.

Query form and toolbar rendering are private table implementation components. Query and proxy orchestration live in table composables. A separate public wrapper is prohibited by [separate-table-grid-wrapper.md](../prohibited/separate-table-grid-wrapper.md).

## Documentation

English and Chinese Table pages contain the business examples, API metadata, complete Vue source, and Playground sources. Navigation exposes only Table; examples describe the current public API without implementation or correction history.

## Verification

- `pnpm run typecheck`
- `pnpm run build:theme`
- `pnpm run test:docs-examples` — 2 files and 9 tests passed
- Table and TableSelect Vitest suite — 63 files and 620 tests passed
- `pnpm run docs:build` — 173 pages rendered
- Browser verification covered the Chinese query and toolbar example, complete Code source, and the shared Playground workspace.
