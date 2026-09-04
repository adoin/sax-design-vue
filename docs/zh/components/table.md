---
description: '支持排序、筛选、分页、树形数据与虚拟滚动的数据表格。'
PROPS:
  - name: "find-config"
    type: "Boolean | TableFindConfig"
    description: "开启查找面板、搜索范围、转换和处理上限。"
    default: false
    usage: "#查找与替换"
  - name: "clipboard-config"
    type: "Boolean | TableClipboardConfig"
    description: "显式开启剪贴板操作，配置文本转换、写入限制和区域上限。"
    default: false
    usage: "#复制-剪切与粘贴"
  - name: "range-config"
    type: "Boolean | TableRangeConfig"
    description: "开启矩形区域选择，可分别控制鼠标、键盘和边缘自动滚动。"
    default: "false"
    usage: "#单元格区域选择"
  - name: "cell-range"
    type: "TableCellRange | null"
    description: "通过 v-model:cell-range 控制选区起点和终点；省略时由组件管理。"
    default: null
    usage: "#单元格区域选择"
  - name: "group-config"
    type: "Boolean | TableGroupConfig"
    description: "配置本地/远程行分组、聚合和汇总范围。"
    default: false
    usage: "#行分组与聚合"
  - name: "group-expanded-keys"
    type: "string[]"
    description: "通过 v-model:group-expanded-keys 控制展开组；省略时内部管理。"
    default: null
    usage: "#行分组与聚合"
  - name: "merge-config"
    type: "Boolean | TableMergeConfig"
    description: "通过位置范围或同步窗口规则合并正文与表尾单元格。"
    default: false
    usage: "#合并单元格"
  - name: "context-menu-config"
    type: "Boolean | TableContextMenuConfig"
    description: "配置表头、数据区和表尾的菜单项、动态工厂与可见条件。"
    default: false
    usage: "#右键菜单"
  - name: "keyboard-config"
    type: "Boolean | TableKeyboardConfig"
    description: "开启单元格导航，配置 Enter 编辑与生成源行键定位。"
    default: false
    usage: "#键盘导航"
  - name: "active-cell"
    type: "TableActiveCell | null"
    description: "使用 v-model:active-cell 控制活动单元格；省略时由组件管理。"
    default: null
    usage: "#键盘导航"
  - name: "row-drag-config"
    type: "Boolean | TableRowDragConfig"
    description: "开启行拖拽，配置禁用条件、放置条件、自动滚动和受控适配器。"
    default: false
    usage: "#行拖拽排序"
  - name: "history-config"
    type: "Boolean | TableHistoryConfig"
    description: "开启操作历史，需同时开启 change-config；limit 默认保留最近 100 次操作。"
    default: false
    usage: "#撤销与重做"
  - name: "change-config"
    type: "Boolean | TableChangeConfig"
    description: "开启受控数据变更与追踪；普通数组使用 v-model:data，生成源提供 apply 和 indexOf。"
    default: false
    usage: "#变更追踪"
  - name: "validation-rules"
    type: "TableValidationRules"
    description: "按字段设置校验规则；列 rules 优先，空数组可关闭该列规则。"
    default: "{}"
    usage: "#数据校验"
  - name: "validation-config"
    type: "Boolean | TableValidationConfig"
    description: "开启编辑提交前校验，并配置自动定位及错误数上限。关闭时仍可手动校验。"
    default: "false"
    usage: "#数据校验"
  - name: "edit-config"
    type: "Boolean | TableEditConfig"
    description: "开启编辑，配置单元格或整行模式、触发方式、条件及离开策略。"
    default: "false"
    usage: "#单元格与整行编辑"
  - name: "detail-config"
    type: "Boolean | TableDetailConfig"
    description: "详情展开配置；expand 列自动开启，false 关闭。生成数据源需显式开启。"
    default: null
    usage: "#详情展开行"
  - name: "detail-expanded-keys"
    type: "TableRowKey[]"
    description: "通过 v-model:detail-expanded-keys 控制展开键，独立于树节点展开。"
    default: null
    usage: "#详情展开行"
  - name: footer-data
    type: TableRow[]
    description: 与列字段对应的表尾记录数组，不参与正文排序、筛选或分页。
    default: '[]'
    usage: '#表尾数据行'
  - name: footer-row-key
    type: TableRowKeyGetter
    description: 表尾稳定行键的字段路径或函数；未设置时使用表尾索引。
    default: null
    usage: '#表尾数据行'
  - name: show-footer-overflow
    type: TableOverflow
    description: 表尾溢出处理，与正文和表头独立；列配置优先。
    default: 'false'
    usage: '#表尾数据行'
  - name: column-manager-config
    type: Boolean | TableColumnManagerConfig
    description: 开启列设置面板，可通过 storageKey 显式启用本地持久化。
    default: false
    usage: '#列设置'
  - name: column-state
    type: TableColumnState[]
    description: "通过 v-model:column-state 控制列显隐、顺序及固定位置。"
    default: null
    usage: '#列设置'
  - name: resize-config
    type: Boolean | TableResizeConfig
    description: "显式开启列宽调整，支持全局最小宽度和键盘步长。"
    default: false
    usage: '#拖动调整列宽'
  - name: column-widths
    type: TableColumnWidths
    description: "v-model:column-widths 受控列宽；普通列以 key、field 或 @索引标识，virtualSource 使用列索引字符串。"
    default: null
    usage: '#拖动调整列宽'
  - name: data
    type: TableRow[]
    description: 表格渲染的行数据。
    default: '[]'
    usage: '#grid-式配置'
  - name: columns
    type: TableColumn[]
    description: 列配置，支持字段、尺寸、对齐、插槽、渲染器和树节点。
    default: '[]'
    usage: '#grid-式配置'
  - name: row-key
    type: String | Function
    description: 稳定的行键字段或取值函数。
    default: id
    usage: '#grid-式配置'
  - name: highlight
    type: TableRow | TableRow[] | null
    description: 当前高亮的行或行数组。
    default: null
    usage: '#行选择'
  - name: multiple
    type: Boolean
    values: 'true | false'
    description: 开启多行选择。
    default: 'false'
    usage: '#行选择'
  - name: striped
    type: Boolean
    values: 'true | false'
    description: 交替显示行背景。
    default: 'false'
    usage: '#grid-式配置'
  - name: row-class
    type: String | Function
    description: 为每一行添加类名。
    default: null
    usage: '#grid-式配置'
  - name: tree-config
    type: TableTreeConfig
    description: 开启层级行、受控展开和子节点懒加载。
    default: null
    usage: '#树形表格与懒加载'
  - name: virtual-config
    type: Boolean | TableVirtualConfig
    description: 开启 Y 轴虚拟行以及可选的 X 轴虚拟列。
    default: 'false'
    usage: '#虚拟滚动与动态行高'
  - name: virtual-source
    type: TableVirtualSource
    description: 通过索引回调按需提供行与列，适合大规模数据。
    default: null
    usage: '#虚拟滚动与动态行高'
  - name: expanded-keys
    type: Array<String | Number>
    description: 供 v-model:expanded-keys 使用的受控展开键。
    default: null
    usage: '#树形表格与懒加载'
  - name: renderers
    type: Record<string, TableRenderer>
    description: 供列配置引用的具名单元格和表头渲染器。
    default: '{}'
    usage: '#插槽与渲染器'
  - name: show-header
    type: Boolean
    values: 'true | false'
    description: 是否显示配置生成的表头。
    default: true
    usage: '#grid-式配置'
  - name: empty-text
    type: String
    description: 没有行或列时显示的文字。
    default: null
    usage: '#grid-式配置'
  - name: loading
    type: Boolean
    values: 'true | false'
    description: 在表格上显示加载遮罩。
    default: 'false'
    usage: '#grid-式配置'
  - name: sort-by
    type: 'TableSort[]'
    description: '受控排序状态；未传时使用内部状态。'
    default: null
    usage: '#排序与多字段排序'
  - name: sort-config
    type: 'TableSortConfig'
    description: '多字段、远程排序和初始排序配置。'
    default: '{}'
    usage: '#排序与多字段排序'
  - name: filters
    type: 'TableFilters'
    description: '受控筛选值，以字段名或无字段列的 key 为键。'
    default: null
    usage: '#筛选与自定义筛选'
  - name: filter-config
    type: 'TableFilterConfig'
    description: '远程筛选和初始筛选配置。'
    default: '{}'
    usage: '#远程排序与筛选'
  - name: pager-config
    type: Boolean | TablePagerConfig
    description: '内置分页配置，默认关闭。提供 currentPage/pageSize 时使用 v-model:pager-config 同步；remote 模式需传 total。'
    default: 'false'
    usage: '#选择列与跨页保留'
  - name: selection-config
    type: 'TableSelectionConfig'
    description: '行选择触发方式、禁选、全选和跨页保留配置。'
    default: '{}'
    usage: '#选择列与跨页保留'
  - name: show-overflow
    type: 'TableOverflow'
    description: '单元格溢出处理，true 等价于 tooltip。'
    default: 'false'
    usage: '#文本溢出与提示'
  - name: show-header-overflow
    type: 'TableOverflow'
    description: '表头溢出处理，列配置优先。'
    default: 'false'
    usage: '#文本溢出与提示'
CHILD_PROPS:
  - name: "drag-sort"
    type: "Boolean"
    description: "在此列显示行拖动手柄，需开启 row-drag-config。"
    default: false
    usage: "#行拖拽排序"
  - name: "rules"
    type: "TableValidationRule | TableValidationRule[]"
    description: "当前列的同步或异步规则，优先于 validation-rules。"
    default: null
    usage: "#数据校验"
  - name: "editor"
    type: "Boolean | TableEditorConfig"
    description: "允许编辑此字段；支持 input、number、select、date、switch，以及控件 props、选项和条件。"
    default: null
    usage: "#单元格与整行编辑"
  - name: "edit"
    type: "TableEditRenderer"
    description: "编辑态渲染函数，与展示态 cell 分开。"
    default: null
    usage: "#自定义编辑器"
  - name: footer
    type: TableFooterRenderer
    description: 表尾单元格渲染函数。
    default: null
    usage: '#表尾数据行'
  - name: footer-formatter
    type: TableFooterFormatter
    description: 表尾文本格式化函数；无插槽或渲染器时使用。
    default: null
    usage: '#表尾数据行'
  - name: footer-align
    type: TableAlign
    description: 表尾对齐方式，默认使用该列 align。
    default: null
    usage: '#表尾数据行'
  - name: show-footer-overflow
    type: TableOverflow
    description: 当前列的表尾溢出处理，优先于表格配置。
    default: null
    usage: '#表尾数据行'
  - name: children
    type: TableColumn[]
    description: 嵌套子列并生成分组标题；数据单元格只由叶子列渲染。
    default: null
    usage: '#多级表头'
  - name: resizable
    type: Boolean
    description: "设为 false 禁止调整此列；需先开启 resize-config。"
    default: null
    usage: '#拖动调整列宽'
  - name: type
    type: String
    values: seq | checkbox | radio | expand
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
    type: String
    values: left | center | right
    description: 表头和单元格的对齐方式。
    default: left
  - name: fixed
    type: Boolean | String
    values: 'true | false | left | right'
    description: 将列固定在左侧或右侧；true 等价于 left。未设置时继承父组，false 解除继承的固定位置。
    default: null
    usage: '#虚拟滚动与动态行高'
  - name: tree-node
    type: Boolean
    values: 'true | false'
    description: 在当前列放置树形缩进和展开按钮。
    default: 'false'
  - name: renderer
    type: String | Function | TableRenderer
    description: 内联渲染器或 table renderers 中的键名。
    default: null
  - name: slots
    type: TableColumnSlots
    description: Grid 式配置中单元格、表头与筛选插槽的名称映射。
    default: null
  - name: sortable
    type: 'Boolean'
    description: '启用该列的排序按钮。'
    default: 'false'
    usage: '#排序与多字段排序'
  - name: sort-method
    type: 'TableSortMethod'
    values: 'number | string | Function'
    description: '逐列指定数字、字符串或自定义排序。函数支持布尔值、0/1 和标准数值比较结果；true/正数表示升序时 a 排在 b 后面。'
    default: null
    usage: '#列级排序规则'
  - name: filters
    type: 'TableFilterOption[]'
    description: '筛选选项；可用 disabled 禁用某个选项。'
    default: null
    usage: '#筛选与自定义筛选'
  - name: filter-multiple
    type: 'Boolean'
    description: '筛选选项是否允许多选。'
    default: true
    usage: '#筛选与自定义筛选'
  - name: filter-method
    type: '(params: TableFilterParams) => boolean'
    description: '自定义行匹配函数；同列选项逻辑由此函数决定。'
    default: null
    usage: '#筛选与自定义筛选'
  - name: show-overflow
    type: 'TableOverflow'
    description: '覆盖该列的单元格溢出处理；未设置时继承表格。'
    default: null
    usage: '#文本溢出与提示'
  - name: show-header-overflow
    type: 'TableOverflow'
    description: '覆盖该列的表头溢出处理；未设置时继承表格。'
    default: null
    usage: '#文本溢出与提示'
EVENTS:
  - name: "findChange"
    type: "(state: TableFindState) => void"
    description: "搜索进度、匹配、活动索引或清理发生变化。"
    default: null
    usage: "#查找与替换"
  - name: "replace"
    type: "(result: TableReplaceResult) => void"
    description: "替换完成，包含变更数量、校验错误或失败原因。"
    default: null
    usage: "#查找与替换"
  - name: "clipboard"
    type: "(result: TableClipboardResult) => void"
    description: "操作结束时提供成功状态、剪贴板写入状态、实际变更数及失败原因。"
    default: null
    usage: "#复制-剪切与粘贴"
  - name: "update:cellRange"
    type: "(range: TableCellRange | null) => void"
    description: "请求更新受控选区。"
    default: null
    usage: "#单元格区域选择"
  - name: "cellRangeChange"
    type: "(change: TableCellRangeChange) => void"
    description: "已接受的选区或逻辑边界变化后触发，包含范围、边界和原因。"
    default: null
    usage: "#单元格区域选择"
  - name: "cellRangeError"
    type: "(error: unknown) => void"
    description: "选区合并区域解析失败时触发。"
    default: null
    usage: "#单元格区域选择"
  - name: "update:groupExpandedKeys"
    type: "(keys: string[]) => void"
    description: "请求更新展开键。"
    default: null
    usage: "#行分组与聚合"
  - name: "groupExpand"
    type: "(params: { group: TableGroupNode; expanded: boolean }) => void"
    description: "展开变更被接受后触发。"
    default: null
    usage: "#行分组与聚合"
  - name: "groupError"
    type: "(error: unknown) => void"
    description: "分组配置或聚合计算失败。"
    default: null
    usage: "#行分组与聚合"
  - name: "contextMenuOpen"
    type: "(context: TableContextMenuContext) => void"
    description: "菜单打开，提供所在区域及对应行列上下文。"
    default: null
    usage: "#右键菜单"
  - name: "contextMenuSelect"
    type: "(params: TableContextMenuSelectParams) => void"
    description: "选择可用菜单项；由应用执行对应业务操作。"
    default: null
    usage: "#右键菜单"
  - name: "contextMenuClose"
    type: "(context: TableContextMenuContext) => void"
    description: "菜单关闭，提供原上下文。"
    default: null
    usage: "#右键菜单"
  - name: "update:activeCell"
    type: "(cell: TableActiveCell | null) => void"
    description: "请求更新活动单元格，与行选择独立。"
    default: null
    usage: "#键盘导航"
  - name: "activeCellChange"
    type: "(cell: TableActiveCell | null) => void"
    description: "活动单元格被接受后变化时触发。"
    default: null
    usage: "#键盘导航"
  - name: "rowDragStart"
    type: "(context: TableRowDragContext) => void"
    description: "鼠标或键盘拾取行。"
    default: null
    usage: "#行拖拽排序"
  - name: "rowDragEnd"
    type: "(result: TableRowDragResult) => void"
    description: "拖动或 moveRow 操作结束；检查 applied 和 reason。"
    default: null
    usage: "#行拖拽排序"
  - name: "historyChange"
    type: "(state: TableHistoryState) => void"
    description: "历史栈变化时触发；包含撤销和重做数量以及可用状态。"
    default: null
    usage: "#撤销与重做"
  - name: "update:data"
    type: "(data: TableRow[]) => void"
    description: "普通数组变更提案；父组件接受后才计入记录。"
    default: null
    usage: "#变更追踪"
  - name: "dataChange"
    type: "(operations: TableDataMutation[]) => void"
    description: "数据所有者接受变更且记录提交后触发，包含还原操作。"
    default: null
    usage: "#变更追踪"
  - name: "changesChange"
    type: "(version: number) => void"
    description: "变更记录版本变化时触发；可用 getChangeRecords 获取快照。"
    default: null
    usage: "#变更追踪"
  - name: "validation"
    type: "TableValidationResult"
    description: "最新校验结束时触发；取消或过期的校验不触发此事件。"
    default: null
    usage: "#数据校验"
  - name: "editStart"
    type: "(params: TableEditRecord) => void"
    description: "开始编辑时触发。"
    default: null
    usage: "#单元格与整行编辑"
  - name: "editChange"
    type: "(params: TableEditRecord) => void"
    description: "草稿变更时触发；不会修改传入的数据。"
    default: null
    usage: "#单元格与整行编辑"
  - name: "editCommit"
    type: "(params: TableEditEndParams) => void"
    description: "提交草稿时提供变更字段与 updatedRow；业务接收并保存结果。"
    default: null
    usage: "#单元格与整行编辑"
  - name: "editCancel"
    type: "(params: TableEditEndParams) => void"
    description: "取消草稿时触发，包含 reason。"
    default: null
    usage: "#单元格与整行编辑"
  - name: "update:detailExpandedKeys"
    type: "(keys: TableRowKey[]) => void"
    description: "请求更新完整的详情展开键数组。"
    default: null
    usage: "#详情展开行"
  - name: "detailExpand"
    type: "(params: TableDetailExpandParams) => void"
    description: "用户或 toggleRowDetail 请求展开或收起时触发；受控模式需更新模型才会生效。"
    default: null
    usage: "#详情展开行"
  - name: "detailLoad"
    type: "(params: TableDetailParams & { data: unknown }) => void"
    description: "当前有效的异步详情加载成功时触发。"
    default: null
    usage: "#异步详情"
  - name: "detailLoadError"
    type: "(params: TableDetailParams & { error: unknown }) => void"
    description: "当前详情加载失败时触发，不包含取消或过期请求。"
    default: null
    usage: "#异步详情"
  - name: footerCellClick
    type: '(params: TableFooterCellRenderParams, event: MouseEvent) => void'
    description: 点击表尾单元格时触发，包含表尾行、叶子列、原始值与索引；不会触发行选择。
    default: null
    usage: '#表尾数据行'
  - name: update:columnState
    type: '(state: TableColumnState[]) => void'
    description: 请求更新受控列设置。
    default: null
    usage: '#列设置'
  - name: columnStateChange
    type: '(state: TableColumnState[]) => void'
    description: 用户更改或重置列设置时触发，携带完整设置数组。
    default: null
    usage: '#列设置'
  - name: columnStorageError
    type: "(event: { operation: 'read' | 'write'; error: unknown }) => void"
    description: 读取或写入本地列设置失败时触发，表格仍可正常操作。
    default: null
    usage: '#记住列设置'
  - name: update:columnWidths
    type: '(widths: TableColumnWidths) => void'
    description: "提交列宽后返回新的完整宽度记录。"
    default: null
    usage: '#拖动调整列宽'
  - name: column-resize
    type: '(params: TableColumnResizeParams) => void'
    description: "拖动结束或键盘调整后触发，含列、索引、新旧宽度及输入来源。"
    default: null
    usage: '#拖动调整列宽'
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
    usage: '#排序与多字段排序'
  - name: sortChange
    type: 'TableSort[]'
    description: '排序状态变化；远程模式下可据此发起请求。'
    default: null
    usage: '#远程排序与筛选'
  - name: update:filters
    type: 'TableFilters'
    description: '供 v-model:filters 使用的筛选更新。'
    default: null
    usage: '#筛选与自定义筛选'
  - name: filterChange
    type: 'TableFilters'
    description: '确认或重置筛选后触发。'
    default: null
    usage: '#筛选与自定义筛选'
  - name: update:pagerConfig
    type: TablePagerConfig
    description: '同步页码和每页条数，保留配置中的其他字段。'
    default: null
    usage: '#选择列与跨页保留'
  - name: pageChange
    type: TablePageChangeParams
    description: '翻页、修改条数、查询重置或越界修正时触发，包含 currentPage、pageSize、total 和 type。'
    default: null
    usage: '#选择列与跨页保留'
  - name: selectionChange
    type: 'TableRow[]'
    description: '选择变化，单选和多选均返回行数组。'
    default: null
    usage: '#选择列与跨页保留'
SLOTS:
  - name: "group-header"
    type: "{ group: TableGroupNode; expanded: boolean }"
    description: "组标题内容，保留内置展开按钮。"
    default: null
    usage: "#行分组与聚合"
  - name: "group-summary"
    type: "TableFooterCellRenderParams & { group?: TableGroupNode; kind: string }"
    description: "小计或整体汇总单元格。"
    default: null
    usage: "#行分组与聚合"
  - name: "edit-[column key]"
    type: "TableEditSlotParams"
    description: "指定列的编辑插槽，columns.slots.edit 可更改名称。"
    default: null
    usage: "#自定义编辑器"
  - name: "edit-cell"
    type: "TableEditSlotParams"
    description: "通用编辑插槽；接收 value、draftRow、setValue、commit 和 cancel。"
    default: null
    usage: "#自定义编辑器"
  - name: "STableColumn.edit"
    type: "TableEditSlotParams"
    description: "声明式列的编辑插槽。"
    default: null
    usage: "#自定义编辑器"
  - name: "detail"
    type: "TableDetailSlotParams"
    description: "详情内容；接收行、键、索引、加载结果以及 reload 和 close。"
    default: null
    usage: "#详情展开行"
  - name: "detail-loading"
    type: "TableDetailSlotParams"
    description: "详情加载中的内容。"
    default: null
    usage: "#异步详情"
  - name: "detail-error"
    type: "TableDetailSlotParams"
    description: "详情加载失败的内容；可调用 reload 重试。"
    default: null
    usage: "#异步详情"
  - name: footer-[column key]
    type: TableFooterCellRenderParams
    description: 指定叶子列的表尾插槽；也可通过 columns.slots.footer 指定名称。
    default: null
    usage: '#表尾数据行'
  - name: footer-cell
    type: TableFooterCellRenderParams
    description: 所有表尾单元格的后备插槽。
    default: null
    usage: '#表尾数据行'
  - name: STableColumn.footer
    type: TableFooterCellRenderParams
    description: 声明式列的表尾渲染插槽。
    default: null
    usage: '#表尾数据行'
  - name: STableColumn.columns
    type: Slot
    description: STableColumn 的嵌套子列定义插槽。
    usage: '#声明式分组表头'
  - name: default
    type: Slot
    description: 声明式 s-table-column 列定义。
  - name: cell-[column key]
    type: Scoped slot
    description: 指定列的单元格插槽，可获取 row、column、value 和 rowIndex。
  - name: cell
    type: Scoped slot
    description: 所有列共用的后备单元格插槽。
  - name: header-[column key]
    type: Scoped slot
    description: 指定列的表头插槽。
  - name: header-cell
    type: Scoped slot
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
    usage: '#筛选与自定义筛选'
EXPOSES:
  - name: "findCells"
    type: "(query: string | TableFindQuery, options?: TableFindOptions) => Promise<TableFindResult>"
    description: "查找指定范围，返回匹配快照及扫描完整性。"
    default: null
    usage: "#查找与替换"
  - name: "findNext"
    type: "(options?: TableFindNavigateOptions) => Promise<boolean>"
    description: "定位下一个匹配，末尾循环；返回定位是否成功。"
    default: null
    usage: "#查找与替换"
  - name: "findPrevious"
    type: "(options?: TableFindNavigateOptions) => Promise<boolean>"
    description: "定位上一个匹配；focus: false 保留当前输入焦点。"
    default: null
    usage: "#查找与替换"
  - name: "replaceMatch"
    type: "(replacement: string, options?: TableReplaceOptions) => Promise<TableReplaceResult>"
    description: "替换活动匹配格或指定索引匹配格中的全部字面命中。"
    default: null
    usage: "#查找与替换"
  - name: "replaceAll"
    type: "(replacement: string, options?: TableReplaceOptions) => Promise<TableReplaceResult>"
    description: "校验并以一次事务替换所有可写匹配；要求搜索完整。"
    default: null
    usage: "#查找与替换"
  - name: "getFindState"
    type: "() => TableFindState"
    description: "读取查询、范围、匹配摘要、活动索引、进度和上限状态。"
    default: null
    usage: "#查找与替换"
  - name: "clearFind"
    type: "() => void"
    description: "取消等待并清空匹配，保留查询内容。"
    default: null
    usage: "#查找与替换"
  - name: "cancelFind"
    type: "() => void"
    description: "取消等待中的搜索、定位或替换操作。"
    default: null
    usage: "#查找与替换"
  - name: "openFind"
    type: "() => Promise<boolean>"
    description: "打开并聚焦内置面板；未启用或 panel: false 时返回 false。"
    default: null
    usage: "#查找与替换"
  - name: "closeFind"
    type: "() => void"
    description: "关闭面板并取消等待；焦点在面板中时恢复到触发按钮。"
    default: null
    usage: "#查找与替换"
  - name: "copyCells"
    type: "(options?: TableCopyOptions) => Promise<TableClipboardResult>"
    description: "复制当前区域或 bounds；writeClipboard: false 仅返回独立二维数据与 TSV。"
    default: null
    usage: "#复制-剪切与粘贴"
  - name: "cutCells"
    type: "(options?: TableCopyOptions) => Promise<TableClipboardResult>"
    description: "复制成功后校验并批量清空可写字段；默认清空值为 null。"
    default: null
    usage: "#复制-剪切与粘贴"
  - name: "pasteCells"
    type: "(data?: string | TableClipboardData, options?: TableClipboardOptions) => Promise<TableClipboardResult>"
    description: "粘贴 TSV 或二维数据；省略 data 时由浏览器读取剪贴板。"
    default: null
    usage: "#复制-剪切与粘贴"
  - name: "cancelClipboard"
    type: "() => void"
    description: "取消未完成的读取、准备、校验或待接受写入；不撤销已完成的系统剪贴板写入。"
    default: null
    usage: "#复制-剪切与粘贴"
  - name: "setCellRange"
    type: "(range: TableCellRange | null) => Promise<boolean>"
    description: "设置逻辑选区；返回是否被接受，不移动当前视口。"
    default: null
    usage: "#单元格区域选择"
  - name: "clearCellRange"
    type: "() => Promise<boolean>"
    description: "清空选区，保留活动单元格。"
    default: null
    usage: "#单元格区域选择"
  - name: "getCellRange"
    type: "() => TableCellRange | null"
    description: "读取选区端点的副本。"
    default: null
    usage: "#单元格区域选择"
  - name: "getCellRangeBounds"
    type: "() => TableCellRangeBounds | null"
    description: "读取当前可见数据行与视觉列的半开区间，不计组标题和详情行。"
    default: null
    usage: "#单元格区域选择"
  - name: "getGroups"
    type: "() => readonly TableGroupNode[]"
    description: "读取当前分组元数据。"
    default: null
    usage: "#行分组与聚合"
  - name: "getGroupSummary"
    type: "() => Readonly<Record<string, unknown>>"
    description: "读取整体统计结果。"
    default: null
    usage: "#行分组与聚合"
  - name: "toggleGroup"
    type: "(key: string, expanded?: boolean) => Promise<boolean>"
    description: "切换一个组，返回更新是否被接受。"
    default: null
    usage: "#行分组与聚合"
  - name: "setGroupExpandedKeys"
    type: "(keys: readonly string[]) => Promise<boolean>"
    description: "设置展开键，返回更新是否被接受。"
    default: null
    usage: "#行分组与聚合"
  - name: "closeContextMenu"
    type: "() => void"
    description: "关闭当前菜单；焦点仍在菜单内时恢复到来源单元格。"
    default: null
    usage: "#右键菜单"
  - name: "setActiveCell"
    type: "(rowIndex: number, columnIndex: number) => Promise<boolean>"
    description: "按索引激活并定位；返回是否成功聚焦。普通数据使用当前页展开行及已解析列索引，生成源使用绝对源索引。"
    default: null
    usage: "#键盘导航"
  - name: "clearActiveCell"
    type: "() => Promise<boolean>"
    description: "清空活动格；受控模型拒绝时返回 false。"
    default: null
    usage: "#键盘导航"
  - name: "getActiveCell"
    type: "() => TableActiveCell | null"
    description: "读取当前有效活动格的地址副本。"
    default: null
    usage: "#键盘导航"
  - name: "moveRow"
    type: "(from: number, to: number, position?: TableRowDropPosition) => Promise<TableRowDragResult>"
    description: "按当前展开页索引移动行；position 默认为 before。"
    default: null
    usage: "#行拖拽排序"
  - name: "cancelRowDrag"
    type: "() => void"
    description: "取消拖动或等待中的重排适配器。"
    default: null
    usage: "#行拖拽排序"
  - name: "undo"
    type: "() => Promise<TableDataMutationResult>"
    description: "撤销最近一次已接受的操作；活动草稿需先提交或取消。"
    default: null
    usage: "#撤销与重做"
  - name: "redo"
    type: "() => Promise<TableDataMutationResult>"
    description: "重做最近一次撤销；拒绝或取消不会移动历史栈。"
    default: null
    usage: "#撤销与重做"
  - name: "clearHistory"
    type: "() => void"
    description: "清空撤销和重做历史并取消待处理提案，保留当前数据与变更记录。"
    default: null
    usage: "#撤销与重做"
  - name: "getHistoryState"
    type: "() => TableHistoryState"
    description: "读取历史数量与可用状态快照；并不代表当前未忙或没有活动草稿。"
    default: null
    usage: "#撤销与重做"
  - name: "insertRows"
    type: "(rows: TableRow[], position?: Partial<TableDataPosition>) => Promise<TableDataMutationResult>"
    description: "按源数据位置插入行；parentKey 指定父节点。index 指源数据同级位置，不是排序或分页后的序号。"
    default: null
    usage: "#变更追踪"
  - name: "removeRows"
    type: "(rowKeys: TableRowKey[]) => Promise<TableDataMutationResult>"
    description: "按稳定行键删除；删除树父节点时包含已加载后代。"
    default: null
    usage: "#变更追踪"
  - name: "updateRow"
    type: "(rowKey: TableRowKey, values: Record<string, unknown>) => Promise<TableDataMutationResult>"
    description: "按行键应用字段值，支持点路径；不自动执行编辑校验。不可修改稳定行键或直接覆盖树子节点。"
    default: null
    usage: "#变更追踪"
  - name: "revertChanges"
    type: "(rowKeys?: TableRowKey[]) => Promise<TableDataMutationResult>"
    description: "还原指定行及其已加载或已删除的后代；省略行键则还原全部未确认变更。"
    default: null
    usage: "#变更追踪"
  - name: "getChangeRecords"
    type: "() => TableChangeRecords"
    description: "读取记录版本及新增、修改、删除行。字段变更为快照，row 为只读引用。"
    default: null
    usage: "#变更追踪"
  - name: "acceptChanges"
    type: "(version: number, rowKeys?: TableRowKey[]) => boolean"
    description: "将已保存版本确认为基线，不修改数据；过期版本或待处理请求返回 false。可指定仅确认部分行键。"
    default: null
    usage: "#变更追踪"
  - name: "resetChanges"
    type: "() => void"
    description: "取消待处理的数据接受请求并清空记录；当前数据保留为新基线。"
    default: null
    usage: "#变更追踪"
  - name: "cancelDataChange"
    type: "() => void"
    description: "中止待处理的数据接受请求；保留此前已接受的变更及当前编辑草稿。"
    default: null
    usage: "#变更追踪"
  - name: "validate"
    type: "(options?: TableValidateOptions) => Promise<TableValidationResult>"
    description: "校验提供的数据或指定范围；默认包含已加载的折叠树节点，不请求未加载子节点或远程页。"
    default: null
    usage: "#数据校验"
  - name: "validateRow"
    type: "(rowOrIndex: TableRow | number, options?: TableValidateOptions) => Promise<TableValidationResult>"
    description: "校验单行全部规则字段；普通索引为当前页展开行索引，生成源使用全局索引。"
    default: null
    usage: "#数据校验"
  - name: "validateCell"
    type: "(rowOrIndex: TableRow | number, columnOrIndex: TableColumn | string | number, options?: TableValidateOptions) => Promise<TableValidationResult>"
    description: "校验一个单元格；普通列可用对象、键、字段或可见列索引，生成源使用全局数字索引。"
    default: null
    usage: "#数据校验"
  - name: "clearValidation"
    type: "(rowKey?: TableRowKey, field?: string) => void"
    description: "清除全部或指定行键、字段的错误，并取消正在进行的校验。"
    default: null
    usage: "#数据校验"
  - name: "cancelValidation"
    type: "() => void"
    description: "立即取消当前校验，保留之前完成的校验错误与编辑草稿。"
    default: null
    usage: "#数据校验"
  - name: "getValidationErrors"
    type: "() => TableValidationError[]"
    description: "获取当前错误的快照；失效行或已修改字段的旧错误不会返回。"
    default: null
    usage: "#数据校验"
  - name: "scrollToValidationError"
    type: "(error?: TableValidationError) => Promise<boolean>"
    description: "定位指定错误，默认第一项；自动展开祖先和切换本地页。受控更新拒绝、目标被筛选或列隐藏时返回 false。"
    default: null
    usage: "#数据校验"
  - name: "startEdit"
    type: "(rowOrIndex: TableRow | number, columnOrIndex: TableColumn | string | number) => Promise<boolean>"
    description: "开始编辑并定位；普通数据使用当前可见行/列索引或行对象、列字段/键，生成源使用全局数字索引。"
    default: null
    usage: "#虚拟数据编辑"
  - name: "commitEdit"
    type: "() => Promise<boolean>"
    description: "提交当前草稿并发出 editCommit；无会话时返回 true，条件、数据冲突或校验失败导致拒绝时返回 false。"
    default: null
    usage: "#单元格与整行编辑"
  - name: "cancelEdit"
    type: "() => void"
    description: "放弃当前草稿。"
    default: null
    usage: "#单元格与整行编辑"
  - name: "getEditRecord"
    type: "() => TableEditRecord | null"
    description: "读取当前会话与草稿变更快照。"
    default: null
    usage: "#单元格与整行编辑"
  - name: "toggleRowDetail"
    type: "(rowOrIndex: TableRow | number, expanded?: boolean) => Promise<void>"
    description: "展开或收起详情；普通数据索引为当前可见行索引，生成数据源索引为全局索引。"
    default: null
    usage: "#虚拟滚动中的详情"
  - name: "setDetailExpandedKeys"
    type: "(keys: TableRowKey[]) => void"
    description: "设置详情展开键；受控时仅发出模型更新。"
    default: null
    usage: "#详情展开行"
  - name: "reloadRowDetail"
    type: "(rowOrIndex: TableRow | number) => Promise<void>"
    description: "重新加载已展开的详情，行和索引规则同 toggleRowDetail。"
    default: null
    usage: "#异步详情"
  - name: setSort
    type: '(sorts: TableSort[]) => void'
    description: '设置排序；受控模式下发出更新，需同步模型。'
    default: null
    usage: '#排序与多字段排序'
  - name: clearSort
    type: '() => void'
    description: '清除全部排序。'
    default: null
    usage: '#排序与多字段排序'
  - name: setFilters
    type: '(filters: TableFilters) => void'
    description: '替换筛选状态；受控模式下需同步模型。'
    default: null
    usage: '#筛选与自定义筛选'
  - name: clearFilters
    type: '() => void'
    description: '清除全部筛选。'
    default: null
    usage: '#筛选与自定义筛选'
  - name: getSelectedRows
    type: '() => TableRow[]'
    description: '读取选中行，单选模式也返回数组。'
    default: null
    usage: '#选择列与跨页保留'
  - name: setSelectedRows
    type: '(rows: TableRow[]) => void'
    description: '设置选中行；单选取首个可选行。'
    default: null
    usage: '#选择列与跨页保留'
  - name: clearSelection
    type: '() => void'
    description: '清空选择。'
    default: null
    usage: '#选择列与跨页保留'
  - name: toggleRowSelection
    type: '(row: TableRow, selected?: boolean) => void'
    description: '切换行选择，也可显式指定选中状态。'
    default: null
    usage: '#选择列与跨页保留'
  - name: selectAll
    type: '(selected?: boolean) => void'
    description: '选择或取消当前页筛选后已展开的可选行；virtualSource 下不执行全选，避免遍历海量数据。'
    default: null
    usage: '#选择列与跨页保留'
  - name: toggleRowExpand
    type: '(row, expanded?) => Promise<void>'
    description: 展开或收起树形行。
  - name: setExpandedKeys
    type: '(keys) => void'
    description: 替换树节点展开键集合。
  - name: scrollToRow
    type: '(rowOrIndex, align?) => void'
    description: 将普通或虚拟表格滚动到指定行。
  - name: scrollToColumn
    type: '(columnOrIndex, align?) => void'
    description: 按索引、key、field 或列对象滚动到指定列。
  - name: measure
    type: '() => void'
    description: 重新测量虚拟列表的动态行高。
---

# Table 表格

<card>

## 行分组与聚合

通过 `group-config.fields` 按字段嵌套分组。分组发生在排序、筛选、分页后；树数据以当前页的根分支分组，已展开后代保持在根分支内。组标题和小计不参与数据行选择或编辑。双击工时可编辑，成功更新后统计自动重算。

组小计覆盖该组当前提供的所有成员，收起不改变结果。整体汇总的 `summaryScope` 默认为 `page`，设置为 `filtered` 时统计已提供且符合筛选的可见树行，包含其他本地页；不会加载未展开或懒加载的后代。远程分页下，应用未提供的数据不在本地统计范围。

`aggregates` 的 `key` 对应汇总列字段。`count` 统计记录数；`sum`、`average`、`min`、`max` 仅接受有限数字。空输入的 sum/count 为 0，其余为 null；数值溢出返回 null。自定义聚合提供独立的 `initial`、`step` 和可选 `finish`，可按记录逐步计算，无需收集值数组。

展开键可由 `v-model:group-expanded-keys` 控制；拒绝更新时保留原显示状态。分组值支持基础类型和日期，对象字段应配置 `value` 函数返回稳定值。错误通过 `group-error` 报告，恢复原行显示。

<template #example><table-zh-grouping /></template>

<template #template>

@[code{69-105}](../../.vuepress/components/table-zh/grouping.vue)

</template>

<template #script>

@[code{1-67}](../../.vuepress/components/table-zh/grouping.vue)

</template>

<template #style>

@[code{107-119}](../../.vuepress/components/table-zh/grouping.vue)

</template>

</card>

<card>

## 远程分组请求

本例用模拟服务返回一页数据、页内分组范围和全量汇总。`STableGrid` 负责请求、分页、取消及错误反馈；分组元数据按已接受的数据页关联，过期、取消或失败的请求不会覆盖当前分组与统计。

使用真实接口时，让服务返回连续的组成员及 `TableGroupRemoteResult`，替换示例中的模拟查询即可。组小计为当前页提供的成员统计，整体汇总由服务定义；这里为全部 24 条记录的工时总和。

<template #example><table-zh-grouping-remote /></template>

<template #template>

@[code{85-115}](../../.vuepress/components/table-zh/grouping-remote.vue)

</template>

<template #script>

@[code{1-83}](../../.vuepress/components/table-zh/grouping-remote.vue)

</template>

</card>

<card>

## 远程分组与虚拟行

生成源使用 `mode: remote`。应用提供 `remote.groups` 的起始行、行数、子分组和聚合结果，以及 `remote.summary`；服务请求和取消可使用现有 Grid 请求代理，由应用传入当前结果。表格不会遍历生成源来猜测分组。普通数组的远程范围使用当前页数据索引，生成源使用绝对源索引；兄弟范围必须有序、不重叠，并位于父范围内，未覆盖行保留普通显示。

此例按公式提供 100 万行、10 万列的分组元数据。展开末批会先更新分组状态，再定位末端；收起的行没有可见数据地址，程序定位前应展开所在组。分组标题、小计和数据共用虚拟窗口，索引空间随组数增长；本地分组和聚合则同步处理已提供行，计算及存储成本随行数和分组层级增长，大规模全局统计应交给服务端。

<template #example><table-zh-grouping-source /></template>

<template #template>

@[code{52-78}](../../.vuepress/components/table-zh/grouping-source.vue)

</template>

<template #script>

@[code{1-50}](../../.vuepress/components/table-zh/grouping-source.vue)

</template>

<template #style>

@[code{80-95}](../../.vuepress/components/table-zh/grouping-source.vue)

</template>

</card>

<card>

## 合并单元格

通过 `merge-config.body` 和 `merge-config.footer` 分别指定正文与表尾的合并区域。每项包含从零开始的 `row`、`col`，以及大于零的 `rowspan`、`colspan`。合并区域显示起点单元格的内容，继续使用其列插槽、格式化和交互。

普通数据的 `row` 对应排序、筛选、分页和树展开后的当前显示行；表尾的 `row` 对应 `footer-data`。`col` 按左固定列、中心列、右固定列的可见顺序计算。固定范围跟随位置，查询、分页或列重排后会应用到新位置的单元格；需要按内容分组时应重新计算范围。

下例合并相邻团队，并单独合并表尾标签。方向键和 Tab 跳过被覆盖的单元格。跨固定列的区域分段绘制，只在一处保留内容和可交互控件。

跨度超出行列范围时会裁剪；无效范围被忽略，重叠范围以最先出现的有效项为准。1 × 1 范围不产生合并。将配置设为 `false` 或 `enabled: false` 可恢复独立单元格。

<template #example><table-zh-merging /></template>

<template #template>

@[code{28-40}](../../.vuepress/components/table-zh/merging.vue)

</template>

<template #script>

@[code{1-26}](../../.vuepress/components/table-zh/merging.vue)

</template>

<template #style>

@[code{42-49}](../../.vuepress/components/table-zh/merging.vue)

</template>

</card>

<card>

## 合并编辑与详情

双击团队或项目单元格进入编辑，点击保存接受更新，或取消保留原值。合并团队只编辑起点行，不会同时修改被覆盖行的数据。通过首列展开任意项目的详情；合并区域在详情上下分段绘制，详情中的输入保持独立。可切换虚拟行，并拖动表头真实边界调整列宽。

<template #example><table-zh-merging-edit /></template>

<template #template>

@[code{43-83}](../../.vuepress/components/table-zh/merging-edit.vue)

</template>

<template #script>

@[code{1-41}](../../.vuepress/components/table-zh/merging-edit.vue)

</template>

<template #style>

@[code{85-104}](../../.vuepress/components/table-zh/merging-edit.vue)

</template>

</card>

<card>

## 虚拟合并区域

生成数据源的合并行位置使用绝对源索引，开启分页时也保持此规则。`body` 或 `footer` 可接收同步函数，参数包含半开窗口 `rowStart`、`rowEnd`、`colStart`、`colEnd`，以及区域、行列数量和 `rowAt` / `columnAt` 访问器。函数需要返回与窗口相交的完整范围，包括起点位于窗口之前的范围。固定列、中心列和程序定位的目标可能分别触发查询；规则应保持确定性，不执行副作用。规则抛出异常时，该次查询不合并单元格。

下例在生成数据中每四行、八列组成一个区域。点击「末端区域」可定位到两个轴末端的被覆盖单元格，活动地址归一到其区域起点。开启多行内容可观察自然高度调整。横向窗口切换保留已测得的最大高度；内容、真实列布局变化或调用 `measure()` 后允许重新测量。编辑和单元格交互使用合并起点对应的行、列上下文。

内容高于整个可视区域时，可在合并单元格内滚动阅读；聚焦后也可使用 Page Up / Page Down。编辑期间改变合并规则会遵循已配置的列变更策略。受控活动地址指向被覆盖单元格时，组件请求将地址更新为区域起点；接受更新后才显示活动状态。

<template #example><table-zh-merging-source /></template>

<template #template>

@[code{46-82}](../../.vuepress/components/table-zh/merging-source.vue)

</template>

<template #script>

@[code{1-44}](../../.vuepress/components/table-zh/merging-source.vue)

</template>

<template #style>

@[code{84-99}](../../.vuepress/components/table-zh/merging-source.vue)

</template>

</card>

<card>

## 右键菜单

通过 `context-menu-config.header`、`body` 和 `footer` 分别提供菜单项数组，或接收上下文并返回数组的同步函数。`visibleMethod` 返回 false、当前区域没有菜单项或配置关闭时，保留浏览器原生右键菜单。工厂函数异常时同样回退到原生菜单。

`context.area` 区分 `header`、`body` 与 `footer`，三者都有 `column`、`columnIndex`。表头另有 `group`，分组表头提供分组列，索引指向当前渲染标题段的首个叶子列；数据区提供 `row`、`rowKey`、`rowIndex`、原始 `value` 及树节点上下文；表尾提供汇总行、表尾行索引及原始值。`contextMenuSelect` 返回 `{ context, item }`，组件不会自动修改数据或执行删除等业务动作。

菜单项沿用 `ContextMenuItem` 的 `label`、`value`、`icon`、`disabled`、`divided`、`keepOpen`。响应式工厂可更新禁用状态；`keepOpen` 适合连续查看操作。下例表头菜单排序，数据菜单查看记录或启动已有编辑器，表尾菜单查看汇总。

聚焦单元格后按 Shift + F10 或菜单键打开，方向键、Home / End 移动菜单焦点，Enter / Space 选择，Escape 关闭并恢复来源焦点，Tab 关闭后继续浏览。配合 `keyboard-config` 可先用方向键选择数据单元格。菜单不触发行选择；编辑器内保留原生右键菜单及输入法行为。

表格滚动、翻页、排序、筛选、数据或列布局变化会关闭当前菜单；外部点击由共享弹层处理。菜单默认传送到页面弹层，不会被卡片或虚拟视口裁切。

<template #example><table-zh-context-menu /></template>

<template #template>

@[code{58-98}](../../.vuepress/components/table-zh/context-menu.vue)

</template>

<template #script>

@[code{1-56}](../../.vuepress/components/table-zh/context-menu.vue)

</template>

<template #style>

@[code{100-114}](../../.vuepress/components/table-zh/context-menu.vue)

</template>

</card>

<card>

## 虚拟数据菜单

`virtualSource` 下的数据行列索引为绝对源索引，表尾 `rowIndex` 仍是表尾数组索引。仅为命中的已渲染单元格构造上下文，不枚举整张数据源。点击末格后按 Shift + F10，可检查末端数据和左右固定列；横向移动后也可打开对应表尾菜单。数据源的变更、滚动或卸载会关闭旧上下文。

<template #example><table-zh-context-menu-source /></template>

<template #template>

@[code{35-57}](../../.vuepress/components/table-zh/context-menu-source.vue)

</template>

<template #script>

@[code{1-33}](../../.vuepress/components/table-zh/context-menu-source.vue)

</template>

<template #style>

@[code{59-72}](../../.vuepress/components/table-zh/context-menu-source.vue)

</template>

</card>

<card>

## 单元格区域选择

设置 `range-config` 后，拖动单元格建立矩形选区；Shift + 点击或 Shift + 方向键扩展选区，Ctrl / Command + A 选择当前视图，Escape 清空。拖动至可见区域边缘会自动滚动，Escape 可取消拖动并恢复原选区。选区与行高亮、活动单元格分别管理。

`v-model:cell-range` 保存稳定的 `{ anchor, focus }` 地址，合并单元格会完整纳入范围。排序或列重排后跟随行列键，隐藏端点、折叠分组或翻页使端点不可见时请求清空。受控模型需接受更新。

<template #example><table-zh-range /></template>

<template #template>

@[code{21-66}](../../.vuepress/components/table-zh/range.vue)

</template>

<template #script>

@[code{1-19}](../../.vuepress/components/table-zh/range.vue)

</template>

<template #style>

@[code{68-81}](../../.vuepress/components/table-zh/range.vue)

</template>

</card>

<card>

## 巨量数据的区域选择

此例按需生成 100 万行、10 万列，固定列与中心列共用逻辑坐标。全表选区只记录端点与边界，不读取全部单元格；渲染仍限于当前窗口。通过 `range-config.rowIndexOf` 将稳定行键映射到绝对源索引，支持视口外的程序选区。

边缘滚动使用内容逻辑像素，在压缩滚动轨道下保持一致速度。合并规则应返回与查询矩形相交的完整区域；极大选区的代价取决于相交合并区域数量，计算可被新手势或上下文变化取消。

<template #example><table-zh-range-source /></template>

<template #template>

@[code{41-81}](../../.vuepress/components/table-zh/range-source.vue)

</template>

<template #script>

@[code{1-39}](../../.vuepress/components/table-zh/range-source.vue)

</template>

<template #style>

@[code{83-96}](../../.vuepress/components/table-zh/range-source.vue)

</template>

</card>

<card>

## 复制、剪切与粘贴

开启 `clipboard-config` 后，使用 Ctrl / Command + C、X、V 操作当前区域；未选区域时使用活动单元格。输入框内部保留原生文本操作。复制只需剪贴板配置；剪切和粘贴还需 `edit-config`、列 `editor` 及 `change-config`，普通数组使用 `v-model:data` 接受变更。

复制同时生成独立二维值和 TSV 文本。粘贴从单个活动格开始时按输入尺寸展开；已有矩形选区必须是输入行列数的整数倍，可用单值填充。只读格保持原位置，不会把后续值左移。合并区域只在起点复制内容，其余位置为空；目标必须覆盖完整合并格，冲突内容会拒绝。`bounds` 使用当前视图可见数据行与视觉列的半开索引，不包括组标题，也不自动翻页。

`validation-config` 开启时，写入字段复用现有规则，校验可读取包含整批字段变化的 `draftRow`；`onCommit: false` 关闭这一步。任一字段失败则整批保留原数据。一次粘贴或剪切清空各占一步历史，配合 `history-config` 撤销/重做。剪切先复制，再以 `clearCell`（默认 `null`）清空可写格；必填规则可能阻止清空，此时结果会标明 `clipboardWritten: true`。

按钮和无参数 `pasteCells()` 使用浏览器 Clipboard API，需要安全上下文及浏览器许可；快捷键粘贴可直接读取原生粘贴事件。`copyCells({ writeClipboard: false })` 与显式传入二维数据的 `pasteCells(data)` 不访问系统剪贴板。文本数字按数字编辑器转换，开关识别 `true/false`；其他格式通过 `formatCell`、`parseCell` 配置。

表格保持焦点时按 Escape，或调用 `cancelClipboard()` 取消等待；换页、改配置、开始编辑或替换数据也会使旧请求失效。适配器必须在写入前检查 `signal`。取消不能回滚已经完成的系统剪贴板写入；`clipboardWritten: null` 表示系统写入已发起但结果尚未确认。

默认最多处理 10000 个单元格、2000000 个文本字符，可通过 `maxCells`、`maxCharacters` 调整。上限按矩形面积计算，包含只读格和合并续接位置；选中巨量区域不会自动复制完整数据集。二维对象值的大小由业务控制，单元格数量上限并不等同于固定内存预算。

<template #example><table-zh-clipboard /></template>

<template #template>

@[code{70-124}](../../.vuepress/components/table-zh/clipboard.vue)

</template>

<template #script>

@[code{1-69}](../../.vuepress/components/table-zh/clipboard.vue)

</template>

<template #style>

@[code{125-139}](../../.vuepress/components/table-zh/clipboard.vue)

</template>

</card>

<card>

## 巨量数据的剪贴板

生成源通过 `change-config.indexOf` 定位稳定行键，通过 `apply` 接受字段补丁；本例只保存修改过的值。末端合并区域跨越右固定列，可复制、粘贴和撤销。选择全表后复制会先返回超限结果，避免枚举百万行十万列。区域读取、候选行生成和校验按批让出执行；未加载的远程页或树节点不会被自动读取。

<template #example><table-zh-clipboard-source /></template>

<template #template>

@[code{120-170}](../../.vuepress/components/table-zh/clipboard-source.vue)

</template>

<template #script>

@[code{1-119}](../../.vuepress/components/table-zh/clipboard-source.vue)

</template>

<template #style>

@[code{171-185}](../../.vuepress/components/table-zh/clipboard-source.vue)

</template>

</card>

<card>

## 查找与替换

开启 `find-config` 后显示搜索面板。表格单元格获得焦点时，Ctrl / Command + F 打开查找，Ctrl / Command + H 聚焦替换框，F3 / Shift + F3 导航匹配。面板内按 Enter 执行查找，Escape 取消等待或关闭面板。`panel: false` 用于只通过 API 集成；`keyboard: false` 关闭表格快捷键。

查询按字面文本匹配，可选区分大小写和匹配整个单元格。当前视图搜索当前筛选页中已展开的行；选中区域搜索当前矩形选区。两者按可见视觉列顺序遍历，合并单元格只计一次。已提供数据范围跨页搜索所有已提供的行和已加载的树子节点，不受筛选限制，搜索可见列对应的原始字段；不会请求其他远程页面或懒加载子节点。定位会展开已加载的祖先、分组并请求切页；若筛选隐藏目标行或受控视图拒绝导航，则返回 `false`，不会清除筛选条件。

通过 `findCells(query, { scope, bounds, columns })` 发起程序查询。`bounds` 为当前视图或选区范围内的半开可见坐标，`columns` 限定列键或列索引。`findNext`、`findPrevious` 循环定位匹配；`focus: false` 在滚动并标记活动格时保留输入焦点。空查询不产生匹配。重新框选会清除选区范围的旧结果，显式传入 bounds 的查询不受框选变化影响。

替换需要 `edit-config`、列编辑器和 `change-config`；普通数组通过 `v-model:data` 接受更新。`replaceMatch` 替换一个匹配格内的全部命中，`replaceAll` 处理全部可写匹配格。只读、禁用和业务条件限制的字段保留原值。替换值使用内置编辑器转换或 `parseCell`，`$` 等内容按字面保留。完整候选行先经过已有校验，再提交一次所有者接受的批量变更和一步撤销历史；校验失败则保留全部源数据。成功后重新执行同一查询，不移动焦点。

示例可跨页查找 Alpha、选择区域、分组或切换动态虚拟滚动。项目名称必填且最多 24 字符，可尝试替换为空字符串观察整批校验失败，再用撤销和重做检查成功的事务。

<template #example><table-zh-find /></template>

<template #template>

@[code{57-103}](../../.vuepress/components/table-zh/find.vue)

</template>

<template #script>

@[code{1-56}](../../.vuepress/components/table-zh/find.vue)

</template>

<template #style>

@[code{104-115}](../../.vuepress/components/table-zh/find.vue)

</template>

</card>

<card>

## 巨量数据查找与替换

`find-config` 默认最多检查 100000 个位置、保留 1000 个匹配格、处理 2000000 文本字符。本例将 `maxCells` 降为 4096。搜索未完成时会保留明确的上限状态，`replaceAll` 拒绝部分结果，`replaceMatch` 仍可替换一个已返回的匹配格。可缩小范围或主动调整上限。对象值需要格式化函数；文本与单元格上限不衡量已提供对象占用的内存。

来源为百万行、十万列。查找已选中的末端合并区域，在面板中填写替换值，即可更新跨固定列边界的合并起点。数据适配器只保存发生变化的字段，定位复用虚拟行列窗口。

`cancelFind()` 和 `AbortSignal` 可停止搜索、校验和数据接受等待。数据或列变化会使旧结果失效；当前视图的结果还会在翻页或展开状态改变时失效。适配器应在接受写入前检查信号；取消无法撤回已经完成的外部写入，可通过已接受的历史记录撤销。

<template #example><table-zh-find-source /></template>

<template #template>

@[code{95-135}](../../.vuepress/components/table-zh/find-source.vue)

</template>

<template #script>

@[code{1-94}](../../.vuepress/components/table-zh/find-source.vue)

</template>

<template #style>

@[code{136-147}](../../.vuepress/components/table-zh/find-source.vue)

</template>

</card>

<card>

## 键盘导航

显式开启 `keyboard-config` 后，方向键按可见列顺序移动，Tab / Shift + Tab 跨行移动；到达当前页首尾时保留浏览器原生 Tab 行为。固定列参与相同导航顺序，隐藏列会被跳过。不会自动翻页。

`v-model:active-cell` 保存 `{ rowKey, columnKey }`，与 `v-model:highlight` 行选择独立。普通列使用 `key`、`field`，未命名列使用 `@原始索引`；需要持久保存地址时请提供稳定键。排序、重排列后跟随同一行键和列键；筛选、折叠、翻页或隐藏列使目标不可见时请求清空。受控模型需接受更新。

聚焦单元格后按 Enter / F2 进入已配置的编辑器；设置 `enterToEdit: false` 可关闭该快捷入口。没有编辑器时尝试聚焦格内控件。编辑器内部保留方向键、Tab、中文输入法和弹层快捷键；取消编辑后焦点回到单元格。单元格上的 Escape 清空活动格。

虚拟窗口移走活动格时，焦点暂存于表格入口；该格重新挂载且焦点仍属于表格时恢复。鼠标点击其他区域或焦点已移出表格后不会自动抢回。下例还可以在列设置中隐藏、重排或固定列。

<template #example><table-zh-keyboard /></template>

<template #template>

@[code{18-55}](../../.vuepress/components/table-zh/keyboard.vue)

</template>

<template #script>

@[code{1-16}](../../.vuepress/components/table-zh/keyboard.vue)

</template>

<template #style>

@[code{57-70}](../../.vuepress/components/table-zh/keyboard.vue)

</template>

</card>

<card>

## 跨虚拟窗口导航

生成源地址的 `columnKey` 是列源索引的字符串。通过 `keyboardConfig.rowIndexOf(key)` 将行键映射到绝对源行索引，便于受控模型定位或数据重排后跟随行键；组件不会扫描生成数据寻找行。未提供解析器时，只能跟随本次导航已知且仍匹配的行位置。

本例按需生成 100 万行、10 万列。点击末格后可用方向键跨越虚拟窗口、进入右固定列；单元格定位只挂载当前窗口。`setActiveCell` 对生成源使用绝对源索引；目标不在当前页、列被隐藏、模型拒绝或定位取消时返回 false。

<template #example><table-zh-keyboard-source /></template>

<template #template>

@[code{26-45}](../../.vuepress/components/table-zh/keyboard-source.vue)

</template>

<template #script>

@[code{1-24}](../../.vuepress/components/table-zh/keyboard-source.vue)

</template>

<template #style>

@[code{47-60}](../../.vuepress/components/table-zh/keyboard-source.vue)

</template>

</card>

<card>

## 行拖拽排序

开启 `row-drag-config`，在列上设置 `dragSort: true`（声明式列使用 `drag-sort`）显示手柄。使用稳定 `row-key` 和 `v-model:data` 接受重排数组。`checkMethod` 限制可拾取行，`dropMethod` 限制落点；手柄不会触发行选择或编辑。

空格或回车拾取，方向键选择落点，回车放置，Escape 取消。鼠标拖至可滚动窗口边缘会自动滚动，可用 `autoScroll: false` 关闭；`scrollThreshold` 默认 40px，`scrollSpeed` 默认每帧 16px。

排序条件存在时不能重排，请先清除排序。筛选和分页下按目标行在完整源数组中的位置移动，保留隐藏行与其他页；远程分页只能调整当前提供的一页。活动草稿或未保存变更期间禁用；先提交或还原后再调整顺序。重排是一次新的数据基线，不作为编辑字段变更，也不进入编辑撤销历史。

`moveRow(from, to, position)` 接受当前展开页的索引，`position` 为 `before`（默认）或 `after`。`rowDragStart` 提供拾取行，`rowDragEnd` 和返回结果提供 `applied`、`reason` 及已生成的 `request`；其中 `oldIndex`、`newIndex` 为源同级数组位置，`parentKey` 标识父节点。

<template #example><table-zh-row-drag /></template>

<template #template>

@[code{40-57}](../../.vuepress/components/table-zh/row-drag.vue)

</template>

<template #script>

@[code{1-38}](../../.vuepress/components/table-zh/row-drag.vue)

</template>

<template #style>

@[code{59-69}](../../.vuepress/components/table-zh/row-drag.vue)

</template>

</card>

<card>

## 树形同级重排

树形数据仅在同级之间移动，展开的后代随父节点一起移动；不会把节点重新挂到另一父节点。已加载的懒节点子数组与普通 children 使用相同规则，不请求未加载子节点。仅复制受影响的同级数组和祖先，原始行保持不变。下例组合声明式列、左右固定列、虚拟滚动和动态行高。

<template #example><table-zh-row-drag-tree /></template>

<template #template>

@[code{29-52}](../../.vuepress/components/table-zh/row-drag-tree.vue)

</template>

<template #script>

@[code{1-27}](../../.vuepress/components/table-zh/row-drag-tree.vue)

</template>

</card>

<card>

## 生成源拖动与自动滚动

`virtualSource` 必须提供 `rowDragConfig.apply`，接收稳定行键、落点、源绝对位置和 `signal`。生成源请求没有 `data`，由适配器更新数据源及行键映射，再返回 true；组件核对移动行的新位置后报告成功。普通数组也可使用 apply；需先接受请求中的完整 data 数组。返回 false、异常、外部数据替换、取消或卸载均不能报告成功，`cancelRowDrag()` 会立即结束等待；适配器应在写入前检查 signal。

此例按需提供 100 万行、10 万列，仅缓存顺序改变的位置。相邻拖动只更新少量映射，长距离移动的时间和内存与跨越行数成正比；示例分批让出执行并支持取消。业务服务可用稳定行键及前后落点持久化顺序，不必加载完整数据集。

<template #example><table-zh-row-drag-source /></template>

<template #template>

@[code{59-83}](../../.vuepress/components/table-zh/row-drag-source.vue)

</template>

<template #script>

@[code{1-57}](../../.vuepress/components/table-zh/row-drag-source.vue)

</template>

<template #style>

@[code{85-98}](../../.vuepress/components/table-zh/row-drag-source.vue)

</template>

</card>

<card>

## 撤销与重做

同时开启 `change-config` 和 `history-config`，通过 `undo()`、`redo()` 回放已接受的编辑、增删及还原操作。一次整行提交或批量增删只占一个历史步骤；未提交的草稿、校验失败、被拒绝或取消的操作不进入历史。活动草稿期间回放返回 `editing`，请先提交或取消草稿。

`history-config.limit` 默认 100，示例设为 30。历史保存受影响字段的前后值及增删行的只读引用，不复制整张数据集；删除大型已加载分支仍会保留该分支，条数上限不等于固定内存上限。业务应通过变更 API 更新数据，避免原地修改历史引用。

新操作会清空重做分支，写入相同值不会清空。`clearHistory()` 仅清空历史，保留数据和变更记录；成功调用 `acceptChanges()`（包括部分行确认）、`resetChanges()`、更换数据基线或关闭历史功能都会清空全部历史。排序、筛选、分页不清空历史，操作始终按稳定行键定位。

回放沿用数据接受适配器，不重复执行编辑校验，也不自动持久化到服务端。异步适配器需遵守 `signal`；拒绝、异常或取消不消耗历史步骤。`getHistoryState()` 与 `historyChange` 提供按钮状态。`empty` 表示无可回放步骤，`conflict` 表示目标字段已被外部修改；查看返回结果的 `applied` 后再更新业务反馈。输入框内原有的撤销快捷键保持不变。

<template #example><table-zh-history /></template>

<template #template>

@[code{51-126}](../../.vuepress/components/table-zh/history.vue)

</template>

<template #script>

@[code{1-49}](../../.vuepress/components/table-zh/history.vue)

</template>

<template #style>

@[code{128-139}](../../.vuepress/components/table-zh/history.vue)

</template>

</card>

<card>

## 变更追踪

开启 `change-config`，通过 `v-model:data` 接受普通数组的增删改提案。`row-key` 必须是稳定且唯一的字符串或数字，不能依赖行序号；组件不会原地修改业务行。排序、筛选和分页不改变变更 API 的行键含义。

编辑中的草稿不计入变更记录；编辑校验通过且父组件接受数据后，才触发 `editCommit` 并更新记录。开启变更追踪时无需再在 `editCommit` 中手动替换行。`insertRows`、`removeRows`、`updateRow` 是独立的数据 API，不自动执行编辑校验；保存前可调用 `validate()`。

`getChangeRecords()` 返回 `inserted`、`updated`、`removed` 和 `version`。新增后删除会抵消，修改回原值会移除修改记录。`revertChanges([key])` 还原指定行，省略行键还原全部；业务保存成功后，再调用 `acceptChanges(snapshot.version)` 确认基线。保存期间有新变更时，旧版本确认返回 `false`，应检查最新记录再保存，不能直接清空。

示例的“确认基线”按钮只演示本地确认。`resetChanges()` 清空记录并保留当前数据，与还原不同。外部替换 `data` 数组会开始新基线；需要保留记录的修改应走上述 API。

<template #example><table-zh-changes /></template>

<template #template>

@[code{108-176}](../../.vuepress/components/table-zh/changes.vue)

</template>

<template #script>

@[code{1-106}](../../.vuepress/components/table-zh/changes.vue)

</template>

<template #style>

@[code{178-189}](../../.vuepress/components/table-zh/changes.vue)

</template>

</card>

<card>

## 树分支变更与还原

`insertRows(rows, { parentKey, index })` 插入子行；删除父节点会记录已加载的整个分支。`revertChanges([parentKey])` 包含未修改的中间节点下的后代，也能还原已删除的分支；不会恢复在本次基线之后新增又删除的行。

懒加载只处理已经载入的记录，不会为变更追踪主动请求后代。修改已加载子节点时，提案会复制对应祖先并写入子数组；原始业务对象保持不变。下方可以依次加载、修改后代、插入子行、删除分支，再还原分支。

本例同时开启操作历史，可撤销或重做插入子行、修改后代、删除分支及还原；已加载后代随删除操作一起恢复，不重新请求懒加载。

<template #example><table-zh-changes-tree /></template>

<template #template>

@[code{74-143}](../../.vuepress/components/table-zh/changes-tree.vue)

</template>

<template #script>

@[code{1-72}](../../.vuepress/components/table-zh/changes-tree.vue)

</template>

<template #style>

@[code{145-156}](../../.vuepress/components/table-zh/changes-tree.vue)

</template>

</card>

<card>

## 生成源变更适配

生成源提供 `changeConfig.indexOf(key)` 定位当前全局行索引，并通过 `apply({ operations, signal })` 接受变更。适配器完成数据写入后返回 `true`，拒绝返回 `false`；异步写入前必须检查 `signal.aborted`，以免取消或切换数据后写回旧结果。同一张表已有待处理请求时，新请求返回 `busy`。

生成行可以按需提供字段。`row` 应表示该次读取的只读数据版本；更新优先读取 `patches`，不要展开整行或遍历完整行列矩阵。插入和删除由适配器维护源行数、稳定键映射及恢复位置；本例为固定行数源，只接受字段更新。表格记录只随已改行和字段增长，示例在百万行、十万列中保存稀疏覆盖值。

切换到另一个业务数据集时更新 `changeConfig.dataKey`。调用 `cancelDataChange()` 取消待处理接受请求，使用 `resetChanges()` 放弃记录并确认当前数据。外部替换生成源的 `row` 函数也会开始新基线；由当前 `apply` 接受的函数替换会保留记录。

本例开启历史后，末端单元格的修改也可以撤销或重做；回放通过相同的 apply 适配器写回生成源。确认基线会清空历史。

<template #example><table-zh-changes-source /></template>

<template #template>

@[code{105-157}](../../.vuepress/components/table-zh/changes-source.vue)

</template>

<template #script>

@[code{1-103}](../../.vuepress/components/table-zh/changes-source.vue)

</template>

<template #style>

@[code{159-170}](../../.vuepress/components/table-zh/changes-source.vue)

</template>

</card>

<card>

## 数据校验

为列配置 `rules`，或通过 `validation-rules` 按字段配置规则；列规则优先，`rules: []` 可关闭该列校验。支持必填、类型、数值范围、字符串或数组长度、正则，以及自定义同步或异步 `validator`。规则不会转换数据类型；可选空值跳过类型与范围检查，但仍执行自定义函数。

显式开启 `validation-config` 后，提交编辑会先校验草稿。单元格模式检查当前字段，整行模式检查该行所有规则字段；失败保留草稿，不触发 `editCommit`。没有开启编辑时也能调用 `validateCell`、`validateRow` 或 `validate`。

自定义函数接收 `value`、`draftRow` 和 `signal`。返回 `true` 或不返回值表示通过；返回 `false`、错误消息、`Error` 或拒绝 Promise 表示失败。下方名称检查用延迟模拟服务端占用检查，`admin` 不可使用。输入新草稿、取消编辑或启动新校验都会废弃旧请求；远程校验可把 `signal` 传给 `fetch`。

错误显示在对应单元格内，内置编辑器提供错误关联；自定义编辑插槽也可读取 `error` 和 `validating`。校验期间仍可修改或放弃草稿。

<template #example><table-zh-validation /></template>

<template #template>

@[code{108-162}](../../.vuepress/components/table-zh/validation.vue)

</template>

<template #script>

@[code{1-106}](../../.vuepress/components/table-zh/validation.vue)

</template>

<template #style>

@[code{164-178}](../../.vuepress/components/table-zh/validation.vue)

</template>

</card>

<card>

## 错误定位与校验范围

`validate()` 默认检查所有已提供的数据，包括已加载的折叠树节点；`scope: 'view'` 仅检查筛选、展开和分页后的行，不限于虚拟滚动当前挂载的窗口。它不会请求尚未加载的树节点或远程页。

使用 `validate({ rowKeys: [...] })` 按稳定行键选择普通数组或树形记录，也适用于变更追踪返回的记录。生成数据源使用 `rowKeys` 时必须同时提供数字 `rows` 索引；通过数字 `columns` 指定校验列范围。

发现错误时默认展开祖先、切换本地页并滚动聚焦；使用 `scrollToError: false` 关闭自动定位。受控分页或展开需要父组件接受更新，筛选排除的行和隐藏列不会被强制恢复。`scrollToValidationError()` 返回定位是否成功。

`clearValidation(rowKey?, field?)` 清除指定错误；无参数时清除全部。更换数据、规则或继续修改字段后，旧错误不会继续用于定位。普通数据的数字行索引对应当前页展开后的行；需要校验其他页时传入行对象，或使用全表范围。

<template #example><table-zh-validation-navigation /></template>

<template #template>

@[code{47-72}](../../.vuepress/components/table-zh/validation-navigation.vue)

</template>

<template #script>

@[code{1-45}](../../.vuepress/components/table-zh/validation-navigation.vue)

</template>

<template #style>

@[code{74-88}](../../.vuepress/components/table-zh/validation-navigation.vue)

</template>

</card>

<card>

## 生成数据校验

生成数据源使用全局数字行列索引。`validateCell(999_999, 99_998)` 可直接检查一个远端位置；`validate({ rows, columns })` 可指定一组目标，避免扫描整张生成表。下例生成 100 万行、10 万列，只有末行的指定字段为空。

全量校验按需读取数据并定期让出执行时间，但耗时仍随目标数量增长。可通过 `AbortSignal` 或 `cancelValidation()` 取消。`maxErrors` 默认 100，达到上限后停止并设置 `truncated: true`；`checked` 是已校验的规则字段数。取消时返回 `cancelled: true`，不会发布部分结果或覆盖之前的错误。应检查 `valid`，不能仅凭错误数组为空判断通过。

<template #example><table-zh-validation-source /></template>

<template #template>

@[code{76-105}](../../.vuepress/components/table-zh/validation-source.vue)

</template>

<template #script>

@[code{1-74}](../../.vuepress/components/table-zh/validation-source.vue)

</template>

<template #style>

@[code{107-121}](../../.vuepress/components/table-zh/validation-source.vue)

</template>

</card>

<card>

## 单元格与整行编辑

设置 `edit-config` 并为列添加 `editor`，默认双击进入单元格编辑。`mode: 'row'` 开启整行编辑；`trigger` 可选 `click`、`dblclick` 或 `manual`，`checkMethod` 限制可编辑行或单元格。此例的归档项目不可编辑。

默认编辑只改变草稿。未开启 `change-config` 时，接收 `editCommit` 的 `updatedRow` 或 `changes` 后，由应用更新 `data` 或提交到服务端；组件不会直接修改业务记录。普通输入按 Enter 提交、Escape 取消，选择器和日期面板优先处理自身按键，也可使用保存按钮或 Ctrl/⌘ + Enter。Tab 可进入可编辑单元格，再按 Enter 或 F2 开始。

切换编辑目标默认提交前一项，可用 `onSwitch: 'cancel'` 改为取消。翻页、排序、筛选或调整列设置默认取消草稿，`onContextChange: 'commit'` 可改为提交；替换数据或关闭编辑会取消当前会话。`commitEdit()` 成功表示已发出变更，不代表远程请求已完成。

<template #example><table-zh-editing /></template>

<template #template>

@[code{93-124}](../../.vuepress/components/table-zh/editing.vue)

</template>

<template #script>

@[code{1-91}](../../.vuepress/components/table-zh/editing.vue)

</template>

<template #style>

@[code{126-140}](../../.vuepress/components/table-zh/editing.vue)

</template>

</card>

<card>

## 编辑生命周期

通过 `edit-config.onSwitch` 设置切换单元格时的行为，默认 `commit`；通过 `onContextChange` 设置排序、筛选、分页或列变更时的行为，默认 `cancel`。受控查询只有在父组件接受新状态后才结束编辑。Enter 提交草稿，Escape 放弃草稿。

虚拟滚动的 `onScroll: 'keep'` 默认在编辑器移出渲染窗口后保留草稿，也可选择 `commit` 或 `cancel`。整行模式会等该行最后一个编辑器移出窗口后再执行。可在下方关闭分页、开启虚拟滚动进行体验。

替换数据数组或正在编辑的行对象时，会以 `data` 原因取消编辑；删除该行、收起其祖先节点，或缩小生成源使活动索引越界时，会以 `view` 原因取消，不会自动保存已经失效的记录。插入或加载其他行可以保留当前草稿；提交前会检查相同字段是否被外部修改。通过 `editCommit` 和 `editCancel` 获取结果及原因。

<template #example><table-zh-editing-lifecycle /></template>

<template #template>

@[code{103-167}](../../.vuepress/components/table-zh/editing-lifecycle.vue)

</template>

<template #script>

@[code{1-101}](../../.vuepress/components/table-zh/editing-lifecycle.vue)

</template>

<template #style>

@[code{169-189}](../../.vuepress/components/table-zh/editing-lifecycle.vue)

</template>

</card>

<card>

## 自定义编辑器

使用 `STableColumn #edit`、指定列的 `#edit-[key]` 或通用 `#edit-cell` 定制编辑内容，调用 `setValue` 更新草稿。`value` 是当前字段草稿，`draftRow` 可读取本行其他字段的草稿；不要直接修改插槽参数中的对象。

编辑内容按指定列插槽、通用编辑插槽、列 `edit` 函数、命名渲染器的 `edit`、内置编辑器依次回退。展示态继续使用原有单元格渲染规则。此例通过操作按钮启动整行编辑，输入框和选择器复用组件库控件。

<template #example><table-zh-editing-custom /></template>

<template #template>

@[code{23-78}](../../.vuepress/components/table-zh/editing-custom.vue)

</template>

<template #script>

@[code{1-21}](../../.vuepress/components/table-zh/editing-custom.vue)

</template>

</card>

<card>

## 虚拟数据编辑

生成源通过稳定行键与字段标识编辑位置。此例按需生成 100 万行、10 万列，仅保存已修改字段；接收 `changes` 即可把补丁发送给服务端，不需要构造完整二维数据。

默认离开虚拟视口时保留当前草稿，返回后继续编辑；`onScroll: 'commit'` 或 `'cancel'` 可在编辑器离开窗口时结束会话。整行模式只在整行编辑器都离开窗口时应用此策略。`startEdit` 会滚动到目标行列并聚焦，隐藏列不可启动编辑。

<template #example><table-zh-editing-source /></template>

<template #template>

@[code{66-95}](../../.vuepress/components/table-zh/editing-source.vue)

</template>

<template #script>

@[code{1-64}](../../.vuepress/components/table-zh/editing-source.vue)

</template>

<template #style>

@[code{97-108}](../../.vuepress/components/table-zh/editing-source.vue)

</template>

</card>

<card>

## 详情展开行

添加 `type: 'expand'` 列，通过 `#detail` 放置详情、表单或子表格。`v-model:detail-expanded-keys` 使用稳定行键，与树节点的 `expanded-keys` 分别控制；展开按钮支持 Tab 聚焦、Enter 和空格操作。

未绑定模型时可用 `detailConfig.defaultExpandedKeys` 设置初始展开项，`checkMethod` 控制哪些行可展开。表单值由业务保存，详情收起或虚拟滚动离开视口时，插槽组件会卸载。

<template #example><table-zh-details /></template>

<template #template>

@[code{35-66}](../../.vuepress/components/table-zh/details.vue)

</template>

<template #script>

@[code{1-33}](../../.vuepress/components/table-zh/details.vue)

</template>

<template #style>

@[code{68-86}](../../.vuepress/components/table-zh/details.vue)

</template>

</card>

<card>

## 异步详情

通过 `detailConfig.load` 异步获取详情；返回结果由 `#detail` 的 `data` 接收。`#detail-loading` 和 `#detail-error` 可替换加载与错误提示，`reload()` 重新加载当前详情。

收起、关闭详情功能、更换数据数组或加载函数、卸载表格时，会取消相关请求并忽略过期结果。请将 `signal` 传给请求客户端。展开项在离开虚拟视口后保留加载结果，收起后清除；替换数据数组会重新加载。

此例延迟 800ms，第二条报表首次加载失败，可点击重试。

<template #example><table-zh-details-async /></template>

<template #template>

@[code{42-58}](../../.vuepress/components/table-zh/details-async.vue)

</template>

<template #script>

@[code{1-40}](../../.vuepress/components/table-zh/details-async.vue)

</template>

<template #style>

@[code{60-64}](../../.vuepress/components/table-zh/details-async.vue)

</template>

</card>

<card>

## 虚拟滚动中的详情

详情与对应数据行一起测量高度；开启详情后会自动启用动态测量，内容缩短或收起时重新测量。面板保持可见区域宽度，横向滚动时不会随着虚拟列移出视口。

生成数据源需显式设置 `detail-config` 并提供稳定的 `rowKey`。此例按需生成 100 万行、10 万列，展开状态仅记录指定键。`toggleRowDetail(index)` 接受全局行索引，普通数据则使用当前排序、筛选、分页和树展开后的可见索引；传入行对象时，应使用当前渲染或插槽提供的对象。

<template #example><table-zh-details-source /></template>

<template #template>

@[code{32-59}](../../.vuepress/components/table-zh/details-source.vue)

</template>

<template #script>

@[code{1-30}](../../.vuepress/components/table-zh/details-source.vue)

</template>

<template #style>

@[code{61-76}](../../.vuepress/components/table-zh/details-source.vue)

</template>

</card>

<card>

## 拖动调整列宽

开启 `resize-config` 后可拖动表头边缘。右侧固定列从左边缘调整；列的 `minWidth`（数字或 px）与全局 `minWidth` 共同约束拖动，`resizable: false` 可禁用指定列。键盘左右键调整，Shift 加速，Home 到最小宽度，Escape 取消拖动。

`v-model:column-widths` 用于外部受控与恢复；未传时组件在内部保留结果，不修改原始 columns 或行数据。改变原始列 width 会清除该列的内部调整。拖动过程中预览宽度，松开后才提交事件；父级未接受受控更新时恢复原值。

调整列宽后，固定列位置和动态行高会自动更新。修改行内容后如需重新计算高度，可调用 `measure()`。

勾选“百万行生成数据”可体验大数据下的列宽调整。使用 `virtualSource` 时，排序、筛选和数据请求由应用处理。

<template #example>
<table-zh-resize />
</template>

<template #template>

@[code{91-125}](../../.vuepress/components/table-zh/resize.vue)

</template>

<template #script>

@[code{1-89}](../../.vuepress/components/table-zh/resize.vue)

</template>

<template #style>

@[code{127-140}](../../.vuepress/components/table-zh/resize.vue)

</template>

</card>

<card>

## 列设置

开启 `column-manager-config`，用户可以显示或隐藏列、用上下按钮调整顺序、设置左右固定，以及恢复默认。固定列始终位于对应边缘，顺序调整决定同一区域内的排列。隐藏列不会清除已有的排序、筛选或行选择。

`v-model:column-state` 接收 `TableColumnState[]`；不传时由组件管理。每项用 `key` 标识列，依次取列的 `key`、`field` 或 `@索引`。建议为需要保存设置的列提供稳定且唯一的键。使用 `virtualSource` 时以原始列索引字符串标识。

`hidden` 控制隐藏，`fixed` 为 `false`、`left` 或 `right`，`order` 是包含隐藏列的从 0 开始的位置。未指定的设置沿用列定义；未知列键会被忽略。恢复默认会清空列设置，列宽仍由 `column-widths` 独立管理。

面板支持键盘操作；PageUp / PageDown 翻动列列表，Escape 关闭并返回触发按钮。

<template #example><table-zh-column-manager /></template>

<template #template>

@[code{76-106}](../../.vuepress/components/table-zh/column-manager.vue)

</template>

<template #script>

@[code{1-74}](../../.vuepress/components/table-zh/column-manager.vue)

</template>

<template #style>

@[code{108-121}](../../.vuepress/components/table-zh/column-manager.vue)

</template>

</card>

<card>

## 记住列设置

给 `column-manager-config.storageKey` 设置唯一的业务键，可将列设置保存在当前浏览器的 localStorage 中。未设置键时不会读写存储；不同表格或用户应使用不同的键。

非受控模式会在挂载时恢复已保存的设置。受控模式以父组件的 `column-state` 为准，只保存已接受的状态，初始恢复由应用负责。恢复默认后保存空设置。存储不可用或容量不足时，可监听 `column-storage-error` 处理错误。

<template #example><table-zh-column-persistence /></template>

<template #template>

@[code{8-17}](../../.vuepress/components/table-zh/column-persistence.vue)

</template>

<template #script>

@[code{1-6}](../../.vuepress/components/table-zh/column-persistence.vue)

</template>

</card>

<card>

## 多级表头

在列配置的 `children` 中嵌套子列。组标题自动跨越相邻的可见叶子列，较浅的叶子表头跨行显示；排序、筛选与列宽调整配置在叶子列上。组的 `fixed` 会向下继承，子列可用 `fixed: false` 解除固定。

通过列设置隐藏、重排或固定叶子列后，同组中不再相邻的列会显示为独立标题段。分组只影响表头，数据仍按叶子列的 `field`、插槽或渲染器展示。

<template #example><table-zh-grouped-headers /></template>

<template #template>

@[code{47-65}](../../.vuepress/components/table-zh/grouped-headers.vue)

</template>

<template #script>

@[code{1-45}](../../.vuepress/components/table-zh/grouped-headers.vue)

</template>

<template #style>

@[code{67-74}](../../.vuepress/components/table-zh/grouped-headers.vue)

</template>

</card>

<card>

## 声明式分组表头

在 `STableColumn` 的 `#columns` 插槽中嵌套列定义；`#default` 继续用于叶子单元格，`#header` 自定义组标题。也可以直接传入 `children` 数组。

<template #example><table-zh-grouped-declarations /></template>

<template #template>

@[code{8-28}](../../.vuepress/components/table-zh/grouped-declarations.vue)

</template>

<template #script>

@[code{1-6}](../../.vuepress/components/table-zh/grouped-declarations.vue)

</template>

</card>

<card>

## 按需生成分组表头

使用 `virtualSource.headerPath(index)` 返回叶子列从外到内的祖先分组，每层提供稳定 `key` 与 `title`。`headerDepth` 指定包含叶子层在内的总层数，避免因窗口中的叶子层级不同而增减表头行数；超出该层数的祖先会被截断。回调只读取当前列窗口和固定列。

下面按需提供 100 万行、10 万列；可以定位末端、调整列宽或打开列设置。生成数据的排序和筛选由应用处理。

<template #example><table-zh-grouped-source /></template>

<template #template>

@[code{37-53}](../../.vuepress/components/table-zh/grouped-source.vue)

</template>

<template #script>

@[code{1-35}](../../.vuepress/components/table-zh/grouped-source.vue)

</template>

<template #style>

@[code{55-62}](../../.vuepress/components/table-zh/grouped-source.vue)

</template>

</card>

<card>

## 表尾数据行

使用 `footer-data` 提供一行或多行表尾记录，字段对应叶子列的 `field`。表尾与正文共享列宽、固定位置及横向滚动，也会跟随列设置的显隐和顺序变化。`footer-row-key` 可指定稳定行键。

表尾数据由应用计算或从服务端获取，不参与正文排序、筛选或分页。下面的合计和平均值覆盖传入的全部订单；如果需要当前页或筛选结果的汇总，请按对应范围更新 `footer-data`。

渲染优先级：指定列表尾插槽、通用 `footer-cell` 插槽、列 `footer`、命名或内联渲染器的 `footer`、`footerFormatter`、原始字段值。表尾不会复用正文渲染函数，也不会生成复选、序号或树展开控件。`footerAlign` 与 `showFooterOverflow` 可单独配置。

<template #example><table-zh-footer-data /></template>

<template #template>

@[code{76-98}](../../.vuepress/components/table-zh/footer-data.vue)

</template>

<template #script>

@[code{1-74}](../../.vuepress/components/table-zh/footer-data.vue)

</template>

<template #style>

@[code{100-107}](../../.vuepress/components/table-zh/footer-data.vue)

</template>

</card>

<card>

## 声明式表尾与底部插槽

在 `STableColumn` 上使用 `#footer` 自定义表尾单元格，`#default` 继续处理正文。表格本身的 `#footer` 插槽用于底部工具栏或说明；它与列对齐的表尾数据行可以同时存在。

<template #example><table-zh-footer-declarations /></template>

<template #template>

@[code{11-33}](../../.vuepress/components/table-zh/footer-declarations.vue)

</template>

<template #script>

@[code{1-9}](../../.vuepress/components/table-zh/footer-declarations.vue)

</template>

</card>

<card>

## 虚拟列与表尾

表尾只渲染当前横向窗口与固定列。横向切换窗口时保留当前布局下已测得的最大表尾行高；列宽、容器宽度、列设置或表尾数据变化会重新测量。自定义内容缩短后，也可调用 `measure()` 重新计算。

此例按公式计算 100 万行、10 万列的合计与平均值，不遍历生成数据。可以定位末端、调整列宽，并切换为空正文，检查表尾的横向滚动。实际业务可直接传入服务端汇总结果。

<template #example><table-zh-footer-source /></template>

<template #template>

@[code{47-66}](../../.vuepress/components/table-zh/footer-source.vue)

</template>

<template #script>

@[code{1-45}](../../.vuepress/components/table-zh/footer-source.vue)

</template>

<template #style>

@[code{68-75}](../../.vuepress/components/table-zh/footer-source.vue)

</template>

</card>

<card>

## Grid 式配置

通过 `data` 提供行数据，`columns` 定义列的字段、标题和显示方式。也可以将表格属性放入一个对象，通过 `v-bind` 统一传入。

`width` 指定固定列宽；未设置 `width` 的列以 `minWidth`（默认 120px）为基础，均分剩余空间。容器宽度不足时，可横向滚动查看其余列。

<template #example><table-zh-default /></template>

<template #template>

@[code{34-36}](../../.vuepress/components/table-zh/default.vue)

</template>

<template #script>

@[code{1-32}](../../.vuepress/components/table-zh/default.vue)

</template>

</card>

<card>

## 声明式列

需要在模板中直观看到列结构时，使用 `s-table-column`。列可以直接持有作用域插槽，而所有行仍由 `data` 提供。

<template #example><table-zh-columns /></template>

<template #template>

@[code{17-30}](../../.vuepress/components/table-zh/columns.vue)

</template>

<template #script>

@[code{1-15}](../../.vuepress/components/table-zh/columns.vue)

</template>

</card>

<card>

## 插槽与渲染器

配置列可通过 `slots.default` 映射具名插槽，也可通过名称引用复用渲染器。渲染优先级为：映射插槽或列键插槽、通用单元格插槽、内联或具名渲染器、字段原始值。

<template #example><table-zh-rendering /></template>

<template #template>

@[code{36-45}](../../.vuepress/components/table-zh/rendering.vue)

</template>

<template #script>

@[code{1-34}](../../.vuepress/components/table-zh/rendering.vue)

</template>

<template #style>

@[code{47-60}](../../.vuepress/components/table-zh/rendering.vue)

</template>

</card>

<card>

## 行选择

通过 `v-model:highlight` 绑定当前高亮行；模型需要数组时添加 `multiple`。

<template #example><table-zh-selection /></template>

<template #template>

@[code{24-35}](../../.vuepress/components/table-zh/selection.vue)

</template>

<template #script>

@[code{1-22}](../../.vuepress/components/table-zh/selection.vue)

</template>

</card>

<card>

## 排序与多字段排序

列设置 `sortable` 后显示独立的升序（上三角）和降序（下三角）按钮，再次点击已选方向取消该列排序。`sort-config.multiple` 保留多列优先级，仅在至少两列参与排序时显示优先级数字，取消至只剩一列时自动隐藏。`v-model:sort-by` 控制排序状态；不会修改源数组，null / undefined 始终排在末尾。

<template #example><table-zh-sorting /></template>

<template #template>

@[code{24-40}](../../.vuepress/components/table-zh/sorting.vue)

</template>

<template #script>

@[code{1-22}](../../.vuepress/components/table-zh/sorting.vue)

</template>

<template #style>

@[code{42-54}](../../.vuepress/components/table-zh/sorting.vue)

</template>

</card>

<card>

## 列级排序规则

每列通过 `sortMethod` 独立指定规则：`'number'` 将数字及数字字符串按数值排序，`'string'` 按字符串字典序比较。不设置时保留自动自然排序，例如“任务 2”排在“任务 10”前。

函数接收 `(a, b, rowA, rowB)`，前两项为字段值，后两项为原始行对象。升序时 a 应排在 b 后面就返回 `true` / `1`，否则返回 `false` / `0`。表格会反向比较一次，以区分“排在前面”和“相等”，因此函数需保持纯函数且比较规则一致。也支持 `(a, b) => Number(a) - Number(b)` 这类返回负数 / 零 / 正数的标准比较器。降序自动反转；相等时保留原始顺序，或交给下一排序字段判断。

null 和 undefined 始终放在最后；数字模式还将空白字符串、无效数字和非有限值视为空值。远程排序及按索引生成的虚拟数据源只发出排序状态，不执行这些本地比较函数。

<template #example><table-zh-sort-methods /></template>

<template #template>

@[code{31-42}](../../.vuepress/components/table-zh/sort-methods.vue)

</template>

<template #script>

@[code{1-29}](../../.vuepress/components/table-zh/sort-methods.vue)

</template>

<template #style>

@[code{44-52}](../../.vuepress/components/table-zh/sort-methods.vue)

</template>

</card>

<card>

## 筛选与自定义筛选

不同列之间取交集，同列可多选或通过 `filter-multiple=false` 限制为单选。修改面板中的选项后点击确认才会生效；关闭面板会舍弃草稿。自定义筛选插槽只负责 UI，匹配逻辑放在 `filterMethod` 中。

<template #example><table-zh-filtering /></template>

<template #template>

@[code{43-59}](../../.vuepress/components/table-zh/filtering.vue)

</template>

<template #script>

@[code{1-41}](../../.vuepress/components/table-zh/filtering.vue)

</template>

<template #style>

@[code{61-68}](../../.vuepress/components/table-zh/filtering.vue)

</template>

</card>

<card>

## 选择列与跨页保留

`type="checkbox"` 自动使用数组模型，`type="radio"` 使用单行模型。默认仅点击选择控件切换，`selection-config.trigger="row"` 可启用整行选择。全选只作用于当前页筛选后、展开的可选行，不受虚拟窗口限制。`checkMethod` 禁选，`reserve` 保留其他页的选择，需提供稳定唯一的 `row-key`。树节点独立选择，不自动级联。

通过 `v-model:pager-config` 配置表格内置分页器，无需自行切分数据。默认不分页；传 `true` 时默认第 1 页、每页 10 条。可配置 `currentPage`、`pageSize`、`pageSizes`、`layout`、`pagerCount`、`hideOnSinglePage`、`disabled` 和 `shape`。本地数据先排序、筛选，再分页；查询变化回到第一页，每页条数变化也回到第一页。树形表格按根节点分页，展开的子节点跟随所属根节点；分页后的当前页仍可启用双轴虚拟滚动。

<template #example><table-zh-selection-columns /></template>

<template #template>

@[code{33-61}](../../.vuepress/components/table-zh/selection-columns.vue)

</template>

<template #script>

@[code{1-31}](../../.vuepress/components/table-zh/selection-columns.vue)

</template>

<template #style>

@[code{63-76}](../../.vuepress/components/table-zh/selection-columns.vue)

</template>

</card>

<card>

## 文本溢出与提示

`show-overflow` 可选择自动换行（false）、仅省略（ellipsis）、原生提示（title）或浮动提示（tooltip / true）。只有内容溢出才显示提示，鼠标悬停和键盘聚焦均可触发；表头支持独立的 `show-header-overflow`，列配置优先于表格配置。

<template #example><table-zh-overflow /></template>

<template #template>

@[code{30-51}](../../.vuepress/components/table-zh/overflow.vue)

</template>

<template #script>

@[code{1-28}](../../.vuepress/components/table-zh/overflow.vue)

</template>

<template #style>

@[code{53-63}](../../.vuepress/components/table-zh/overflow.vue)

</template>

</card>

<card>

## 普通固定列与滚动定位

左右固定列不依赖虚拟滚动。中间内容超出时横向滚动，固定列保留连续背景。下面通过 `scrollToColumn` 定位中间列，`scrollToRow` 定位行。

<template #example><table-zh-fixed-columns /></template>

<template #template>

@[code{24-54}](../../.vuepress/components/table-zh/fixed-columns.vue)

</template>

<template #script>

@[code{1-22}](../../.vuepress/components/table-zh/fixed-columns.vue)

</template>

<template #style>

@[code{56-66}](../../.vuepress/components/table-zh/fixed-columns.vue)

</template>

</card>

<card>

## 加载、空态与表格插槽

通过 `header`、`footer` 和 `empty` 插槽自定义表格周边内容。使用 `loading` 显示加载状态，`show-header` 控制表头显隐，`row-class` 自定义行样式；列的 `field` 支持嵌套字段路径。

<template #example><table-zh-states /></template>

<template #template>

@[code{20-52}](../../.vuepress/components/table-zh/states.vue)

</template>

<template #script>

@[code{1-18}](../../.vuepress/components/table-zh/states.vue)

</template>

<template #style>

@[code{54-82}](../../.vuepress/components/table-zh/states.vue)

</template>

</card>

<card>

## 远程排序与筛选

分别在 `sort-config`、`filter-config` 和 `pager-config` 中设置 `remote: true`，表格只维护查询与分页状态，不重复处理服务端返回的当前页数据。分页配置中的 `total` 传服务端返回的总条数；可监听 `page-change` 请求数据，或像本例一样监听受控页码和每页条数。远程排序、筛选变化时，由业务将页码重置为 1。

此处用延迟函数模拟服务端排序、筛选和分页，实际业务替换为请求即可；新查询会取消旧定时器，避免旧结果覆盖新结果。`virtualSource` 不会为了排序或筛选遍历生成全部数据；启用本地分页时只按页范围读取行。

<template #example><table-zh-remote-query /></template>

<template #template>

@[code{68-80}](../../.vuepress/components/table-zh/remote-query.vue)

</template>

<template #script>

@[code{1-66}](../../.vuepress/components/table-zh/remote-query.vue)

</template>

</card>

<card>

## 树形排序与筛选

树形排序只调整同级节点，父子关系保持不变。筛选保留匹配节点及其祖先，并临时展开匹配路径；清除筛选后恢复原来的展开状态。懒加载节点只筛选已经加载的数据，不自动发起请求。

<template #example><table-zh-tree-query /></template>

<template #template>

@[code{37-59}](../../.vuepress/components/table-zh/tree-query.vue)

</template>

<template #script>

@[code{1-35}](../../.vuepress/components/table-zh/tree-query.vue)

</template>

<template #style>

@[code{61-71}](../../.vuepress/components/table-zh/tree-query.vue)

</template>

</card>

<card>

## 树形表格与懒加载

树形数据直接由 `s-table` 处理。在一个配置列上设置 `treeNode`，再通过 `tree-config` 提供子节点或懒加载函数。

<template #example><table-zh-tree /></template>

<template #template>

@[code{58-74}](../../.vuepress/components/table-zh/tree.vue)

</template>

<template #script>

@[code{1-56}](../../.vuepress/components/table-zh/tree.vue)

</template>

<template #style>

@[code{76-95}](../../.vuepress/components/table-zh/tree.vue)

</template>

</card>

<card>

## 虚拟滚动与动态行高

设置 `virtual-config` 可开启虚拟滚动，`height` 指定可视区域高度。开启 `dynamic` 后会根据内容测量行高；`horizontal` 开启横向列虚拟化，`columnOverscan` 控制左右额外渲染的列数。列设置 `fixed="left"` 或 `fixed="right"` 可固定在相应边缘。

数据会重排、更新或包含树节点时，建议提供稳定唯一的 `row-key`。横向滚动时，行高会保留已显示内容的最大高度，以减少上下跳动；调整列宽后会重新测量。

对于按需加载的数据，可通过 `virtualSource` 提供行数、列数及索引回调。下方示例支持加载大数据、跳转到中部或末尾，以及双向滚动。实际数据规模应结合设备内存、行高和单元格复杂度选择；服务端数据可配合远程分页使用。

<template #example><table-zh-virtual /></template>

<template #template>

@[code{173-225}](../../.vuepress/components/table-zh/virtual.vue)

</template>

<template #script>

@[code{1-171}](../../.vuepress/components/table-zh/virtual.vue)

</template>

<template #style>

@[code{227-304}](../../.vuepress/components/table-zh/virtual.vue)

</template>

</card>
