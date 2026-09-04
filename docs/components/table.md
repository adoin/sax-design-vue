---
description: 'Data tables with sorting, filtering, pagination, tree data and virtual scrolling.'
PROPS:
  - name: resize-config
    type: Boolean | TableResizeConfig
    description: "Opt in to column resizing with a minimum width and keyboard step."
    default: false
    usage: '#column-resizing'
  - name: column-widths
    type: TableColumnWidths
    description: "Controlled column widths via v-model:column-widths. Keys use column key, field or @index; virtualSource uses stringified column indexes."
    default: null
    usage: '#column-resizing'
  - name: data
    type: TableRow[]
    description: Row data rendered by the table.
    default: '[]'
    usage: '#grid-style-configuration'
  - name: columns
    type: TableColumn[]
    description: Column configuration for fields, sizing, alignment, slots, renderers and tree nodes.
    default: '[]'
    usage: '#grid-style-configuration'
  - name: row-key
    type: String | Function
    description: Stable row key field or getter.
    default: id
    usage: '#grid-style-configuration'
  - name: row
    type: TableRow | TableRow[] | null
    description: Selected row or rows.
    default: null
    usage: '#row-selection'
  - name: multiple
    type: Boolean
    values: 'true | false'
    description: Enables multiple row selection.
    default: 'false'
    usage: '#row-selection'
  - name: striped
    type: Boolean
    values: 'true | false'
    description: Alternates row backgrounds.
    default: 'false'
    usage: '#grid-style-configuration'
  - name: row-class
    type: String | Function
    description: Adds a class to each rendered row.
    default: null
    usage: '#grid-style-configuration'
  - name: tree-config
    type: TableTreeConfig
    description: Enables hierarchical rows, controlled expansion and lazy child loading.
    default: null
    usage: '#tree-table-and-lazy-loading'
  - name: virtual-config
    type: Boolean | TableVirtualConfig
    description: Enables Y-axis row virtualization and optional X-axis column virtualization.
    default: 'false'
    usage: '#virtual-rows-and-dynamic-heights'
  - name: virtual-source
    type: TableVirtualSource
    description: Provides rows and columns through index callbacks for large data sets.
    default: null
    usage: '#virtual-rows-and-dynamic-heights'
  - name: expanded-keys
    type: Array<String | Number>
    description: Controlled expanded tree row keys used by v-model:expanded-keys.
    default: null
    usage: '#tree-table-and-lazy-loading'
  - name: renderers
    type: Record<string, TableRenderer>
    description: Named cell and header renderers referenced by columns.
    default: '{}'
    usage: '#slots-and-renderers'
  - name: show-header
    type: Boolean
    values: 'true | false'
    description: Shows the configured column header.
    default: true
    usage: '#grid-style-configuration'
  - name: empty-text
    type: String
    description: Text displayed when there are no rows or columns.
    default: null
    usage: '#grid-style-configuration'
  - name: loading
    type: Boolean
    values: 'true | false'
    description: Displays a loading mask over the table.
    default: 'false'
    usage: '#grid-style-configuration'
  - name: sort-by
    type: 'TableSort[]'
    description: 'Controlled sorting state; omitted uses internal state.'
    default: null
    usage: '#sorting-and-multiple-fields'
  - name: sort-config
    type: 'TableSortConfig'
    description: 'Multiple, remote and initial sorting configuration.'
    default: '{}'
    usage: '#sorting-and-multiple-fields'
  - name: filters
    type: 'TableFilters'
    description: 'Controlled filter values keyed by field, or key for fieldless columns.'
    default: null
    usage: '#filters-and-custom-filters'
  - name: filter-config
    type: 'TableFilterConfig'
    description: 'Remote and initial filter configuration.'
    default: '{}'
    usage: '#remote-sorting-and-filtering'
  - name: pager-config
    type: Boolean | TablePagerConfig
    description: 'Optional built-in pagination. Use v-model:pager-config to synchronize supplied currentPage/pageSize fields; remote mode requires total.'
    default: 'false'
    usage: '#selection-columns-and-reservation'
  - name: selection-config
    type: 'TableSelectionConfig'
    description: 'Selection trigger, eligibility, select-all and reservation configuration.'
    default: '{}'
    usage: '#selection-columns-and-reservation'
  - name: show-overflow
    type: 'TableOverflow'
    description: 'Cell overflow behavior; true is equivalent to tooltip.'
    default: 'false'
    usage: '#text-overflow-and-tooltips'
  - name: show-header-overflow
    type: 'TableOverflow'
    description: 'Header overflow behavior; column configuration takes priority.'
    default: 'false'
    usage: '#text-overflow-and-tooltips'
CHILD_PROPS:
  - name: resizable
    type: Boolean
    description: "Set false to disable resizing for this column; resize-config must be enabled."
    default: null
    usage: '#column-resizing'
  - name: type
    type: String
    values: seq | checkbox | radio
    description: Renders sequence, checkbox or radio columns using built-in controls.
    default: null
  - name: field
    type: String
    description: Dot-path used to read the cell value from a row.
    default: null
  - name: title
    type: String
    description: Column header text.
    default: null
  - name: width
    type: Number | String
    description: Fixed column width.
    default: null
  - name: min-width
    type: Number | String
    description: Minimum width for a flexible column; after all minimums fit, flexible columns share the remaining space equally.
    default: null
  - name: align
    type: String
    values: left | center | right
    description: Header and cell alignment.
    default: left
  - name: fixed
    type: Boolean | String
    values: 'true | false | left | right'
    description: Pins the column to the left or right edge; true is an alias for left.
    default: 'false'
    usage: '#virtual-rows-and-dynamic-heights'
  - name: tree-node
    type: Boolean
    values: 'true | false'
    description: Places tree indentation and the expand control in this column.
    default: 'false'
  - name: renderer
    type: String | Function | TableRenderer
    description: Inline renderer or key from the table renderers map.
    default: null
  - name: slots
    type: TableColumnSlots
    description: Maps configured cell, header and filter slot names in Grid-style mode.
    default: null
  - name: sortable
    type: 'Boolean'
    description: 'Enables sorting controls for this column.'
    default: 'false'
    usage: '#sorting-and-multiple-fields'
  - name: sort-method
    type: 'TableSortMethod'
    values: 'number | string | Function'
    description: 'Per-column numeric, lexical string, or custom comparison. Functions return boolean, 0/1, or a signed number; true/positive means a follows b in ascending order.'
    default: null
    usage: '#column-sorting-rules'
  - name: filters
    type: 'TableFilterOption[]'
    description: 'Filter options; disabled prevents selecting an option.'
    default: null
    usage: '#filters-and-custom-filters'
  - name: filter-multiple
    type: 'Boolean'
    description: 'Allows multiple filter values.'
    default: true
    usage: '#filters-and-custom-filters'
  - name: filter-method
    type: '(params: TableFilterParams) => boolean'
    description: 'Custom row matcher; this function defines matching within the column.'
    default: null
    usage: '#filters-and-custom-filters'
  - name: show-overflow
    type: 'TableOverflow'
    description: 'Overrides cell overflow for this column; otherwise inherits the table.'
    default: null
    usage: '#text-overflow-and-tooltips'
  - name: show-header-overflow
    type: 'TableOverflow'
    description: 'Overrides header overflow for this column; otherwise inherits the table.'
    default: null
    usage: '#text-overflow-and-tooltips'
EVENTS:
  - name: update:columnWidths
    type: '(widths: TableColumnWidths) => void'
    description: "Emits the complete next width record on commit."
    default: null
    usage: '#column-resizing'
  - name: column-resize
    type: '(params: TableColumnResizeParams) => void'
    description: "Fires after a pointer drag or keyboard resize with the column, index, old and new widths, and input source."
    default: null
    usage: '#column-resizing'
  - name: update:row
    type: TableRow | TableRow[] | null
    description: Fires when row selection changes.
  - name: update:expandedKeys
    type: Array<String | Number>
    description: Fires when controlled tree expansion changes.
  - name: rowClick
    type: '(row, event)'
    description: Fires when a row is clicked.
  - name: cellClick
    type: '(params, event)'
    description: Fires when a cell is clicked.
  - name: treeExpand
    type: '(row, expanded)'
    description: Fires after a tree row expands or collapses.
  - name: lazyLoad
    type: '(row, children)'
    description: Fires after lazy children load.
  - name: scroll
    type: Event
    description: Fires when the virtual row viewport scrolls.
  - name: update:sortBy
    type: 'TableSort[]'
    description: 'Sorting update for v-model:sort-by.'
    default: null
    usage: '#sorting-and-multiple-fields'
  - name: sortChange
    type: 'TableSort[]'
    description: 'Sorting changed; can trigger a request in remote mode.'
    default: null
    usage: '#remote-sorting-and-filtering'
  - name: update:filters
    type: 'TableFilters'
    description: 'Filter update for v-model:filters.'
    default: null
    usage: '#filters-and-custom-filters'
  - name: filterChange
    type: 'TableFilters'
    description: 'Fires after applying or resetting filters.'
    default: null
    usage: '#filters-and-custom-filters'
  - name: update:pagerConfig
    type: TablePagerConfig
    description: 'Updates currentPage and pageSize while retaining other configuration fields.'
    default: null
    usage: '#selection-columns-and-reservation'
  - name: pageChange
    type: TablePageChangeParams
    description: 'Emitted for navigation, page-size changes, query resets or page clamping; includes currentPage, pageSize, total and type.'
    default: null
    usage: '#selection-columns-and-reservation'
  - name: selectionChange
    type: 'TableRow[]'
    description: 'Selection changed; always emits a row array for both modes.'
    default: null
    usage: '#selection-columns-and-reservation'
SLOTS:
  - name: default
    type: Slot
    description: Declarative s-table-column definitions.
  - name: cell-[column key]
    type: Scoped slot
    description: Column-specific cell content receiving row, column, value and rowIndex.
  - name: cell
    type: Scoped slot
    description: Fallback cell content for every column.
  - name: header-[column key]
    type: Scoped slot
    description: Column-specific header content.
  - name: header-cell
    type: Scoped slot
    description: Fallback header content for every column.
  - name: header
    type: Slot
    description: Toolbar or status content above the table.
  - name: footer
    type: Slot
    description: Pagination or summary content below the table.
  - name: notFound
    type: Slot
    description: Empty-state content.
  - name: '[columns.slots.filter]'
    type: 'TableFilterSlotParams'
    description: 'Custom filter slot named by the column; receives values, setValues, apply, reset and close.'
    default: null
    usage: '#filters-and-custom-filters'
EXPOSES:
  - name: setSort
    type: '(sorts: TableSort[]) => void'
    description: 'Sets sorting; controlled mode emits an update for the model.'
    default: null
    usage: '#sorting-and-multiple-fields'
  - name: clearSort
    type: '() => void'
    description: 'Clears all sorting.'
    default: null
    usage: '#sorting-and-multiple-fields'
  - name: setFilters
    type: '(filters: TableFilters) => void'
    description: 'Replaces filters; synchronize the model in controlled mode.'
    default: null
    usage: '#filters-and-custom-filters'
  - name: clearFilters
    type: '() => void'
    description: 'Clears all filters.'
    default: null
    usage: '#filters-and-custom-filters'
  - name: getSelectedRows
    type: '() => TableRow[]'
    description: 'Returns selected rows as an array in either mode.'
    default: null
    usage: '#selection-columns-and-reservation'
  - name: setSelectedRows
    type: '(rows: TableRow[]) => void'
    description: 'Sets selected rows; single selection uses the first eligible row.'
    default: null
    usage: '#selection-columns-and-reservation'
  - name: clearSelection
    type: '() => void'
    description: 'Clears selection.'
    default: null
    usage: '#selection-columns-and-reservation'
  - name: toggleRowSelection
    type: '(row: TableRow, selected?: boolean) => void'
    description: 'Toggles a row or explicitly sets its selected state.'
    default: null
    usage: '#selection-columns-and-reservation'
  - name: selectAll
    type: '(selected?: boolean) => void'
    description: 'Selects or deselects eligible filtered, expanded rows on the current page. Disabled for virtualSource to avoid enumerating massive data.'
    default: null
    usage: '#selection-columns-and-reservation'
  - name: toggleRowExpand
    type: '(row, expanded?) => Promise<void>'
    description: Expands or collapses a tree row.
  - name: setExpandedKeys
    type: '(keys) => void'
    description: Replaces the expanded tree key set.
  - name: scrollToRow
    type: '(rowOrIndex, align?) => void'
    description: Scrolls a normal or virtual table to a row.
  - name: scrollToColumn
    type: '(columnOrIndex, align?) => void'
    description: Scrolls to a column by index, key, field or column object.
  - name: measure
    type: '() => void'
    description: Remeasures dynamic virtual row heights.
---

# Table

<card>

## Column resizing

Enable `resize-config` to drag header edges. Right-fixed columns resize from the left edge. Numeric or px column `minWidth` and the global minimum constrain resizing; `resizable: false` disables individual columns. Arrow keys resize, Shift accelerates, Home uses the minimum, and Escape cancels dragging.

Use `v-model:column-widths` for controlled state and resets, or omit it to keep widths internally without mutating columns or rows. Changing a declared column `width` clears its internal override. Dragging previews widths; release commits the event. Controlled values revert if the parent does not accept the update.

Fixed column positions and dynamic row heights update automatically after resizing. Call `measure()` to recalculate heights after editing row content.

Select “One million generated rows” to try resizing with a large data set. With `virtualSource`, the application handles sorting, filtering and data requests.

<template #example>
<table-resize />
</template>

<template #template>

@[code{98-134}](../.vuepress/components/table/resize.vue)

</template>

<template #script>

@[code{1-96}](../.vuepress/components/table/resize.vue)

</template>

<template #style>

@[code{136-149}](../.vuepress/components/table/resize.vue)

</template>

</card>

<card>

## Grid-style configuration

Pass rows through `data` and define each column's field, title and display options through `columns`. You can also collect table props in an object and pass them together with `v-bind`.

`width` sets a fixed column width. Columns without it start from `minWidth` (120px by default) and share the remaining space equally. When the container is too narrow, scroll horizontally to see the remaining columns.

<template #example><table-default /></template>

<template #template>

@[code{54-56}](../.vuepress/components/table/default.vue)

</template>

<template #script>

@[code{1-52}](../.vuepress/components/table/default.vue)

</template>

</card>

<card>

## Declarative columns

When template-level column declaration reads better, use `s-table-column`. A column can own its scoped cell slot while rows still come from `data`.

<template #example><table-columns /></template>

<template #template>

@[code{17-30}](../.vuepress/components/table/columns.vue)

</template>

<template #script>

@[code{1-15}](../.vuepress/components/table/columns.vue)

</template>

</card>

<card>

## Slots and renderers

In configured columns, map a named slot with `slots.default`, or reference a reusable renderer by name. Rendering precedence is: mapped or column-key slot, generic cell slot, inline or named renderer, then raw field value.

<template #example><table-rendering /></template>

<template #template>

@[code{36-45}](../.vuepress/components/table/rendering.vue)

</template>

<template #script>

@[code{1-34}](../.vuepress/components/table/rendering.vue)

</template>

<template #style>

@[code{47-60}](../.vuepress/components/table/rendering.vue)

</template>

</card>

<card>

## Row selection

Bind the selected row with `v-model:row`; add `multiple` when the model should be an array.

<template #example><table-selection /></template>

<template #template>

@[code{24-30}](../.vuepress/components/table/selection.vue)

</template>

<template #script>

@[code{1-22}](../.vuepress/components/table/selection.vue)

</template>

</card>

<card>

## Sorting and multiple fields

Set `sortable` on a column to show separate ascending (up) and descending (down) buttons. Click the active direction again to clear that column. `sort-config.multiple` preserves multi-column priority; priority numbers appear only when two or more columns are sorted and disappear when only one remains. `v-model:sort-by` controls the state. Source arrays are not mutated and null / undefined values remain last.

<template #example><table-sorting /></template>

<template #template>

@[code{24-44}](../.vuepress/components/table/sorting.vue)

</template>

<template #script>

@[code{1-22}](../.vuepress/components/table/sorting.vue)

</template>

<template #style>

@[code{46-58}](../.vuepress/components/table/sorting.vue)

</template>

</card>

<card>

## Column sorting rules

Each column independently configures `sortMethod`: `'number'` compares numbers and numeric strings numerically; `'string'` uses lexical string comparison. Omit it to retain automatic natural sorting (for example, Task 2 before Task 10).

Functions receive `(a, b, rowA, rowB)`: the first two arguments are field values and the last two are the original rows. Return `true` / `1` when a should follow b in ascending order, or `false` / `0` otherwise. The table checks the reverse pair to distinguish "before" from a tie, so keep the function pure and consistent. Standard negative / zero / positive comparators such as `(a, b) => Number(a) - Number(b)` are also supported. Descending reverses the comparison; ties preserve input order or defer to the next sort field.

Null and undefined always remain last. Numeric mode also treats blank strings, invalid numbers and non-finite values as empty. Remote sorting and index-generated virtual sources emit sort state without applying these local comparators.

<template #example><table-sort-methods /></template>

<template #template>

@[code{31-42}](../.vuepress/components/table/sort-methods.vue)

</template>

<template #script>

@[code{1-29}](../.vuepress/components/table/sort-methods.vue)

</template>

<template #style>

@[code{44-52}](../.vuepress/components/table/sort-methods.vue)

</template>

</card>

<card>

## Filters and custom filters

Column filters are combined with AND. Options within a column allow multiple values, or one value with `filter-multiple=false`. Changes are applied only on confirmation; dismissing the panel discards the draft. A custom filter slot supplies UI while `filterMethod` owns matching.

<template #example><table-filtering /></template>

<template #template>

@[code{43-59}](../.vuepress/components/table/filtering.vue)

</template>

<template #script>

@[code{1-41}](../.vuepress/components/table/filtering.vue)

</template>

<template #style>

@[code{61-68}](../.vuepress/components/table/filtering.vue)

</template>

</card>

<card>

## Selection columns and reservation

`type="checkbox"` uses an array model and `type="radio"` uses a single row. Controls are the default trigger; use `selection-config.trigger="row"` for row clicks. Select-all covers eligible filtered, expanded rows on the current page, not just the virtual window. `checkMethod` disables rows; `reserve` retains selections on other pages. Supply a stable unique `row-key`. Tree selection is independent, not cascading.

Configure the built-in paginator with `v-model:pager-config`; pass the complete data array without slicing it yourself. Pagination is off by default; `true` starts on page 1 with 10 rows per page. Options include `currentPage`, `pageSize`, `pageSizes`, `layout`, `pagerCount`, `hideOnSinglePage`, `disabled`, and `shape`. Local sorting and filtering run before pagination; changing the query or page size returns to page 1. Trees paginate root nodes with their expanded descendants kept together. Both virtual axes can still operate within the current page.

<template #example><table-selection-columns /></template>

<template #template>

@[code{33-63}](../.vuepress/components/table/selection-columns.vue)

</template>

<template #script>

@[code{1-31}](../.vuepress/components/table/selection-columns.vue)

</template>

<template #style>

@[code{65-78}](../.vuepress/components/table/selection-columns.vue)

</template>

</card>

<card>

## Text overflow and tooltips

`show-overflow` supports wrapping (false), ellipsis, native title, or a floating tooltip (tooltip / true). A tooltip appears only for clipped content, on hover or keyboard focus. Headers use `show-header-overflow`; column settings override table settings.

<template #example><table-overflow /></template>

<template #template>

@[code{34-55}](../.vuepress/components/table/overflow.vue)

</template>

<template #script>

@[code{1-32}](../.vuepress/components/table/overflow.vue)

</template>

<template #style>

@[code{57-67}](../.vuepress/components/table/overflow.vue)

</template>

</card>

<card>

## Fixed columns and scroll positioning

Fixed left and right columns also work without virtualization. The center scrolls horizontally while fixed columns keep an opaque continuous surface. These controls demonstrate `scrollToColumn` and `scrollToRow`.

<template #example><table-fixed-columns /></template>

<template #template>

@[code{24-54}](../.vuepress/components/table/fixed-columns.vue)

</template>

<template #script>

@[code{1-22}](../.vuepress/components/table/fixed-columns.vue)

</template>

<template #style>

@[code{56-66}](../.vuepress/components/table/fixed-columns.vue)

</template>

</card>

<card>

## Loading, empty states and table slots

Use the `header`, `footer` and `empty` slots to customize content around the table. `loading` displays a loading state, `show-header` controls header visibility and `row-class` customizes row styling. Column `field` values support nested paths.

<template #example><table-states /></template>

<template #template>

@[code{20-52}](../.vuepress/components/table/states.vue)

</template>

<template #script>

@[code{1-18}](../.vuepress/components/table/states.vue)

</template>

<template #style>

@[code{54-82}](../.vuepress/components/table/states.vue)

</template>

</card>

<card>

## Remote sorting and filtering

Set `remote: true` separately in `sort-config`, `filter-config`, and `pager-config` to keep query and paging state without reprocessing the server's current-page data. Set the paginator's `total` from the server response. Request data on `page-change`, or watch the controlled page and page size as this example does. Reset the page to 1 in your application when a remote sort or filter changes.

A delayed function simulates server sorting, filtering, and pagination here; replace it with a request in production. New queries cancel pending work to avoid stale results. `virtualSource` is never fully enumerated for a query; local pagination reads only the current page's row indices.

<template #example><table-remote-query /></template>

<template #template>

@[code{68-80}](../.vuepress/components/table/remote-query.vue)

</template>

<template #script>

@[code{1-66}](../.vuepress/components/table/remote-query.vue)

</template>

</card>

<card>

## Tree sorting and filtering

Tree sorting reorders siblings without detaching children. Filtering retains matches and their ancestors, temporarily expanding matching paths. Clearing filters restores the previous expansion state. Only loaded lazy nodes are searched; filtering never starts a load request.

<template #example><table-tree-query /></template>

<template #template>

@[code{37-59}](../.vuepress/components/table/tree-query.vue)

</template>

<template #script>

@[code{1-35}](../.vuepress/components/table/tree-query.vue)

</template>

<template #style>

@[code{61-71}](../.vuepress/components/table/tree-query.vue)

</template>

</card>

<card>

## Tree table and lazy loading

Tree data remains part of `s-table`. Mark one configured column with `treeNode`, then provide children or a lazy loader through `tree-config`.

<template #example><table-tree /></template>

<template #template>

@[code{1-17}](../.vuepress/components/table/tree.vue)

</template>

<template #script>

@[code{19-80}](../.vuepress/components/table/tree.vue)

</template>

<template #style>

@[code{82-101}](../.vuepress/components/table/tree.vue)

</template>

</card>

<card>

## Virtual rows and dynamic heights

Enable virtualization with `virtual-config` and set `height` to define the viewport. `dynamic` measures row heights from their content; `horizontal` enables column virtualization and `columnOverscan` controls extra columns rendered on each side. Set `fixed="left"` or `fixed="right"` on a column to keep it at that edge.

Supply a stable, unique `row-key` when rows can be reordered, updated or expanded as a tree. During horizontal scrolling, rows retain the largest height of their displayed content to reduce vertical movement. Resizing columns triggers fresh measurements.

For data loaded on demand, use `virtualSource` to provide row and column counts and index callbacks. The example supports loading a large data set, jumping to the middle or end, and scrolling both axes. Choose your data size based on device memory, row heights and cell complexity; server-backed data can also use remote pagination.

<template #example><table-virtual /></template>

<template #template>

@[code{173-228}](../.vuepress/components/table/virtual.vue)

</template>

<template #script>

@[code{1-171}](../.vuepress/components/table/virtual.vue)

</template>

<template #style>

@[code{230-307}](../.vuepress/components/table/virtual.vue)

</template>

</card>
