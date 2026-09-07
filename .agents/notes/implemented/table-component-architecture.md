---
status: implemented
kind: project-specification
updated_at: 2026-09-07
completed_at: 2026-09-07
modules:
  - packages/components/table
  - packages/components/table-select
  - packages/theme-chalk/src/table.scss
supersedes: []
---

# Table component architecture

## Public contract

`STable` is the single data-driven table implementation. Consumers define rows with `data` and columns either through the `columns` configuration array or renderless nested `STableColumn` children. A supplied `columns` array takes precedence when both forms are present, and both forms use the same rendering, sizing, interaction, and virtualization pipeline.

`STableColumn` registers with its parent and renders no table markup itself. Data-cell rendering precedence is a column-specific slot, the generic cell slot, an inline or named renderer, then the raw field value. A grouped header uses `title`, then `field`, unless its optional header slot or renderer overrides that content.

Columns with `width` reserve fixed tracks. Flexible columns start from `minWidth`, defaulting to 120px, and share remaining space equally. When the summed minimum width exceeds the viewport, the table preserves that width and scrolls horizontally.

Highlighted rows use `v-model:highlight` for a row or row array. Their pale warm surface derives from the primary HSL hue and uses a contained weak shadow without a border, remaining distinct from the header in both themes.

The public row and cell component approach is prohibited by [handwritten-table-markup.md](../prohibited/handwritten-table-markup.md). Query forms, toolbars, and request proxy behavior follow [table-single-component-business-shell.md](table-single-component-business-shell.md); a separate wrapper is prohibited by [separate-table-grid-wrapper.md](../prohibited/separate-table-grid-wrapper.md).

## Hierarchy, groups, and virtualization

Tree data belongs to `STable`. The table flattens loaded rows from current expansion state before virtualizing them, keeps lazy results internally without mutating consumer rows, and emits loaded results for optional persistence. `STableSelect` remains a thin selector shell over this mode and forwards columns, tree configuration, renderers, slots, and virtualization options.

Tree and grouped-row guide lines are opt-in. Connected branches remain visually continuous across rows, terminal siblings end with an L-shaped branch, and hover surfaces do not erase or extend guide segments. Expand and collapse controls stay compact and align consistently with their guide and row content.

The optional parent indicator appears while a long grouped or tree branch is scrolling and remains for `hideDelay`, defaulting to 1000ms, after scrolling stops. Its default mark is the double-corner return symbol. The `parent-indicator` slot customizes the remaining content and receives the parent key, label, and `jump` method.

Row and column virtualization are independently configurable. Virtual tables preserve measured dynamic heights, stable row keys, overscan, keyboard-operable expansion, fixed columns, and exposed `scrollToRow`, `scrollToColumn`, and `measure` methods. Generated sources address large logical row and column spaces without enumerating them.

## Visual and interaction details

Column-resize affordances sit on the true column boundary and appear on hover or focus. Editing does not add cell padding or increase row height, and select-like editors align vertically with other editors.

Grouped headers use one header surface. Horizontal and vertical group boundaries use the table's shadow treatment and continue through every header tier, including leaf headers beneath a row-spanning sibling.

Floating filters, column settings, context menus, and other panels use the shared `SPopper` layer so container clipping is solved by teleportation and positioning rather than changing table or documentation-card overflow.

## Verification

- Table and TableSelect Vitest suite: 63 files and 620 tests passed during the completed Table audit.
- `pnpm run test:docs-examples`: 2 files and 9 tests passed after the final documentation reorganization.
- `pnpm run docs:build`: 173 pages rendered after the final documentation reorganization.
- Browser verification covered both locales, grouped-header title fallback, hierarchy guides, grouped-header dividers, the parent indicator, Code, Playground, and the final anchor hierarchy.
