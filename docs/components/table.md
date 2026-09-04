---
description: 'Data tables with sorting, filtering, pagination, tree data and virtual scrolling.'
PROPS:
  - name: "row"
    type: "TableRow | TableRow[] | null"
    description: "Deprecated named selection model; migrate to v-model:highlight. An explicit highlight takes precedence."
    default: null
    usage: "#row-selection"
  - name: "model-value"
    type: "TableModelValueType | TableModelValueType[] | null"
    description: "Legacy unnamed selection model; migrate to v-model:highlight. Used only when neither highlight nor row is provided."
    default: null
    usage: "#row-selection"
  - name: "chart-config"
    type: "Boolean | TableChartConfig"
    description: "Enable chart data extraction, budgets, conversions and an optional drawing adapter."
    default: false
    usage: "#chart-integration"
  - name: "find-config"
    type: "Boolean | TableFindConfig"
    description: "Enable search UI, scopes, conversions and processing limits."
    default: false
    usage: "#find-and-replace"
  - name: "clipboard-config"
    type: "Boolean | TableClipboardConfig"
    description: "Enable clipboard actions, text conversions, write restrictions and region limits."
    default: false
    usage: "#copy-cut-and-paste"
  - name: "range-config"
    type: "Boolean | TableRangeConfig"
    description: "Enable rectangular range selection, with independent mouse, keyboard and edge-scrolling options."
    default: "false"
    usage: "#cell-range-selection"
  - name: "cell-range"
    type: "TableCellRange | null"
    description: "Control anchor and focus addresses through v-model:cell-range; omit for internal state."
    default: null
    usage: "#cell-range-selection"
  - name: "group-config"
    type: "Boolean | TableGroupConfig"
    description: "Configure local/remote row grouping, aggregates and summary scope."
    default: false
    usage: "#row-grouping-and-aggregation"
  - name: "group-expanded-keys"
    type: "string[]"
    description: "Control expanded groups with v-model:group-expanded-keys; omit for internal state."
    default: null
    usage: "#row-grouping-and-aggregation"
  - name: "merge-config"
    type: "Boolean | TableMergeConfig"
    description: "Merge body and footer cells using positional ranges or synchronous window-based rules."
    default: false
    usage: "#merging-cells"
  - name: "context-menu-config"
    type: "Boolean | TableContextMenuConfig"
    description: "Configure header, body and footer items, dynamic factories and visibility predicates."
    default: false
    usage: "#context-menus"
  - name: "keyboard-config"
    type: "Boolean | TableKeyboardConfig"
    description: "Enable cell navigation, Enter editing and generated row-key resolution."
    default: false
    usage: "#keyboard-navigation"
  - name: "active-cell"
    type: "TableActiveCell | null"
    description: "Control the active cell with v-model:active-cell; omit for internal state."
    default: null
    usage: "#keyboard-navigation"
  - name: "row-drag-config"
    type: "Boolean | TableRowDragConfig"
    description: "Enable row dragging, predicates, edge scrolling and controlled adapters."
    default: false
    usage: "#row-reordering"
  - name: "history-config"
    type: "Boolean | TableHistoryConfig"
    description: "Enable operation history together with change-config; limit defaults to the latest 100 operations."
    default: false
    usage: "#undo-and-redo"
  - name: "change-config"
    type: "Boolean | TableChangeConfig"
    description: "Enable controlled data mutations and tracking; ordinary arrays use v-model:data, generated sources supply apply and indexOf."
    default: false
    usage: "#change-tracking"
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
    default: ""
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
  - name: "key"
    type: "String"
    description: "Stable column identity in columns configuration. With STableColumn, use the Vue key attribute."
    default: null
    usage: "#declarative-columns"
  - name: "class-name"
    type: "String"
    description: "Custom class on data cells in this column."
    default: null
    usage: "#slots-and-renderers"
  - name: "cell"
    type: "TableCellRenderer"
    description: "Cell render function, used after column-specific and generic cell slots."
    default: null
    usage: "#slots-and-renderers"
  - name: "header"
    type: "TableHeaderRenderer"
    description: "Header render function, used after column-specific and generic header slots."
    default: null
    usage: "#slots-and-renderers"
  - name: "drag-sort"
    type: "Boolean"
    description: "Show a row drag handle in this column when row-drag-config is enabled."
    default: false
    usage: "#row-reordering"
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
  - name: "update:row"
    type: "(value: TableRow | TableRow[] | null) => void"
    description: "Compatibility selection update for v-model:row; use update:highlight in new code."
    default: null
    usage: "#row-selection"
  - name: "update:modelValue"
    type: "(value: TableModelValueType | TableModelValueType[] | null) => void"
    description: "Compatibility update for the unnamed model; use update:highlight in new code."
    default: null
    usage: "#row-selection"
  - name: "chartChange"
    type: "(state: TableChartState) => void"
    description: "Chart extraction, snapshot or panel state changed."
    default: null
    usage: "#chart-integration"
  - name: "chartError"
    type: "(error: unknown) => void"
    description: "The drawing adapter failed while mounting, resizing or disposing."
    default: null
    usage: "#chart-integration"
  - name: "findChange"
    type: "(state: TableFindState) => void"
    description: "Search progress, matches, active index or cleared state changed."
    default: null
    usage: "#find-and-replace"
  - name: "replace"
    type: "(result: TableReplaceResult) => void"
    description: "Replacement completed with changed-cell count, validation errors or failure reason."
    default: null
    usage: "#find-and-replace"
  - name: "clipboard"
    type: "(result: TableClipboardResult) => void"
    description: "Reports completion, OS clipboard status, applied cell count and failure reason."
    default: null
    usage: "#copy-cut-and-paste"
  - name: "update:cellRange"
    type: "(range: TableCellRange | null) => void"
    description: "Request a controlled range update."
    default: null
    usage: "#cell-range-selection"
  - name: "cellRangeChange"
    type: "(change: TableCellRangeChange) => void"
    description: "Emitted after the accepted range or logical bounds change, with range, bounds and reason."
    default: null
    usage: "#cell-range-selection"
  - name: "cellRangeError"
    type: "(error: unknown) => void"
    description: "Emitted when merge resolution for a range fails."
    default: null
    usage: "#cell-range-selection"
  - name: "update:groupExpandedKeys"
    type: "(keys: string[]) => void"
    description: "Request updated expanded group keys."
    default: null
    usage: "#row-grouping-and-aggregation"
  - name: "groupExpand"
    type: "(params: { group: TableGroupNode; expanded: boolean }) => void"
    description: "Emitted after an expansion change is accepted."
    default: null
    usage: "#row-grouping-and-aggregation"
  - name: "groupError"
    type: "(error: unknown) => void"
    description: "Grouping configuration or aggregation failed."
    default: null
    usage: "#row-grouping-and-aggregation"
  - name: "contextMenuOpen"
    type: "(context: TableContextMenuContext) => void"
    description: "A menu opens with its area and row/column context."
    default: null
    usage: "#context-menus"
  - name: "contextMenuSelect"
    type: "(params: TableContextMenuSelectParams) => void"
    description: "An enabled item is selected; the application performs its business action."
    default: null
    usage: "#context-menus"
  - name: "contextMenuClose"
    type: "(context: TableContextMenuContext) => void"
    description: "A menu closes with its previous context."
    default: null
    usage: "#context-menus"
  - name: "update:activeCell"
    type: "(cell: TableActiveCell | null) => void"
    description: "Request an active-cell update independently of row selection."
    default: null
    usage: "#keyboard-navigation"
  - name: "activeCellChange"
    type: "(cell: TableActiveCell | null) => void"
    description: "Emitted when the accepted active-cell address changes."
    default: null
    usage: "#keyboard-navigation"
  - name: "rowDragStart"
    type: "(context: TableRowDragContext) => void"
    description: "A pointer or keyboard interaction picks up a row."
    default: null
    usage: "#row-reordering"
  - name: "rowDragEnd"
    type: "(result: TableRowDragResult) => void"
    description: "A drag or moveRow operation ends; inspect applied and reason."
    default: null
    usage: "#row-reordering"
  - name: "historyChange"
    type: "(state: TableHistoryState) => void"
    description: "Emitted when history changes, with undo/redo counts and availability."
    default: null
    usage: "#undo-and-redo"
  - name: "update:data"
    type: "(data: TableRow[]) => void"
    description: "Proposed ordinary array; recorded only after the parent accepts it."
    default: null
    usage: "#change-tracking"
  - name: "dataChange"
    type: "(operations: TableDataMutation[]) => void"
    description: "Fired after the owner accepts data and the journal commits, including reverts."
    default: null
    usage: "#change-tracking"
  - name: "changesChange"
    type: "(version: number) => void"
    description: "Journal version changed; call getChangeRecords to read its snapshot."
    default: null
    usage: "#change-tracking"
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
  - name: "STableColumn.default"
    type: "TableCellRenderParams"
    description: "Cell content on a declarative column."
    default: null
    usage: "#declarative-columns"
  - name: "STableColumn.header"
    type: "TableHeaderRenderParams"
    description: "Header content on a declarative leaf or grouped column."
    default: null
    usage: "#declarative-grouped-headers"
  - name: "group-header"
    type: "{ group: TableGroupNode; expanded: boolean }"
    description: "Group heading content alongside the built-in expand button."
    default: null
    usage: "#row-grouping-and-aggregation"
  - name: "group-summary"
    type: "TableFooterCellRenderParams & { group?: TableGroupNode; kind: string }"
    description: "Subtotal or overall summary cell."
    default: null
    usage: "#row-grouping-and-aggregation"
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
    type: TableCellRenderParams
    description: Column-specific cell content receiving row, column, value and rowIndex.
  - name: cell
    type: TableCellRenderParams
    description: Fallback cell content for every column.
  - name: header-[column key]
    type: TableHeaderRenderParams
    description: Column-specific header content.
  - name: header-cell
    type: TableHeaderRenderParams
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
  - name: "getChartData"
    type: "(options: TableChartOptions) => Promise<TableChartResult>"
    description: "Extract a readonly chart snapshot without opening a panel. scope and series are required; bounds is only for selection, while aggregate/groupKeys/summaryLabel are for aggregate scope."
    default: null
    usage: "#chart-integration"
  - name: "openChart"
    type: "(options: TableChartOptions) => Promise<TableChartResult>"
    description: "Extract complete data and open the panel; requires an adapter."
    default: null
    usage: "#chart-integration"
  - name: "closeChart"
    type: "() => void"
    description: "Close the panel, cancel extraction and clear the snapshot."
    default: null
    usage: "#chart-integration"
  - name: "cancelChart"
    type: "() => void"
    description: "Cancel pending data extraction."
    default: null
    usage: "#chart-integration"
  - name: "getChartState"
    type: "() => TableChartState"
    description: "Read extraction and panel state."
    default: null
    usage: "#chart-integration"
  - name: "findCells"
    type: "(query: string | TableFindQuery, options?: TableFindOptions) => Promise<TableFindResult>"
    description: "Search the chosen scope and return matches and completion limits. scope defaults to findConfig.scope, then view; bounds is invalid with data scope, and columns: [] searches nothing."
    default: null
    usage: "#find-and-replace"
  - name: "findNext"
    type: "(options?: TableFindNavigateOptions) => Promise<boolean>"
    description: "Move to the next match, wrapping at the end; resolve whether positioning succeeded."
    default: null
    usage: "#find-and-replace"
  - name: "findPrevious"
    type: "(options?: TableFindNavigateOptions) => Promise<boolean>"
    description: "Move to the previous match; focus: false preserves the current input focus."
    default: null
    usage: "#find-and-replace"
  - name: "replaceMatch"
    type: "(replacement: string, options?: TableReplaceOptions) => Promise<TableReplaceResult>"
    description: "Replace all literal occurrences inside the active or indexed matching cell."
    default: null
    usage: "#find-and-replace"
  - name: "replaceAll"
    type: "(replacement: string, options?: TableReplaceOptions) => Promise<TableReplaceResult>"
    description: "Validate and replace writable matches in one transaction; requires a complete search. options.index is ignored; it only applies to replaceMatch."
    default: null
    usage: "#find-and-replace"
  - name: "getFindState"
    type: "() => TableFindState"
    description: "Return query, scope, match summaries, active index, progress and limits."
    default: null
    usage: "#find-and-replace"
  - name: "clearFind"
    type: "() => void"
    description: "Cancel pending work and clear matches while retaining the query."
    default: null
    usage: "#find-and-replace"
  - name: "cancelFind"
    type: "() => void"
    description: "Cancel pending search, positioning or replacement work."
    default: null
    usage: "#find-and-replace"
  - name: "openFind"
    type: "() => Promise<boolean>"
    description: "Open and focus the built-in panel; false when disabled or panel: false."
    default: null
    usage: "#find-and-replace"
  - name: "closeFind"
    type: "() => void"
    description: "Close the panel, cancel pending work and restore its trigger focus when appropriate."
    default: null
    usage: "#find-and-replace"
  - name: "copyCells"
    type: "(options?: TableCopyOptions) => Promise<TableClipboardResult>"
    description: "Copy the range or bounds; writeClipboard: false returns a snapshot and TSV without OS access."
    default: null
    usage: "#copy-cut-and-paste"
  - name: "cutCells"
    type: "(options?: TableCopyOptions) => Promise<TableClipboardResult>"
    description: "After copying, validate and clear writable fields in one batch; the default clear value is null."
    default: null
    usage: "#copy-cut-and-paste"
  - name: "pasteCells"
    type: "(data?: string | TableClipboardData, options?: TableClipboardOptions) => Promise<TableClipboardResult>"
    description: "Paste TSV or a 2D matrix; omit data to read the browser clipboard. A single target cell expands to the payload size; a larger target must be a whole multiple of the payload rectangle."
    default: null
    usage: "#copy-cut-and-paste"
  - name: "cancelClipboard"
    type: "() => void"
    description: "Cancel pending reading, preparation, validation or data acceptance; completed OS clipboard writes are not undone."
    default: null
    usage: "#copy-cut-and-paste"
  - name: "setCellRange"
    type: "(range: TableCellRange | null) => Promise<boolean>"
    description: "Set a logical range and resolve whether it was accepted, without moving the viewport."
    default: null
    usage: "#cell-range-selection"
  - name: "clearCellRange"
    type: "() => Promise<boolean>"
    description: "Clear the range while preserving the active cell."
    default: null
    usage: "#cell-range-selection"
  - name: "getCellRange"
    type: "() => TableCellRange | null"
    description: "Read a copy of the range endpoints."
    default: null
    usage: "#cell-range-selection"
  - name: "getCellRangeBounds"
    type: "() => TableCellRangeBounds | null"
    description: "Read half-open visible data-row and visual-column bounds, excluding group and detail bands."
    default: null
    usage: "#cell-range-selection"
  - name: "getGroups"
    type: "() => readonly TableGroupNode[]"
    description: "Read current group metadata."
    default: null
    usage: "#row-grouping-and-aggregation"
  - name: "getGroupSummary"
    type: "() => Readonly<Record<string, unknown>>"
    description: "Read overall aggregate results."
    default: null
    usage: "#row-grouping-and-aggregation"
  - name: "toggleGroup"
    type: "(key: string, expanded?: boolean) => Promise<boolean>"
    description: "Toggle one group and report whether the update was accepted."
    default: null
    usage: "#row-grouping-and-aggregation"
  - name: "setGroupExpandedKeys"
    type: "(keys: readonly string[]) => Promise<boolean>"
    description: "Set expanded group keys and report whether the update was accepted."
    default: null
    usage: "#row-grouping-and-aggregation"
  - name: "closeContextMenu"
    type: "() => void"
    description: "Close the menu and restore the originating cell if focus is still inside the menu."
    default: null
    usage: "#context-menus"
  - name: "setActiveCell"
    type: "(rowIndex: number, columnIndex: number) => Promise<boolean>"
    description: "Activate and locate a cell; resolves whether focus succeeded. Ordinary data uses flattened-page rows and resolved columns; generated data uses absolute source indices."
    default: null
    usage: "#keyboard-navigation"
  - name: "clearActiveCell"
    type: "() => Promise<boolean>"
    description: "Clear activity; resolves false when the controlled model refuses."
    default: null
    usage: "#keyboard-navigation"
  - name: "getActiveCell"
    type: "() => TableActiveCell | null"
    description: "Read a copy of the current valid active-cell address."
    default: null
    usage: "#keyboard-navigation"
  - name: "moveRow"
    type: "(from: number, to: number, position?: TableRowDropPosition) => Promise<TableRowDragResult>"
    description: "Move using current flattened-page indices; position defaults to before."
    default: null
    usage: "#row-reordering"
  - name: "cancelRowDrag"
    type: "() => void"
    description: "Cancel dragging or a pending reorder adapter."
    default: null
    usage: "#row-reordering"
  - name: "undo"
    type: "() => Promise<TableDataMutationResult>"
    description: "Undo the latest accepted operation; commit or cancel an active draft first."
    default: null
    usage: "#undo-and-redo"
  - name: "redo"
    type: "() => Promise<TableDataMutationResult>"
    description: "Redo the latest undone operation; rejection or cancellation does not move history."
    default: null
    usage: "#undo-and-redo"
  - name: "clearHistory"
    type: "() => void"
    description: "Clear undo/redo history and cancel pending proposals, retaining data and tracked changes."
    default: null
    usage: "#undo-and-redo"
  - name: "getHistoryState"
    type: "() => TableHistoryState"
    description: "Read history counts and availability; this does not indicate whether a request or draft is active."
    default: null
    usage: "#undo-and-redo"
  - name: "insertRows"
    type: "(rows: TableRow[], position?: Partial<TableDataPosition>) => Promise<TableDataMutationResult>"
    description: "Insert rows in source order, optionally under parentKey. Indices address source siblings, not sorted or paged rows."
    default: null
    usage: "#change-tracking"
  - name: "removeRows"
    type: "(rowKeys: TableRowKey[]) => Promise<TableDataMutationResult>"
    description: "Remove rows by stable key; removing a tree parent includes its loaded descendants."
    default: null
    usage: "#change-tracking"
  - name: "updateRow"
    type: "(rowKey: TableRowKey, values: Record<string, unknown>) => Promise<TableDataMutationResult>"
    description: "Apply field values by key; dot paths are supported. Does not invoke editor validation. Stable keys and tree children cannot be overwritten."
    default: null
    usage: "#change-tracking"
  - name: "revertChanges"
    type: "(rowKeys?: TableRowKey[]) => Promise<TableDataMutationResult>"
    description: "Revert selected rows and their loaded or removed descendants; omit keys to revert all unconfirmed changes."
    default: null
    usage: "#change-tracking"
  - name: "getChangeRecords"
    type: "() => TableChangeRecords"
    description: "Read the journal version and inserted, updated and removed records. Field changes are snapshots; rows are read-only references."
    default: null
    usage: "#change-tracking"
  - name: "acceptChanges"
    type: "(version: number, rowKeys?: TableRowKey[]) => boolean"
    description: "Confirm a saved version as baseline without changing data. Reject stale versions and pending requests; optional keys confirm only those records."
    default: null
    usage: "#change-tracking"
  - name: "resetChanges"
    type: "() => void"
    description: "Cancel pending ownership requests and discard the journal, retaining current data as baseline."
    default: null
    usage: "#change-tracking"
  - name: "cancelDataChange"
    type: "() => void"
    description: "Abort the pending ownership request; preserve previously accepted changes and current editor drafts."
    default: null
    usage: "#change-tracking"
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
    type: '(row: TableRow, expanded?: boolean) => Promise<void>'
    description: 'Expands or collapses a row object in the currently expanded tree data, including other local pages; omit expanded to toggle. Waits for lazy loading when needed; load failures reject the Promise.'
  - name: setExpandedKeys
    type: '(keys: TableRowKey[]) => void'
    description: 'Replaces the tree expansion key set and emits update:expandedKeys. Does not load missing children; use toggleRowExpand to trigger lazy loading.'
  - name: scrollToRow
    type: "(rowOrIndex: TableRow | TableRowKey, align?: 'auto' | 'start' | 'center' | 'end') => void"
    description: 'Scrolls within the current flattened page. Ordinary data accepts the original row object or a row key; a number first matches a key, then falls back to a zero-based page index. virtualSource accepts only absolute numeric source indices on the current page. Does not expand ancestors or switch pages. align defaults to auto.'
  - name: scrollToColumn
    type: "(columnOrIndex: TableColumn | string | number, align?: 'auto' | 'start' | 'center' | 'end') => void"
    description: 'Scrolls a visible center column. Ordinary data accepts a resolved column index, key, field or column object; virtualSource requires an absolute numeric column index. Hidden, fixed and missing columns do not scroll. align defaults to auto.'
  - name: measure
    type: '() => Promise<void>'
    description: 'After the next Vue update, resets virtual row and merged-cell measurements, requests footer measurement and refreshes the horizontal viewport. Resolves when these requests run; later ResizeObserver updates may still follow.'
---

# Table

<card>

## Row grouping and aggregation

Use `group-config.fields` for nested field grouping. Groups are built after sorting, filtering and pagination. A tree root and its currently expanded descendants remain in one branch. Headings and subtotals are separate from selectable/editable data rows. Double-click Hours to edit; accepted updates recalculate aggregates.

Each subtotal includes all supplied members of that group, independent of collapse state. The overall `summaryScope` defaults to `page`; `filtered` includes supplied visible tree rows matching the filter across local pages. It does not load collapsed or lazy descendants. With remote pagination, unavailable pages are outside the local aggregation scope.

An aggregate `key` addresses its summary column field. `count` counts records; `sum`, `average`, `min` and `max` accept finite numbers only. Empty sum/count results are 0, other empty results are null; numeric overflow returns null. A custom aggregate supplies independent `initial`, `step` and optional `finish` functions without collecting a values array.

Control expansion with `v-model:group-expanded-keys`; rejected updates preserve the displayed state. Group values support primitives and dates; normalize object fields using a `value` function. Invalid configuration or calculation emits `group-error` and restores the original row display.

<template #example><table-grouping /></template>

<template #template>

@[code{111-151}](../.vuepress/components/table/grouping.vue)

</template>

<template #script>

@[code{1-109}](../.vuepress/components/table/grouping.vue)

</template>

<template #style>

@[code{153-165}](../.vuepress/components/table/grouping.vue)

</template>

</card>

<card>

## Requesting grouped pages

The simulated service returns page data, page-relative group ranges and an overall summary. `STableGrid` owns requests, pagination, cancellation and error feedback. Group metadata follows the accepted page, so stale, cancelled or failed responses do not replace the displayed groups or totals.

With a real endpoint, return contiguous group members and `TableGroupRemoteResult` from the service. Subtotals cover supplied page members; the service defines the overall summary scope. Here it includes hours from all 24 records.

<template #example><table-grouping-remote /></template>

<template #template>

@[code{85-115}](../.vuepress/components/table/grouping-remote.vue)

</template>

<template #script>

@[code{1-83}](../.vuepress/components/table/grouping-remote.vue)

</template>

</card>

<card>

## Remote groups and virtual rows

Generated sources use `mode: remote`. The application supplies `remote.groups` with starts, counts, children and aggregates, plus `remote.summary`. Fetching and cancellation can use the existing Grid request proxy; pass the current server result into this configuration. The table does not scan generated rows to infer groups. Remote ranges use page data indices for ordinary arrays and absolute source indices for generated sources. Sibling ranges must be ordered, disjoint and inside their parent; uncovered rows remain visible.

This example provides formula-based metadata for one million rows and one hundred thousand columns. Open last batch updates expansion before locating the final cell. Collapsed members have no visible data address; expand their group before programmatic navigation. Group headings, subtotals and data share a virtual window, with range metadata proportional to group count. Local grouping/aggregation processes supplied rows synchronously, so computation and storage grow with rows and group depth; use server aggregation for large global datasets.

<template #example><table-grouping-source /></template>

<template #template>

@[code{52-78}](../.vuepress/components/table/grouping-source.vue)

</template>

<template #script>

@[code{1-50}](../.vuepress/components/table/grouping-source.vue)

</template>

<template #style>

@[code{80-95}](../.vuepress/components/table/grouping-source.vue)

</template>

</card>

<card>

## Merging cells

Use `merge-config.body` and `merge-config.footer` for body and footer ranges. Each range has zero-based `row` and `col` positions, plus positive `rowspan` and `colspan` values. A merged region displays its starting cell, retaining that column's slots, formatting and interactions.

For ordinary data, `row` refers to the current displayed rows after sorting, filtering, pagination and tree expansion; footer rows refer to `footer-data`. `col` follows visible fixed-left, center and fixed-right column order. Static ranges follow positions, so a query, page or column-order change applies them to the cells at the new positions. Recalculate ranges when grouping by content.

This example merges adjacent team labels and independently merges the footer label. Arrow keys and Tab skip covered cells. Ranges crossing fixed-column boundaries are drawn in separate sections, with a single copy of the content and interactive controls.

Out-of-bounds spans are clipped to the available rows and columns. Invalid ranges are ignored; when ranges overlap, the first valid range wins. A 1 × 1 range has no effect. Setting the configuration to `false` or `enabled: false` restores individual cells.

<template #example><table-merging /></template>

<template #template>

@[code{40-52}](../.vuepress/components/table/merging.vue)

</template>

<template #script>

@[code{1-38}](../.vuepress/components/table/merging.vue)

</template>

<template #style>

@[code{54-61}](../.vuepress/components/table/merging.vue)

</template>

</card>

<card>

## Editing and details in merged rows

Double-click a team or project cell to edit, then save the update or cancel the draft. Editing a merged team changes only its origin row, leaving covered rows unchanged. Expand a project with the first column: merged regions split around its details, while the detail input remains independent. Toggle virtual rows and drag a header boundary to adjust column widths.

<template #example><table-merging-edit /></template>

<template #template>

@[code{61-101}](../.vuepress/components/table/merging-edit.vue)

</template>

<template #script>

@[code{1-59}](../.vuepress/components/table/merging-edit.vue)

</template>

<template #style>

@[code{103-122}](../.vuepress/components/table/merging-edit.vue)

</template>

</card>

<card>

## Virtual merged regions

For generated data, merge row positions are absolute source indices, including when pagination is enabled. A synchronous `body` or `footer` function receives a half-open window (`rowStart`, `rowEnd`, `colStart`, `colEnd`), the area, counts, and `rowAt` / `columnAt` accessors. Return complete ranges that intersect that window, including ranges whose origins precede it. The function may run separately for fixed and center columns, or for a programmatically requested cell; keep it deterministic and free of side effects. A thrown rule returns no merged ranges for that query.

The example groups four rows and eight columns per region over generated data. Use **Last region** to locate a covered cell at the end of both axes; the active address resolves to its region's origin. Enable multiline content to see natural height adjustment. Horizontal window changes retain the largest measured height; content changes, column layout changes and `measure()` allow a fresh measurement. Editing and cell interactions use the original region owner's row and column.

If content is taller than the visible viewport, scroll inside the merged cell to read the rest; a focused cell also supports Page Up / Page Down. Changing a merge rule during editing follows the configured column-change policy. A controlled active address that points to a covered cell requests an update to the origin address; accept that update to display the active state.

<template #example><table-merging-source /></template>

<template #template>

@[code{46-84}](../.vuepress/components/table/merging-source.vue)

</template>

<template #script>

@[code{1-44}](../.vuepress/components/table/merging-source.vue)

</template>

<template #style>

@[code{86-101}](../.vuepress/components/table/merging-source.vue)

</template>

</card>

<card>

## Context menus

Provide item arrays or synchronous context-to-items functions through `context-menu-config.header`, `body` and `footer`. A false `visibleMethod`, an empty region or a disabled configuration preserves the browser's native context menu. A throwing factory also falls back to the native menu.

`context.area` is `header`, `body` or `footer`; all include `column` and `columnIndex`. Headers add `group`, with grouped headers supplying the group column; their index identifies the first leaf in the rendered header segment. Body contexts include `row`, `rowKey`, `rowIndex`, the raw `value` and tree-node context. Footer contexts contain the summary row, footer row index and raw value. `contextMenuSelect` returns `{ context, item }`; the table does not automatically change data or execute business actions such as deletion.

Items reuse `ContextMenuItem`: `label`, `value`, `icon`, `disabled`, `divided` and `keepOpen`. Reactive factories can update disabled states; `keepOpen` supports repeated inspection. This example sorts from headers, inspects records or opens existing editors from body cells, and inspects footer summaries.

Focus a cell and press Shift + F10 or the context-menu key. Arrows and Home / End move menu focus; Enter / Space selects, Escape closes and restores the origin, and Tab closes before continuing navigation. Combine with `keyboard-config` for arrow navigation between data cells. Opening a menu does not select rows. Editors retain native menus and IME behavior.

Scrolling, paging, sorting, filtering, data replacement and column layout changes close the current menu. The shared floating layer handles outside clicks. Menus teleport by default so cards and virtual viewports cannot clip them.

<template #example><table-context-menu /></template>

<template #template>

@[code{58-98}](../.vuepress/components/table/context-menu.vue)

</template>

<template #script>

@[code{1-56}](../.vuepress/components/table/context-menu.vue)

</template>

<template #style>

@[code{100-114}](../.vuepress/components/table/context-menu.vue)

</template>

</card>

<card>

## Menus in virtual data

With `virtualSource`, body row and column indices are absolute source indices; footer `rowIndex` still refers to the footer array. Context is built only for the rendered hit cell, without enumerating the source. Select the last cell and press Shift + F10 to inspect the far boundary and fixed columns; footer menus use the same horizontal column window. Source replacement, scrolling and unmounting close stale contexts.

<template #example><table-context-menu-source /></template>

<template #template>

@[code{35-59}](../.vuepress/components/table/context-menu-source.vue)

</template>

<template #script>

@[code{1-33}](../.vuepress/components/table/context-menu-source.vue)

</template>

<template #style>

@[code{61-74}](../.vuepress/components/table/context-menu-source.vue)

</template>

</card>

<card>

## Cell range selection

Enable `range-config` and drag across cells to select a rectangle. Shift + click or Shift + arrow extends it, Ctrl / Command + A selects the current view, and Escape clears it. Drag near a viewport edge to scroll; Escape during dragging restores the previous range. Ranges, row highlighting and active-cell focus are independent.

`v-model:cell-range` stores stable `{ anchor, focus }` addresses. Intersecting merged cells are included in full. Ranges follow row and column keys after sorting or reordering; hidden endpoints, collapsed groups or page changes request clearing when an endpoint is no longer visible. Controlled models must accept updates.

<template #example><table-range /></template>

<template #template>

@[code{21-68}](../.vuepress/components/table/range.vue)

</template>

<template #script>

@[code{1-19}](../.vuepress/components/table/range.vue)

</template>

<template #style>

@[code{70-83}](../.vuepress/components/table/range.vue)

</template>

</card>

<card>

## Ranges across generated data

This example generates one million rows and 100,000 columns on demand. Fixed and scrolling columns share logical coordinates. Selecting the entire view stores endpoints and bounds without reading every cell; rendering stays limited to the visible window. Use `range-config.rowIndexOf` to map stable row keys to absolute source indices for offscreen programmatic selection.

Edge scrolling uses logical content pixels, preserving speed with compressed tracks. Merge resolvers must return complete regions intersecting the query rectangle. Large-range calculation cost depends on intersecting merge regions and can be cancelled by a newer gesture or context change.

<template #example><table-range-source /></template>

<template #template>

@[code{41-81}](../.vuepress/components/table/range-source.vue)

</template>

<template #script>

@[code{1-39}](../.vuepress/components/table/range-source.vue)

</template>

<template #style>

@[code{83-96}](../.vuepress/components/table/range-source.vue)

</template>

</card>

<card>

## Copy, cut and paste

Enable `clipboard-config` to use Ctrl / Command + C, X and V on the selected range, falling back to the active cell. Editors retain native text actions. Copying only needs clipboard configuration; cutting and pasting also require `edit-config`, column `editor` definitions and `change-config`. Accept ordinary array updates with `v-model:data`.

Copying produces an independent value matrix and TSV text. A single-cell target expands to the input dimensions; an existing rectangle must be a whole multiple of the input shape, including scalar fills. Read-only positions are skipped without shifting subsequent values. A merged owner is copied once with empty continuation slots; pasting must cover complete merges and rejects conflicting values. `bounds` uses half-open visible data-row and visual-column indices in the current view, excluding group bands; operations do not change pages.

With `validation-config`, written fields use existing rules and validators receive a `draftRow` containing the complete row candidate; `onCommit: false` skips this step. A failed field prevents the whole batch. Each paste or cut-clear occupies one history step when `history-config` is enabled. Cutting first copies, then clears writable cells with `clearCell` (default `null`); required rules may reject clearing while the result still reports `clipboardWritten: true`.

Buttons and `pasteCells()` without data use the browser Clipboard API, which requires a secure context and browser permission. Keyboard pastes can use the native paste event directly. `copyCells({ writeClipboard: false })` and `pasteCells(data)` with explicit data do not access the OS clipboard. Number editors parse numeric text and switches accept `true/false`; use `formatCell` and `parseCell` for other formats.

While the table has focus, press Escape or call `cancelClipboard()` to cancel pending work. Page/configuration changes, editing and data replacement invalidate old requests. Adapters must check `signal` before writing. Cancellation cannot roll back a completed OS clipboard write; `clipboardWritten: null` means a write started but its outcome was not confirmed.

The defaults are 10000 cells and 2000000 text characters, configurable with `maxCells` and `maxCharacters`. Limits count the full rectangle, including read-only and merged continuation slots. Selecting a huge region does not copy the full dataset. Applications control the size of structured 2D values; a cell limit is not a fixed memory budget.

<template #example><table-clipboard /></template>

<template #template>

@[code{72-128}](../.vuepress/components/table/clipboard.vue)

</template>

<template #script>

@[code{1-71}](../.vuepress/components/table/clipboard.vue)

</template>

<template #style>

@[code{129-143}](../.vuepress/components/table/clipboard.vue)

</template>

</card>

<card>

## Clipboard with generated data

Generated sources locate stable row keys through `change-config.indexOf` and accept field patches through `apply`; this example stores only edited values. The last merged region crosses the right fixed column and supports copy, paste and undo. Copying the whole selection returns a limit result before visiting a million rows by a hundred thousand columns. Region reads, row preparation and validation yield between batches; unloaded remote pages or tree nodes are not fetched automatically.

<template #example><table-clipboard-source /></template>

<template #template>

@[code{122-176}](../.vuepress/components/table/clipboard-source.vue)

</template>

<template #script>

@[code{1-121}](../.vuepress/components/table/clipboard-source.vue)

</template>

<template #style>

@[code{177-191}](../.vuepress/components/table/clipboard-source.vue)

</template>

</card>

<card>

## Chart integration

Enable `chart-config` to extract immutable snapshots with `getChartData(options)`. Add an `adapter` to open the panel with `openChart(options)`. The optional `createTableSvgChartAdapter()` export provides bar and line charts without introducing a chart engine into ordinary tables. The panel offers a data table, chart-type controls and a close button, with Tab focus containment and Escape closing.

`scope: 'selection'` uses the current cell range or explicit `bounds`; mapped columns must be inside that range, and numeric values in complete merged regions are counted once. `filtered` reads supplied, filtered and expanded tree rows before local pagination. It never fetches remote pages or unloaded children. `aggregate` consumes existing `group-config` statistics: root groups by default, explicit nested `groupKeys`, or the overall summary with `aggregate: 'summary'`. Statistics retain the grouping configuration's scope rather than recomputing other pages.

Choose the category column with `category` and numeric columns with `series`. For aggregate scope, `series.column` identifies an aggregate key. Only finite numbers become numeric values; missing values and numeric strings are gaps unless converted explicitly with `categoryMethod` or `valueMethod`. Equal category labels remain separate points, with stable row/group keys in `points`. Results are snapshots; call again to refresh. Data-reference, view, column or grouping-model changes cancel extraction and close the old panel.

Custom adapters implement `mount(container, { data, type, theme, signal })`, returning a handle with `dispose()` and optional `resize(width, height)`. Asynchronous mounting is supported. Data, type or theme changes abort the old signal and remount into a new container. Write only inside the provided container and release resources if mounting rejects. Closing or unmounting disposes the handle, including handles returned after cancellation. Adapter failures emit `chartError`; extraction failures are returned by the method.

<template #example><table-chart /></template>

<template #template>

@[code{62-92}](../.vuepress/components/table/chart.vue)

</template>

<template #script>

@[code{1-61}](../.vuepress/components/table/chart.vue)

</template>

<template #style>

@[code{93-107}](../.vuepress/components/table/chart.vue)

</template>

</card>

<card>

## Large-source charts

Extraction defaults to 1000 points, 32 series, 10000 cells and 2000000 metadata/category characters. Each point's category and all series count toward the cell budget. Exceeding a budget returns `reason: 'limit'` with an incomplete snapshot; `openChart` never displays a truncated chart. Narrow the scope or explicitly adjust the budget before retrying. `cancelChart()` and `AbortSignal` cancel extraction; snapshots and conversions of complex objects still have separate memory costs.

This example uses one million generated rows and 100000 columns. The last-range chart reads only five rows and two columns spanning the center and right-fixed region. For generated sources, `filtered` means all logical rows supplied by the adapter, not a new remote query; update the source after remote filtering. Aggregate charts consume supplied remote statistics without enumerating group members.

<template #example><table-chart-source /></template>

<template #template>

@[code{97-132}](../.vuepress/components/table/chart-source.vue)

</template>

<template #script>

@[code{1-96}](../.vuepress/components/table/chart-source.vue)

</template>

<template #style>

@[code{133-147}](../.vuepress/components/table/chart-source.vue)

</template>

</card>

<card>

## Find and replace

Enable `find-config` to show the search panel. Focus a table cell and press Ctrl / Command + F to find, Ctrl / Command + H to focus replacement, or F3 / Shift + F3 to navigate matches. Enter runs the panel query; Escape cancels pending work or closes the panel. Set `panel: false` for API-only integration, or `keyboard: false` to disable table shortcuts.

Queries are literal text, with optional case-sensitive and whole-cell matching. The current view searches expanded rows on the current filtered page; selection searches the current rectangular range. Both use visible visual-column order and count merged owners once. The supplied-data scope searches all provided rows and loaded tree children, across pages and independently of filters; it searches raw fields in visible columns. It does not fetch other remote pages or lazy children. Positioning can expand loaded ancestors and groups and request a page change. If filters hide a row or a controlled view rejects navigation, positioning returns `false` without clearing the filters.

Use `findCells(query, { scope, bounds, columns })` for programmatic searches. `bounds` is a half-open visible rectangle for view/selection scopes; `columns` restricts column keys or indices. `findNext` and `findPrevious` wrap through matches; `focus: false` preserves input focus while scrolling and marking the active cell. Empty text produces no matches. Changing the selected range clears selection-scope results unless explicit bounds were supplied.

Replacing requires `edit-config`, column editors and `change-config`; ordinary arrays accept updates with `v-model:data`. `replaceMatch` replaces every occurrence within one matching cell, while `replaceAll` handles all writable matching cells. Read-only, disabled and business-restricted fields retain their values. Replacements use built-in editor conversion or `parseCell`; `$` sequences remain literal. Candidate rows pass existing validation before one owner-approved batch, one change event and one undo step. A failed validation preserves all source data. Accepted writes refresh the same search without moving focus.

The example searches Alpha across pages, supports selection and grouping, and can switch to dynamic virtual scrolling. Project names are required and limited to 24 characters: replacing a name with an empty string demonstrates an atomic validation failure. Use Undo/Redo to inspect the accepted transaction.

<template #example><table-find /></template>

<template #template>

@[code{57-107}](../.vuepress/components/table/find.vue)

</template>

<template #script>

@[code{1-56}](../.vuepress/components/table/find.vue)

</template>

<template #style>

@[code{108-119}](../.vuepress/components/table/find.vue)

</template>

</card>

<card>

## Finding in generated data

`find-config` defaults to at most 100000 visited positions, 1000 matching cells and 2000000 processed text characters. This example lowers `maxCells` to 4096. Incomplete searches retain their explicit limit status; `replaceAll` refuses a partial result, while `replaceMatch` can target an individual returned match. Narrow the scope or adjust limits deliberately. Object values need a formatter; text and cell limits do not measure the memory retained by supplied objects.

The source contains a million rows and a hundred thousand columns. Search the selected last merged range, edit the replacement text, and replace its owner across the fixed-column boundary. Only changed fields are stored by the data adapter; navigation reuses the virtual row and column windows.

`cancelFind()` and `AbortSignal` stop pending scans, validation and data acceptance. Data or column changes invalidate old results; view-scope results also expire when paging or expansion changes. Adapters must check their signal before accepting a write. A completed external write cannot be rolled back by cancellation; use the accepted history entry to undo it.

<template #example><table-find-source /></template>

<template #template>

@[code{95-137}](../.vuepress/components/table/find-source.vue)

</template>

<template #script>

@[code{1-94}](../.vuepress/components/table/find-source.vue)

</template>

<template #style>

@[code{138-149}](../.vuepress/components/table/find-source.vue)

</template>

</card>

<card>

## Keyboard navigation

Enable `keyboard-config` to move with arrow keys in visible column order. Tab / Shift + Tab wraps across rows; native Tab behavior is preserved at either edge of the current page. Fixed columns share the same navigation order, and hidden columns are skipped. Navigation does not change pages automatically.

`v-model:active-cell` stores `{ rowKey, columnKey }`, independently of row selection through `v-model:highlight`. Ordinary columns use `key`, then `field`, or `@originalIndex` for unnamed columns; provide stable keys to persist addresses. Activity follows keys after sorting or reordering. Filtering, collapsing, paging or hiding the active column requests a clear when the target is no longer visible. Controlled models must accept updates.

Enter / F2 on a focused cell opens its configured editor; set `enterToEdit: false` to disable that shortcut. Without an editor, navigation tries to focus a control in the cell. Editors keep their own arrows, Tab, IME and popup shortcuts; cancelling editing restores cell focus. Escape on a cell clears activity.

When virtualization unmounts the active cell, focus parks at the table entry. It restores when the cell remounts and focus still belongs to the table. Clicking elsewhere or moving focus outside prevents automatic restoration. Use column settings below to hide, reorder or fix columns.

<template #example><table-keyboard /></template>

<template #template>

@[code{18-62}](../.vuepress/components/table/keyboard.vue)

</template>

<template #script>

@[code{1-16}](../.vuepress/components/table/keyboard.vue)

</template>

<template #style>

@[code{64-77}](../.vuepress/components/table/keyboard.vue)

</template>

</card>

<card>

## Navigation across virtual windows

Generated addresses use a stringified source column index as `columnKey`. Supply `keyboardConfig.rowIndexOf(key)` to resolve a stable row key to an absolute source index for controlled addresses or reordered data. The table does not scan generated rows to find a key. Without a resolver, it can only retain a known navigation position while its key still matches.

This example generates one million rows and 100,000 columns on demand. Select the last cell, then use arrow keys across virtual windows and into the right fixed column. Only the current window mounts. `setActiveCell` uses absolute source indices for generated data and resolves false for out-of-page or hidden targets, refused models and cancelled focus requests.

<template #example><table-keyboard-source /></template>

<template #template>

@[code{26-47}](../.vuepress/components/table/keyboard-source.vue)

</template>

<template #script>

@[code{1-24}](../.vuepress/components/table/keyboard-source.vue)

</template>

<template #style>

@[code{49-62}](../.vuepress/components/table/keyboard-source.vue)

</template>

</card>

<card>

## Row reordering

Enable `row-drag-config` and set `dragSort: true` on a column (`drag-sort` on declarative columns). Provide stable `row-key` values and accept the proposed array with `v-model:data`. `checkMethod` restricts pickup; `dropMethod` restricts drop targets. Handles do not select or edit rows.

Space or Enter picks up a row, arrow keys choose a target, Enter drops it and Escape cancels. Holding near a scrollable window edge scrolls automatically; set `autoScroll: false` to disable this. `scrollThreshold` defaults to 40px and `scrollSpeed` to 16px per frame.

Clear active sorting before reordering. Filtered and paginated views move relative to the target in the complete source array, preserving hidden rows and other pages; remote paging can only reorder supplied records. Active drafts or unsaved changes block reordering until committed or reverted. A reorder establishes a new data baseline; it is not a field change and does not enter edit undo history.

`moveRow(from, to, position)` uses current flattened-page indices; `position` is `before` (default) or `after`. `rowDragStart` identifies the picked-up row. `rowDragEnd` and the return value provide `applied`, `reason` and a generated `request`; its `oldIndex` and `newIndex` refer to the source sibling array, with `parentKey` identifying the parent.

<template #example><table-row-drag /></template>

<template #template>

@[code{40-60}](../.vuepress/components/table/row-drag.vue)

</template>

<template #script>

@[code{1-38}](../.vuepress/components/table/row-drag.vue)

</template>

<template #style>

@[code{62-72}](../.vuepress/components/table/row-drag.vue)

</template>

</card>

<card>

## Tree sibling reordering

Tree rows move within the same parent. Expanded descendants follow their parent; dropping into another parent is not supported. Loaded lazy children follow the same rules as ordinary children, without requesting unloaded nodes. Only affected sibling arrays and ancestors are copied; original rows stay unchanged. This example combines declarative columns, fixed columns, virtualization and measured row heights.

<template #example><table-row-drag-tree /></template>

<template #template>

@[code{35-58}](../.vuepress/components/table/row-drag-tree.vue)

</template>

<template #script>

@[code{1-33}](../.vuepress/components/table/row-drag-tree.vue)

</template>

</card>

<card>

## Generated data and edge scrolling

`virtualSource` requires `rowDragConfig.apply`, receiving stable row keys, the target, absolute source positions and `signal`. Generated requests omit `data`: update the source and key mapping, then return true. The component verifies the moved row at its new position before reporting success. Ordinary arrays can also use apply; accept the exact proposed data array first. Rejection, errors, external data replacement, cancellation and unmount must not report success. `cancelRowDrag()` settles pending work immediately; adapters must check signal before writing.

This example provides one million rows and one hundred thousand columns on demand, caching only positions whose order changes. Neighboring moves touch few mappings; long moves cost time and memory proportional to the distance. The adapter yields in batches and supports cancellation. A remote service can persist order from stable row keys and relative targets without loading the entire dataset.

<template #example><table-row-drag-source /></template>

<template #template>

@[code{61-85}](../.vuepress/components/table/row-drag-source.vue)

</template>

<template #script>

@[code{1-59}](../.vuepress/components/table/row-drag-source.vue)

</template>

<template #style>

@[code{87-100}](../.vuepress/components/table/row-drag-source.vue)

</template>

</card>

<card>

## Undo and redo

Enable both `change-config` and `history-config`, then call `undo()` and `redo()` to replay accepted edits, insertions, removals and reverts. A row commit or batch mutation creates one step. Drafts, failed validation and rejected or cancelled operations create none. Replay returns `editing` while a draft is active; commit or cancel it first.

`history-config.limit` defaults to 100; this example retains 30 steps. History stores touched field values and read-only inserted/removed row references, without copying the whole data set. Removing a large loaded branch still retains that branch, so a step limit is not a fixed memory limit. Use mutation APIs rather than changing historical row references in place.

A new operation clears redo; assigning an unchanged value does not. `clearHistory()` retains current data and tracked changes. Successful `acceptChanges()` (including partial confirmation), `resetChanges()`, a new data baseline or disabling history clears all history. Sorting, filtering and paging preserve it; replay identifies records by stable keys.

Replay uses the data acceptance adapter, without rerunning editor validation or automatically saving to a server. Async adapters must honor `signal`; rejection, failure or cancellation does not consume a step. Use `getHistoryState()` and `historyChange` for controls. `empty` means no step is available; `conflict` means a target field changed externally. Check `applied` before reporting success. Native undo shortcuts inside inputs remain unchanged.

<template #example><table-history /></template>

<template #template>

@[code{55-129}](../.vuepress/components/table/history.vue)

</template>

<template #script>

@[code{1-53}](../.vuepress/components/table/history.vue)

</template>

<template #style>

@[code{131-142}](../.vuepress/components/table/history.vue)

</template>

</card>

<card>

## Change tracking

Enable `change-config` and accept ordinary array proposals through `v-model:data`. Use unique, stable string or numeric `row-key` values, independent of row indices. The table never mutates owned rows in place. Sorting, filtering and paging do not change the keys used by mutation APIs.

Editor drafts are separate from tracked changes. Validation must pass and the parent must accept the data before the journal updates and `editCommit` fires. With tracking enabled, do not replace the row again in `editCommit`. `insertRows`, `removeRows` and `updateRow` are data APIs and do not automatically run editor validation; call `validate()` before saving.

`getChangeRecords()` returns `inserted`, `updated`, `removed` and `version`. Inserting then removing a row cancels that change; restoring a field to its original value clears its update. `revertChanges([key])` reverts a selected row; omit keys to revert everything. After business persistence succeeds, acknowledge that snapshot with `acceptChanges(snapshot.version)`. If newer changes occurred during saving, the old acknowledgement returns `false`; review and save the latest records instead of clearing them.

The Confirm baseline button demonstrates local acknowledgement only. `resetChanges()` clears the journal while retaining current data, unlike reverting. Replacing the external `data` array starts a new baseline; use the mutation APIs for changes that should remain tracked.

<template #example><table-changes /></template>

<template #template>

@[code{112-180}](../.vuepress/components/table/changes.vue)

</template>

<template #script>

@[code{1-110}](../.vuepress/components/table/changes.vue)

</template>

<template #style>

@[code{182-193}](../.vuepress/components/table/changes.vue)

</template>

</card>

<card>

## Tree branch changes

Use `insertRows(rows, { parentKey, index })` to insert children. Removing a parent records its loaded branch. `revertChanges([parentKey])` includes descendants through unchanged intermediate parents and can restore a deleted branch; rows inserted and then removed since the baseline remain absent.

Lazy trees track only loaded records and do not fetch descendants for change tracking. Updating a loaded child copies the affected ancestors into the proposal and supplies their child arrays, leaving original business objects unchanged. Load the example branch, update a descendant, insert a child, remove the branch, then revert it.

History is also enabled: undo or redo child insertion, descendant edits, branch removal and reversion. Undoing removal restores loaded descendants without another lazy request.

<template #example><table-changes-tree /></template>

<template #template>

@[code{76-145}](../.vuepress/components/table/changes-tree.vue)

</template>

<template #script>

@[code{1-74}](../.vuepress/components/table/changes-tree.vue)

</template>

<template #style>

@[code{147-158}](../.vuepress/components/table/changes-tree.vue)

</template>

</card>

<card>

## Generated source changes

Generated sources provide `changeConfig.indexOf(key)` to locate the current global row index and accept mutations through `apply({ operations, signal })`. Apply owned data before returning `true`, or return `false` to reject. Before an asynchronous write, check `signal.aborted` so cancelled or replaced requests cannot write stale data. A new request returns `busy` while another ownership request is pending.

Generated rows may supply fields on demand. Each `row` must represent a read-only data version. Prefer `patches` for updates; do not spread a generated row or scan its whole matrix. For insertion and deletion, the adapter owns row counts, stable-key mappings and restoration positions. This fixed-size example accepts field updates only and stores sparse overrides across one million rows and one hundred thousand columns.

Change `changeConfig.dataKey` when switching business datasets. `cancelDataChange()` aborts a pending acceptance request; `resetChanges()` discards the journal while retaining current data. Externally replacing the source `row` function also starts a new baseline; replacements accepted by the current `apply` retain tracking.

History also covers edits at the far end of this generated source. Replay writes through the same apply adapter; confirming the baseline clears history.

<template #example><table-changes-source /></template>

<template #template>

@[code{105-157}](../.vuepress/components/table/changes-source.vue)

</template>

<template #script>

@[code{1-103}](../.vuepress/components/table/changes-source.vue)

</template>

<template #style>

@[code{159-170}](../.vuepress/components/table/changes-source.vue)

</template>

</card>

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

Use `validate({ rowKeys: [...] })` to select ordinary array or tree records by stable keys, including records returned by change tracking. Generated sources must also provide numeric `rows` indices when using `rowKeys`; specify numeric `columns` to bound the validation scope.

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

Editing updates a draft. Without `change-config`, accept `updatedRow` or `changes` from `editCommit` to update `data` or persist to a server; the table does not mutate business records. Enter commits a text input and Escape cancels; selects and date panels handle their own keys first. Use the Save button or Ctrl/⌘ + Enter for any editor. Tab to an editable cell, then press Enter or F2 to begin.

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

Give columns rendered with `v-for` stable keys. Changing their order updates headers and cells together; removing a custom cell slot restores the column renderer or raw value.

<template #example><table-columns /></template>

<template #template>

@[code{24-48}](../.vuepress/components/table/columns.vue)

</template>

<template #script>

@[code{1-22}](../.vuepress/components/table/columns.vue)

</template>

<template #style>

@[code{50-57}](../.vuepress/components/table/columns.vue)

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

Supply a stable, unique `row-key` when rows can be reordered, updated or expanded as a tree. During horizontal scrolling, rows retain the largest height of their displayed content to reduce vertical movement. Changes to column widths, container width, column visibility or order trigger fresh measurements. Replacing the `data` array or the `virtualSource.row` callback also clears previous row-height measurements.

When changing row fields, custom slot content or external data read by a callback in place, visible content growth is measured automatically. To release retained height after content becomes shorter, call `measure()` after updating the content. Height history is stored for visited row keys, so the measurement cache can grow as users browse beyond the current window.

For data loaded on demand, use `virtualSource` to provide row and column counts and index callbacks. The example supports loading a large data set, jumping to the middle or end, and scrolling both axes. Choose your data size based on device memory, row heights and cell complexity; server-backed data can also use remote pagination.

Virtualization bounds mounted rows and columns; it does not make every data operation window-sized. Loaded rows in ordinary `data` still need indexes, and local sorting, filtering, grouping and aggregation process their corresponding data scopes. These synchronous computations have no separate cancellation API. Applications or servers provide sorting, filtering and grouping results for generated sources; the table does not enumerate every generated row for those operations or automatically fetch unprovided pages or lazy children.

Full validation still scans its targets: `maxErrors` limits errors, not work. Narrow the scope and set the relevant processing budgets for find, clipboard and chart operations. Cancellation takes effect at checkpoints and asynchronous waits; it cannot interrupt a running synchronous application callback or undo an external write that already completed. Measurement caches, loaded details, change records and history references each retain memory. Cell budgets, history counts and browser Map capacity are not guarantees of usable row counts.

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
