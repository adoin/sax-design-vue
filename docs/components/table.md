---
description: 'Data tables with sorting, filtering, pagination, tree data and virtual scrolling.'
PROPS:
  - name: "validation-rules"
    type: "TableValidationRules"
    description: "Field-based rules; column rules take precedence, and an empty array disables rules for that column."
    default: "{}"
    usage: "#data-validation"
  - name: "validation-config"
    type: "Boolean | TableValidationConfig"
    description: "Enable validation before edit commits; configure error navigation and the error limit. Manual validation is available when disabled."
    default: "false"
    usage: "#data-validation"
  - name: "edit-config"
    type: "Boolean | TableEditConfig"
    description: "Enable editing with cell or row mode, triggers, eligibility and leave policies."
    default: "false"
    usage: "#cell-and-row-editing"
  - name: "detail-config"
    type: "Boolean | TableDetailConfig"
    description: "Detail expansion configuration; an expand column enables it automatically, false disables it. Enable explicitly with virtualSource."
    default: null
    usage: "#detail-rows"
  - name: "detail-expanded-keys"
    type: "TableRowKey[]"
    description: "Controlled detail keys through v-model:detail-expanded-keys, independent of tree expansion."
    default: null
    usage: "#detail-rows"
  - name: footer-data
    type: TableRow[]
    description: Footer records keyed by column fields, independent of body sorting, filtering and pagination.
    default: '[]'
    usage: '#footer-data-rows'
  - name: footer-row-key
    type: TableRowKeyGetter
    description: Field path or function for stable footer row keys; defaults to the footer index.
    default: null
    usage: '#footer-data-rows'
  - name: show-footer-overflow
    type: TableOverflow
    description: Footer overflow handling, independent of body and headers; column settings take precedence.
    default: 'false'
    usage: '#footer-data-rows'
  - name: column-manager-config
    type: Boolean | TableColumnManagerConfig
    description: Enable the column panel; supply storageKey to opt into local persistence.
    default: false
    usage: '#column-settings'
  - name: column-state
    type: TableColumnState[]
    description: "Control visibility, order and fixed position with v-model:column-state."
    default: null
    usage: '#column-settings'
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
  - name: highlight
    type: TableRow | TableRow[] | null
    description: Highlighted row or rows.
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
  - name: "rules"
    type: "TableValidationRule | TableValidationRule[]"
    description: "Synchronous or asynchronous rules for this column, overriding validation-rules."
    default: null
    usage: "#data-validation"
  - name: "editor"
    type: "Boolean | TableEditorConfig"
    description: "Enable field editing with input, number, select, date or switch controls, props, options and eligibility."
    default: null
    usage: "#cell-and-row-editing"
  - name: "edit"
    type: "TableEditRenderer"
    description: "Editor render function, independent of the display cell renderer."
    default: null
    usage: "#custom-editors"
  - name: footer
    type: TableFooterRenderer
    description: Footer cell render function.
    default: null
    usage: '#footer-data-rows'
  - name: footer-formatter
    type: TableFooterFormatter
    description: Footer text formatter, used when no slot or renderer takes precedence.
    default: null
    usage: '#footer-data-rows'
  - name: footer-align
    type: TableAlign
    description: Footer alignment, falling back to the column align value.
    default: null
    usage: '#footer-data-rows'
  - name: show-footer-overflow
    type: TableOverflow
    description: Footer overflow for this column, overriding the table setting.
    default: null
    usage: '#footer-data-rows'
  - name: children
    type: TableColumn[]
    description: Nested columns forming a header group; only leaves render data cells.
    default: null
    usage: '#grouped-headers'
  - name: resizable
    type: Boolean
    description: "Set false to disable resizing for this column; resize-config must be enabled."
    default: null
    usage: '#column-resizing'
  - name: type
    type: String
    values: seq | checkbox | radio | expand
    description: Renders sequence, checkbox, radio or detail expansion columns using built-in controls.
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
    description: Pins the column to either edge; true means left. Inherits the parent group when omitted; false overrides an inherited fixed side.
    default: null
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
  - name: "validation"
    type: "TableValidationResult"
    description: "Emitted when the latest validation completes; cancelled or stale runs do not emit."
    default: null
    usage: "#data-validation"
  - name: "editStart"
    type: "(params: TableEditRecord) => void"
    description: "Emitted when an edit session starts."
    default: null
    usage: "#cell-and-row-editing"
  - name: "editChange"
    type: "(params: TableEditRecord) => void"
    description: "Emitted when a draft changes; supplied data is not mutated."
    default: null
    usage: "#cell-and-row-editing"
  - name: "editCommit"
    type: "(params: TableEditEndParams) => void"
    description: "Provides changed fields and updatedRow on commit; the application accepts and persists the result."
    default: null
    usage: "#cell-and-row-editing"
  - name: "editCancel"
    type: "(params: TableEditEndParams) => void"
    description: "Emitted when a draft is cancelled, including its reason."
    default: null
    usage: "#cell-and-row-editing"
  - name: "update:detailExpandedKeys"
    type: "(keys: TableRowKey[]) => void"
    description: "Requests the complete next detail key array."
    default: null
    usage: "#detail-rows"
  - name: "detailExpand"
    type: "(params: TableDetailExpandParams) => void"
    description: "Emitted when a trigger or toggleRowDetail requests expansion or collapse; controlled state requires parent acceptance."
    default: null
    usage: "#detail-rows"
  - name: "detailLoad"
    type: "(params: TableDetailParams & { data: unknown }) => void"
    description: "Emitted when the current detail request succeeds."
    default: null
    usage: "#async-details"
  - name: "detailLoadError"
    type: "(params: TableDetailParams & { error: unknown }) => void"
    description: "Emitted for current request failures; aborted and stale requests are ignored."
    default: null
    usage: "#async-details"
  - name: footerCellClick
    type: '(params: TableFooterCellRenderParams, event: MouseEvent) => void'
    description: Fires on footer cell clicks with the footer record, leaf column, raw value and indices; does not select body rows.
    default: null
    usage: '#footer-data-rows'
  - name: update:columnState
    type: '(state: TableColumnState[]) => void'
    description: Request a controlled column-state update.
    default: null
    usage: '#column-settings'
  - name: columnStateChange
    type: '(state: TableColumnState[]) => void'
    description: Emitted with the complete state array when the user changes or resets column settings.
    default: null
    usage: '#column-settings'
  - name: columnStorageError
    type: "(event: { operation: 'read' | 'write'; error: unknown }) => void"
    description: Emitted when local settings cannot be read or written; table interaction remains available.
    default: null
    usage: '#remember-column-settings'
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
  - name: update:highlight
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
  - name: "edit-[column key]"
    type: "TableEditSlotParams"
    description: "Column editor slot; columns.slots.edit can specify another name."
    default: null
    usage: "#custom-editors"
  - name: "edit-cell"
    type: "TableEditSlotParams"
    description: "Generic editor slot with value, draftRow, setValue, commit and cancel."
    default: null
    usage: "#custom-editors"
  - name: "STableColumn.edit"
    type: "TableEditSlotParams"
    description: "Editor slot on a declarative column."
    default: null
    usage: "#custom-editors"
  - name: "detail"
    type: "TableDetailSlotParams"
    description: "Detail content with row, key, index, loaded data, reload and close."
    default: null
    usage: "#detail-rows"
  - name: "detail-loading"
    type: "TableDetailSlotParams"
    description: "Detail loading content."
    default: null
    usage: "#async-details"
  - name: "detail-error"
    type: "TableDetailSlotParams"
    description: "Detail error content; call reload to retry."
    default: null
    usage: "#async-details"
  - name: footer-[column key]
    type: TableFooterCellRenderParams
    description: Footer slot for a leaf column; columns.slots.footer can specify another name.
    default: null
    usage: '#footer-data-rows'
  - name: footer-cell
    type: TableFooterCellRenderParams
    description: Fallback slot for all footer cells.
    default: null
    usage: '#footer-data-rows'
  - name: STableColumn.footer
    type: TableFooterCellRenderParams
    description: Footer render slot on a declarative column.
    default: null
    usage: '#footer-data-rows'
  - name: STableColumn.columns
    type: Slot
    description: Nested column declarations inside STableColumn.
    usage: '#declarative-grouped-headers'
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
  - name: "validate"
    type: "(options?: TableValidateOptions) => Promise<TableValidationResult>"
    description: "Validate supplied data or a selected scope; includes loaded collapsed descendants without fetching children or remote pages."
    default: null
    usage: "#data-validation"
  - name: "validateRow"
    type: "(rowOrIndex: TableRow | number, options?: TableValidateOptions) => Promise<TableValidationResult>"
    description: "Validate all ruled fields in one row; normal indices refer to expanded current-page rows, generated sources use global indices."
    default: null
    usage: "#data-validation"
  - name: "validateCell"
    type: "(rowOrIndex: TableRow | number, columnOrIndex: TableColumn | string | number, options?: TableValidateOptions) => Promise<TableValidationResult>"
    description: "Validate one cell; ordinary columns accept an object, key, field or visible index, generated sources require global numeric indices."
    default: null
    usage: "#data-validation"
  - name: "clearValidation"
    type: "(rowKey?: TableRowKey, field?: string) => void"
    description: "Clear all errors or those for a row key and field; also cancel the current validation."
    default: null
    usage: "#data-validation"
  - name: "cancelValidation"
    type: "() => void"
    description: "Cancel current validation immediately, retaining previously completed errors and edit drafts."
    default: null
    usage: "#data-validation"
  - name: "getValidationErrors"
    type: "() => TableValidationError[]"
    description: "Get a snapshot of current errors, excluding stale rows or changed field values."
    default: null
    usage: "#data-validation"
  - name: "scrollToValidationError"
    type: "(error?: TableValidationError) => Promise<boolean>"
    description: "Locate an error, defaulting to the first, expanding ancestors and changing local pages. Returns false for refused controlled updates or filtered/hidden targets."
    default: null
    usage: "#data-validation"
  - name: "startEdit"
    type: "(rowOrIndex: TableRow | number, columnOrIndex: TableColumn | string | number) => Promise<boolean>"
    description: "Start and locate an editor; normal data accepts visible row/column indices, row objects and column fields/keys, while generated sources use global numeric indices."
    default: null
    usage: "#editing-virtual-data"
  - name: "commitEdit"
    type: "() => Promise<boolean>"
    description: "Commit and emit editCommit; returns true with no session and false on eligibility, data conflicts or validation failure."
    default: null
    usage: "#cell-and-row-editing"
  - name: "cancelEdit"
    type: "() => void"
    description: "Discard the active draft."
    default: null
    usage: "#cell-and-row-editing"
  - name: "getEditRecord"
    type: "() => TableEditRecord | null"
    description: "Read the active session and its draft change snapshot."
    default: null
    usage: "#cell-and-row-editing"
  - name: "toggleRowDetail"
    type: "(rowOrIndex: TableRow | number, expanded?: boolean) => Promise<void>"
    description: "Toggle a detail using a row or index; normal indices address visible rows, source indices address the full source."
    default: null
    usage: "#details-with-virtual-scrolling"
  - name: "setDetailExpandedKeys"
    type: "(keys: TableRowKey[]) => void"
    description: "Set detail keys; controlled mode emits a model update."
    default: null
    usage: "#detail-rows"
  - name: "reloadRowDetail"
    type: "(rowOrIndex: TableRow | number) => Promise<void>"
    description: "Reload an expanded detail; row and index rules match toggleRowDetail."
    default: null
    usage: "#async-details"
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

## Data validation

Set column `rules` or provide field-based `validation-rules`. Column rules take precedence; `rules: []` disables validation for that column. Rules support required values, types, numeric ranges, string or array lengths, regular expressions and synchronous or asynchronous `validator` functions. Values are not coerced. Optional empty values skip type and range checks but still run custom validators.

Enable `validation-config` explicitly to validate drafts before committing. Cell mode checks the current field; row mode checks every ruled field in that row. A failed check retains the draft without emitting `editCommit`. Manual `validateCell`, `validateRow` and `validate` calls also work without editing enabled.

Custom validators receive `value`, `draftRow` and `signal`. Return `true` or nothing to pass; return `false`, a message, an `Error`, or reject a Promise to fail. The name check below simulates a server check with a delay: `admin` is unavailable. Changing a draft, cancelling an edit or starting a new check invalidates the old request. Pass `signal` to `fetch` for remote checks.

Errors appear inside their cells with accessible associations for built-in editors. Custom editor slots also receive `error` and `validating`. Drafts remain editable and can be discarded while validation is pending.

<template #example><table-validation /></template>

<template #template>

@[code{109-163}](../.vuepress/components/table/validation.vue)

</template>

<template #script>

@[code{1-107}](../.vuepress/components/table/validation.vue)

</template>

<template #style>

@[code{165-179}](../.vuepress/components/table/validation.vue)

</template>

</card>

<card>

## Error navigation and scope

`validate()` checks all supplied data, including loaded collapsed descendants. `scope: 'view'` checks the filtered, expanded current page, including rows outside the mounted virtual window. Validation does not fetch unloaded children or remote pages.

By default, an error expands its ancestors, changes the local page, scrolls and receives focus. Set `scrollToError: false` to disable automatic navigation. Controlled pagination and expansion require the parent to accept updates; filtered rows and hidden columns are not forcibly restored. `scrollToValidationError()` reports whether navigation succeeded.

Use `clearValidation(rowKey?, field?)` to clear selected errors, or omit arguments to clear all. Old errors are not used for navigation after data, rules or field values change. Numeric row indices in ordinary data refer to expanded current-page rows; pass a row object to target another page, or validate the whole dataset.

<template #example><table-validation-navigation /></template>

<template #template>

@[code{49-78}](../.vuepress/components/table/validation-navigation.vue)

</template>

<template #script>

@[code{1-47}](../.vuepress/components/table/validation-navigation.vue)

</template>

<template #style>

@[code{80-94}](../.vuepress/components/table/validation-navigation.vue)

</template>

</card>

<card>

## Generated data validation

Generated sources use global numeric row and column indices. `validateCell(999_999, 99_998)` checks one distant position directly. Use `validate({ rows, columns })` to select targets without scanning the entire generated table. This example generates one million rows and 100,000 columns; one field in the last row is empty.

Full validation reads data on demand and periodically yields, but runtime still grows with the number of targets. Cancel through an `AbortSignal` or `cancelValidation()`. The default `maxErrors` is 100; reaching the limit stops validation with `truncated: true`. `checked` counts fields with rules that were checked. Cancellation returns `cancelled: true` without publishing partial results or overwriting prior errors. Check `valid` rather than treating an empty error array as success.

<template #example><table-validation-source /></template>

<template #template>

@[code{83-112}](../.vuepress/components/table/validation-source.vue)

</template>

<template #script>

@[code{1-81}](../.vuepress/components/table/validation-source.vue)

</template>

<template #style>

@[code{114-128}](../.vuepress/components/table/validation-source.vue)

</template>

</card>

<card>

## Cell and row editing

Enable `edit-config` and add `editor` to editable columns. Double-click starts cell editing by default. Use `mode: 'row'` for row editing, `trigger: 'click' | 'dblclick' | 'manual'` for activation, and `checkMethod` for eligibility. The archived project in this example is read-only.

Editing updates a draft. Accept `updatedRow` or `changes` from `editCommit` to update `data` or persist to a server; the table does not mutate business records. Enter commits a text input and Escape cancels; selects and date panels handle their own keys first. Use the Save button or Ctrl/⌘ + Enter for any editor. Tab to an editable cell, then press Enter or F2 to begin.

Switching targets commits the previous edit by default; set `onSwitch: 'cancel'` to discard it. Paging, sorting, filtering and column settings cancel by default; `onContextChange: 'commit'` submits instead. Replacing data or disabling editing cancels the session. A successful `commitEdit()` means changes were emitted, not that a remote request finished.

<template #example><table-editing /></template>

<template #template>

@[code{96-127}](../.vuepress/components/table/editing.vue)

</template>

<template #script>

@[code{1-94}](../.vuepress/components/table/editing.vue)

</template>

<template #style>

@[code{129-143}](../.vuepress/components/table/editing.vue)

</template>

</card>

<card>

## Editing lifecycle

Choose `edit-config.onSwitch` for moving to another cell (`commit` by default), and `onContextChange` for accepted sort, filter, page or column changes (`cancel` by default). Controlled query requests only end editing after the parent accepts the new state. Enter submits the draft; Escape discards it.

With virtual scrolling, `onScroll: 'keep'` preserves the draft when its editor leaves the rendered window. Use `commit` or `cancel` to end it instead. In row mode the policy runs when the last editor for that row leaves the window. Turn off pagination and enable virtual scrolling below to try this behavior.

Replacing the data array or the edited row object cancels the session with reason `data`. Removing the row, collapsing an ancestor, or shrinking a generated source past the active index cancels with reason `view`. These changes never automatically save a stale record. Other rows may be inserted or loaded without discarding the active draft; a change to the same field is checked for conflicts before commit. Listen to `editCommit` and `editCancel` for the result and reason.

<template #example><table-editing-lifecycle /></template>

<template #template>

@[code{103-169}](../.vuepress/components/table/editing-lifecycle.vue)

</template>

<template #script>

@[code{1-101}](../.vuepress/components/table/editing-lifecycle.vue)

</template>

<template #style>

@[code{171-191}](../.vuepress/components/table/editing-lifecycle.vue)

</template>

</card>

<card>

## Custom editors

Customize editors with `STableColumn #edit`, a column-specific `#edit-[key]` or generic `#edit-cell`. Call `setValue` to update the draft. `value` is the field draft and `draftRow` exposes other draft fields; do not mutate slot parameter objects directly.

Editor precedence is column-specific slot, generic editor slot, column `edit` function, named renderer `edit`, then the built-in editor. Display cells retain their existing rendering rules. This example starts row editing from an action button and reuses the library input and select.

<template #example><table-editing-custom /></template>

<template #template>

@[code{23-78}](../.vuepress/components/table/editing-custom.vue)

</template>

<template #script>

@[code{1-21}](../.vuepress/components/table/editing-custom.vue)

</template>

</card>

<card>

## Editing virtual data

Stable row keys and fields identify edits in a generated source. This example generates one million rows and 100,000 columns on demand, saving only changed fields. Send the `changes` patch to a server without constructing the full matrix.

Leaving the virtual viewport retains the current draft by default. Use `onScroll: 'commit'` or `'cancel'` to finish when the editor leaves the window; row mode applies this only after all editors for the row leave. `startEdit` scrolls to the target row and column and focuses the editor. Hidden columns cannot start editing.

<template #example><table-editing-source /></template>

<template #template>

@[code{66-95}](../.vuepress/components/table/editing-source.vue)

</template>

<template #script>

@[code{1-64}](../.vuepress/components/table/editing-source.vue)

</template>

<template #style>

@[code{97-108}](../.vuepress/components/table/editing-source.vue)

</template>

</card>

<card>

## Detail rows

Add a `type: 'expand'` column and use `#detail` for details, forms or nested tables. `v-model:detail-expanded-keys` uses stable row keys independently of tree `expanded-keys`. Focus the trigger with Tab and activate it with Enter or Space.

Without a controlled model, use `detailConfig.defaultExpandedKeys` for initial expansion and `checkMethod` to restrict eligible rows. Keep form values in application state: slot components unmount when collapsed or outside the virtual window.

<template #example><table-details /></template>

<template #template>

@[code{35-68}](../.vuepress/components/table/details.vue)

</template>

<template #script>

@[code{1-33}](../.vuepress/components/table/details.vue)

</template>

<template #style>

@[code{70-88}](../.vuepress/components/table/details.vue)

</template>

</card>

<card>

## Async details

Load details with `detailConfig.load`; the resolved result is passed to `#detail` as `data`. Customize progress and failures with `#detail-loading` and `#detail-error`, and call `reload()` to fetch again.

Collapsing, disabling details, replacing the data array or loader, and unmounting cancel affected requests and ignore stale results. Pass `signal` to your request client. Expanded records retain loaded data outside the virtual window; collapsing clears it, and replacing the data array reloads it.

This example waits 800ms. The second report fails on its first attempt so you can try the retry action.

<template #example><table-details-async /></template>

<template #template>

@[code{42-60}](../.vuepress/components/table/details-async.vue)

</template>

<template #script>

@[code{1-40}](../.vuepress/components/table/details-async.vue)

</template>

<template #style>

@[code{62-66}](../.vuepress/components/table/details-async.vue)

</template>

</card>

<card>

## Details with virtual scrolling

Details are measured together with their data row. Enabling details automatically enables dynamic measurement; shrinking content and collapsing trigger a new measurement. The panel stays within the visible table width while columns scroll horizontally.

Enable `detail-config` explicitly with a generated source and provide stable `rowKey` values. This example generates one million rows and 100,000 columns on demand, recording only expanded keys. `toggleRowDetail(index)` accepts a global source index; normal data uses the current visible index after sorting, filtering, pagination and tree expansion. For object arguments, use the row supplied by the current render or slot.

<template #example><table-details-source /></template>

<template #template>

@[code{32-66}](../.vuepress/components/table/details-source.vue)

</template>

<template #script>

@[code{1-30}](../.vuepress/components/table/details-source.vue)

</template>

<template #style>

@[code{68-83}](../.vuepress/components/table/details-source.vue)

</template>

</card>

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

## Column settings

Enable `column-manager-config` to show or hide columns, change their order with the up/down buttons, fix them to either edge, and restore defaults. Fixed columns stay at their designated edge; ordering controls their position within that region. Hiding a column preserves its sorting, filtering and row-selection behavior.

Use `v-model:column-state` with `TableColumnState[]`, or omit it for internal state. Entries identify columns by `key`, falling back to the column's `field` and then `@index`. Provide stable, unique keys when saving settings. For `virtualSource`, use the original column index as a string.

`hidden` controls visibility, `fixed` accepts `false`, `left` or `right`, and `order` is a zero-based position including hidden columns. Unspecified settings use the column definition; unknown keys are ignored. Restoring defaults clears column settings; widths remain independently managed by `column-widths`.

The panel supports keyboard interaction: PageUp / PageDown move through the column list, and Escape closes it and returns focus to the trigger.

<template #example><table-column-manager /></template>

<template #template>

@[code{77-111}](../.vuepress/components/table/column-manager.vue)

</template>

<template #script>

@[code{1-75}](../.vuepress/components/table/column-manager.vue)

</template>

<template #style>

@[code{113-126}](../.vuepress/components/table/column-manager.vue)

</template>

</card>

<card>

## Remember column settings

Set a unique `column-manager-config.storageKey` to save settings in the current browser's localStorage. Storage is untouched when no key is supplied. Use different keys for different tables or users.

Uncontrolled tables restore saved settings on mount. Controlled tables use the parent's `column-state` and only persist accepted state; the application owns initial restoration. Restoring defaults saves an empty state. Listen to `column-storage-error` to handle unavailable storage or quota errors.

<template #example><table-column-persistence /></template>

<template #template>

@[code{8-17}](../.vuepress/components/table/column-persistence.vue)

</template>

<template #script>

@[code{1-6}](../.vuepress/components/table/column-persistence.vue)

</template>

</card>

<card>

## Grouped headers

Nest columns with `children`. Group titles span adjacent visible leaves, while shallower leaf headers span multiple rows. Configure sorting, filtering and resizing on leaf columns. A group's `fixed` value is inherited; set a child to `fixed: false` to leave it unfixed.

Column settings can hide, reorder or pin individual leaves. A group splits into separate title segments when its leaves are no longer adjacent. Data cells continue to use each leaf's field, slot or renderer.

<template #example><table-grouped-headers /></template>

<template #template>

@[code{47-69}](../.vuepress/components/table/grouped-headers.vue)

</template>

<template #script>

@[code{1-45}](../.vuepress/components/table/grouped-headers.vue)

</template>

<template #style>

@[code{71-78}](../.vuepress/components/table/grouped-headers.vue)

</template>

</card>

<card>

## Declarative grouped headers

Nest column declarations in an `STableColumn` `#columns` slot. Keep `#default` for leaf cell content and use `#header` for a custom group title. You can also pass a `children` array.

<template #example><table-grouped-declarations /></template>

<template #template>

@[code{8-28}](../.vuepress/components/table/grouped-declarations.vue)

</template>

<template #script>

@[code{1-6}](../.vuepress/components/table/grouped-declarations.vue)

</template>

</card>

<card>

## Generated grouped headers

Use `virtualSource.headerPath(index)` to return a leaf's ancestors, from outermost to innermost, with stable keys and titles. Set `headerDepth` to the total number of levels including leaves so the number of header rows stays stable across horizontal windows. Ancestors beyond that depth are truncated. The callback reads only the current column window and fixed columns.

This example provides one million rows and 100,000 columns on demand. Jump to the end, resize columns or open column settings. The application owns sorting and filtering for generated data.

<template #example><table-grouped-source /></template>

<template #template>

@[code{37-55}](../.vuepress/components/table/grouped-source.vue)

</template>

<template #script>

@[code{1-35}](../.vuepress/components/table/grouped-source.vue)

</template>

<template #style>

@[code{57-64}](../.vuepress/components/table/grouped-source.vue)

</template>

</card>

<card>

## Footer data rows

Provide one or more footer records through `footer-data`, using the leaf columns' fields. Footer rows share column widths, fixed positions and horizontal scrolling with the body, including visibility and order changes from column settings. Set `footer-row-key` for stable row identities.

Calculate footer data in the application or fetch it from the server. It is independent of body sorting, filtering and pagination. The totals and averages below cover all supplied orders. To summarize the current page or filtered results, update `footer-data` using that scope.

Rendering precedence: column footer slot, generic `footer-cell` slot, column `footer`, named or inline renderer's `footer`, `footerFormatter`, then raw field value. Footers do not reuse body render functions or generate selection, sequence or tree controls. Configure `footerAlign` and `showFooterOverflow` independently.

<template #example><table-footer-data /></template>

<template #template>

@[code{79-101}](../.vuepress/components/table/footer-data.vue)

</template>

<template #script>

@[code{1-77}](../.vuepress/components/table/footer-data.vue)

</template>

<template #style>

@[code{103-110}](../.vuepress/components/table/footer-data.vue)

</template>

</card>

<card>

## Declarative footers and the bottom slot

Use `#footer` on `STableColumn` to customize a footer cell; `#default` continues to render body cells. The table-level `#footer` slot is a bottom toolbar or note. It can coexist with the column-aligned footer data rows.

<template #example><table-footer-declarations /></template>

<template #template>

@[code{11-38}](../.vuepress/components/table/footer-declarations.vue)

</template>

<template #script>

@[code{1-9}](../.vuepress/components/table/footer-declarations.vue)

</template>

</card>

<card>

## Virtual columns and footers

Footers render only the current horizontal window and fixed columns. Measured maximum footer row heights are retained across windows within the same layout. Column widths, container width, column settings or footer data changes reset measurements. Call `measure()` after custom content shrinks if needed.

This example computes totals and averages for one million rows and 100,000 columns with a formula, without enumerating the generated data. Jump to the end, resize columns or switch to an empty body to try footer scrolling. Applications can supply server-generated summaries directly.

<template #example><table-footer-source /></template>

<template #template>

@[code{47-68}](../.vuepress/components/table/footer-source.vue)

</template>

<template #script>

@[code{1-45}](../.vuepress/components/table/footer-source.vue)

</template>

<template #style>

@[code{70-77}](../.vuepress/components/table/footer-source.vue)

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

Bind the highlighted row with `v-model:highlight`; add `multiple` when the model should be an array.

<template #example><table-selection /></template>

<template #template>

@[code{24-35}](../.vuepress/components/table/selection.vue)

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
