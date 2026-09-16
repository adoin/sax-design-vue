---
status: implemented
kind: project-specification
updated_at: 2026-09-15
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

In configuration-object columns, `slots.default` accepts either a table-level named slot string or a direct `TableCellRenderer` function. Direct functions receive the complete `TableCellRenderParams`; `index` is the VXE-style alias of `rowIndex`. `slots.default`, `slots.header`, `slots.edit`, `slots.footer`, and `slots.filter` explicitly map application-owned names. Table never derives a slot name from a column field or key. Declarative `STableColumn` local slots and the generic `cell`, `header-cell`, `edit-cell`, and `footer-cell` slots remain the collision-free template paths. These forms occupy the column-specific or generic positions in the shared rendering precedence.

Form and Table share the VXE-style global renderer registry described in [global-renderer-registry.md](global-renderer-registry.md). Table columns can resolve global cell, edit, and filter renderers while preserving table-local renderer overrides and slot precedence.

The public generic contract is defined by [table-generic-type-chain.md](table-generic-type-chain.md). `SaxGridSetting<Row, QueryForm>` carries a body-row interface and optional proxy query-form interface through configuration callbacks, Vue slots and events, global renderer helpers, proxy adapters, and exposed methods without introducing another runtime table component.

Columns with `width` reserve fixed tracks. Flexible columns start from `minWidth`, defaulting to 120px, and share remaining space equally. When the summed minimum width exceeds the viewport, the table preserves that width and scrolls horizontally.

Interactive column layout remains separate from the structural `columns` definition. `columnState` owns visibility, order, fixed placement and optional `{ parentKey, index }` hierarchy overrides, while `columnWidths` owns resize overrides; their update and change events cover controlled state and user-action observation. Clearing both records restores the original column structure and declared widths without rewriting render functions, grouped paths, or renderless declarations.

Reusable Table defaults follow [global-component-defaults.md](global-component-defaults.md). `SConfigProvider.table` owns only cross-instance feature and presentation policies; an explicit Table prop overrides it, object-valued feature props shallow-merge over it, and `false` disables a globally enabled feature. Data, controlled state, record-specific callbacks, renderers, and business configuration remain local.

Highlighted rows use `v-model:highlight` for a row or row array. Their pale warm surface derives from the primary HSL hue and uses a contained weak shadow without a border, remaining distinct from the header in both themes.

Eligibility callbacks use capability-specific names: `selectableMethod` for row selection, `expandableMethod` for details, `editableMethod` for table and column editing, `draggableMethod` for row pickup, `writableMethod` for clipboard writes, and `replaceableMethod` for find-and-replace. The ambiguous `checkMethod` name is not part of these Table contracts.

The public row and cell component approach is prohibited by [handwritten-table-markup.md](../prohibited/handwritten-table-markup.md). Query forms, toolbars, and request proxy behavior follow [table-single-component-business-shell.md](table-single-component-business-shell.md); a separate wrapper is prohibited by [separate-table-grid-wrapper.md](../prohibited/separate-table-grid-wrapper.md).

## Hierarchy, groups, and virtualization

Tree data belongs to `STable`. The table flattens loaded rows from current expansion state before virtualizing them, keeps lazy results internally without mutating consumer rows, and emits loaded results for optional persistence. `STableSelect` remains a thin selector shell over this mode and forwards columns, tree configuration, renderers, slots, and virtualization options.

Tree and grouped-row guide lines are opt-in. Connected branches remain visually continuous across rows, terminal siblings end with an L-shaped branch, and hover surfaces do not erase or extend guide segments. When group subtotals are enabled, ancestor guides continue through the last child group, its member rows, and its subtotal; the parent subtotal owns the final L-shaped closure. Expand and collapse controls stay compact and align consistently with their guide and row content.

The optional parent indicator appears while a long grouped or tree branch is scrolling and remains for `hideDelay`, defaulting to 1000ms, after scrolling stops. Its default mark is the double-corner return symbol. The `parent-indicator` slot customizes the remaining content and receives the parent key, label, and `jump` method.

Row and column virtualization are independently configurable. Virtual tables preserve measured dynamic heights, stable row keys, overscan, keyboard-operable expansion, fixed columns, and exposed `scrollToRow`, `scrollToColumn`, and `measure` methods. `virtualConfig.height: 'auto'` makes the row viewport consume the remainder of a definite-height parent through nested flex layout; query UI, toolbars, headers, wrapping footer rows, footer content and pagination retain their intrinsic heights, and later layout changes resize the viewport without a JavaScript pre-measurement pass. Ordinary `data` virtualization reduces mounted DOM while retaining the complete supplied array in application memory. `virtualSource` instead declares logical counts plus synchronous index readers, allowing Table to materialize only the visible row and column objects without storing complete arrays itself; the backing callbacks may compute values or read an application-owned indexed store.

Virtual row scrollbar interaction follows [virtual-list-scrollbar-track-navigation.md](virtual-list-scrollbar-track-navigation.md): an empty-track click navigates immediately across the full range, while pressing the current thumb preserves native dragging and measurement locking.

Rounded virtual Table viewports inset native scrollbar tracks by 4px and narrow the painted thumb with a transparent border. The inset keeps both axes clear of clipped corners without adding another scroll owner; direct track navigation uses the same inset geometry.

## Visual and interaction details

Column-resize affordances sit on the true column boundary and appear on hover or focus. Editing does not add cell padding or increase row height, and select-like editors align vertically with other editors. Built-in input-surface editors default to square geometry inside cells, including both the direct editor path and the shared renderer `renderEdit` path; an explicit `props.shape` overrides the table default. Switches, checkboxes, radios, sliders, and rates retain their control-specific geometry.

Custom-editor wrapping and row growth follow [table-custom-editor-sizing.md](table-custom-editor-sizing.md). Single-line and multi-line controls retain their native semantics, while Table supplies the editing-cell sizing integration required by auto-sizing Textarea.

Validation presentation follows [table-validation-overlay.md](table-validation-overlay.md). Error messages never change row height: invalid cells use a contained danger shadow and marker, the active message uses the shared teleported Popper, and multiple errors use an overlaid previous/next navigator. Manual validation closes active editors; starting an editor clears its old error presentation, while a failed commit republishes the error without discarding the draft.

Fixed-column boundary shadows use a single pointer-transparent overlay spanning the data viewport, aligned to the fixed bands in both virtual and ordinary horizontal scrolling. Ordinary scroll viewports use their paint-box width (`offsetWidth`) for the right boundary: a native scrollbar gutter can make `clientWidth` narrower without moving the sticky right cell. Do not paint one gradient per fixed cell: subpixel row boundaries can leave pale seams, while extending those segments overlaps them into dark seams. Horizontal overscan keeps partially covered center cells mounted; suppress their content until the column is fully visible so clipped text does not appear beside a fixed band. Starting an editor from an already mounted cell preserves the current horizontal position; only programmatic editing of an offscreen target invokes row or column location before focus, and editor focus uses `preventScroll`.

Column settings use one drag handle per row for ordering. Group columns render as tinted containers that wrap their complete descendant branch; nested groups add another inset surface and every group shows its direct child count. These containers are always expanded and do not add disclosure controls. Pointer dragging shows an insertion line or highlights a target group container and scrolls near the panel edges; keyboard users can pick up a focused handle, choose a position with the arrow keys, then drop or cancel it. The panel does not render separate up/down ordering buttons. Its trigger updates the shared popper model synchronously without the general Button ripple, debounce, or delayed-toggle path. The shared popper content stays mounted while hidden. Panels with at most 20 columns pre-render their rows; larger panels retain virtual rendering and remain visually hidden until the first range is ready, so neither mode exposes an empty panel shell.

Grouped headers use one header surface. Horizontal and vertical group boundaries use the table's shadow treatment and continue through every header tier, including leaf headers beneath a row-spanning sibling.

Floating filters, column settings, context menus, and other panels use the shared `SPopper` layer so container clipping is solved by teleportation and positioning rather than changing table or documentation-card overflow.

Table footers accept either explicit `footerData` records or locally derived `footerConfig` rows. Each footer row combines fixed values with `count`, `sum`, `average`, `min`, `max`, or custom aggregate definitions and can target all supplied data, filtered data, or the current page. Custom aggregates primarily accept an ordered cell-array function returning a string or number; the accumulator object form remains available when large local data requires constant auxiliary memory. Built-in numeric summaries use `decimal.js`; decimal strings are accepted and decimal results remain strings so monetary values do not pass through native binary floating-point arithmetic. A nonempty `footerData` value takes precedence. Both sources then use the same leaf-column footer slots, renderers, formatters and raw-value fallback. Nested declaration columns participate after their leaf fields are resolved. `virtualSource` summaries must be supplied through `footerData` because the complete logical dataset may not exist in local memory.

Table toolbars expose `toolbar_left` and `toolbar_right`. Both sides accept slots or ordered `toolbarConfig.left` / `toolbarConfig.right` renderer lists using `itemRender`. Column settings are provided by `STableColumnConfig`; the built-in `$columnConfig` toolbar renderer mounts that same component in either list. `TableCore` only provides the current table context and does not hardcode or automatically place the trigger.

## Verification

- The Table suite contains 62 files and 643 tests. All assertions pass with one worker.
- The VirtualList suite contains 3 files and 26 passing tests for native thumb dragging, direct track navigation, overlay-scrollbar hit testing, dynamic measurement and sparse mapping. Browser verification covered immediate ordinary and million-row Table track jumps plus drag-lock release.
- `pnpm run test:docs-examples`: 4 files and 12 tests passed.
- `pnpm run docs:build`: 201 pages rendered.
- Browser verification covered both locales, grouped-header title fallback, hierarchy guides, grouped-header dividers, the parent indicator, left/right toolbars in ordinary and proxy tables, the `$columnConfig` panel, Code, Playground, the final anchor hierarchy, and auto-height allocation across toolbar, header, virtual body, and wrapping footer rows.
