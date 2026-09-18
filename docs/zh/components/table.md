---
description: '支持排序、筛选、分页、树形数据与虚拟滚动的数据表格。'
PROPS:
  - name: 'row'
    type: 'TableRow | TableRow[] | null'
    description: '旧版具名选择模型，请迁移到 v-model:highlight；显式 highlight 优先。'
    default: null
    usage: '/zh/components/table/row-selection.html#row-selection'
  - name: 'model-value'
    type: 'TableModelValueType | TableModelValueType[] | null'
    description: '旧版未具名选择模型，请迁移到 v-model:highlight；仅在未提供 highlight 和 row 时使用。'
    default: null
    usage: '/zh/components/table/row-selection.html#row-selection'
  - name: 'chart-config'
    type: 'Boolean | TableChartConfig'
    description: '开启图表取数，配置预算、转换与可选绘图适配器。'
    default: false
    usage: '/zh/components/table/large-data-and-visualization.html#chart-integration'
  - name: 'find-config'
    type: 'Boolean | TableFindConfig'
    description: '开启纯 API 查找，或配置范围、转换、键盘行为和处理上限；界面需显式使用 $find 工具栏渲染器。'
    default: false
    usage: '/zh/components/table/spreadsheet-interactions.html#find-and-replace'
  - name: 'clipboard-config'
    type: 'Boolean | TableClipboardConfig'
    description: '显式开启剪贴板操作，配置文本转换、写入限制和区域上限。'
    default: false
    usage: '/zh/components/table/spreadsheet-interactions.html#copy-cut-and-paste'
  - name: 'range-config'
    type: 'Boolean | TableRangeConfig'
    description: '开启矩形区域选择，可分别控制鼠标、键盘和边缘自动滚动。'
    default: 'false'
    usage: '/zh/components/table/spreadsheet-interactions.html#cell-range-selection'
  - name: 'cell-range'
    type: 'TableCellRange | null'
    description: '通过 v-model:cell-range 控制选区起点和终点；省略时由组件管理。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#cell-range-selection'
  - name: 'group-config'
    type: 'Boolean | TableGroupConfig'
    description: '配置本地/远程行分组、聚合和汇总范围。'
    default: false
    usage: '/zh/components/table/trees-and-groups.html#row-grouping-and-aggregation'
  - name: 'group-expanded-keys'
    type: 'string[]'
    description: '通过 v-model:group-expanded-keys 控制展开组；省略时内部管理。'
    default: null
    usage: '/zh/components/table/trees-and-groups.html#row-grouping-and-aggregation'
  - name: 'merge-config'
    type: 'Boolean | TableMergeConfig'
    description: '通过位置范围或同步窗口规则合并正文与表尾单元格。'
    default: false
    usage: '/zh/components/table/merged-cells.html#merging-cells'
  - name: 'context-menu-config'
    type: 'Boolean | TableContextMenuConfig'
    description: '配置表头、数据区和表尾的菜单项、动态工厂与可见条件。'
    default: false
    usage: '/zh/components/table/spreadsheet-interactions.html#context-menus'
  - name: 'keyboard-config'
    type: 'Boolean | TableKeyboardConfig'
    description: '开启单元格导航，配置 Enter 编辑与生成源行键定位。'
    default: false
    usage: '/zh/components/table/spreadsheet-interactions.html#keyboard-navigation'
  - name: 'active-cell'
    type: 'TableActiveCell | null'
    description: '使用 v-model:active-cell 控制活动单元格；省略时由组件管理。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#keyboard-navigation'
  - name: 'row-drag-config'
    type: 'Boolean | TableRowDragConfig'
    description: '开启行拖拽，配置禁用条件、放置条件、自动滚动和受控适配器。'
    default: false
    usage: '/zh/components/table/spreadsheet-interactions.html#row-reordering'
  - name: 'history-config'
    type: 'Boolean | TableHistoryConfig'
    description: '开启操作历史，需同时开启 change-config；limit 默认保留最近 100 次操作。'
    default: false
    usage: '/zh/components/table/editing-validation-and-changes.html#undo-and-redo'
  - name: 'change-config'
    type: 'Boolean | TableChangeConfig'
    description: '开启受控数据变更与追踪；普通数组使用 v-model:data，生成源提供 apply 和 indexOf。'
    default: false
    usage: '/zh/components/table/editing-validation-and-changes.html#change-tracking'
  - name: 'validation-rules'
    type: 'TableValidationRules'
    description: '按字段设置校验规则；列 rules 优先，空数组可关闭该列规则。'
    default: '{}'
    usage: '/zh/components/table/editing-validation-and-changes.html#data-validation'
  - name: 'validation-config'
    type: 'Boolean | TableValidationConfig'
    description: '开启编辑提交前校验，并配置自动定位及错误数上限。关闭时仍可手动校验。'
    default: 'false'
    usage: '/zh/components/table/editing-validation-and-changes.html#data-validation'
  - name: 'edit-config'
    type: 'Boolean | TableEditConfig'
    description: '开启编辑，配置单元格或整行模式、触发方式、条件及离开策略。'
    default: 'false'
    usage: '/zh/components/table/editing-validation-and-changes.html#cell-and-row-editing'
  - name: 'detail-config'
    type: 'Boolean | TableDetailConfig'
    description: '详情展开配置；expand 列自动开启，false 关闭。生成数据源需显式开启。'
    default: null
    usage: '/zh/components/table/row-expansion.html#detail-rows'
  - name: 'detail-expanded-keys'
    type: 'TableRowKey[]'
    description: '通过 v-model:detail-expanded-keys 控制展开键，独立于树节点展开。'
    default: null
    usage: '/zh/components/table/row-expansion.html#detail-rows'
  - name: footer-data
    type: TableRow[]
    description: 应用或服务端直接提供的表尾记录；叶子列的表尾插槽、渲染函数和格式化仍分别控制各单元格。
    default: '[]'
    usage: '/zh/components/table/footers-and-summaries.html#footer-data-rows'
  - name: footer-config
    type: Boolean | TableFooterConfig
    description: 从全部传入数据、筛选结果或当前页生成表尾行，并提供精确的内置聚合。
    default: 'false'
    usage: '/zh/components/table/footers-and-summaries.html#footer-data-rows'
  - name: footer-row-key
    type: TableRowKeyGetter
    description: 表尾稳定行键的字段路径或函数；未设置时使用表尾索引。
    default: null
    usage: '/zh/components/table/footers-and-summaries.html#footer-data-rows'
  - name: show-footer-overflow
    type: TableOverflow
    description: 表尾溢出处理，与正文和表头独立；列配置优先。
    default: 'false'
    usage: '/zh/components/table/footers-and-summaries.html#footer-data-rows'
  - name: column-state
    type: TableColumnState[]
    description: '通过 v-model:column-state 控制列显隐、顺序、固定位置及可选的父级结构覆盖。'
    default: null
    usage: '/zh/components/table/column-layout-and-management.html#column-settings'
  - name: resize-config
    type: Boolean | TableResizeConfig
    description: '显式开启列宽调整，支持全局最小宽度和键盘步长。'
    default: false
    usage: '/zh/components/table/column-layout-and-management.html#column-resizing'
  - name: column-widths
    type: TableColumnWidths
    description: 'v-model:column-widths 受控列宽；普通列以 key、field 或 @索引标识，virtualSource 使用列索引字符串。'
    default: null
    usage: '/zh/components/table/column-layout-and-management.html#column-resizing'
  - name: data
    type: Row[]
    description: 表格渲染的行数据；省略时，已开启的请求代理会在内部保存已接受的查询结果。
    default: null
    usage: '/zh/components/table/data-and-column-definitions.html#configuration-object'
  - name: columns
    type: TableColumn<Row>[]
    description: 列配置，支持字段、尺寸、对齐、插槽、渲染器和树节点。
    default: '[]'
    usage: '/zh/components/table/data-and-column-definitions.html#configuration-object'
  - name: row-key
    type: String | Function
    description: 稳定的行键字段或取值函数。
    default: id
    usage: '/zh/components/table/data-and-column-definitions.html#configuration-object'
  - name: highlight
    type: TableRow | TableRow[] | null
    description: 当前高亮的行或行数组。
    default: null
    usage: '/zh/components/table/row-selection.html#row-selection'
  - name: multiple
    type: Boolean
    description: 开启多行选择。
    default: 'false'
    usage: '/zh/components/table/row-selection.html#row-selection'
  - name: striped
    type: Boolean
    description: 交替显示行背景。
    default: 'false'
    usage: '/zh/components/table/data-and-column-definitions.html#configuration-object'
  - name: row-class
    type: String | Function
    description: 为每一行添加类名。
    default: ''
    usage: '/zh/components/table/data-and-column-definitions.html#configuration-object'
  - name: tree-config
    type: TableTreeConfig
    description: 开启层级行、受控展开和子节点懒加载；line 控制是否显示父子连接线。
    default: null
    usage: '/zh/components/table/trees-and-groups.html#tree-table-and-lazy-loading'
  - name: parent-indicator
    type: Boolean | TableParentIndicatorConfig
    description: 虚拟滚动经过树节点或分组成员时显示返回父级的临时吸顶条；enabled 控制是否开启，hideDelay 设置停止滚动后的隐藏延迟，单位为毫秒。
    default: true
    usage: '/zh/components/table/trees-and-groups.html#remote-groups-and-virtual-rows'
  - name: virtual-config
    type: Boolean | TableVirtualConfig
    description: 开启 Y 轴虚拟行以及可选的 X 轴虚拟列；height 可传尺寸，或用 auto 占用有界容器的剩余空间。
    default: 'false'
    usage: '/zh/components/table/large-data-and-visualization.html#virtual-rows-and-dynamic-heights'
  - name: virtual-source
    type: TableVirtualSource
    description: 通过逻辑行列数量和同步索引读取器提供可见窗口，使 Table 无需接收完整的行列数组。
    default: null
    usage: '/zh/components/table/large-data-and-visualization.html#virtual-rows-and-dynamic-heights'
  - name: expanded-keys
    type: Array<String | Number>
    description: 供 v-model:expanded-keys 使用的受控展开键。
    default: null
    usage: '/zh/components/table/trees-and-groups.html#tree-table-and-lazy-loading'
  - name: renderers
    type: Record<string, TableRenderer>
    description: 供列配置引用的具名单元格和表头渲染器。
    default: '{}'
    usage: '/zh/components/table/data-and-column-definitions.html#slots-and-renderers'
  - name: show-header
    type: Boolean
    description: 是否显示配置生成的表头。
    default: true
    usage: '/zh/components/table/data-and-column-definitions.html#configuration-object'
  - name: empty-text
    type: String
    description: 没有行或列时显示的文字。
    default: null
    usage: '/zh/components/table/data-and-column-definitions.html#configuration-object'
  - name: loading
    type: Boolean
    description: 在表格上显示加载遮罩。
    default: 'false'
    usage: '/zh/components/table/data-and-column-definitions.html#configuration-object'
  - name: sort-by
    type: 'TableSort[]'
    description: '受控排序状态；未传时使用内部状态。'
    default: null
    usage: '/zh/components/table/sorting-and-filtering.html#sorting-and-multiple-fields'
  - name: sort-config
    type: 'TableSortConfig'
    description: '多字段、远程排序和初始排序配置。'
    default: '{}'
    usage: '/zh/components/table/sorting-and-filtering.html#sorting-and-multiple-fields'
  - name: filters
    type: 'TableFilters'
    description: '受控筛选值，以字段名或无字段列的 key 为键。'
    default: null
    usage: '/zh/components/table/sorting-and-filtering.html#filters-and-custom-filters'
  - name: filter-config
    type: 'TableFilterConfig'
    description: '远程筛选和初始筛选配置。'
    default: '{}'
    usage: '/zh/components/table/sorting-and-filtering.html#remote-sorting-and-filtering'
  - name: pager-config
    type: Boolean | TablePagerConfig
    description: '内置分页配置，默认关闭。提供 currentPage/pageSize 时使用 v-model:pager-config 同步；remote 模式需传 total。'
    default: 'false'
    usage: '/zh/components/table/row-selection.html#multiple-selection'
  - name: selection-config
    type: 'TableSelectionConfig'
    description: '行选择触发方式、禁选、全选和跨页保留配置。'
    default: '{}'
    usage: '/zh/components/table/row-selection.html#multiple-selection'
  - name: show-overflow
    type: 'TableOverflow'
    description: '单元格溢出处理，true 等价于 tooltip。'
    default: 'false'
    usage: '/zh/components/table/data-and-column-definitions.html#text-overflow-and-tooltips'
  - name: show-header-overflow
    type: 'TableOverflow'
    description: '表头溢出处理，列配置优先。'
    default: 'false'
    usage: '/zh/components/table/data-and-column-definitions.html#text-overflow-and-tooltips'
  - name: 'proxy-config'
    type: 'Boolean | TableProxyConfig<Row, QueryForm>'
    description: '配置 query、save、delete 适配器；默认关闭。'
    default: false
    usage: '/zh/components/table/query-forms-and-request-proxy.html#request-proxy'
  - name: 'query-config'
    type: 'Boolean | TableQueryConfig<QueryForm>'
    description: '查询表单配置；model、items、rules 和布局参数沿用 SForm。'
    default: false
    usage: '/zh/components/table/query-forms-and-request-proxy.html#query-and-toolbar'
  - name: 'toolbar-config'
    type: 'Boolean | TableToolbarConfig<Row, QueryForm>'
    description: '工具栏标题和有序的 left/right 渲染器列表；内置 button、$refresh 与 $columnConfig。'
    default: false
    usage: '/zh/components/table/query-forms-and-request-proxy.html#query-and-toolbar'
CHILD_PROPS:
  - name: 'key'
    type: 'String'
    description: 'columns 配置中的稳定列标识；嵌套的 STableColumn 使用 Vue 的 key 属性。'
    default: null
    usage: '/zh/components/table/data-and-column-definitions.html#nested-columns'
  - name: 'class-name'
    type: 'String'
    description: '此列数据单元格的自定义类名。'
    default: null
    usage: '/zh/components/table/data-and-column-definitions.html#slots-and-renderers'
  - name: 'cell'
    type: 'TableCellRenderer'
    description: '单元格渲染函数，优先使用列专属插槽和通用 cell 插槽。'
    default: null
    usage: '/zh/components/table/data-and-column-definitions.html#slots-and-renderers'
  - name: 'header'
    type: 'TableHeaderRenderer'
    description: '表头渲染函数，优先使用列专属插槽和通用 header-cell 插槽。'
    default: null
    usage: '/zh/components/table/data-and-column-definitions.html#slots-and-renderers'
  - name: 'drag-sort'
    type: 'Boolean'
    description: '在此列显示行拖动手柄，需开启 row-drag-config。'
    default: false
    usage: '/zh/components/table/spreadsheet-interactions.html#row-reordering'
  - name: 'rules'
    type: 'TableValidationRule | TableValidationRule[]'
    description: '当前列的同步或异步规则，优先于 validation-rules。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#data-validation'
  - name: 'editor'
    type: 'Boolean | TableEditorConfig'
    description: '允许编辑此字段；支持 input、number、select、date、switch，以及控件 props、选项和条件。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#cell-and-row-editing'
  - name: 'edit'
    type: 'TableEditRenderer'
    description: '编辑态渲染函数，与展示态 cell 分开。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#custom-editors'
  - name: footer
    type: TableFooterRenderer
    description: 表尾单元格渲染函数。
    default: null
    usage: '/zh/components/table/footers-and-summaries.html#footer-data-rows'
  - name: footer-formatter
    type: TableFooterFormatter
    description: 表尾文本格式化函数；无插槽或渲染器时使用。
    default: null
    usage: '/zh/components/table/footers-and-summaries.html#footer-data-rows'
  - name: footer-align
    type: TableAlign
    description: 表尾对齐方式，默认使用该列 align。
    default: null
    usage: '/zh/components/table/footers-and-summaries.html#footer-data-rows'
  - name: show-footer-overflow
    type: TableOverflow
    description: 当前列的表尾溢出处理，优先于表格配置。
    default: null
    usage: '/zh/components/table/footers-and-summaries.html#footer-data-rows'
  - name: children
    type: TableColumn[]
    description: 嵌套子列并生成分组标题；数据单元格只由叶子列渲染。
    default: null
    usage: '/zh/components/table/header-structures.html#grouped-headers'
  - name: resizable
    type: Boolean
    description: '设为 false 禁止调整此列；需先开启 resize-config。'
    default: null
    usage: '/zh/components/table/column-layout-and-management.html#column-resizing'
  - name: type
    type: TableColumnType
    description: 生成序号、复选、单选或详情展开列，使用内置控件。
    default: null
  - name: field
    type: String
    description: 从行数据中读取单元格值的点路径。
    default: null
  - name: title
    type: String
    description: 列表头文字。
    default: null
  - name: width
    type: Number | String
    description: 固定列宽。
    default: null
  - name: min-width
    type: Number | String
    description: 弹性列的最小宽度；满足所有最小宽度后，各弹性列均分剩余空间。
    default: null
  - name: align
    type: TableAlign
    description: 表头和单元格的对齐方式。
    default: left
  - name: fixed
    type: TableColumnFixed
    description: 将列固定在左侧或右侧；true 等价于 left。未设置时继承父组，false 解除继承的固定位置。
    default: null
    usage: '/zh/components/table/large-data-and-visualization.html#virtual-rows-and-dynamic-heights'
  - name: tree-node
    type: Boolean
    description: 在当前列放置树形缩进和展开按钮。
    default: 'false'
  - name: renderer
    type: String | Function | TableRenderer | TableRendererOptions
    description: "内联渲染器、表格局部渲染器键名，或 `{ name: '$buttons' }` 形式的全局渲染器配置。"
    default: null
    usage: '/zh/components/table/data-and-column-definitions.html#slots-and-renderers'
  - name: slots
    type: TableColumnSlots
    description: 配置项写法中正文、表头、编辑、表尾与筛选插槽的显式名称映射；slots.default 也可直接传入 TableCellRenderer 函数。
    default: null
  - name: sortable
    type: 'Boolean'
    description: '启用该列的排序按钮。'
    default: 'false'
    usage: '/zh/components/table/sorting-and-filtering.html#sorting-and-multiple-fields'
  - name: sort-method
    type: 'TableSortMethod'
    description: '逐列指定数字、字符串或自定义排序。函数支持布尔值、0/1 和标准数值比较结果；true/正数表示升序时 a 排在 b 后面。'
    default: null
    usage: '/zh/components/table/sorting-and-filtering.html#column-sorting-rules'
  - name: filters
    type: 'TableFilterOption[]'
    description: '筛选选项；可用 disabled 禁用某个选项。'
    default: null
    usage: '/zh/components/table/sorting-and-filtering.html#filters-and-custom-filters'
  - name: filter-multiple
    type: 'Boolean'
    description: '筛选选项是否允许多选。'
    default: true
    usage: '/zh/components/table/sorting-and-filtering.html#filters-and-custom-filters'
  - name: filter-method
    type: '(params: TableFilterParams) => boolean'
    description: '自定义行匹配函数；同列选项逻辑由此函数决定。'
    default: null
    usage: '/zh/components/table/sorting-and-filtering.html#filters-and-custom-filters'
  - name: filter-render
    type: 'TableRendererOptions'
    description: '通过全局渲染器注册表生成筛选控件，并向渲染器传递 props、options 与 events。'
    default: null
    usage: '/zh/components/table/sorting-and-filtering.html#filters-and-custom-filters'
  - name: show-overflow
    type: 'TableOverflow'
    description: '覆盖该列的单元格溢出处理；未设置时继承表格。'
    default: null
    usage: '/zh/components/table/data-and-column-definitions.html#text-overflow-and-tooltips'
  - name: show-header-overflow
    type: 'TableOverflow'
    description: '覆盖该列的表头溢出处理；未设置时继承表格。'
    default: null
    usage: '/zh/components/table/data-and-column-definitions.html#text-overflow-and-tooltips'
EVENTS:
  - name: 'proxyStateChange'
    type: '(state: TableProxyState) => void'
    description: '请求加载状态和最近结果变化。'
    default: null
    usage: '/zh/components/table/query-forms-and-request-proxy.html#request-proxy'
  - name: 'proxySuccess'
    type: '(result: TableProxyResult) => void'
    description: '查询数据被接受或写请求成功后触发。'
    default: null
    usage: '/zh/components/table/query-forms-and-request-proxy.html#request-proxy'
  - name: 'proxyError'
    type: '(result: TableProxyResult) => void'
    description: '适配器抛出异常或查询响应格式无效；取消不触发。'
    default: null
    usage: '/zh/components/table/query-forms-and-request-proxy.html#request-proxy'
  - name: 'query'
    type: '(context: TableQueryContext<Row, QueryForm>) => void'
    description: '查询、重置或刷新时提供独立的表单、分页、排序与筛选快照。'
    default: null
    usage: '/zh/components/table/query-forms-and-request-proxy.html#query-and-toolbar'
  - name: 'queryError'
    type: '(error: unknown) => void'
    description: '查询编排异常；字段校验失败由表单展示，不触发此事件。'
    default: null
    usage: '/zh/components/table/query-forms-and-request-proxy.html#query-and-toolbar'
  - name: 'toolbarClick'
    type: '(code: string, context: TableQueryContext<Row, QueryForm>, event: MouseEvent) => void'
    description: '点击工具栏任一侧未被单独处理的 $buttons 操作。'
    default: null
    usage: '/zh/components/table/query-forms-and-request-proxy.html#query-and-toolbar'
  - name: 'update:row'
    type: '(value: TableRow | TableRow[] | null) => void'
    description: '用于兼容 v-model:row 的选择更新；新代码使用 update:highlight。'
    default: null
    usage: '/zh/components/table/row-selection.html#row-selection'
  - name: 'update:modelValue'
    type: '(value: TableModelValueType | TableModelValueType[] | null) => void'
    description: '用于兼容未具名模型的更新；新代码使用 update:highlight。'
    default: null
    usage: '/zh/components/table/row-selection.html#row-selection'
  - name: 'chartChange'
    type: '(state: TableChartState) => void'
    description: '取数进度、快照或面板状态改变。'
    default: null
    usage: '/zh/components/table/large-data-and-visualization.html#chart-integration'
  - name: 'chartError'
    type: '(error: unknown) => void'
    description: '绘图适配器挂载、尺寸更新或释放发生错误。'
    default: null
    usage: '/zh/components/table/large-data-and-visualization.html#chart-integration'
  - name: 'findChange'
    type: '(state: TableFindState) => void'
    description: '搜索进度、匹配、活动索引或清理发生变化。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#find-and-replace'
  - name: 'replace'
    type: '(result: TableReplaceResult) => void'
    description: '替换完成，包含变更数量、校验错误或失败原因。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#find-and-replace'
  - name: 'clipboard'
    type: '(result: TableClipboardResult) => void'
    description: '操作结束时提供成功状态、剪贴板写入状态、实际变更数及失败原因。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#copy-cut-and-paste'
  - name: 'update:cellRange'
    type: '(range: TableCellRange | null) => void'
    description: '请求更新受控选区。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#cell-range-selection'
  - name: 'cellRangeChange'
    type: '(change: TableCellRangeChange) => void'
    description: '已接受的选区或逻辑边界变化后触发，包含范围、边界和原因。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#cell-range-selection'
  - name: 'cellRangeError'
    type: '(error: unknown) => void'
    description: '选区合并区域解析失败时触发。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#cell-range-selection'
  - name: 'update:groupExpandedKeys'
    type: '(keys: string[]) => void'
    description: '请求更新展开键。'
    default: null
    usage: '/zh/components/table/trees-and-groups.html#row-grouping-and-aggregation'
  - name: 'groupExpand'
    type: '(params: { group: TableGroupNode; expanded: boolean }) => void'
    description: '展开变更被接受后触发。'
    default: null
    usage: '/zh/components/table/trees-and-groups.html#row-grouping-and-aggregation'
  - name: 'groupError'
    type: '(error: unknown) => void'
    description: '分组配置或聚合计算失败。'
    default: null
    usage: '/zh/components/table/trees-and-groups.html#row-grouping-and-aggregation'
  - name: 'contextMenuOpen'
    type: '(context: TableContextMenuContext) => void'
    description: '菜单打开，提供所在区域、对应行列上下文及单元格选区快照。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#context-menus'
  - name: 'contextMenuSelect'
    type: '(params: TableContextMenuSelectParams) => void'
    description: '选择可用菜单项；由应用执行对应业务操作。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#context-menus'
  - name: 'contextMenuClose'
    type: '(context: TableContextMenuContext) => void'
    description: '菜单关闭，提供原上下文及打开时的单元格选区快照。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#context-menus'
  - name: 'update:activeCell'
    type: '(cell: TableActiveCell | null) => void'
    description: '请求更新活动单元格，与行选择独立。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#keyboard-navigation'
  - name: 'activeCellChange'
    type: '(cell: TableActiveCell | null) => void'
    description: '活动单元格被接受后变化时触发。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#keyboard-navigation'
  - name: 'rowDragStart'
    type: '(context: TableRowDragContext) => void'
    description: '鼠标或键盘拾取行。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#row-reordering'
  - name: 'rowDragEnd'
    type: '(result: TableRowDragResult) => void'
    description: '拖动或 moveRow 操作结束；检查 applied 和 reason。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#row-reordering'
  - name: 'historyChange'
    type: '(state: TableHistoryState) => void'
    description: '历史栈变化时触发；包含撤销和重做数量以及可用状态。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#undo-and-redo'
  - name: 'update:data'
    type: '(data: TableRow[]) => void'
    description: '普通数组变更提案；父组件接受后才计入记录。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#change-tracking'
  - name: 'dataChange'
    type: '(operations: TableDataMutation[]) => void'
    description: '数据所有者接受变更且记录提交后触发，包含还原操作。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#change-tracking'
  - name: 'changesChange'
    type: '(version: number) => void'
    description: '变更记录版本变化时触发；可用 getChangeRecords 获取快照。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#change-tracking'
  - name: 'validation'
    type: 'TableValidationResult'
    description: '最新校验结束时触发；取消或过期的校验不触发此事件。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#data-validation'
  - name: 'editStart'
    type: '(params: TableEditRecord) => void'
    description: '开始编辑时触发。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#cell-and-row-editing'
  - name: 'editChange'
    type: '(params: TableEditRecord) => void'
    description: '草稿变更时触发；不会修改传入的数据。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#cell-and-row-editing'
  - name: 'editCommit'
    type: '(params: TableEditEndParams) => void'
    description: '提交草稿时提供变更字段与 updatedRow；业务接收并保存结果。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#cell-and-row-editing'
  - name: 'editCancel'
    type: '(params: TableEditEndParams) => void'
    description: '取消草稿时触发，包含 reason。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#cell-and-row-editing'
  - name: 'update:detailExpandedKeys'
    type: '(keys: TableRowKey[]) => void'
    description: '请求更新完整的详情展开键数组。'
    default: null
    usage: '/zh/components/table/row-expansion.html#detail-rows'
  - name: 'detailExpand'
    type: '(params: TableDetailExpandParams) => void'
    description: '用户或 toggleRowDetail 请求展开或收起时触发；受控模式需更新模型才会生效。'
    default: null
    usage: '/zh/components/table/row-expansion.html#detail-rows'
  - name: 'detailLoad'
    type: '(params: TableDetailParams & { data: unknown }) => void'
    description: '当前有效的异步详情加载成功时触发。'
    default: null
    usage: '/zh/components/table/row-expansion.html#async-details'
  - name: 'detailLoadError'
    type: '(params: TableDetailParams & { error: unknown }) => void'
    description: '当前详情加载失败时触发，不包含取消或过期请求。'
    default: null
    usage: '/zh/components/table/row-expansion.html#async-details'
  - name: footerCellClick
    type: '(params: TableFooterCellRenderParams, event: MouseEvent) => void'
    description: 点击表尾单元格时触发，包含表尾行、叶子列、原始值与索引；不会触发行选择。
    default: null
    usage: '/zh/components/table/footers-and-summaries.html#footer-data-rows'
  - name: footerError
    type: '(error: unknown) => void'
    description: footer-config 定义无效或无法在本地计算时触发。
    default: null
    usage: '/zh/components/table/footers-and-summaries.html#footer-data-rows'
  - name: update:columnState
    type: '(state: TableColumnState[]) => void'
    description: 请求更新受控列设置。
    default: null
    usage: '/zh/components/table/column-layout-and-management.html#column-settings'
  - name: columnStateChange
    type: '(state: TableColumnState[]) => void'
    description: 用户更改或重置列设置时触发，携带完整设置数组。
    default: null
    usage: '/zh/components/table/column-layout-and-management.html#column-settings'
  - name: columnStorageError
    type: "(event: { operation: 'read' | 'write'; error: unknown }) => void"
    description: 读取或写入本地列设置失败时触发，表格仍可正常操作。
    default: null
    usage: '/zh/components/table/column-layout-and-management.html#remember-column-settings'
  - name: update:columnWidths
    type: '(widths: TableColumnWidths) => void'
    description: '提交列宽后返回新的完整宽度记录。'
    default: null
    usage: '/zh/components/table/column-layout-and-management.html#column-resizing'
  - name: column-resize
    type: '(params: TableColumnResizeParams) => void'
    description: '拖动结束或键盘调整后触发，含列、索引、新旧宽度及输入来源。'
    default: null
    usage: '/zh/components/table/column-layout-and-management.html#column-resizing'
  - name: update:highlight
    type: TableRow | TableRow[] | null
    description: 行选择变化时触发。
  - name: update:expandedKeys
    type: Array<String | Number>
    description: 受控的树节点展开状态变化时触发。
  - name: rowClick
    type: '(row, event)'
    description: 点击行时触发。
  - name: cellClick
    type: '(params, event)'
    description: 点击单元格时触发。
  - name: treeExpand
    type: '(row, expanded)'
    description: 树节点展开或收起后触发。
  - name: lazyLoad
    type: '(row, children)'
    description: 懒加载子节点完成后触发。
  - name: scroll
    type: Event
    description: 虚拟行视口滚动时触发。
  - name: update:sortBy
    type: 'TableSort[]'
    description: '供 v-model:sort-by 使用的排序更新。'
    default: null
    usage: '/zh/components/table/sorting-and-filtering.html#sorting-and-multiple-fields'
  - name: sortChange
    type: 'TableSort[]'
    description: '排序状态变化；远程模式下可据此发起请求。'
    default: null
    usage: '/zh/components/table/sorting-and-filtering.html#remote-sorting-and-filtering'
  - name: update:filters
    type: 'TableFilters'
    description: '供 v-model:filters 使用的筛选更新。'
    default: null
    usage: '/zh/components/table/sorting-and-filtering.html#filters-and-custom-filters'
  - name: filterChange
    type: 'TableFilters'
    description: '确认或重置筛选后触发。'
    default: null
    usage: '/zh/components/table/sorting-and-filtering.html#filters-and-custom-filters'
  - name: update:pagerConfig
    type: TablePagerConfig
    description: '同步页码和每页条数，保留配置中的其他字段。'
    default: null
    usage: '/zh/components/table/row-selection.html#multiple-selection'
  - name: pageChange
    type: TablePageChangeParams
    description: '翻页、修改条数、查询重置或越界修正时触发，包含 currentPage、pageSize、total 和 type。'
    default: null
    usage: '/zh/components/table/row-selection.html#multiple-selection'
  - name: selectionChange
    type: 'TableRow[]'
    description: '选择变化，单选和多选均返回行数组。'
    default: null
    usage: '/zh/components/table/row-selection.html#multiple-selection'
SLOTS:
  - name: 'proxy-error'
    type: 'TableExposes & { state: TableProxyState }'
    description: '自定义请求错误内容，接收 state 和 Table 方法。'
    default: null
    usage: '/zh/components/table/query-forms-and-request-proxy.html#request-proxy'
  - name: 'query'
    type: 'TableExposes & { model: FormModel }'
    description: '在同一个表单中追加 SFormItem，接收 model 和 Table 方法。'
    default: null
    usage: '/zh/components/table/query-forms-and-request-proxy.html#slots-and-nested-columns'
  - name: '[queryConfig.items[].slots]'
    type: 'Scoped slot'
    description: '由查询项显式映射的字段、标签或错误插槽；字段内容可获取 model、item、field、prop、value、disabled、readonly 和 setValue(value)。'
    default: null
    usage: '/zh/components/table/query-forms-and-request-proxy.html#slots-and-nested-columns'
  - name: 'query-actions'
    type: 'TableExposes & { busy: boolean }'
    description: '替换查询操作，接收 query、resetQuery、refresh、busy 等。'
    default: null
    usage: '/zh/components/table/query-forms-and-request-proxy.html#slots-and-nested-columns'
  - name: 'toolbar_left'
    type: 'TableExposes & { busy: boolean }'
    description: '替换工具栏左侧区域，接收 Table 方法和 busy。'
    default: null
    usage: '/zh/components/table/query-forms-and-request-proxy.html#slots-and-nested-columns'
  - name: 'toolbar_right'
    type: 'TableExposes & { busy: boolean }'
    description: '替换工具栏右侧区域，接收 Table 方法和 busy。'
    default: null
    usage: '/zh/components/table/query-forms-and-request-proxy.html#slots-and-nested-columns'
  - name: 'toolbar-title'
    type: 'Slot'
    description: '替换工具栏标题。'
    default: null
    usage: '/zh/components/table/query-forms-and-request-proxy.html#slots-and-nested-columns'
  - name: 'STableColumn.default'
    type: 'TableCellRenderParams'
    description: '嵌套列的数据单元格内容。'
    default: null
    usage: '/zh/components/table/data-and-column-definitions.html#nested-columns'
  - name: 'STableColumn.header'
    type: 'TableHeaderRenderParams'
    description: '嵌套叶子列或分组列的表头内容。'
    default: null
    usage: '/zh/components/table/header-structures.html#nested-grouped-headers'
  - name: 'group-header'
    type: '{ group: TableGroupNode; expanded: boolean }'
    description: '组标题内容，保留内置展开按钮。'
    default: null
    usage: '/zh/components/table/trees-and-groups.html#row-grouping-and-aggregation'
  - name: 'group-summary'
    type: 'TableFooterCellRenderParams & { group?: TableGroupNode; kind: string }'
    description: '小计或整体汇总单元格。'
    default: null
    usage: '/zh/components/table/trees-and-groups.html#row-grouping-and-aggregation'
  - name: 'parent-indicator'
    type: 'TableParentIndicatorSlotParams'
    description: '自定义固定回退图标以外的提示条内容；可获取 parentKey、label 和 jump。'
    default: null
    usage: '/zh/components/table/trees-and-groups.html#remote-groups-and-virtual-rows'
  - name: '[columns.slots.edit]'
    type: 'TableEditSlotParams'
    description: '由列配置显式映射的编辑插槽。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#custom-editors'
  - name: 'edit-cell'
    type: 'TableEditSlotParams'
    description: '通用编辑插槽；接收 value、draftRow、setValue、commit 和 cancel。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#custom-editors'
  - name: 'STableColumn.edit'
    type: 'TableEditSlotParams'
    description: '嵌套列的编辑插槽。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#custom-editors'
  - name: 'detail'
    type: 'TableDetailSlotParams'
    description: '详情内容；接收行、键、索引、加载结果以及 reload 和 close。'
    default: null
    usage: '/zh/components/table/row-expansion.html#detail-rows'
  - name: 'detail-loading'
    type: 'TableDetailSlotParams'
    description: '详情加载中的内容。'
    default: null
    usage: '/zh/components/table/row-expansion.html#async-details'
  - name: 'detail-error'
    type: 'TableDetailSlotParams'
    description: '详情加载失败的内容；可调用 reload 重试。'
    default: null
    usage: '/zh/components/table/row-expansion.html#async-details'
  - name: '[columns.slots.footer]'
    type: TableFooterCellRenderParams
    description: 由叶子列配置显式映射的表尾插槽。
    default: null
    usage: '/zh/components/table/footers-and-summaries.html#footer-data-rows'
  - name: footer-cell
    type: TableFooterCellRenderParams
    description: 所有表尾单元格的后备插槽。
    default: null
    usage: '/zh/components/table/footers-and-summaries.html#footer-data-rows'
  - name: STableColumn.footer
    type: TableFooterCellRenderParams
    description: 嵌套列的表尾渲染插槽。
    default: null
    usage: '/zh/components/table/footers-and-summaries.html#footer-data-rows'
  - name: STableColumn.columns
    type: Slot
    description: STableColumn 的嵌套子列定义插槽。
    usage: '/zh/components/table/header-structures.html#nested-grouped-headers'
  - name: default
    type: Slot
    description: 嵌套的 s-table-column 列定义。
  - name: '[columns.slots.default]'
    type: TableCellRenderParams
    description: 由列配置显式映射的正文单元格插槽，可获取 row、column、value 和 rowIndex。
  - name: cell
    type: TableCellRenderParams
    description: 所有列共用的后备单元格插槽。
  - name: '[columns.slots.header]'
    type: TableHeaderRenderParams
    description: 由列配置显式映射的表头插槽。
  - name: header-cell
    type: TableHeaderRenderParams
    description: 所有列共用的后备表头插槽。
  - name: header
    type: Slot
    description: 表格上方的工具栏或状态区域。
  - name: footer
    type: Slot
    description: 表格下方的分页或汇总区域。
  - name: notFound
    type: Slot
    description: 空数据状态内容。
  - name: '[columns.slots.filter]'
    type: 'TableFilterSlotParams'
    description: '列配置指定的自定义筛选插槽，可获取 values、setValues、apply、reset、close。'
    default: null
    usage: '/zh/components/table/sorting-and-filtering.html#filters-and-custom-filters'
EXPOSES:
  - name: 'getChartData'
    type: '(options: TableChartOptions) => Promise<TableChartResult>'
    description: '提取只读图表快照，不打开面板。scope 和 series 必填；bounds 仅用于 selection，aggregate/groupKeys/summaryLabel 用于 aggregate 范围。'
    default: null
    usage: '/zh/components/table/large-data-and-visualization.html#chart-integration'
  - name: 'openChart'
    type: '(options: TableChartOptions) => Promise<TableChartResult>'
    description: '提取完整数据后打开面板；需要配置 adapter。'
    default: null
    usage: '/zh/components/table/large-data-and-visualization.html#chart-integration'
  - name: 'closeChart'
    type: '() => void'
    description: '关闭面板、取消取数并清除快照。'
    default: null
    usage: '/zh/components/table/large-data-and-visualization.html#chart-integration'
  - name: 'cancelChart'
    type: '() => void'
    description: '取消待完成的取数任务。'
    default: null
    usage: '/zh/components/table/large-data-and-visualization.html#chart-integration'
  - name: 'getChartState'
    type: '() => TableChartState'
    description: '读取图表取数和面板状态。'
    default: null
    usage: '/zh/components/table/large-data-and-visualization.html#chart-integration'
  - name: 'findCells'
    type: '(query: string | TableFindQuery, options?: TableFindOptions) => Promise<TableFindResult>'
    description: '查找指定范围，返回匹配快照及扫描完整性。scope 默认取 findConfig.scope，再回退到 view；data 范围不接受 bounds，columns: [] 不搜索任何列。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#find-and-replace'
  - name: 'findNext'
    type: '(options?: TableFindNavigateOptions) => Promise<boolean>'
    description: '定位下一个匹配，末尾循环；返回定位是否成功。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#find-and-replace'
  - name: 'findPrevious'
    type: '(options?: TableFindNavigateOptions) => Promise<boolean>'
    description: '定位上一个匹配；focus: false 保留当前输入焦点。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#find-and-replace'
  - name: 'replaceMatch'
    type: '(replacement: string, options?: TableReplaceOptions) => Promise<TableReplaceResult>'
    description: '替换活动匹配格或指定索引匹配格中的全部字面命中。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#find-and-replace'
  - name: 'replaceAll'
    type: '(replacement: string, options?: TableReplaceOptions) => Promise<TableReplaceResult>'
    description: '校验并以一次事务替换所有可写匹配；要求搜索完整。忽略 options.index，该索引仅用于 replaceMatch。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#find-and-replace'
  - name: 'getFindState'
    type: '() => TableFindState'
    description: '读取查询、范围、匹配摘要、活动索引、进度和上限状态。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#find-and-replace'
  - name: 'clearFind'
    type: '() => void'
    description: '取消等待并清空匹配，保留查询内容。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#find-and-replace'
  - name: 'cancelFind'
    type: '() => void'
    description: '取消等待中的搜索、定位或替换操作。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#find-and-replace'
  - name: 'openFind'
    type: '() => Promise<boolean>'
    description: '打开并聚焦已挂载的 $find 工具栏面板；未挂载 $find 或查找被禁用时返回 false。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#find-and-replace'
  - name: 'closeFind'
    type: '() => void'
    description: '关闭面板并取消等待；焦点在面板中时恢复到触发按钮。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#find-and-replace'
  - name: 'copyCells'
    type: '(options?: TableCopyOptions) => Promise<TableClipboardResult>'
    description: '复制当前区域或 bounds；writeClipboard: false 仅返回独立二维数据与 TSV。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#copy-cut-and-paste'
  - name: 'cutCells'
    type: '(options?: TableCopyOptions) => Promise<TableClipboardResult>'
    description: '复制成功后校验并批量清空可写字段；默认清空值为 null。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#copy-cut-and-paste'
  - name: 'pasteCells'
    type: '(data?: string | TableClipboardData, options?: TableClipboardOptions) => Promise<TableClipboardResult>'
    description: '粘贴 TSV 或二维数据；省略 data 时由浏览器读取剪贴板。单格目标按数据尺寸扩展，多格目标的行列数必须分别是数据矩形尺寸的整倍数。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#copy-cut-and-paste'
  - name: 'cancelClipboard'
    type: '() => void'
    description: '取消未完成的读取、准备、校验或待接受写入；不撤销已完成的系统剪贴板写入。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#copy-cut-and-paste'
  - name: 'setCellRange'
    type: '(range: TableCellRange | null) => Promise<boolean>'
    description: '设置逻辑选区；返回是否被接受，不移动当前视口。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#cell-range-selection'
  - name: 'clearCellRange'
    type: '() => Promise<boolean>'
    description: '清空选区，保留活动单元格。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#cell-range-selection'
  - name: 'getCellRange'
    type: '() => TableCellRange | null'
    description: '读取选区端点的副本。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#cell-range-selection'
  - name: 'getCellRangeBounds'
    type: '() => TableCellRangeBounds | null'
    description: '读取当前可见数据行与视觉列的半开区间，不计组标题和详情行。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#cell-range-selection'
  - name: 'getGroups'
    type: '() => readonly TableGroupNode[]'
    description: '读取当前分组元数据。'
    default: null
    usage: '/zh/components/table/trees-and-groups.html#row-grouping-and-aggregation'
  - name: 'getGroupSummary'
    type: '() => Readonly<Record<string, unknown>>'
    description: '读取整体统计结果。'
    default: null
    usage: '/zh/components/table/trees-and-groups.html#row-grouping-and-aggregation'
  - name: 'toggleGroup'
    type: '(key: string, expanded?: boolean) => Promise<boolean>'
    description: '切换一个组，返回更新是否被接受。'
    default: null
    usage: '/zh/components/table/trees-and-groups.html#row-grouping-and-aggregation'
  - name: 'setGroupExpandedKeys'
    type: '(keys: readonly string[]) => Promise<boolean>'
    description: '设置展开键，返回更新是否被接受。'
    default: null
    usage: '/zh/components/table/trees-and-groups.html#row-grouping-and-aggregation'
  - name: 'closeContextMenu'
    type: '() => void'
    description: '关闭当前菜单；焦点仍在菜单内时恢复到来源单元格。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#context-menus'
  - name: 'setActiveCell'
    type: '(rowIndex: number, columnIndex: number) => Promise<boolean>'
    description: '按索引激活并定位；返回是否成功聚焦。普通数据使用当前页展开行及已解析列索引，生成源使用绝对源索引。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#keyboard-navigation'
  - name: 'clearActiveCell'
    type: '() => Promise<boolean>'
    description: '清空活动格；受控模型拒绝时返回 false。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#keyboard-navigation'
  - name: 'getActiveCell'
    type: '() => TableActiveCell | null'
    description: '读取当前有效活动格的地址副本。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#keyboard-navigation'
  - name: 'moveRow'
    type: '(from: number, to: number, position?: TableRowDropPosition) => Promise<TableRowDragResult>'
    description: '按当前展开页索引移动行；position 默认为 before。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#row-reordering'
  - name: 'cancelRowDrag'
    type: '() => void'
    description: '取消拖动或等待中的重排适配器。'
    default: null
    usage: '/zh/components/table/spreadsheet-interactions.html#row-reordering'
  - name: 'undo'
    type: '() => Promise<TableDataMutationResult>'
    description: '撤销最近一次已接受的操作；活动草稿需先提交或取消。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#undo-and-redo'
  - name: 'redo'
    type: '() => Promise<TableDataMutationResult>'
    description: '重做最近一次撤销；拒绝或取消不会移动历史栈。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#undo-and-redo'
  - name: 'clearHistory'
    type: '() => void'
    description: '清空撤销和重做历史并取消待处理提案，保留当前数据与变更记录。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#undo-and-redo'
  - name: 'getHistoryState'
    type: '() => TableHistoryState'
    description: '读取历史数量与可用状态快照；并不代表当前未忙或没有活动草稿。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#undo-and-redo'
  - name: 'insertRows'
    type: '(rows: TableRow[], position?: Partial<TableDataPosition>) => Promise<TableDataMutationResult>'
    description: '按源数据位置插入行；parentKey 指定父节点。index 指源数据同级位置，不是排序或分页后的序号。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#change-tracking'
  - name: 'removeRows'
    type: '(rowKeys: TableRowKey[]) => Promise<TableDataMutationResult>'
    description: '按稳定行键删除；删除树父节点时包含已加载后代。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#change-tracking'
  - name: 'updateRow'
    type: '(rowKey: TableRowKey, values: Partial<TableRow>) => Promise<TableDataMutationResult>'
    description: '按行键应用字段值，支持点路径；不自动执行编辑校验。不可修改稳定行键或直接覆盖树子节点。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#change-tracking'
  - name: 'revertChanges'
    type: '(rowKeys?: TableRowKey[]) => Promise<TableDataMutationResult>'
    description: '还原指定行及其已加载或已删除的后代；省略行键则还原全部未确认变更。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#change-tracking'
  - name: 'getChangeRecords'
    type: '() => TableChangeRecords'
    description: '读取记录版本及新增、修改、删除行。字段变更为快照，row 为只读引用。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#change-tracking'
  - name: 'acceptChanges'
    type: '(version: number, rowKeys?: TableRowKey[]) => boolean'
    description: '将已保存版本确认为基线，不修改数据；过期版本或待处理请求返回 false。可指定仅确认部分行键。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#change-tracking'
  - name: 'resetChanges'
    type: '() => void'
    description: '取消待处理的数据接受请求并清空记录；当前数据保留为新基线。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#change-tracking'
  - name: 'cancelDataChange'
    type: '() => void'
    description: '中止待处理的数据接受请求；保留此前已接受的变更及当前编辑草稿。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#change-tracking'
  - name: 'validate'
    type: '(options?: TableValidateOptions) => Promise<TableValidationResult>'
    description: '校验提供的数据或指定范围；默认包含已加载的折叠树节点，不请求未加载子节点或远程页。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#data-validation'
  - name: 'validateRow'
    type: '(rowOrIndex: TableRow | number, options?: TableValidateOptions) => Promise<TableValidationResult>'
    description: '校验单行全部规则字段；普通索引为当前页展开行索引，生成源使用全局索引。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#data-validation'
  - name: 'validateCell'
    type: '(rowOrIndex: TableRow | number, columnOrIndex: TableColumn | string | number, options?: TableValidateOptions) => Promise<TableValidationResult>'
    description: '校验一个单元格；普通列可用对象、键、字段或可见列索引，生成源使用全局数字索引。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#data-validation'
  - name: 'clearValidation'
    type: '(rowKey?: TableRowKey, field?: string) => void'
    description: '清除全部或指定行键、字段的错误，并取消正在进行的校验。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#data-validation'
  - name: 'cancelValidation'
    type: '() => void'
    description: '立即取消当前校验，保留之前完成的校验错误与编辑草稿。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#data-validation'
  - name: 'getValidationErrors'
    type: '() => TableValidationError[]'
    description: '获取当前错误的快照；失效行或已修改字段的旧错误不会返回。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#data-validation'
  - name: 'scrollToValidationError'
    type: '(error?: TableValidationError) => Promise<boolean>'
    description: '定位指定错误，默认第一项；自动展开祖先和切换本地页。受控更新拒绝、目标被筛选或列隐藏时返回 false。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#data-validation'
  - name: 'startEdit'
    type: '(rowOrIndex: TableRow | number, columnOrIndex: TableColumn | string | number) => Promise<boolean>'
    description: '开始编辑并定位；普通数据使用当前可见行/列索引或行对象、列字段/键，生成源使用全局数字索引。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#editing-virtual-data'
  - name: 'commitEdit'
    type: '() => Promise<boolean>'
    description: '提交当前草稿并发出 editCommit；无会话时返回 true，条件、数据冲突或校验失败导致拒绝时返回 false。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#cell-and-row-editing'
  - name: 'cancelEdit'
    type: '() => void'
    description: '放弃当前草稿。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#cell-and-row-editing'
  - name: 'getEditRecord'
    type: '() => TableEditRecord | null'
    description: '读取当前会话与草稿变更快照。'
    default: null
    usage: '/zh/components/table/editing-validation-and-changes.html#cell-and-row-editing'
  - name: 'toggleRowDetail'
    type: '(rowOrIndex: TableRow | number, expanded?: boolean) => Promise<void>'
    description: '展开或收起详情；普通数据索引为当前可见行索引，生成数据源索引为全局索引。'
    default: null
    usage: '/zh/components/table/row-expansion.html#details-with-virtual-scrolling'
  - name: 'setDetailExpandedKeys'
    type: '(keys: TableRowKey[]) => void'
    description: '设置详情展开键；受控时仅发出模型更新。'
    default: null
    usage: '/zh/components/table/row-expansion.html#detail-rows'
  - name: 'reloadRowDetail'
    type: '(rowOrIndex: TableRow | number) => Promise<void>'
    description: '重新加载已展开的详情，行和索引规则同 toggleRowDetail。'
    default: null
    usage: '/zh/components/table/row-expansion.html#async-details'
  - name: setSort
    type: '(sorts: TableSort[]) => void'
    description: '设置排序；受控模式下发出更新，需同步模型。'
    default: null
    usage: '/zh/components/table/sorting-and-filtering.html#sorting-and-multiple-fields'
  - name: clearSort
    type: '() => void'
    description: '清除全部排序。'
    default: null
    usage: '/zh/components/table/sorting-and-filtering.html#sorting-and-multiple-fields'
  - name: setFilters
    type: '(filters: TableFilters) => void'
    description: '替换筛选状态；受控模式下需同步模型。'
    default: null
    usage: '/zh/components/table/sorting-and-filtering.html#filters-and-custom-filters'
  - name: clearFilters
    type: '() => void'
    description: '清除全部筛选。'
    default: null
    usage: '/zh/components/table/sorting-and-filtering.html#filters-and-custom-filters'
  - name: getSelectedRows
    type: '() => TableRow[]'
    description: '读取选中行，单选模式也返回数组。'
    default: null
    usage: '/zh/components/table/row-selection.html#multiple-selection'
  - name: setSelectedRows
    type: '(rows: TableRow[]) => void'
    description: '设置选中行；单选取首个可选行。'
    default: null
    usage: '/zh/components/table/row-selection.html#multiple-selection'
  - name: clearSelection
    type: '() => void'
    description: '清空选择。'
    default: null
    usage: '/zh/components/table/row-selection.html#multiple-selection'
  - name: toggleRowSelection
    type: '(row: TableRow, selected?: boolean) => void'
    description: '切换行选择，也可显式指定选中状态。'
    default: null
    usage: '/zh/components/table/row-selection.html#multiple-selection'
  - name: selectAll
    type: '(selected?: boolean) => void'
    description: '选择或取消当前页筛选后已展开的可选行；virtualSource 下不执行全选，避免遍历海量数据。'
    default: null
    usage: '/zh/components/table/row-selection.html#multiple-selection'
  - name: toggleRowExpand
    type: '(row: TableRow, expanded?: boolean) => Promise<void>'
    description: '展开或收起当前展开树数据中的行对象，包含其他本地页；省略 expanded 时切换状态。需要懒加载时等待加载完成，加载失败会拒绝 Promise。'
  - name: setExpandedKeys
    type: '(keys: TableRowKey[]) => void'
    description: '替换树节点展开键集合并发出 update:expandedKeys；不会加载缺失的子节点，懒加载请调用 toggleRowExpand。'
  - name: scrollToRow
    type: "(rowOrIndex: TableRow | TableRowKey, align?: 'auto' | 'start' | 'center' | 'end') => void"
    description: '在当前页展开列表内定位。普通数据接受原始行对象或行键；数字优先匹配行键，未匹配时才按从 0 开始的页内索引定位。virtualSource 仅接受当前页内的绝对数字源索引。不自动展开祖先或切换页，align 默认为 auto。'
  - name: scrollToColumn
    type: "(columnOrIndex: TableColumn | string | number, align?: 'auto' | 'start' | 'center' | 'end') => void"
    description: '定位可见的中间列。普通数据接受解析后的列索引、key、field 或列对象；virtualSource 仅接受绝对数字列索引。隐藏列、固定列和不存在的列不滚动，align 默认为 auto。'
  - name: measure
    type: '() => Promise<void>'
    description: '外部样式或自定义内容改变尺寸但表格未自动适配时，重新同步虚拟行、合并单元格、表尾及横向视口布局。'
  - name: 'commitProxy'
    type: '(action: TableProxyAction, rows?: TableRow[]) => Promise<TableProxyResult>'
    description: '按当前条件执行 query、refresh、save 或 delete。rows 仅用于 delete：省略时读取当前选中行，传 [] 则不删除；save 使用已跟踪的变更记录。'
    default: null
    usage: '/zh/components/table/query-forms-and-request-proxy.html#request-proxy'
  - name: 'cancelProxy'
    type: '() => void'
    description: '中止当前请求并忽略迟到的结果，不保证撤回已到达服务端的写入。'
    default: null
    usage: '/zh/components/table/query-forms-and-request-proxy.html#request-proxy'
  - name: 'getProxyState'
    type: '() => TableProxyState'
    description: '读取当前请求状态。'
    default: null
    usage: '/zh/components/table/query-forms-and-request-proxy.html#request-proxy'
  - name: 'query'
    type: '() => Promise<boolean>'
    description: '校验表单，通过后回到第一页并发出 query。'
    default: null
    usage: '/zh/components/table/query-forms-and-request-proxy.html#query-and-toolbar'
  - name: 'resetQuery'
    type: '() => Promise<boolean>'
    description: '还原表单初始字段值并回到第一页，再发出 query。'
    default: null
    usage: '/zh/components/table/query-forms-and-request-proxy.html#query-and-toolbar'
  - name: 'refresh'
    type: '() => Promise<boolean>'
    description: '保持当前页与条件，不校验表单，发出 query。'
    default: null
    usage: '/zh/components/table/query-forms-and-request-proxy.html#query-and-toolbar'
  - name: 'getQueryContext'
    type: '() => TableQueryContext<TableRow,QueryForm>'
    description: '读取条件快照；reason 默认为 submit。'
    default: null
    usage: '/zh/components/table/query-forms-and-request-proxy.html#query-and-toolbar'
  - name: 'getForm'
    type: '() => FormInstance | undefined'
    description: '获取查询表单；挂载前或未启用时不可用。'
    default: null
    usage: '/zh/components/table/query-forms-and-request-proxy.html#query-and-toolbar'
---

# Table 表格
