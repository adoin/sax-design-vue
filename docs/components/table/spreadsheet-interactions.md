---
description: 'Table spreadsheet interactions behavior, configuration, and runnable examples.'
---

# Spreadsheet interactions guide

<card class="table-doc-section-start">

## Spreadsheet interactions

These examples cover spreadsheet-like operations: keyboard navigation, ranges, clipboard actions, find, menus, and row reordering.

### Keyboard navigation

Enable `keyboard-config` to move with arrow keys in visible column order when not editing. Tab / Shift + Tab wraps across rows; native Tab behavior is preserved at either edge of the current page. While editing, Tab / Shift + Tab commits the current cell and opens the next or previous editable cell in left-to-right, top-to-bottom order. Cells without an editor, disabled or readonly editors, and cells excluded by `editableMethod` are skipped. A failed commit validation keeps the current editor open. Fixed columns share the same navigation order, and hidden columns are skipped. Navigation does not change pages automatically.

`v-model:active-cell` stores `{ rowKey, columnKey }`, independently of row selection through `v-model:highlight`. Ordinary columns use `key`, then `field`, or `@originalIndex` for unnamed columns; provide stable keys to persist addresses. Activity follows keys after sorting or reordering. Filtering, collapsing, paging or hiding the active column requests a clear when the target is no longer visible. Controlled models must accept updates.

<template #example><table-keyboard /></template>

<template #template>

@[code{18-62}](../../.vuepress/components/table/keyboard.vue)

</template>

<template #script>

@[code{1-16}](../../.vuepress/components/table/keyboard.vue)

</template>

<template #style>

@[code{64-71}](../../.vuepress/components/table/keyboard.vue)

</template>

</card>

<card>

### Navigation across virtual windows

Generated addresses use a stringified source column index as `columnKey`. Supply `keyboardConfig.rowIndexOf(key)` to resolve a stable row key to an absolute source index for controlled addresses or reordered data. The table does not scan generated rows to find a key. Without a resolver, it can only retain a known navigation position while its key still matches.

This example generates one million rows and 100,000 columns on demand. Select the last cell, then use arrow keys across virtual windows and into the right fixed column. Only the current window mounts. `setActiveCell` uses absolute source indices for generated data and resolves false for out-of-page or hidden targets, refused models and cancelled focus requests.

<template #example><table-keyboard-source /></template>

<template #template>

@[code{26-47}](../../.vuepress/components/table/keyboard-source.vue)

</template>

<template #script>

@[code{1-24}](../../.vuepress/components/table/keyboard-source.vue)

</template>

<template #style>

@[code{49-62}](../../.vuepress/components/table/keyboard-source.vue)

</template>

</card>

<card>

### Cell range selection

Enable `range-config` and drag across cells to select a rectangle. Shift + click or Shift + arrow extends it, Ctrl / Command + A selects the current view, and Escape or `clearCellRange` clears both the range and the last drop-point caret. Drag near a table viewport edge to scroll remaining table content; a short table does not scroll the page. Escape during dragging restores the previous range. Row highlighting stays independent; keyboard navigation still uses `v-model:active-cell` when it should keep its own address.

`v-model:cell-range` stores stable `{ anchor, focus }` addresses. Intersecting merged cells are included in full. Ranges follow row and column keys after sorting or reordering; hidden endpoints, collapsed groups or page changes request clearing when an endpoint is no longer visible. Controlled models must accept updates.

<template #example><table-range /></template>

<template #template>

@[code{22-69}](../../.vuepress/components/table/range.vue)

</template>

<template #script>

@[code{1-20}](../../.vuepress/components/table/range.vue)

</template>

<template #style>

@[code{71-78}](../../.vuepress/components/table/range.vue)

</template>

</card>

<card>

### Ranges across generated data

This example generates one million rows and 100,000 columns on demand. Fixed and scrolling columns share logical coordinates. Selecting the entire view stores endpoints and bounds without reading every cell; rendering stays limited to the visible window. Use `range-config.rowIndexOf` to map stable row keys to absolute source indices for offscreen programmatic selection.

Edge scrolling uses logical content pixels, preserving speed with compressed tracks. Merge resolvers must return complete regions intersecting the query rectangle. Large-range calculation cost depends on intersecting merge regions and can be cancelled by a newer gesture or context change.

<template #example><table-range-source /></template>

<template #template>

@[code{41-81}](../../.vuepress/components/table/range-source.vue)

</template>

<template #script>

@[code{1-39}](../../.vuepress/components/table/range-source.vue)

</template>

<template #style>

@[code{83-96}](../../.vuepress/components/table/range-source.vue)

</template>

</card>

<card>

### Copy, cut and paste

Enable `clipboard-config` to use Ctrl / Command + C, X and V on the selected range, falling back to the active cell. Editors retain native text actions. Copying only needs clipboard configuration; cutting and pasting also require `edit-config`, column `editor` definitions and `change-config`. Accept ordinary array updates with `v-model:data`.

Copying produces an independent value matrix and TSV text. A single-cell target expands to the input dimensions; an existing rectangle must be a whole multiple of the input shape, including scalar fills. Read-only positions are skipped without shifting subsequent values. A merged owner is copied once with empty continuation slots; pasting must cover complete merges and rejects conflicting values. `bounds` uses half-open visible data-row and visual-column indices in the current view, excluding group bands; operations do not change pages.

<template #example><table-clipboard /></template>

<template #template>

@[code{72-128}](../../.vuepress/components/table/clipboard.vue)

</template>

<template #script>

@[code{1-71}](../../.vuepress/components/table/clipboard.vue)

</template>

<template #style>

@[code{129-143}](../../.vuepress/components/table/clipboard.vue)

</template>

</card>

<card>

### Clipboard with generated data

Generated sources locate stable row keys through `change-config.indexOf` and accept field patches through `apply`; this example stores only edited values. The last merged region crosses the right fixed column and supports copy, paste and undo. Copying the whole selection returns a limit result before visiting a million rows by a hundred thousand columns. Region reads, row preparation and validation yield between batches; unloaded remote pages or tree nodes are not fetched automatically.

<template #example><table-clipboard-source /></template>

<template #template>

@[code{122-176}](../../.vuepress/components/table/clipboard-source.vue)

</template>

<template #script>

@[code{1-121}](../../.vuepress/components/table/clipboard-source.vue)

</template>

<template #style>

@[code{177-191}](../../.vuepress/components/table/clipboard-source.vue)

</template>

</card>

<card>

### Find and replace

Place the built-in `$find` renderer in `toolbar-config.left` or `toolbar-config.right` to add a find-and-replace trigger. The trigger is an icon by default; pass `content` or `props.content` to show a label after the icon. Clicking it opens a teleported form panel; each open resets the form and previous matches. After a successful search, the panel collapses to a compact results bar so you can step through matches without the query fields. Expand restores the form; the compact close control, the form popper close control, or Escape dismisses the panel. Clicking the table does not dismiss it. The renderer explicitly enables the capability; `find-config` only customizes scope, conversion, keyboard behavior and processing limits, and can enable API-only integration without rendering UI. Focus a table cell and press Ctrl / Command + F to find, Ctrl / Command + H to focus replacement, or F3 / Shift + F3 to navigate matches while `$find` is mounted. Enter runs the panel query. Set `keyboard: false` to disable these shortcuts.

Queries are literal text, with optional case-sensitive and whole-cell matching. The current view searches expanded rows on the current filtered page; selection searches the current rectangular range. Both use visible visual-column order and count merged owners once. On generated or horizontally virtualized grids, the current view is the painted window — fixed columns plus the current row and column ranges — not every logical column. The supplied-data scope searches all provided rows and loaded tree children, across pages and independently of filters; it searches raw fields in visible columns. It does not fetch other remote pages or lazy children. Positioning can expand loaded ancestors and groups and request a page change. If filters hide a row or a controlled view rejects navigation, positioning returns `false` without clearing the filters.

Replace current stays disabled when the active match is not writable, or when the draft replacement cannot convert into that cell (for example replacing `0` with `x` inside a number). After a search, the panel moves to the first match that can accept the current replacement text. Replace all stays disabled when the search is incomplete, or when no returned match is both writable and able to accept the draft replacement. Replace all still updates writable text matches when other hits cannot accept the replacement, for example a number cell that would become non-numeric.

<template #example><table-find /></template>

<template #template>

@[code{58-108}](../../.vuepress/components/table/find.vue)

</template>

<template #script>

@[code{1-57}](../../.vuepress/components/table/find.vue)

</template>

<template #style>

@[code{109-120}](../../.vuepress/components/table/find.vue)

</template>

</card>

<card>

### Finding in generated data

The `$find` toolbar renderer supplies this example's UI. `find-config` defaults to at most 100000 visited positions, 1000 matching cells and 2000000 processed text characters. Incomplete searches retain their explicit limit status; `replaceAll` refuses a partial result, while `replaceMatch` can target an individual returned match. Narrow the scope or adjust limits deliberately. Object values need a formatter; text and cell limits do not measure the memory retained by supplied objects.

The source contains a million rows and a hundred thousand columns. Current-view search covers the painted window, so values like `3/3` that are already on screen are found without spending the scan budget on off-screen columns of row 0. Search the selected last merged range, edit the replacement text, and replace its owner across the fixed-column boundary. Only changed fields are stored by the data adapter; navigation reuses the virtual row and column windows. Use the supplied-data scope when you need to demonstrate the scan limit.

<template #example><table-find-source /></template>

<template #template>

@[code{96-138}](../../.vuepress/components/table/find-source.vue)

</template>

<template #script>

@[code{1-95}](../../.vuepress/components/table/find-source.vue)

</template>

<template #style>

@[code{139-150}](../../.vuepress/components/table/find-source.vue)

</template>

</card>

<card>

### Context menus

Provide item arrays or synchronous context-to-items functions through `context-menu-config.header`, `body` and `footer`. A false `visibleMethod`, an empty region or a disabled configuration preserves the browser's native context menu. A throwing factory also falls back to the native menu.

`context.area` is `header`, `body` or `footer`; all include `column` and `columnIndex`. Headers add `group`, with grouped headers supplying the group column; their index identifies the first leaf in the rendered header segment. Body contexts include `row`, `rowKey`, `rowIndex`, the raw `value` and tree-node context. Footer contexts contain the summary row, footer row index and raw value.

Every context also captures `range` and normalized `rangeBounds` when the menu opens; both are `null` when no cell range exists. The snapshot stays stable while the menu is open, so an action can pass `context.rangeBounds` to `openChart({ scope: 'selection', bounds: ... })` or use it for application-specific aggregation without rereading a changed selection. `contextMenuSelect` returns `{ context, item }`; the table does not automatically change data or execute business actions such as deletion.

<template #example><table-context-menu /></template>

<template #template>

@[code{78-120}](../../.vuepress/components/table/context-menu.vue)

</template>

<template #script>

@[code{1-76}](../../.vuepress/components/table/context-menu.vue)

</template>

<template #style>

@[code{122-136}](../../.vuepress/components/table/context-menu.vue)

</template>

</card>

<card>

### Menus in virtual data

With `virtualSource`, body row and column indices are absolute source indices; footer `rowIndex` still refers to the footer array. Context is built only for the rendered hit cell, without enumerating the source. Select the last cell and press Shift + F10 to inspect the far boundary and fixed columns; footer menus use the same horizontal column window. Source replacement, scrolling and unmounting close stale contexts.

<template #example><table-context-menu-source /></template>

<template #template>

@[code{35-59}](../../.vuepress/components/table/context-menu-source.vue)

</template>

<template #script>

@[code{1-33}](../../.vuepress/components/table/context-menu-source.vue)

</template>

<template #style>

@[code{61-74}](../../.vuepress/components/table/context-menu-source.vue)

</template>

</card>

<card>

### Row reordering

Enable `row-drag-config` and set `dragSort: true` on a column (`drag-sort` in the nested form). Provide stable `row-key` values and accept the proposed array with `v-model:data`. `draggableMethod` restricts pickup; `dropMethod` restricts drop targets. Handles do not select or edit rows.

Space or Enter picks up a row, arrow keys choose a target, Enter drops it and Escape cancels. Holding near a scrollable window edge scrolls automatically; set `autoScroll: false` to disable this. `scrollThreshold` defaults to 40px and `scrollSpeed` to 16px per frame.

<template #example><table-row-drag /></template>

<template #template>

@[code{40-60}](../../.vuepress/components/table/row-drag.vue)

</template>

<template #script>

@[code{1-38}](../../.vuepress/components/table/row-drag.vue)

</template>

<template #style>

@[code{62-72}](../../.vuepress/components/table/row-drag.vue)

</template>

</card>

<card>

### Tree reparenting

Tree rows stay within their current sibling list by default. Set `rowDragConfig.tree` to `true`, or provide its object form, to enable cross-parent moves. Dropping on the upper or lower quarter inserts before or after that row. At an expanded parent / first-child boundary, entering from the child's top means “before the first child”; entering from the parent's bottom means “after the parent,” and that preview line is rendered after the parent's complete visible subtree because that is where the row will appear. The middle half uses `position: 'inside'` and makes the row a child. The middle of any loaded row can therefore turn a former leaf into a parent and create another nested level, subject to `maxDepth` and `dropMethod`. Within four pixels of a shared cross-depth boundary, horizontal intent chooses the deeper or shallower destination. Child placement highlights the target's visible branch; sibling placement uses an insertion line beginning at the proposed depth. Keyboard dragging uses Up/Down to choose a target, Right to move inside it, and Left to promote a direct child after its parent.

The tree configuration can independently disable `allowReparent` or `allowDropInside`, choose `insidePosition: 'first' | 'last'`, limit the complete moved subtree with zero-based `maxDepth`, and control `expandOnDrop`. `draggableMethod` receives the source depth, parent, expansion state and loaded child count. `dropMethod` additionally receives the corresponding target fields plus `oldIndex`, `newIndex`, `newParentKey`, `newDepth`, `subtreeDepth` and `reparented`, so applications can reject locked parents, non-folder targets, full branches or domain-specific combinations. An unloaded lazy target must be expanded and loaded before it accepts an inside drop; dragging never fetches it implicitly. Reordering copies only affected arrays and ancestor rows; it does not mutate incoming row objects. This example uses configuration-object columns.

<template #example><table-row-drag-tree /></template>

<template #template>

@[code{86-99}](../../.vuepress/components/table/row-drag-tree.vue)

</template>

<template #script>

@[code{1-84}](../../.vuepress/components/table/row-drag-tree.vue)

</template>

</card>

<card>

### Generated data and edge scrolling

`virtualSource` requires `rowDragConfig.apply`, receiving stable row keys, the target, absolute source positions and `signal`. Generated requests omit `data`: update the source and key mapping, then return true. The component verifies the moved row at its new position before reporting success. Ordinary arrays can also use apply; accept the exact proposed data array first. Rejection, errors, external data replacement, cancellation and unmount must not report success. `cancelRowDrag()` settles pending work immediately; adapters must check signal before writing.

This example provides one million rows and one hundred thousand columns on demand, caching only positions whose order changes. Neighboring moves touch few mappings; long moves cost time and memory proportional to the distance. The adapter yields in batches and supports cancellation. A remote service can persist order from stable row keys and relative targets without loading the entire dataset.

<template #example><table-row-drag-source /></template>

<template #template>

@[code{61-85}](../../.vuepress/components/table/row-drag-source.vue)

</template>

<template #script>

@[code{1-59}](../../.vuepress/components/table/row-drag-source.vue)

</template>

<template #style>

@[code{87-100}](../../.vuepress/components/table/row-drag-source.vue)

</template>

</card>
