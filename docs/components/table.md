---
description: 'Data tables with sorting, filtering, pagination, tree data and virtual scrolling.'
PROPS:
  - name: 'row'
    type: 'TableRow | TableRow[] | null'
    description: 'Deprecated named selection model; migrate to v-model:highlight. An explicit highlight takes precedence.'
    default: null
    usage: '/components/table/row-selection.html#row-selection'
  - name: 'model-value'
    type: 'TableModelValueType | TableModelValueType[] | null'
    description: 'Legacy unnamed selection model; migrate to v-model:highlight. Used only when neither highlight nor row is provided.'
    default: null
    usage: '/components/table/row-selection.html#row-selection'
  - name: 'chart-config'
    type: 'Boolean | TableChartConfig'
    description: 'Enable chart data extraction, budgets, conversions and an optional drawing adapter.'
    default: false
    usage: '/components/table/large-data-and-visualization.html#chart-integration'
  - name: 'find-config'
    type: 'Boolean | TableFindConfig'
    description: 'Enable API-only finding or configure scopes, conversions, keyboard behavior and processing limits; UI is provided explicitly by the $find toolbar renderer.'
    default: false
    usage: '/components/table/spreadsheet-interactions.html#find-and-replace'
  - name: 'clipboard-config'
    type: 'Boolean | TableClipboardConfig'
    description: 'Enable clipboard actions, text conversions, write restrictions and region limits.'
    default: false
    usage: '/components/table/spreadsheet-interactions.html#copy-cut-and-paste'
  - name: 'range-config'
    type: 'Boolean | TableRangeConfig'
    description: 'Enable rectangular range selection, with independent mouse, keyboard and table-owned edge-scrolling options.'
    default: 'false'
    usage: '/components/table/spreadsheet-interactions.html#cell-range-selection'
  - name: 'cell-range'
    type: 'TableCellRange | null'
    description: 'Control anchor and focus addresses through v-model:cell-range; omit for internal state.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#cell-range-selection'
  - name: 'group-config'
    type: 'Boolean | TableGroupConfig'
    description: 'Configure local/remote row grouping, aggregates and summary scope.'
    default: false
    usage: '/components/table/trees-and-groups.html#row-grouping-and-aggregation'
  - name: 'group-expanded-keys'
    type: 'string[]'
    description: 'Control expanded groups with v-model:group-expanded-keys; omit for internal state.'
    default: null
    usage: '/components/table/trees-and-groups.html#row-grouping-and-aggregation'
  - name: 'merge-config'
    type: 'Boolean | TableMergeConfig'
    description: 'Merge body and footer cells using positional ranges or synchronous window-based rules.'
    default: false
    usage: '/components/table/merged-cells.html#merging-cells'
  - name: 'context-menu-config'
    type: 'Boolean | TableContextMenuConfig'
    description: 'Configure header, body and footer items, dynamic factories and visibility predicates.'
    default: false
    usage: '/components/table/spreadsheet-interactions.html#context-menus'
  - name: 'keyboard-config'
    type: 'Boolean | TableKeyboardConfig'
    description: 'Enable cell navigation, Enter editing and generated row-key resolution.'
    default: false
    usage: '/components/table/spreadsheet-interactions.html#keyboard-navigation'
  - name: 'active-cell'
    type: 'TableActiveCell | null'
    description: 'Control the active cell with v-model:active-cell; omit for internal state.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#keyboard-navigation'
  - name: 'row-drag-config'
    type: 'Boolean | TableRowDragConfig'
    description: 'Enable row dragging, predicates, edge scrolling and controlled adapters.'
    default: false
    usage: '/components/table/spreadsheet-interactions.html#row-reordering'
  - name: 'history-config'
    type: 'Boolean | TableHistoryConfig'
    description: 'Enable operation history together with change-config; limit defaults to the latest 100 operations.'
    default: false
    usage: '/components/table/editing-validation-and-changes.html#undo-and-redo'
  - name: 'change-config'
    type: 'Boolean | TableChangeConfig'
    description: 'Enable controlled data mutations and tracking; ordinary arrays use v-model:data, generated sources supply apply and indexOf.'
    default: false
    usage: '/components/table/editing-validation-and-changes.html#change-tracking'
  - name: 'validation-rules'
    type: 'TableValidationRules'
    description: 'Field-based rules; column rules take precedence, and an empty array disables rules for that column.'
    default: '{}'
    usage: '/components/table/editing-validation-and-changes.html#data-validation'
  - name: 'validation-config'
    type: 'Boolean | TableValidationConfig'
    description: 'Enable validation before edit commits; configure error navigation and the error limit. Manual validation is available when disabled.'
    default: 'false'
    usage: '/components/table/editing-validation-and-changes.html#data-validation'
  - name: 'edit-config'
    type: 'Boolean | TableEditConfig'
    description: 'Enable editing with cell or row mode, triggers, eligibility and leave policies.'
    default: 'false'
    usage: '/components/table/editing-validation-and-changes.html#cell-and-row-editing'
  - name: 'detail-config'
    type: 'Boolean | TableDetailConfig'
    description: 'Detail expansion configuration; an expand column enables it automatically, false disables it. Enable explicitly with virtualSource.'
    default: null
    usage: '/components/table/row-expansion.html#detail-rows'
  - name: 'detail-expanded-keys'
    type: 'TableRowKey[]'
    description: 'Controlled detail keys through v-model:detail-expanded-keys, independent of tree expansion.'
    default: null
    usage: '/components/table/row-expansion.html#detail-rows'
  - name: footer-data
    type: TableRow[]
    description: Explicit application- or server-owned footer records; leaf-column footer slots, renderers and formatters still control each cell.
    default: '[]'
    usage: '/components/table/footers-and-summaries.html#footer-data-rows'
  - name: footer-config
    type: Boolean | TableFooterConfig
    description: Builds footer rows from supplied, filtered, or current-page data with precise built-in aggregates.
    default: 'false'
    usage: '/components/table/footers-and-summaries.html#footer-data-rows'
  - name: footer-row-key
    type: TableRowKeyGetter
    description: Field path or function for stable footer row keys; defaults to the footer index.
    default: null
    usage: '/components/table/footers-and-summaries.html#footer-data-rows'
  - name: show-footer-overflow
    type: TableOverflow
    description: Footer overflow handling, independent of body and headers; column settings take precedence.
    default: 'false'
    usage: '/components/table/footers-and-summaries.html#footer-data-rows'
  - name: column-state
    type: TableColumnState[]
    description: 'Control visibility, order, fixed position and optional parent-structure overrides with v-model:column-state.'
    default: null
    usage: '/components/table/column-layout-and-management.html#column-settings'
  - name: resize-config
    type: Boolean | TableResizeConfig
    description: 'Opt in to column resizing with a minimum width and keyboard step.'
    default: false
    usage: '/components/table/column-layout-and-management.html#column-resizing'
  - name: column-widths
    type: TableColumnWidths
    description: 'Controlled column widths via v-model:column-widths. Keys use column key, field or @index; virtualSource uses stringified column indexes.'
    default: null
    usage: '/components/table/column-layout-and-management.html#column-resizing'
  - name: data
    type: Row[]
    description: Row data rendered by the table. When omitted, an enabled request proxy stores accepted query results internally.
    default: null
    usage: '/components/table/data-and-column-definitions.html#configuration-object'
  - name: columns
    type: TableColumn<Row>[]
    description: Column configuration for fields, sizing, alignment, slots, renderers and tree nodes.
    default: '[]'
    usage: '/components/table/data-and-column-definitions.html#configuration-object'
  - name: row-key
    type: String | Function
    description: Stable row key field or getter.
    default: id
    usage: '/components/table/data-and-column-definitions.html#configuration-object'
  - name: highlight
    type: TableRow | TableRow[] | null
    description: Highlighted row or rows.
    default: null
    usage: '/components/table/row-selection.html#row-selection'
  - name: multiple
    type: Boolean
    description: Enables multiple row selection.
    default: 'false'
    usage: '/components/table/row-selection.html#row-selection'
  - name: striped
    type: Boolean
    description: Alternates row backgrounds.
    default: 'false'
    usage: '/components/table/data-and-column-definitions.html#configuration-object'
  - name: row-class
    type: String | Function
    description: Adds a class to each rendered row.
    default: ''
    usage: '/components/table/data-and-column-definitions.html#configuration-object'
  - name: tree-config
    type: TableTreeConfig
    description: Enables hierarchical rows, controlled expansion and lazy child loading; line controls parent-child guides.
    default: null
    usage: '/components/table/trees-and-groups.html#tree-table-and-lazy-loading'
  - name: parent-indicator
    type: Boolean | TableParentIndicatorConfig
    description: Shows a temporary sticky shortcut back to the parent while virtual scrolling through tree children or group members; enabled controls the feature and hideDelay sets the post-scroll delay in milliseconds.
    default: true
    usage: '/components/table/trees-and-groups.html#remote-groups-and-virtual-rows'
  - name: virtual-config
    type: Boolean | TableVirtualConfig
    description: Enables Y-axis row virtualization and optional X-axis column virtualization; height accepts a size or auto for remaining bounded-container space.
    default: 'false'
    usage: '/components/table/large-data-and-visualization.html#virtual-rows-and-dynamic-heights'
  - name: virtual-source
    type: TableVirtualSource
    description: Declares logical row and column counts with synchronous index readers, allowing Table to render a visible window without receiving complete row or column arrays.
    default: null
    usage: '/components/table/large-data-and-visualization.html#virtual-rows-and-dynamic-heights'
  - name: expanded-keys
    type: Array<String | Number>
    description: Controlled expanded tree row keys used by v-model:expanded-keys.
    default: null
    usage: '/components/table/trees-and-groups.html#tree-table-and-lazy-loading'
  - name: renderers
    type: Record<string, TableRenderer>
    description: Named cell and header renderers referenced by columns.
    default: '{}'
    usage: '/components/table/data-and-column-definitions.html#slots-and-renderers'
  - name: show-header
    type: Boolean
    description: Shows the configured column header.
    default: true
    usage: '/components/table/data-and-column-definitions.html#configuration-object'
  - name: align
    type: TableAlign
    description: Default alignment for headers and cells when a column omits align. Column align still controls both surfaces; header-align overrides the header only.
    default: left
    usage: '/components/table/data-and-column-definitions.html#configuration-object'
  - name: header-align
    type: TableAlign
    description: Default header alignment when a column omits both header-align and align. Does not change body cells.
    default: null
    usage: '/components/table/data-and-column-definitions.html#configuration-object'
  - name: empty-text
    type: String
    description: Text displayed when there are no rows or columns.
    default: null
    usage: '/components/table/data-and-column-definitions.html#configuration-object'
  - name: loading
    type: Boolean
    description: Displays a loading mask over the table.
    default: 'false'
    usage: '/components/table/data-and-column-definitions.html#configuration-object'
  - name: sort-by
    type: 'TableSort[]'
    description: 'Controlled sorting state; omitted uses internal state.'
    default: null
    usage: '/components/table/sorting-and-filtering.html#sorting-and-multiple-fields'
  - name: sort-config
    type: 'TableSortConfig'
    description: 'Multiple, remote and initial sorting configuration.'
    default: '{}'
    usage: '/components/table/sorting-and-filtering.html#sorting-and-multiple-fields'
  - name: filters
    type: 'TableFilters'
    description: 'Controlled filter values keyed by field, or key for fieldless columns.'
    default: null
    usage: '/components/table/sorting-and-filtering.html#filters-and-custom-filters'
  - name: filter-config
    type: 'TableFilterConfig'
    description: 'Remote and initial filter configuration.'
    default: '{}'
    usage: '/components/table/sorting-and-filtering.html#remote-sorting-and-filtering'
  - name: pager-config
    type: Boolean | TablePagerConfig
    description: 'Optional built-in pagination. Use v-model:pager-config to synchronize supplied currentPage/pageSize fields; remote mode requires total.'
    default: 'false'
    usage: '/components/table/row-selection.html#multiple-selection'
  - name: selection-config
    type: 'TableSelectionConfig'
    description: 'Selection trigger, eligibility, select-all and reservation configuration.'
    default: '{}'
    usage: '/components/table/row-selection.html#multiple-selection'
  - name: show-overflow
    type: 'TableOverflow'
    description: 'Cell overflow behavior; true is equivalent to tooltip.'
    default: 'false'
    usage: '/components/table/data-and-column-definitions.html#text-overflow-and-tooltips'
  - name: show-header-overflow
    type: 'TableOverflow'
    description: 'Header overflow behavior; column configuration takes priority.'
    default: 'false'
    usage: '/components/table/data-and-column-definitions.html#text-overflow-and-tooltips'
  - name: 'proxy-config'
    type: 'Boolean | TableProxyConfig<Row, QueryForm>'
    description: 'Configure query, save and delete adapters; disabled by default.'
    default: false
    usage: '/components/table/query-forms-and-request-proxy.html#request-proxy'
  - name: 'query-config'
    type: 'Boolean | TableQueryConfig<QueryForm>'
    description: 'Query form configuration, including SForm model, items, rules and layout.'
    default: false
    usage: '/components/table/query-forms-and-request-proxy.html#query-and-toolbar'
  - name: 'toolbar-config'
    type: 'Boolean | TableToolbarConfig<Row, QueryForm>'
    description: 'Toolbar title and ordered left/right renderer lists; built-ins include button, $refresh and $columnConfig.'
    default: false
    usage: '/components/table/query-forms-and-request-proxy.html#query-and-toolbar'
CHILD_PROPS:
  - name: 'key'
    type: 'String'
    description: 'Stable column identity in columns configuration. With STableColumn, use the Vue key attribute.'
    default: null
    usage: '/components/table/data-and-column-definitions.html#nested-columns'
  - name: 'class-name'
    type: 'String'
    description: 'Custom class on data cells in this column.'
    default: null
    usage: '/components/table/data-and-column-definitions.html#slots-and-renderers'
  - name: 'cell'
    type: 'TableCellRenderer'
    description: 'Cell render function, used after column-specific and generic cell slots.'
    default: null
    usage: '/components/table/data-and-column-definitions.html#slots-and-renderers'
  - name: 'header'
    type: 'TableHeaderRenderer'
    description: 'Header render function, used after column-specific and generic header slots.'
    default: null
    usage: '/components/table/data-and-column-definitions.html#slots-and-renderers'
  - name: 'drag-sort'
    type: 'Boolean'
    description: 'Show a row drag handle in this column when row-drag-config is enabled.'
    default: false
    usage: '/components/table/spreadsheet-interactions.html#row-reordering'
  - name: 'rules'
    type: 'TableValidationRule | TableValidationRule[]'
    description: 'Synchronous or asynchronous rules for this column, overriding validation-rules.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#data-validation'
  - name: 'editor'
    type: 'Boolean | TableEditorConfig'
    description: 'Enable field editing with input, number, select, date or switch controls, props, options and eligibility.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#cell-and-row-editing'
  - name: 'edit'
    type: 'TableEditRenderer'
    description: 'Editor render function, independent of the display cell renderer.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#custom-editors'
  - name: footer
    type: TableFooterRenderer
    description: Footer cell render function.
    default: null
    usage: '/components/table/footers-and-summaries.html#footer-data-rows'
  - name: footer-formatter
    type: TableFooterFormatter
    description: Footer text formatter, used when no slot or renderer takes precedence.
    default: null
    usage: '/components/table/footers-and-summaries.html#footer-data-rows'
  - name: footer-align
    type: TableAlign
    description: Footer alignment, falling back to the column align value, then the table align default.
    default: null
    usage: '/components/table/footers-and-summaries.html#footer-data-rows'
  - name: show-footer-overflow
    type: TableOverflow
    description: Footer overflow for this column, overriding the table setting.
    default: null
    usage: '/components/table/footers-and-summaries.html#footer-data-rows'
  - name: children
    type: TableColumn[]
    description: Nested columns forming a header group; only leaves render data cells.
    default: null
    usage: '/components/table/header-structures.html#grouped-headers'
  - name: resizable
    type: Boolean
    description: 'Set false to disable resizing for this column; resize-config must be enabled.'
    default: null
    usage: '/components/table/column-layout-and-management.html#column-resizing'
  - name: type
    type: TableColumnType
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
    type: TableAlign
    description: Header and cell alignment. Omitted columns inherit the table or ConfigProvider table.align value, then left.
    default: null
    usage: '/components/table/data-and-column-definitions.html#configuration-object'
  - name: header-align
    type: TableAlign
    description: Header alignment for this column. Falls back to the column align value, then table or ConfigProvider table.headerAlign, then table.align, then left.
    default: null
    usage: '/components/table/data-and-column-definitions.html#configuration-object'
  - name: fixed
    type: TableColumnFixed
    description: Pins the column to either edge; true means left. Inherits the parent group when omitted; false overrides an inherited fixed side.
    default: null
    usage: '/components/table/large-data-and-visualization.html#virtual-rows-and-dynamic-heights'
  - name: tree-node
    type: Boolean
    description: Places tree indentation and the expand control in this column.
    default: 'false'
  - name: renderer
    type: String | Function | TableRenderer | TableRendererOptions
    description: "Inline renderer, a local renderer key, or a global renderer option such as `{ name: '$buttons' }`."
    default: null
    usage: '/components/table/data-and-column-definitions.html#slots-and-renderers'
  - name: slots
    type: TableColumnSlots
    description: Explicitly maps body, header, edit, footer and filter slot names; slots.default also accepts a TableCellRenderer function.
    default: null
  - name: sortable
    type: 'Boolean'
    description: 'Enables sorting controls for this column.'
    default: 'false'
    usage: '/components/table/sorting-and-filtering.html#sorting-and-multiple-fields'
  - name: sort-method
    type: 'TableSortMethod'
    description: 'Per-column numeric, lexical string, or custom comparison. Functions return boolean, 0/1, or a signed number; true/positive means a follows b in ascending order.'
    default: null
    usage: '/components/table/sorting-and-filtering.html#column-sorting-rules'
  - name: filters
    type: 'TableFilterOption[]'
    description: 'Filter options; disabled prevents selecting an option.'
    default: null
    usage: '/components/table/sorting-and-filtering.html#filters-and-custom-filters'
  - name: filter-multiple
    type: 'Boolean'
    description: 'Allows multiple filter values.'
    default: true
    usage: '/components/table/sorting-and-filtering.html#filters-and-custom-filters'
  - name: filter-method
    type: '(params: TableFilterParams) => boolean'
    description: 'Custom row matcher; this function defines matching within the column.'
    default: null
    usage: '/components/table/sorting-and-filtering.html#filters-and-custom-filters'
  - name: filter-render
    type: 'TableRendererOptions'
    description: 'Renders filter controls through the global renderer registry; props, options and events are forwarded to that renderer.'
    default: null
    usage: '/components/table/sorting-and-filtering.html#filters-and-custom-filters'
  - name: show-overflow
    type: 'TableOverflow'
    description: 'Overrides cell overflow for this column; otherwise inherits the table.'
    default: null
    usage: '/components/table/data-and-column-definitions.html#text-overflow-and-tooltips'
  - name: show-header-overflow
    type: 'TableOverflow'
    description: 'Overrides header overflow for this column; otherwise inherits the table.'
    default: null
    usage: '/components/table/data-and-column-definitions.html#text-overflow-and-tooltips'
EVENTS:
  - name: 'proxyStateChange'
    type: '(state: TableProxyState) => void'
    description: 'Request loading state and latest result changed.'
    default: null
    usage: '/components/table/query-forms-and-request-proxy.html#request-proxy'
  - name: 'proxySuccess'
    type: '(result: TableProxyResult) => void'
    description: 'Query data was accepted or a write succeeded.'
    default: null
    usage: '/components/table/query-forms-and-request-proxy.html#request-proxy'
  - name: 'proxyError'
    type: '(result: TableProxyResult) => void'
    description: 'Adapter exception or invalid query response; cancellation does not emit this event.'
    default: null
    usage: '/components/table/query-forms-and-request-proxy.html#request-proxy'
  - name: 'query'
    type: '(context: TableQueryContext<Row, QueryForm>) => void'
    description: 'Emits an independent form, pagination, sort and filter snapshot on search, reset or refresh.'
    default: null
    usage: '/components/table/query-forms-and-request-proxy.html#query-and-toolbar'
  - name: 'queryError'
    type: '(error: unknown) => void'
    description: 'Query orchestration error; ordinary field validation failures are displayed by the form.'
    default: null
    usage: '/components/table/query-forms-and-request-proxy.html#query-and-toolbar'
  - name: 'toolbarClick'
    type: '(code: string, context: TableQueryContext<Row, QueryForm>, event: MouseEvent) => void'
    description: 'An unhandled $buttons action from either toolbar side was clicked.'
    default: null
    usage: '/components/table/query-forms-and-request-proxy.html#query-and-toolbar'
  - name: 'update:row'
    type: '(value: TableRow | TableRow[] | null) => void'
    description: 'Compatibility selection update for v-model:row; use update:highlight in new code.'
    default: null
    usage: '/components/table/row-selection.html#row-selection'
  - name: 'update:modelValue'
    type: '(value: TableModelValueType | TableModelValueType[] | null) => void'
    description: 'Compatibility update for the unnamed model; use update:highlight in new code.'
    default: null
    usage: '/components/table/row-selection.html#row-selection'
  - name: 'chartChange'
    type: '(state: TableChartState) => void'
    description: 'Chart extraction, snapshot or panel state changed.'
    default: null
    usage: '/components/table/large-data-and-visualization.html#chart-integration'
  - name: 'chartError'
    type: '(error: unknown) => void'
    description: 'The drawing adapter failed while mounting, resizing or disposing.'
    default: null
    usage: '/components/table/large-data-and-visualization.html#chart-integration'
  - name: 'findChange'
    type: '(state: TableFindState) => void'
    description: 'Search progress, matches, active index or cleared state changed.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#find-and-replace'
  - name: 'replace'
    type: '(result: TableReplaceResult) => void'
    description: 'Replacement completed with changed-cell count, validation errors or failure reason.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#find-and-replace'
  - name: 'clipboard'
    type: '(result: TableClipboardResult) => void'
    description: 'Reports completion, OS clipboard status, applied cell count and failure reason.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#copy-cut-and-paste'
  - name: 'update:cellRange'
    type: '(range: TableCellRange | null) => void'
    description: 'Request a controlled range update.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#cell-range-selection'
  - name: 'cellRangeChange'
    type: '(change: TableCellRangeChange) => void'
    description: 'Emitted after the accepted range or logical bounds change, with range, bounds and reason.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#cell-range-selection'
  - name: 'cellRangeError'
    type: '(error: unknown) => void'
    description: 'Emitted when merge resolution for a range fails.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#cell-range-selection'
  - name: 'update:groupExpandedKeys'
    type: '(keys: string[]) => void'
    description: 'Request updated expanded group keys.'
    default: null
    usage: '/components/table/trees-and-groups.html#row-grouping-and-aggregation'
  - name: 'groupExpand'
    type: '(params: { group: TableGroupNode; expanded: boolean }) => void'
    description: 'Emitted after an expansion change is accepted.'
    default: null
    usage: '/components/table/trees-and-groups.html#row-grouping-and-aggregation'
  - name: 'groupError'
    type: '(error: unknown) => void'
    description: 'Grouping configuration or aggregation failed.'
    default: null
    usage: '/components/table/trees-and-groups.html#row-grouping-and-aggregation'
  - name: 'contextMenuOpen'
    type: '(context: TableContextMenuContext) => void'
    description: 'A menu opens with its area, row/column context and captured cell-range snapshot.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#context-menus'
  - name: 'contextMenuSelect'
    type: '(params: TableContextMenuSelectParams) => void'
    description: 'An enabled item is selected; the application performs its business action.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#context-menus'
  - name: 'contextMenuClose'
    type: '(context: TableContextMenuContext) => void'
    description: 'A menu closes with its original context and cell-range snapshot.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#context-menus'
  - name: 'update:activeCell'
    type: '(cell: TableActiveCell | null) => void'
    description: 'Request an active-cell update independently of row selection.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#keyboard-navigation'
  - name: 'activeCellChange'
    type: '(cell: TableActiveCell | null) => void'
    description: 'Emitted when the accepted active-cell address changes.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#keyboard-navigation'
  - name: 'rowDragStart'
    type: '(context: TableRowDragContext) => void'
    description: 'A pointer or keyboard interaction picks up a row.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#row-reordering'
  - name: 'rowDragEnd'
    type: '(result: TableRowDragResult) => void'
    description: 'A drag or moveRow operation ends; inspect applied and reason.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#row-reordering'
  - name: 'historyChange'
    type: '(state: TableHistoryState) => void'
    description: 'Emitted when history changes, with undo/redo counts and availability.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#undo-and-redo'
  - name: 'update:data'
    type: '(data: TableRow[]) => void'
    description: 'Proposed ordinary array; recorded only after the parent accepts it.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#change-tracking'
  - name: 'dataChange'
    type: '(operations: TableDataMutation[]) => void'
    description: 'Fired after the owner accepts data and the journal commits, including reverts.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#change-tracking'
  - name: 'changesChange'
    type: '(version: number) => void'
    description: 'Journal version changed; call getChangeRecords to read its snapshot.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#change-tracking'
  - name: 'validation'
    type: 'TableValidationResult'
    description: 'Emitted when the latest validation completes; cancelled or stale runs do not emit.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#data-validation'
  - name: 'editStart'
    type: '(params: TableEditRecord) => void'
    description: 'Emitted when an edit session starts.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#cell-and-row-editing'
  - name: 'editChange'
    type: '(params: TableEditRecord) => void'
    description: 'Emitted when a draft changes; supplied data is not mutated.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#cell-and-row-editing'
  - name: 'editCommit'
    type: '(params: TableEditEndParams) => void'
    description: 'Provides changed fields and updatedRow on commit; the application accepts and persists the result.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#cell-and-row-editing'
  - name: 'editCancel'
    type: '(params: TableEditEndParams) => void'
    description: 'Emitted when a draft is cancelled, including its reason.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#cell-and-row-editing'
  - name: 'update:detailExpandedKeys'
    type: '(keys: TableRowKey[]) => void'
    description: 'Requests the complete next detail key array.'
    default: null
    usage: '/components/table/row-expansion.html#detail-rows'
  - name: 'detailExpand'
    type: '(params: TableDetailExpandParams) => void'
    description: 'Emitted when a trigger or toggleRowDetail requests expansion or collapse; controlled state requires parent acceptance.'
    default: null
    usage: '/components/table/row-expansion.html#detail-rows'
  - name: 'detailLoad'
    type: '(params: TableDetailParams & { data: unknown }) => void'
    description: 'Emitted when the current detail request succeeds.'
    default: null
    usage: '/components/table/row-expansion.html#async-details'
  - name: 'detailLoadError'
    type: '(params: TableDetailParams & { error: unknown }) => void'
    description: 'Emitted for current request failures; aborted and stale requests are ignored.'
    default: null
    usage: '/components/table/row-expansion.html#async-details'
  - name: footerCellClick
    type: '(params: TableFooterCellRenderParams, event: MouseEvent) => void'
    description: Fires on footer cell clicks with the footer record, leaf column, raw value and indices; does not select body rows.
    default: null
    usage: '/components/table/footers-and-summaries.html#footer-data-rows'
  - name: footerError
    type: '(error: unknown) => void'
    description: Fires when a footer-config definition is invalid or cannot be evaluated locally.
    default: null
    usage: '/components/table/footers-and-summaries.html#footer-data-rows'
  - name: update:columnState
    type: '(state: TableColumnState[]) => void'
    description: Request a controlled column-state update.
    default: null
    usage: '/components/table/column-layout-and-management.html#column-settings'
  - name: columnStateChange
    type: '(state: TableColumnState[]) => void'
    description: Emitted with the complete state array when the user changes or resets column settings.
    default: null
    usage: '/components/table/column-layout-and-management.html#column-settings'
  - name: columnStorageError
    type: "(event: { operation: 'read' | 'write'; error: unknown }) => void"
    description: Emitted when local settings cannot be read or written; table interaction remains available.
    default: null
    usage: '/components/table/column-layout-and-management.html#remember-column-settings'
  - name: update:columnWidths
    type: '(widths: TableColumnWidths) => void'
    description: 'Emits the complete next width record on commit.'
    default: null
    usage: '/components/table/column-layout-and-management.html#column-resizing'
  - name: column-resize
    type: '(params: TableColumnResizeParams) => void'
    description: 'Fires after a pointer drag or keyboard resize with the column, index, old and new widths, and input source.'
    default: null
    usage: '/components/table/column-layout-and-management.html#column-resizing'
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
    usage: '/components/table/sorting-and-filtering.html#sorting-and-multiple-fields'
  - name: sortChange
    type: 'TableSort[]'
    description: 'Sorting changed; can trigger a request in remote mode.'
    default: null
    usage: '/components/table/sorting-and-filtering.html#remote-sorting-and-filtering'
  - name: update:filters
    type: 'TableFilters'
    description: 'Filter update for v-model:filters.'
    default: null
    usage: '/components/table/sorting-and-filtering.html#filters-and-custom-filters'
  - name: filterChange
    type: 'TableFilters'
    description: 'Fires after applying or resetting filters.'
    default: null
    usage: '/components/table/sorting-and-filtering.html#filters-and-custom-filters'
  - name: update:pagerConfig
    type: TablePagerConfig
    description: 'Updates currentPage and pageSize while retaining other configuration fields.'
    default: null
    usage: '/components/table/row-selection.html#multiple-selection'
  - name: pageChange
    type: TablePageChangeParams
    description: 'Emitted for navigation, page-size changes, query resets or page clamping; includes currentPage, pageSize, total and type.'
    default: null
    usage: '/components/table/row-selection.html#multiple-selection'
  - name: selectionChange
    type: 'TableRow[]'
    description: 'Selection changed; always emits a row array for both modes.'
    default: null
    usage: '/components/table/row-selection.html#multiple-selection'
SLOTS:
  - name: 'proxy-error'
    type: 'TableExposes & { state: TableProxyState }'
    description: 'Customize request error content; receives state and Table methods.'
    default: null
    usage: '/components/table/query-forms-and-request-proxy.html#request-proxy'
  - name: 'query'
    type: 'TableExposes & { model: FormModel }'
    description: 'Additional SFormItem controls inside the same form; receives model and Table methods.'
    default: null
    usage: '/components/table/query-forms-and-request-proxy.html#slots-and-nested-columns'
  - name: '[queryConfig.items[].slots]'
    type: 'Scoped slot'
    description: 'Field, label or error slot explicitly mapped by a query item; field content receives model, item, field, prop, value, disabled, readonly and setValue(value).'
    default: null
    usage: '/components/table/query-forms-and-request-proxy.html#slots-and-nested-columns'
  - name: 'query-actions'
    type: 'TableExposes & { busy: boolean }'
    description: 'Replace query actions; receives query, resetQuery, refresh, busy and other Table methods.'
    default: null
    usage: '/components/table/query-forms-and-request-proxy.html#slots-and-nested-columns'
  - name: 'toolbar_left'
    type: 'TableExposes & { busy: boolean }'
    description: 'Replace the left toolbar region; receives Table methods and busy.'
    default: null
    usage: '/components/table/query-forms-and-request-proxy.html#slots-and-nested-columns'
  - name: 'toolbar_right'
    type: 'TableExposes & { busy: boolean }'
    description: 'Replace the right toolbar region; receives Table methods and busy.'
    default: null
    usage: '/components/table/query-forms-and-request-proxy.html#slots-and-nested-columns'
  - name: 'toolbar-title'
    type: 'Slot'
    description: 'Replace the toolbar title.'
    default: null
    usage: '/components/table/query-forms-and-request-proxy.html#slots-and-nested-columns'
  - name: 'STableColumn.default'
    type: 'TableCellRenderParams'
    description: 'Cell content on a nested column.'
    default: null
    usage: '/components/table/data-and-column-definitions.html#nested-columns'
  - name: 'STableColumn.header'
    type: 'TableHeaderRenderParams'
    description: 'Header content on a nested leaf or grouped column.'
    default: null
    usage: '/components/table/header-structures.html#nested-grouped-headers'
  - name: 'group-header'
    type: '{ group: TableGroupNode; expanded: boolean }'
    description: 'Group heading content alongside the built-in expand button.'
    default: null
    usage: '/components/table/trees-and-groups.html#row-grouping-and-aggregation'
  - name: 'group-summary'
    type: 'TableFooterCellRenderParams & { group?: TableGroupNode; kind: string }'
    description: 'Subtotal or overall summary cell.'
    default: null
    usage: '/components/table/trees-and-groups.html#row-grouping-and-aggregation'
  - name: 'parent-indicator'
    type: 'TableParentIndicatorSlotParams'
    description: 'Customizes the indicator content after the fixed return icon; exposes parentKey, label, and jump.'
    default: null
    usage: '/components/table/trees-and-groups.html#remote-groups-and-virtual-rows'
  - name: '[columns.slots.edit]'
    type: 'TableEditSlotParams'
    description: 'Editor slot explicitly mapped by a column configuration.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#custom-editors'
  - name: 'edit-cell'
    type: 'TableEditSlotParams'
    description: 'Generic editor slot with value, draftRow, setValue, commit and cancel.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#custom-editors'
  - name: 'STableColumn.edit'
    type: 'TableEditSlotParams'
    description: 'Editor slot on a nested column.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#custom-editors'
  - name: 'detail'
    type: 'TableDetailSlotParams'
    description: 'Detail content with row, key, index, loaded data, reload and close.'
    default: null
    usage: '/components/table/row-expansion.html#detail-rows'
  - name: 'detail-loading'
    type: 'TableDetailSlotParams'
    description: 'Detail loading content.'
    default: null
    usage: '/components/table/row-expansion.html#async-details'
  - name: 'detail-error'
    type: 'TableDetailSlotParams'
    description: 'Detail error content; call reload to retry.'
    default: null
    usage: '/components/table/row-expansion.html#async-details'
  - name: '[columns.slots.footer]'
    type: TableFooterCellRenderParams
    description: Footer slot explicitly mapped by a leaf-column configuration.
    default: null
    usage: '/components/table/footers-and-summaries.html#footer-data-rows'
  - name: footer-cell
    type: TableFooterCellRenderParams
    description: Fallback slot for all footer cells.
    default: null
    usage: '/components/table/footers-and-summaries.html#footer-data-rows'
  - name: STableColumn.footer
    type: TableFooterCellRenderParams
    description: Footer render slot on a nested column.
    default: null
    usage: '/components/table/footers-and-summaries.html#footer-data-rows'
  - name: STableColumn.columns
    type: Slot
    description: Nested column declarations inside STableColumn.
    usage: '/components/table/header-structures.html#nested-grouped-headers'
  - name: default
    type: Slot
    description: Nested s-table-column definitions.
  - name: '[columns.slots.default]'
    type: TableCellRenderParams
    description: Body-cell slot explicitly mapped by a column configuration, receiving row, column, value and rowIndex.
  - name: cell
    type: TableCellRenderParams
    description: Fallback cell content for every column.
  - name: '[columns.slots.header]'
    type: TableHeaderRenderParams
    description: Header slot explicitly mapped by a column configuration.
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
    usage: '/components/table/sorting-and-filtering.html#filters-and-custom-filters'
EXPOSES:
  - name: 'getChartData'
    type: '(options: TableChartOptions) => Promise<TableChartResult>'
    description: 'Extract a readonly chart snapshot without opening a panel. scope and series are required; bounds is only for selection, while aggregate/groupKeys/summaryLabel are for aggregate scope.'
    default: null
    usage: '/components/table/large-data-and-visualization.html#chart-integration'
  - name: 'openChart'
    type: '(options: TableChartOptions) => Promise<TableChartResult>'
    description: 'Extract complete data and open the panel; requires an adapter.'
    default: null
    usage: '/components/table/large-data-and-visualization.html#chart-integration'
  - name: 'closeChart'
    type: '() => void'
    description: 'Close the panel, cancel extraction and clear the snapshot.'
    default: null
    usage: '/components/table/large-data-and-visualization.html#chart-integration'
  - name: 'cancelChart'
    type: '() => void'
    description: 'Cancel pending data extraction.'
    default: null
    usage: '/components/table/large-data-and-visualization.html#chart-integration'
  - name: 'getChartState'
    type: '() => TableChartState'
    description: 'Read extraction and panel state.'
    default: null
    usage: '/components/table/large-data-and-visualization.html#chart-integration'
  - name: 'findCells'
    type: '(query: string | TableFindQuery, options?: TableFindOptions) => Promise<TableFindResult>'
    description: 'Search the chosen scope and return matches and completion limits. scope defaults to findConfig.scope, then view; bounds is invalid with data scope, and columns: [] searches nothing.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#find-and-replace'
  - name: 'findNext'
    type: '(options?: TableFindNavigateOptions) => Promise<boolean>'
    description: 'Move to the next match, wrapping at the end; resolve whether positioning succeeded.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#find-and-replace'
  - name: 'findPrevious'
    type: '(options?: TableFindNavigateOptions) => Promise<boolean>'
    description: 'Move to the previous match; focus: false preserves the current input focus.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#find-and-replace'
  - name: 'replaceMatch'
    type: '(replacement: string, options?: TableReplaceOptions) => Promise<TableReplaceResult>'
    description: 'Replace all literal occurrences inside the active or indexed matching cell.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#find-and-replace'
  - name: 'replaceAll'
    type: '(replacement: string, options?: TableReplaceOptions) => Promise<TableReplaceResult>'
    description: 'Validate and replace writable matches in one transaction; requires a complete search. options.index is ignored; it only applies to replaceMatch.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#find-and-replace'
  - name: 'getFindState'
    type: '() => TableFindState'
    description: 'Return query, scope, match summaries including whether each match is replaceable, active index, progress and limits.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#find-and-replace'
  - name: 'clearFind'
    type: '() => void'
    description: 'Cancel pending work and clear matches while retaining the query.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#find-and-replace'
  - name: 'cancelFind'
    type: '() => void'
    description: 'Cancel pending search, positioning or replacement work.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#find-and-replace'
  - name: 'openFind'
    type: '() => Promise<boolean>'
    description: 'Open and focus the $find popper, resetting the form and previous matches; false when no $find renderer is mounted or finding is disabled.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#find-and-replace'
  - name: 'closeFind'
    type: '() => void'
    description: 'Close the panel, cancel pending work and restore its trigger focus when appropriate.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#find-and-replace'
  - name: 'copyCells'
    type: '(options?: TableCopyOptions) => Promise<TableClipboardResult>'
    description: 'Copy the range or bounds; writeClipboard: false returns a snapshot and TSV without OS access.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#copy-cut-and-paste'
  - name: 'cutCells'
    type: '(options?: TableCopyOptions) => Promise<TableClipboardResult>'
    description: 'After copying, validate and clear writable fields in one batch; the default clear value is null.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#copy-cut-and-paste'
  - name: 'pasteCells'
    type: '(data?: string | TableClipboardData, options?: TableClipboardOptions) => Promise<TableClipboardResult>'
    description: 'Paste TSV or a 2D matrix; omit data to read the browser clipboard. A single target cell expands to the payload size; a larger target must be a whole multiple of the payload rectangle.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#copy-cut-and-paste'
  - name: 'cancelClipboard'
    type: '() => void'
    description: 'Cancel pending reading, preparation, validation or data acceptance; completed OS clipboard writes are not undone.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#copy-cut-and-paste'
  - name: 'setCellRange'
    type: '(range: TableCellRange | null) => Promise<boolean>'
    description: 'Set a logical range and resolve whether it was accepted, without moving the viewport.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#cell-range-selection'
  - name: 'clearCellRange'
    type: '() => Promise<boolean>'
    description: 'Clear the range and the leftover active cell from that selection.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#cell-range-selection'
  - name: 'getCellRange'
    type: '() => TableCellRange | null'
    description: 'Read a copy of the range endpoints.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#cell-range-selection'
  - name: 'getCellRangeBounds'
    type: '() => TableCellRangeBounds | null'
    description: 'Read half-open visible data-row and visual-column bounds, excluding group and detail bands.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#cell-range-selection'
  - name: 'getGroups'
    type: '() => readonly TableGroupNode[]'
    description: 'Read current group metadata.'
    default: null
    usage: '/components/table/trees-and-groups.html#row-grouping-and-aggregation'
  - name: 'getGroupSummary'
    type: '() => Readonly<Record<string, unknown>>'
    description: 'Read overall aggregate results.'
    default: null
    usage: '/components/table/trees-and-groups.html#row-grouping-and-aggregation'
  - name: 'toggleGroup'
    type: '(key: string, expanded?: boolean) => Promise<boolean>'
    description: 'Toggle one group and report whether the update was accepted.'
    default: null
    usage: '/components/table/trees-and-groups.html#row-grouping-and-aggregation'
  - name: 'setGroupExpandedKeys'
    type: '(keys: readonly string[]) => Promise<boolean>'
    description: 'Set expanded group keys and report whether the update was accepted.'
    default: null
    usage: '/components/table/trees-and-groups.html#row-grouping-and-aggregation'
  - name: 'closeContextMenu'
    type: '() => void'
    description: 'Close the menu and restore the originating cell if focus is still inside the menu.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#context-menus'
  - name: 'setActiveCell'
    type: '(rowIndex: number, columnIndex: number) => Promise<boolean>'
    description: 'Activate and locate a cell; resolves whether focus succeeded. Ordinary data uses flattened-page rows and resolved columns; generated data uses absolute source indices.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#keyboard-navigation'
  - name: 'clearActiveCell'
    type: '() => Promise<boolean>'
    description: 'Clear activity; resolves false when the controlled model refuses.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#keyboard-navigation'
  - name: 'getActiveCell'
    type: '() => TableActiveCell | null'
    description: 'Read a copy of the current valid active-cell address.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#keyboard-navigation'
  - name: 'moveRow'
    type: '(from: number, to: number, position?: TableRowDropPosition) => Promise<TableRowDragResult>'
    description: 'Move using current flattened-page indices; position defaults to before.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#row-reordering'
  - name: 'cancelRowDrag'
    type: '() => void'
    description: 'Cancel dragging or a pending reorder adapter.'
    default: null
    usage: '/components/table/spreadsheet-interactions.html#row-reordering'
  - name: 'undo'
    type: '() => Promise<TableDataMutationResult>'
    description: 'Undo the latest accepted operation; commit or cancel an active draft first.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#undo-and-redo'
  - name: 'redo'
    type: '() => Promise<TableDataMutationResult>'
    description: 'Redo the latest undone operation; rejection or cancellation does not move history.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#undo-and-redo'
  - name: 'clearHistory'
    type: '() => void'
    description: 'Clear undo/redo history and cancel pending proposals, retaining data and tracked changes.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#undo-and-redo'
  - name: 'getHistoryState'
    type: '() => TableHistoryState'
    description: 'Read history counts and availability; this does not indicate whether a request or draft is active.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#undo-and-redo'
  - name: 'insertRows'
    type: '(rows: TableRow[], position?: Partial<TableDataPosition>) => Promise<TableDataMutationResult>'
    description: 'Insert rows in source order, optionally under parentKey. Indices address source siblings, not sorted or paged rows.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#change-tracking'
  - name: 'removeRows'
    type: '(rowKeys: TableRowKey[]) => Promise<TableDataMutationResult>'
    description: 'Remove rows by stable key; removing a tree parent includes its loaded descendants.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#change-tracking'
  - name: 'updateRow'
    type: '(rowKey: TableRowKey, values: Partial<TableRow>) => Promise<TableDataMutationResult>'
    description: 'Apply field values by key; dot paths are supported. Does not invoke editor validation. Stable keys and tree children cannot be overwritten.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#change-tracking'
  - name: 'revertChanges'
    type: '(rowKeys?: TableRowKey[]) => Promise<TableDataMutationResult>'
    description: 'Revert selected rows and their loaded or removed descendants; omit keys to revert all unconfirmed changes.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#change-tracking'
  - name: 'getChangeRecords'
    type: '() => TableChangeRecords'
    description: 'Read the journal version and inserted, updated and removed records. Field changes are snapshots; rows are read-only references.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#change-tracking'
  - name: 'acceptChanges'
    type: '(version: number, rowKeys?: TableRowKey[]) => boolean'
    description: 'Confirm a saved version as baseline without changing data. Reject stale versions and pending requests; optional keys confirm only those records.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#change-tracking'
  - name: 'resetChanges'
    type: '() => void'
    description: 'Cancel pending ownership requests and discard the journal, retaining current data as baseline.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#change-tracking'
  - name: 'cancelDataChange'
    type: '() => void'
    description: 'Abort the pending ownership request; preserve previously accepted changes and current editor drafts.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#change-tracking'
  - name: 'validate'
    type: '(options?: TableValidateOptions) => Promise<TableValidationResult>'
    description: 'Validate supplied data or a selected scope; includes loaded collapsed descendants without fetching children or remote pages.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#data-validation'
  - name: 'validateRow'
    type: '(rowOrIndex: TableRow | number, options?: TableValidateOptions) => Promise<TableValidationResult>'
    description: 'Validate all ruled fields in one row; normal indices refer to expanded current-page rows, generated sources use global indices.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#data-validation'
  - name: 'validateCell'
    type: '(rowOrIndex: TableRow | number, columnOrIndex: TableColumn | string | number, options?: TableValidateOptions) => Promise<TableValidationResult>'
    description: 'Validate one cell; ordinary columns accept an object, key, field or visible index, generated sources require global numeric indices.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#data-validation'
  - name: 'clearValidation'
    type: '(rowKey?: TableRowKey, field?: string) => void'
    description: 'Clear all errors or those for a row key and field; also cancel the current validation.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#data-validation'
  - name: 'cancelValidation'
    type: '() => void'
    description: 'Cancel current validation immediately, retaining previously completed errors and edit drafts.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#data-validation'
  - name: 'getValidationErrors'
    type: '() => TableValidationError[]'
    description: 'Get a snapshot of current errors, excluding stale rows or changed field values.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#data-validation'
  - name: 'scrollToValidationError'
    type: '(error?: TableValidationError) => Promise<boolean>'
    description: 'Locate an error, defaulting to the first, expanding ancestors and changing local pages. Returns false for refused controlled updates or filtered/hidden targets.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#data-validation'
  - name: 'startEdit'
    type: '(rowOrIndex: TableRow | number, columnOrIndex: TableColumn | string | number) => Promise<boolean>'
    description: 'Start and locate an editor; normal data accepts visible row/column indices, row objects and column fields/keys, while generated sources use global numeric indices.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#editing-virtual-data'
  - name: 'commitEdit'
    type: '() => Promise<boolean>'
    description: 'Commit and emit editCommit; returns true with no session and false on eligibility, data conflicts or validation failure.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#cell-and-row-editing'
  - name: 'cancelEdit'
    type: '() => void'
    description: 'Discard the active draft.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#cell-and-row-editing'
  - name: 'getEditRecord'
    type: '() => TableEditRecord | null'
    description: 'Read the active session and its draft change snapshot.'
    default: null
    usage: '/components/table/editing-validation-and-changes.html#cell-and-row-editing'
  - name: 'toggleRowDetail'
    type: '(rowOrIndex: TableRow | number, expanded?: boolean) => Promise<void>'
    description: 'Toggle a detail using a row or index; normal indices address visible rows, source indices address the full source.'
    default: null
    usage: '/components/table/row-expansion.html#details-with-virtual-scrolling'
  - name: 'setDetailExpandedKeys'
    type: '(keys: TableRowKey[]) => void'
    description: 'Set detail keys; controlled mode emits a model update.'
    default: null
    usage: '/components/table/row-expansion.html#detail-rows'
  - name: 'reloadRowDetail'
    type: '(rowOrIndex: TableRow | number) => Promise<void>'
    description: 'Reload an expanded detail; row and index rules match toggleRowDetail.'
    default: null
    usage: '/components/table/row-expansion.html#async-details'
  - name: setSort
    type: '(sorts: TableSort[]) => void'
    description: 'Sets sorting; controlled mode emits an update for the model.'
    default: null
    usage: '/components/table/sorting-and-filtering.html#sorting-and-multiple-fields'
  - name: clearSort
    type: '() => void'
    description: 'Clears all sorting.'
    default: null
    usage: '/components/table/sorting-and-filtering.html#sorting-and-multiple-fields'
  - name: setFilters
    type: '(filters: TableFilters) => void'
    description: 'Replaces filters; synchronize the model in controlled mode.'
    default: null
    usage: '/components/table/sorting-and-filtering.html#filters-and-custom-filters'
  - name: clearFilters
    type: '() => void'
    description: 'Clears all filters.'
    default: null
    usage: '/components/table/sorting-and-filtering.html#filters-and-custom-filters'
  - name: getSelectedRows
    type: '() => TableRow[]'
    description: 'Returns selected rows as an array in either mode.'
    default: null
    usage: '/components/table/row-selection.html#multiple-selection'
  - name: setSelectedRows
    type: '(rows: TableRow[]) => void'
    description: 'Sets selected rows; single selection uses the first eligible row.'
    default: null
    usage: '/components/table/row-selection.html#multiple-selection'
  - name: clearSelection
    type: '() => void'
    description: 'Clears selection.'
    default: null
    usage: '/components/table/row-selection.html#multiple-selection'
  - name: toggleRowSelection
    type: '(row: TableRow, selected?: boolean) => void'
    description: 'Toggles a row or explicitly sets its selected state.'
    default: null
    usage: '/components/table/row-selection.html#multiple-selection'
  - name: selectAll
    type: '(selected?: boolean) => void'
    description: 'Selects or deselects eligible filtered, expanded rows on the current page. Disabled for virtualSource to avoid enumerating massive data.'
    default: null
    usage: '/components/table/row-selection.html#multiple-selection'
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
    description: 'Resynchronize virtual rows, merged cells, footers and the horizontal viewport when external styles or custom content change size without triggering an automatic layout update.'
  - name: 'commitProxy'
    type: '(action: TableProxyAction, rows?: TableRow[]) => Promise<TableProxyResult>'
    description: 'Dispatch query, refresh, save or delete with current conditions. rows applies only to delete: omit it for the current selection, or pass [] to delete nothing. save uses the tracked change set.'
    default: null
    usage: '/components/table/query-forms-and-request-proxy.html#request-proxy'
  - name: 'cancelProxy'
    type: '() => void'
    description: 'Abort the active request and ignore late results; does not guarantee rollback of server writes.'
    default: null
    usage: '/components/table/query-forms-and-request-proxy.html#request-proxy'
  - name: 'getProxyState'
    type: '() => TableProxyState'
    description: 'Read current request state.'
    default: null
    usage: '/components/table/query-forms-and-request-proxy.html#request-proxy'
  - name: 'query'
    type: '() => Promise<boolean>'
    description: 'Validate the form, request page one and emit query on acceptance.'
    default: null
    usage: '/components/table/query-forms-and-request-proxy.html#query-and-toolbar'
  - name: 'resetQuery'
    type: '() => Promise<boolean>'
    description: 'Restore initial form field values, request page one and emit query.'
    default: null
    usage: '/components/table/query-forms-and-request-proxy.html#query-and-toolbar'
  - name: 'refresh'
    type: '() => Promise<boolean>'
    description: 'Emit query with the current page and conditions, without validating the form.'
    default: null
    usage: '/components/table/query-forms-and-request-proxy.html#query-and-toolbar'
  - name: 'getQueryContext'
    type: '() => TableQueryContext<TableRow,QueryForm>'
    description: 'Read a condition snapshot; reason defaults to submit.'
    default: null
    usage: '/components/table/query-forms-and-request-proxy.html#query-and-toolbar'
  - name: 'getForm'
    type: '() => FormInstance | undefined'
    description: 'Access the query form; unavailable before mounting or when disabled.'
    default: null
    usage: '/components/table/query-forms-and-request-proxy.html#query-and-toolbar'
---

# Table
