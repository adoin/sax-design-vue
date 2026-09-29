---
PROPS:
  - name: checked-strategy
    type: TableSelectCheckedStrategy
    values: "leaf | all | parent"
    default: leaf
    description: 树形联动时控制输出键和标签：leaf 仅可选叶子、all 全部选中节点、parent 合并为已全选父节点。check-strictly 或普通数据不受此策略影响。
    usage: '#tree-multiple-selection'
  - name: multiple
    type: Boolean
    default: false
    description: 启用多选，v-model 为行键数组。
    usage: '#tree-multiple-selection'
  - name: check-strictly
    type: Boolean
    default: false
    description: 树形多选时父子独立选择；默认联动已加载的可选后代，并显示半选。
    usage: '#tree-multiple-selection'
  - name: max-collapse-tags
    type: Number
    default: 2
    description: 触发器最多展示的已选标签数，其余显示 +N。
    usage: '#tree-multiple-selection'
  - name: size
    type: ComponentSize
    values: "small | default | large"
    description: 触发器、弹层 Table 和注册渲染器继承的尺寸。
    default: null
  - name: "empty-text"
    type: "String"
    description: "表格没有数据时显示的文本，省略时使用当前语言的默认文案。"
    default: null
    usage: "#tree-single-selection"
  - name: "placeholder"
    type: "String"
    description: "未选择行时的占位文本，省略时使用当前语言的默认文案。"
    default: null
    usage: "#tree-single-selection"
  - name: "disabled"
    type: "Boolean"
    description: "禁用触发器交互，并关闭已打开的弹层。"
    default: false
    values: "true | false"
    usage: "#tree-single-selection"
  - name: model-value
    type: TableSelectValue
    values: "行键值"
    description: 通过 row-key 解析的已选行键；多选时为行键数组。
    default: null
  - name: v-model
    type: TableSelectValue
    values: "行键值"
    description: 通过 row-key 解析的已选行键；多选时为行键数组。
    default: null
  - name: data
    type: "TableRow[]"
    values: ""
    description: "传入 STable 的行数据，子节点按 tree-config 解析。"
    default: "[]"
    usage: "#tree-single-selection"
  - name: columns
    type: "TableColumn[]"
    values: ""
    description: "转发给 STable 的列配置。"
    default: "[]"
    usage: "#tree-single-selection"
  - name: row-key
    type: "TableRowKeyGetter"
    values: ""
    description: "稳定行键字段或取值函数，选中行的键作为模型值。"
    default: "id"
    usage: "#tree-single-selection"
  - name: label-key
    type: "String"
    values: ""
    description: "触发器标签的字段路径，字段缺失时显示选中的键。"
    default: "label"
    usage: "#tree-single-selection"
  - name: label-formatter
    type: "TableSelectLabelFormatter"
    values: ""
    description: "格式化选中行标签，优先于 label-key。"
    default: null
    usage: "#custom-rendering"
  - name: tree-config
    type: "TableTreeConfig"
    values: ""
    description: "通过 STable 配置子节点、缩进、展开及懒加载。"
    default: null
    usage: "#tree-single-selection"
  - name: expanded-keys
    type: "TableRowKey[]"
    values: ""
    description: "受控的树节点展开键，通过 v-model:expanded-keys 绑定。"
    default: null
    usage: "#tree-single-selection"
  - name: virtual-config
    type: Boolean | TableVirtualConfig
    values: "true / false / '{ height, estimateSize, overscan, dynamic }'"
    description: 为大规模普通数据或树形数据开启 STable 行虚拟化。
    default: 'false'
  - name: renderers
    type: "Record<string, TableRenderer | TableCellRenderer>"
    values: ""
    description: "转发给 STable 的具名单元格与表头渲染器。"
    default: "{}"
    usage: "#custom-rendering"
  - name: row-class
    type: "TableRowClass"
    values: ""
    description: "自定义行类名，函数接收扁平化行上下文。"
    default: ""
    usage: "#tree-single-selection"
  - name: selectable
    type: "TableSelectSelectable"
    values: ""
    description: "返回 false 禁止选中该行；disabled 为真的行始终不可选。"
    default: null
    usage: "#tree-single-selection"
  - name: show-header
    type: "Boolean"
    values: "true | false"
    description: "显示表格列标题。"
    default: true
    usage: "#tree-single-selection"
  - name: striped
    type: "Boolean"
    values: "true | false"
    description: "使用交替行背景。"
    default: false
    usage: "#tree-single-selection"
  - name: table-loading
    type: "Boolean"
    values: "true | false"
    description: "显示内部表格的加载状态。"
    default: false
    usage: "#tree-single-selection"
  - name: close-on-select
    type: "Boolean"
    values: "true | false"
    description: "选中后是否关闭；省略时单选关闭，多选保持打开。"
    default: null
    usage: "#tree-single-selection"
  - name: clearable
    type: "Boolean"
    values: "true | false"
    description: "为选中值显示清除操作。"
    default: false
    usage: "#tree-single-selection"
  - name: loading
    type: "Boolean"
    values: "true | false"
    description: 在尾部显示统一加载图标，保留当前值并禁用编辑、清除和弹层操作。
    default: false
    usage: '#loading'
  - name: block
    type: "Boolean"
    values: "true | false"
    description: "触发器占满可用宽度。"
    default: false
    usage: "#tree-single-selection"
  - name: shape
    type: String
    values: "rounded | square"
    description: 为选择器触发器与弹层表面统一设置圆角或方形外观。
    default: rounded
    usage: '#shape'
  - name: color
    type: "Color"
    values: ""
    description: "触发器与弹层的主视觉颜色。"
    default: "primary"
    usage: "#tree-single-selection"
  - name: state
    type: "Color"
    values: ""
    description: "状态颜色，提供时优先于 color。"
    default: null
    usage: "#tree-single-selection"
  - name: prefix-icon
    type: "String"
    values: ""
    description: "前缀图标名，优先于 prefix-config.icon。"
    default: null
    usage: "#custom-rendering"
  - name: suffix-icon
    type: "String"
    values: ""
    description: "后缀装饰图标，不移除下拉箭头。"
    default: null
    usage: "#custom-rendering"
  - name: prefix-config
    type: "TableSelectAffixConfig"
    values: ""
    description: "前缀图标与文本，prefix 插槽优先。"
    default: null
    usage: "#custom-rendering"
  - name: suffix-config
    type: "TableSelectAffixConfig"
    values: ""
    description: "后缀图标与文本，suffix 插槽优先。"
    default: null
    usage: "#custom-rendering"
  - name: open
    type: "Boolean"
    values: "true | false"
    description: "受控弹层可见性，通过 v-model:open 绑定。"
    default: null
    usage: "#tree-single-selection"
  - name: default-open
    type: "Boolean"
    values: "true | false"
    description: "open 非受控时的初始弹层可见性。"
    default: false
    usage: "#tree-single-selection"
  - name: popup-config
    type: "TableSelectPopupConfig"
    values: ""
    description: "弹层尺寸、位置和挂载目标；其中配置的字段优先于对应顶层属性。"
    default: "{}"
    usage: "#tree-single-selection"
  - name: placement
    type: "String"
    values: ""
    description: "弹层相对触发器的首选位置。"
    default: "bottom-start"
    usage: "#tree-single-selection"
  - name: teleported
    type: "Boolean"
    values: "true | false"
    description: "将弹层传送到祖先裁剪容器之外。"
    default: true
    usage: "#tree-single-selection"
  - name: flip
    type: "Boolean"
    values: "true | false"
    description: "视口空间不足时翻转弹层位置。"
    default: true
    usage: "#tree-single-selection"
  - name: strategy
    type: "String"
    values: "absolute | fixed"
    description: "传给共享 Popper 的定位策略。"
    default: "absolute"
    usage: "#tree-single-selection"
EVENTS:
  - name: "update:modelValue"
    type: "(value: TableSelectValue) => void"
    description: "选中键更新；单选清除为 undefined，多选清除为 []。"
    default: null
    usage: "#tree-single-selection"
  - name: "update:open"
    type: "(value: boolean) => void"
    description: "请求更新弹层可见性。"
    default: null
    usage: "#tree-single-selection"
  - name: "update:expanded-keys"
    type: "(keys: TableRowKey[]) => void"
    description: "STable 更新树节点展开键。"
    default: null
    usage: "#tree-single-selection"
  - name: "visible-change"
    type: "(value: boolean) => void"
    description: "已接受的打开或关闭请求；受控可见性仍由 open 决定。"
    default: null
    usage: "#tree-single-selection"
  - name: "change"
    type: "(value: TableRowKey | TableRowKey[], row: TableRow | TableRow[]) => void"
    description: "选中了可选行，清除操作单独触发 clear。"
    default: null
    usage: "#tree-single-selection"
  - name: "clear"
    type: "() => void"
    description: "触发了清除操作。"
    default: null
    usage: "#tree-single-selection"
  - name: "row-click"
    type: "(row: TableRow, event: MouseEvent) => void"
    description: "表格行点击，包含不可选行的点击。"
    default: null
    usage: "#tree-single-selection"
  - name: "cell-click"
    type: "(params: TableCellRenderParams, event: MouseEvent) => void"
    description: "数据单元格点击，携带其渲染上下文。"
    default: null
    usage: "#tree-single-selection"
  - name: "tree-expand"
    type: "(row: TableRow, expanded: boolean) => void"
    description: "树节点展开或折叠。"
    default: null
    usage: "#tree-single-selection"
  - name: "lazy-load"
    type: "(row: TableRow, children: TableRow[]) => void"
    description: "懒加载子节点完成。"
    default: null
    usage: "#tree-single-selection"
  - name: "scroll"
    type: "(event: Event) => void"
    description: "内部表格视口滚动事件。"
    default: null
    usage: "#tree-single-selection"
  - name: "focus"
    type: "(event: FocusEvent) => void"
    description: "触发器获得焦点。"
    default: null
    usage: "#tree-single-selection"
  - name: "blur"
    type: "(event: FocusEvent) => void"
    description: "触发器失去焦点。"
    default: null
    usage: "#tree-single-selection"
  - name: "prefix-click"
    type: "(event: MouseEvent) => void"
    description: "点击前缀内容。"
    default: null
    usage: "#tree-single-selection"
  - name: "suffix-click"
    type: "(event: MouseEvent) => void"
    description: "点击后缀内容。"
    default: null
    usage: "#tree-single-selection"
SLOTS:
  - name: "selected"
    type: Slot
    scope: "{ row: TableRow; label: string }"
    description: "触发器中的选中行标签。"
    default: null
    usage: "#custom-rendering"
  - name: "prefix"
    type: "Slot"
    description: "触发器前缀内容。"
    default: null
    usage: "#custom-rendering"
  - name: "suffix"
    type: Slot
    scope: "{ open: boolean; selectedRow: TableRow | null }"
    description: "触发器后缀装饰，不替换内置操作。"
    default: null
    usage: "#custom-rendering"
  - name: "clear-icon"
    type: "Slot"
    description: "清除操作的图标。"
    default: null
    usage: "#custom-rendering"
  - name: "cell"
    type: Slot
    scope: "TableCellRenderParams"
    description: "转发到 STable 的通用数据单元格插槽。"
    default: null
    usage: "#custom-rendering"
  - name: "cell-[key]"
    type: Slot
    scope: "TableCellRenderParams"
    description: "指定列的数据单元格插槽。"
    default: null
    usage: "#custom-rendering"
  - name: "header-cell"
    type: Slot
    scope: "TableHeaderRenderParams"
    description: "转发到 STable 的通用表头插槽。"
    default: null
    usage: "#custom-rendering"
  - name: "header-[key]"
    type: Slot
    scope: "TableHeaderRenderParams"
    description: "指定列的表头插槽。"
    default: null
    usage: "#custom-rendering"
  - name: "popup-header"
    type: "Slot"
    description: "弹层内表格上方的内容。"
    default: null
    usage: "#custom-rendering"
  - name: "popup-footer"
    type: Slot
    scope: "{ selectedRow: TableRow | null; close: () => void }"
    description: "弹层内表格下方的内容，提供关闭方法。"
    default: null
    usage: "#custom-rendering"
  - name: "empty"
    type: "Slot"
    description: "替换表格空状态内容。"
    default: null
    usage: "#custom-rendering"
EXPOSES:
  - name: "open"
    type: "() => void"
    description: "请求打开弹层，禁用或加载时不打开。"
    default: null
    usage: "#tree-single-selection"
  - name: "close"
    type: "() => void"
    description: "请求关闭弹层，受控模式通过 update:open 通知。"
    default: null
    usage: "#tree-single-selection"
  - name: "toggleRowExpand"
    type: "(row: TableRow, expanded?: boolean) => Promise<void> | undefined"
    description: "通过已挂载的内部表格切换或设置树节点展开状态。"
    default: null
    usage: "#tree-single-selection"
  - name: "setExpandedKeys"
    type: "(keys: TableRowKey[]) => void"
    description: "通过内部表格设置树节点展开键。"
    default: null
    usage: "#tree-single-selection"
  - name: "scrollToRow"
    type: "(rowOrIndex: TableRow | TableRowKey, align?: 'auto' | 'start' | 'center' | 'end') => void"
    description: "按行对象或行键定位已挂载的内部表格；数字未匹配到可见行键时，才按可见行索引定位。"
    default: null
    usage: "#tree-single-selection"
  - name: "measure"
    type: "() => Promise<void> | undefined"
    description: "重新测量已挂载的内部表格布局与虚拟行。"
    default: null
    usage: "#tree-single-selection"
description: '从普通、虚拟滚动或树形 Table 中选择一行或多行数据。'
---

# Table Select 表格选择器


<card>

## 平铺单选

绑定单个行键，点击可选行后默认关闭弹层；禁用行不可选。

<template #example>
<table-select-zh-flat-single />
</template>

<template #template>

@[code{16-33}](../../.vuepress/components/table-select-zh/flat-single.vue)

</template>

<template #script>

@[code{1-14}](../../.vuepress/components/table-select-zh/flat-single.vue)

</template>

<template #style>

@[code{35-53}](../../.vuepress/components/table-select-zh/flat-single.vue)

</template>

</card>

<card>

## 平铺多选

设置 `multiple`，绑定行键数组。点击行或复选框切换选择，默认保持弹层打开；支持标签移除和清空。

<template #example>
<table-select-zh-flat-multiple />
</template>

<template #template>

@[code{16-34}](../../.vuepress/components/table-select-zh/flat-multiple.vue)

</template>

<template #script>

@[code{1-14}](../../.vuepress/components/table-select-zh/flat-multiple.vue)

</template>

<template #style>

@[code{36-54}](../../.vuepress/components/table-select-zh/flat-multiple.vue)

</template>

</card>

<card>

## 树形单选

使用 `tree-config` 展示层级。本例通过 `selectable` 限制为选择叶子节点，父节点用于展开和折叠。

<template #example>
<table-select-zh-tree-single />
</template>

<template #template>

@[code{22-44}](../../.vuepress/components/table-select-zh/tree-single.vue)

</template>

<template #script>

@[code{1-20}](../../.vuepress/components/table-select-zh/tree-single.vue)

</template>

<template #style>

@[code{46-64}](../../.vuepress/components/table-select-zh/tree-single.vue)

</template>

</card>

<card>

## 树形多选

`multiple` 适用于普通表格和树形数据。多选模型为行键数组，弹层默认保持打开；标签可移除并在超过 `max-collapse-tags` 后折叠。树形数据默认联动已加载的可选后代，父节点勾选状态由后代推导，输出键由 checked-strategy 控制；禁用节点不参与联动。设置 `check-strictly` 可独立选择各节点。`checked-strategy` 默认为 `leaf`，只输出可选叶子；`all` 输出全部选中节点，`parent` 将全选分支合并为父节点。策略同时控制模型和标签，父节点仍显示全选或半选。未加载的节点不会自动加入选中值。

<template #example>
<table-select-zh-multiple />
</template>

<template #template>

@[code{32-69}](../../.vuepress/components/table-select-zh/multiple.vue)

</template>

<template #script>

@[code{1-30}](../../.vuepress/components/table-select-zh/multiple.vue)

</template>

<template #style>

@[code{71-101}](../../.vuepress/components/table-select-zh/multiple.vue)

</template>

</card>

<card>

## 尺寸

对比组件继承后的 `small`、`default`、`large` 三档尺寸。

<template #example><table-select-zh-size /></template>

<template #template>

@[code{13-39}](../../.vuepress/components/table-select-zh/size.vue)

</template>

<template #script>

@[code{1-11}](../../.vuepress/components/table-select-zh/size.vue)

</template>

<template #style>

@[code{41-48}](../../.vuepress/components/table-select-zh/size.vue)

</template>

</card>

<card>

## 外形

设置 `shape="square"` 可让选择器触发器与复用的 Table 弹层表面统一使用直角外观。

<template #example><table-select-shape /></template>

<template #template>

@[code{19-45}](../../.vuepress/components/table-select/shape.vue)

</template>

<template #script>

@[code{1-17}](../../.vuepress/components/table-select/shape.vue)

</template>

<template #style>

@[code{47-59}](../../.vuepress/components/table-select/shape.vue)

</template>

</card>

<card>

## 树形大数据

展开后的树包含 10,000 个叶子节点。`virtual-config` 让弹层保持固定范围，并且只挂载可见行窗口。

<template #example><table-select-large-tree /></template>

<template #template>

@[code{49-68}](../../.vuepress/components/table-select/large-tree.vue)

</template>

<template #script>

@[code{1-47}](../../.vuepress/components/table-select/large-tree.vue)

</template>

<template #style>

@[code{70-80}](../../.vuepress/components/table-select/large-tree.vue)

</template>

</card>

<card>

## 普通表格大数据

普通三列表格同样可以使用虚拟化选择器外壳。本例包含 10,000 行普通数据，并开启动态行高测量。

<template #example><table-select-large-table /></template>

<template #template>

@[code{44-59}](../../.vuepress/components/table-select/large-table.vue)

</template>

<template #script>

@[code{1-42}](../../.vuepress/components/table-select/large-table.vue)

</template>

<template #style>

@[code{61-71}](../../.vuepress/components/table-select/large-table.vue)

</template>

</card>

<card>

## 自定义渲染

通过列插槽和命名渲染器自定义表格单元格，通过 `selected` 插槽自定义触发器中的已选值；更复杂的表格渲染规则仍集中在 Table 自身。

`columns.slots.default` 和 `columns.slots.header` 可指定自定义列插槽名称。列插槽及触发器前后缀支持在挂载后按条件增加或移除。选择器保留 `prefix`、`suffix`、`clear-icon`、`selected`、`empty`、`popup-header`、`popup-footer`，表格内容请使用其他名称。已选值插槽接收 `{ row, label }`，数据和表头插槽保持原有 Table 渲染参数。

<template #example><table-select-custom-render /></template>

<template #template>

@[code{48-88}](../../.vuepress/components/table-select/custom-render.vue)

</template>

<template #script>

@[code{1-46}](../../.vuepress/components/table-select/custom-render.vue)

</template>

<template #style>

@[code{90-129}](../../.vuepress/components/table-select/custom-render.vue)

</template>

</card>

<card>

## 加载

通过 `loading` 表示正在加载数据；尾部图标与 Input、Select 一致，当前值保持可见，加载结束后恢复交互。

<template #example>
<table-select-zh-loading />
</template>

<template #template>

@[code{1-26}](../../.vuepress/components/table-select-zh/loading.vue)

</template>

<template #script>

@[code{28-39}](../../.vuepress/components/table-select-zh/loading.vue)

</template>

<template #style>

@[code{41-54}](../../.vuepress/components/table-select-zh/loading.vue)

</template>

</card>
