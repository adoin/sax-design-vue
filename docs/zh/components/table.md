---
description: '通过数据和列配置渲染结构化表格，不再逐个手写表格单元格。'
PROPS:
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
  - name: model-value
    type: TableRow | TableRow[] | null
    description: 当前选中的行或行数组。
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
    description: 按索引即时生成扁平行与列，用于极端双轴数据量且不分配完整矩阵。
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
  - name: type
    type: String
    values: seq | checkbox | radio
    description: 生成序号、复选或单选列；选择列使用内置控件。
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
    description: 将列固定在左侧或右侧；true 等价于 left。
    default: 'false'
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
  - name: update:modelValue
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

## Grid 式配置

业务表格应把列和行都放在数据中。通过 `v-bind` 传入一个配置对象即可完成渲染，不涉及任何 `tr`、`th` 或 `td` 组件。

列宽采用 VXE 风格的分配规则：`width` 固定占位；无 `width` 的列以 `minWidth`（未设置时为 120px）作为基础宽度，满足基础宽度后共同均分剩余空间。下方示例同时包含默认宽度列和 `minWidth` 列；空间不足时表格保持最小总宽度并横向滚动。

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

通过 `v-model` 绑定当前选中行；模型需要数组时添加 `multiple`。

<template #example><table-zh-selection /></template>

<template #template>

@[code{24-30}](../../.vuepress/components/table-zh/selection.vue)

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

`show-overflow` 可选择自动换行（false）、仅省略（ellipsis）、原生提示（title）或通用弹层（tooltip / true）。只有内容确实溢出才显示提示，鼠标悬停和键盘聚焦均可触发；表头支持独立的 `show-header-overflow`，列配置优先于表格配置。整张表复用同一份 Tooltip。

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

表头、表尾与空态插槽可以独立组合。此示例同时演示 `loading`、`show-header`、嵌套字段路径以及 `row-class`，交互控制均使用组件库已有控件。

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

大数据可通过 `virtual-config` 同时开启双轴虚拟滚动：Y 轴虚拟行支持 `dynamic` 动态行高测量；`horizontal` 开启 X 轴像素列虚拟化，`columnOverscan` 控制左右预渲染列数。列设置 `fixed="left"` 或 `fixed="right"` 后会固定在相应边缘，中间列独立滚动。树形行会先展平再虚拟化，并使用内部 Map 索引稳定行键、展开状态和滚动定位。横向虚拟化的动态行会按稳定 row key 保存所有已访问列窗口中的最大行高，因此回到更矮的列窗口时不会再次收缩，也不会让可见行数回弹；缺少业务行键时也只在 WeakMap 中生成内部身份，不会给原始行对象添加字段。

下方同一示例内提供“巨量数据”测试，按需生成行列，不创建完整单元格矩阵；只渲染可见区域和相邻预渲染区域，保留左右固定列、多行内容及最大行高缓存。点击启动后，可通过中部、末尾跳转及双向滚动检查定位与对齐，停止测试会卸载巨量表格。

**极限说明（不是可用行数承诺）：** V8 公开实现记录中的单个 Map 容量上限参考为 `2^24 = 16,777,216` 个键，约 1,677 万；它不是跨浏览器的 JavaScript 规范保证，具体取决于引擎版本与构建。参见 [V8 容量说明](https://groups.google.com/g/v8-reviews/c/7hZljfgPZN8)。

普通 `data` 模式会建立全量行索引；`virtualSource` 的高度 Map 只缓存已测量行，但增量高度索引仍占用随行数增长的内存。当前 Y 轴使用实际总像素高度，还受浏览器滚动高度限制。因此行数极限不能只按 Map 容量计算，内存、实际行高和单元格复杂度可能更早成为瓶颈；此演示不是浏览器或组件的极限认证。

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
