# Table 方法选项与 API 验收（2026-09-05）

基线为 `8276bcb`。本轮承接 API 名称/默认值、动态插槽和方法行参数验收，核对剩余方法选项，完成 TableSelect 独立签名检查。此项验收只关闭 API 文档清单，不替代尚未完成的所有功能组合及浏览器示例总验收。

## TableSelect 实例合同

新增导出的 `TableSelectExposes`，列出 open、close、toggleRowExpand、setExpandedKeys、scrollToRow、measure 六个方法；组件 defineExpose 用 satisfies 验证实现。保留现有 InstanceType 并组合该接口，没有改变方法运行时行为。

弹层的内部 Table 尚未挂载时，两个异步转发方法返回 undefined，其他转发方法安全忽略。挂载后的展开与 measure 返回 Promise；open/close 仍是请求状态变更，受控模式由调用方同步。单测覆盖挂载前调用、打开后树展开/收起、按字符串行键与 center 对齐滚动、等待 measure、关闭。

Table、Grid、TableSelect 每种语言的 73 + 9 + 6 个方法均逐项比较签名、名称和文档条目。负向测试也覆盖 TableSelect 的错误参数类型、错误可选性和错误返回值。

## 方法分组核对

下表覆盖 73 个 Table 方法；每组同时对照 `table.ts` 的公开签名、`table.vue` 的转发目标、对应实现和双语 EXPOSES 条目。未把名称匹配当作运行时语义验证。

| 分组 | 方法 | 实现与验证依据（packages/components/table 下） |
| --- | --- | --- |
| 图表 5 | getChartData, openChart, closeChart, cancelChart, getChartState | use-table-chart / table-chart-scope；table-chart、table-chart-scope、table-chart-data 测试 |
| 查找 10 | openFind, closeFind, findCells, findNext, findPrevious, replaceMatch, replaceAll, getFindState, clearFind, cancelFind | use-table-find / table-find-scope / table-find-panel；table-find、table-find-data 测试 |
| 剪贴板 4 | copyCells, cutCells, pasteCells, cancelClipboard | use-table-clipboard / clipboard-data；table-clipboard、table-clipboard-data 测试 |
| 区域 4 | setCellRange, clearCellRange, getCellRange, getCellRangeBounds | use-table-cell-range；table-cell-range-model、table-cell-range-state、table-range-integration 测试，固定列/合并区域使用视觉坐标 |
| 分组 4 | setGroupExpandedKeys, toggleGroup, getGroups, getGroupSummary | use-table-groups；分组受控拒绝、生成源范围和统计测试 |
| 菜单 1 | closeContextMenu | use-table-context-menu；table-context-menu 测试，关闭时有条件恢复焦点 |
| 活动格 3 | setActiveCell, clearActiveCell, getActiveCell | use-table-keyboard / table.vue；table-keyboard、table-focus-settlement 测试 |
| 行移动 2 | moveRow, cancelRowDrag | use-table-row-reorder / use-table-row-drag；table-row-drag 测试，当前展开页索引及 before 默认位置 |
| 历史 4 | undo, redo, clearHistory, getHistoryState | use-table-changes；table-history、table-history-api 测试，活动草稿及拒绝/取消 |
| 变更 8 | insertRows, removeRows, updateRow, revertChanges, getChangeRecords, acceptChanges, resetChanges, cancelDataChange | use-table-changes / change-data / change-store；table-change-api、table-changes、table-change-data 测试，源同级位置、稳定键、版本和快照 |
| 校验 7 | validate, validateRow, validateCell, clearValidation, cancelValidation, getValidationErrors, scrollToValidationError | use-table-validation-api / use-table-data-scope / use-table-validation；table-validation、table-validation-integration 测试 |
| 编辑 4 | startEdit, commitEdit, cancelEdit, getEditRecord | use-table-edit / use-table-edit-lifecycle；编辑与生命周期测试，原始对象身份及生成源索引已在前轮修复 |
| 详情 3 | toggleRowDetail, setDetailExpandedKeys, reloadRowDetail | use-table-details / table.vue；table-details 测试，受控键、重载、取消与未展开面板 |
| 树展开 2 | toggleRowExpand, setExpandedKeys | use-table-tree；table.test、table-grouped-header、table-edit-lifecycle 测试 |
| 定位测量 3 | scrollToRow, scrollToColumn, measure | table.vue / use-table-column-virtualization；table.test、table-column-manager、table-footer 测试 |
| 查询状态 4 | setSort, clearSort, setFilters, clearFilters | use-table-query；table-features 测试，受控更新、排序规范化及筛选副本 |
| 选择 5 | getSelectedRows, setSelectedRows, clearSelection, toggleRowSelection, selectAll | use-table-selection；table-features、table-pagination 测试；数组/单选、禁选行和巨量源不全选 |

Grid 的 query/resetQuery/refresh/getQueryContext 由 use-grid-query 管理；getTable/getForm 返回已挂载实例；commitProxy/cancelProxy/getProxyState 由 use-grid-proxy 管理。核对其表单校验、条件快照、重置页码、受控接受、取消和保存版本；`table-grid.test.ts`、`grid-proxy.test.ts` 覆盖对应行为。commitProxy 的 rows 仅对 delete 生效，省略读取当前选择，[] 表示无删除目标；save 始终使用跟踪的变更集合。中英文 API 已说明。

## 选项字段核对

| 选项 | 对照实现后的规则 |
| --- | --- |
| TableValidateOptions | scope 默认 all；rows 的普通数字是当前展开页索引，普通对象接受原始/代理身份并与 view 范围相交；生成源仅接受绝对数字索引，显式 rows 覆盖 scope。rowKeys 继续收窄目标，生成源还必须给 rows。columns 默认包含配置的隐藏列，数字为已解析可见列索引；生成源用绝对数字列索引。signal 取消本次校验；scrollToError/maxErrors 优先方法配置，再取组件配置，默认 true/100。有限错误上限向下取整且至少为 1。空目标不会生成错误，checked 表示实际校验数。 |
| TableFindQuery / TableFindOptions | text 按字面文本匹配，caseSensitive/wholeCell 默认关闭。scope 优先方法选项、findConfig、view；bounds 为当前视图半开区间且 data 不接受它。columns 允许可见列键或已解析数字索引，生成列索引为源索引；[] 不搜索任何列。signal 取消该次查找。 |
| TableFindNavigateOptions / TableReplaceOptions | focus 默认 true，false 保留输入焦点；导航和替换各自接收 signal。index 仅用于 replaceMatch，默认活动匹配且从 0 开始；replaceAll 忽略 index，并要求完整搜索。替换仍受可写条件、校验和数据所有者接受约束。 |
| TableClipboardOptions / TableCopyOptions | bounds 使用半开视觉行列坐标，不含组标题/详情，默认选区再回退到活动格。单格粘贴扩展为数据尺寸，多格目标必须是输入矩形的整倍数。signal 取消处理但无法撤销已完成的系统剪贴板写入。writeClipboard 默认 true，false 只跳过系统写入，cut 仍会准备并清空可写源字段。 |
| TableChartOptions / TableChartRequest / TableChartSeriesMapping | scope、非空 series 必填。selection 使用选区或显式 bounds；filtered 不接受 bounds；aggregate 不接受 bounds/category。普通列用可见 key 或已解析索引，生成源用绝对索引或十进制索引字符串；聚合序列必须用聚合字符串键。category 默认选区/视图第一视觉列。aggregate 默认 groups，groupKeys 可选嵌套组但不可用于 summary；summaryLabel 默认 Total。type 默认 bar，title 默认空字符串，signal 取消取数。series.name 默认列标题/字段或聚合键。 |
| TableDataPosition / 行键数组 | index 为源同级位置，省略插入位置时追加到末尾；parentKey 指定已提供的父节点，生成源不接受树父节点。beforeKey/afterKey 为位置锚点，普通数据优先有效 beforeKey 再 afterKey，再回退 index。删除/还原/确认按稳定行键；acceptChanges 另要求版本匹配。 |
| TableCellRange / TableSort / TableFilters | 选区端点为稳定 rowKey/columnKey，方向独立于半开 bounds；排序项按 field/order 规范化，筛选按字段值数组拷贝；对应受控状态通过模型更新交给调用方接受。 |

以上规则在相关公开类型的字段注释中补全，关键行为同步到中英文 API 描述；类型详情从同一源码提取。新增说明没有引入新的选项或改变默认行为。

## 最终验证

- 组件与文档回归：68 个文件、636 项通过。包含默认值、API 名称/类型、错误签名反例和完整示例源码测试。
- Web、Vitest、Play 三项类型检查通过，TableSelect 的真实 defineExpose 与独立接口由编译器校验。
- `normalize:doc-examples`：144 页，0 修改、0 跳过；本轮没有修改示例 SFC 或 include 范围。
- `audit:table-api`：双语共 176 个方法签名检查，无差异；六页浏览器条目、锚点、用法链接和类型详情通过。
- `node scripts/audit-table-select-methods.mjs` 在中英文页面使用真实 SPopper / Table 检查六个方法：未挂载时安全忽略，打开后 3 行，收起后 1 行，再展开恢复 3 行；展开与 measure 返回 Promise，滚动接受 docs 行键和 center，关闭后面板隐藏。结果见 `table-select-methods-browser.json`。初次一次性脚本用了错误的弹层 class，纠正为源码实际的 panel class 后通过；没有修改组件来迁就测试。

API 验收与既有 `table-api-audit.md`、`table-slot-audit.md`、`table-method-contract-audit.md`、`table-opt-in-audit.md` 合并使用；所有功能的组合测试和完整示例浏览器总验收仍在 todos.md 独立跟踪。
