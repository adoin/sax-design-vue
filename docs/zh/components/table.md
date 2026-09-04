---
description: '支持排序、筛选、分页、树形数据与虚拟滚动的数据表格。'
PROPS:
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
  - name: row
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
  - name: resizable
    type: Boolean
    description: "设为 false 禁止调整此列；需先开启 resize-config。"
    default: null
    usage: '#拖动调整列宽'
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
  - name: update:row
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

通过 `v-model:row` 绑定当前选中行；模型需要数组时添加 `multiple`。

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
