---
PROPS:
  - name: "empty-text"
    type: "String"
    description: "表格没有数据时显示的文本，省略时使用当前语言的默认文案。"
    default: null
    usage: "#树形数据"
  - name: "placeholder"
    type: "String"
    description: "未选择行时的占位文本，省略时使用当前语言的默认文案。"
    default: null
    usage: "#树形数据"
  - name: "disabled"
    type: "Boolean"
    description: "禁用触发器交互，并关闭已打开的弹层。"
    default: false
    values: "true | false"
    usage: "#树形数据"
  - name: model-value
    type: String | Number
    values: "行键值"
    description: 通过 row-key 解析的已选行键值。
    default: null
  - name: v-model
    type: String | Number
    values: "行键值"
    description: 通过 row-key 解析的已选行键值。
    default: null
  - name: data
    type: "TableRow[]"
    values: ""
    description: "传入 STable 的行数据，子节点按 tree-config 解析。"
    default: "[]"
    usage: "#树形数据"
  - name: columns
    type: "TableColumn[]"
    values: ""
    description: "转发给 STable 的列配置。"
    default: "[]"
    usage: "#树形数据"
  - name: row-key
    type: "TableRowKeyGetter"
    values: ""
    description: "稳定行键字段或取值函数，选中行的键作为模型值。"
    default: "id"
    usage: "#树形数据"
  - name: label-key
    type: "String"
    values: ""
    description: "触发器标签的字段路径，字段缺失时显示选中的键。"
    default: "label"
    usage: "#树形数据"
  - name: label-formatter
    type: "TableSelectLabelFormatter"
    values: ""
    description: "格式化选中行标签，优先于 label-key。"
    default: null
    usage: "#自定义渲染"
  - name: tree-config
    type: "TableTreeConfig"
    values: ""
    description: "通过 STable 配置子节点、缩进、展开及懒加载。"
    default: null
    usage: "#树形数据"
  - name: expanded-keys
    type: "TableRowKey[]"
    values: ""
    description: "受控的树节点展开键，通过 v-model:expanded-keys 绑定。"
    default: null
    usage: "#树形数据"
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
    usage: "#自定义渲染"
  - name: row-class
    type: "TableRowClass"
    values: ""
    description: "自定义行类名，函数接收扁平化行上下文。"
    default: ""
    usage: "#树形数据"
  - name: selectable
    type: "TableSelectSelectable"
    values: ""
    description: "返回 false 禁止选中该行；disabled 为真的行始终不可选。"
    default: null
    usage: "#树形数据"
  - name: show-header
    type: "Boolean"
    values: "true | false"
    description: "显示表格列标题。"
    default: true
    usage: "#树形数据"
  - name: striped
    type: "Boolean"
    values: "true | false"
    description: "使用交替行背景。"
    default: false
    usage: "#树形数据"
  - name: table-loading
    type: "Boolean"
    values: "true | false"
    description: "显示内部表格的加载状态。"
    default: false
    usage: "#树形数据"
  - name: close-on-select
    type: "Boolean"
    values: "true | false"
    description: "选中行后关闭弹层。"
    default: true
    usage: "#树形数据"
  - name: clearable
    type: "Boolean"
    values: "true | false"
    description: "为选中值显示清除操作。"
    default: false
    usage: "#树形数据"
  - name: loading
    type: "Boolean"
    values: "true | false"
    description: "显示触发器加载反馈，阻止交互并关闭弹层。"
    default: false
    usage: "#树形数据"
  - name: block
    type: "Boolean"
    values: "true | false"
    description: "触发器占满可用宽度。"
    default: false
    usage: "#树形数据"
  - name: shape
    type: String
    values: "rounded | square"
    description: 为选择器触发器与弹层表面统一设置圆角或方形外观。
    default: rounded
    usage: '#外形'
  - name: color
    type: "Color"
    values: ""
    description: "触发器与弹层的主视觉颜色。"
    default: "primary"
    usage: "#树形数据"
  - name: state
    type: "Color"
    values: ""
    description: "状态颜色，提供时优先于 color。"
    default: null
    usage: "#树形数据"
  - name: prefix-icon
    type: "String"
    values: ""
    description: "前缀图标名，优先于 prefix-config.icon。"
    default: null
    usage: "#自定义渲染"
  - name: suffix-icon
    type: "String"
    values: ""
    description: "后缀装饰图标，不移除下拉箭头。"
    default: null
    usage: "#自定义渲染"
  - name: prefix-config
    type: "TableSelectAffixConfig"
    values: ""
    description: "前缀图标与文本，prefix 插槽优先。"
    default: null
    usage: "#自定义渲染"
  - name: suffix-config
    type: "TableSelectAffixConfig"
    values: ""
    description: "后缀图标与文本，suffix 插槽优先。"
    default: null
    usage: "#自定义渲染"
  - name: open
    type: "Boolean"
    values: "true | false"
    description: "受控弹层可见性，通过 v-model:open 绑定。"
    default: null
    usage: "#树形数据"
  - name: default-open
    type: "Boolean"
    values: "true | false"
    description: "open 非受控时的初始弹层可见性。"
    default: false
    usage: "#树形数据"
  - name: popup-config
    type: "TableSelectPopupConfig"
    values: ""
    description: "弹层尺寸、位置和挂载目标；其中配置的字段优先于对应顶层属性。"
    default: "{}"
    usage: "#树形数据"
  - name: placement
    type: "String"
    values: ""
    description: "弹层相对触发器的首选位置。"
    default: "bottom-start"
    usage: "#树形数据"
  - name: teleported
    type: "Boolean"
    values: "true | false"
    description: "将弹层传送到祖先裁剪容器之外。"
    default: true
    usage: "#树形数据"
  - name: flip
    type: "Boolean"
    values: "true | false"
    description: "视口空间不足时翻转弹层位置。"
    default: true
    usage: "#树形数据"
  - name: strategy
    type: "String"
    values: "absolute | fixed"
    description: "传给共享 Popper 的定位策略。"
    default: "absolute"
    usage: "#树形数据"
EVENTS:
  - name: "update:modelValue"
    type: "(value: TableRowKey | undefined) => void"
    description: "选中键更新，清除时发出 undefined。"
    default: null
    usage: "#树形数据"
  - name: "update:open"
    type: "(value: boolean) => void"
    description: "请求更新弹层可见性。"
    default: null
    usage: "#树形数据"
  - name: "update:expanded-keys"
    type: "(keys: TableRowKey[]) => void"
    description: "STable 更新树节点展开键。"
    default: null
    usage: "#树形数据"
  - name: "visible-change"
    type: "(value: boolean) => void"
    description: "已接受的打开或关闭请求；受控可见性仍由 open 决定。"
    default: null
    usage: "#树形数据"
  - name: "change"
    type: "(value: TableRowKey, row: TableRow) => void"
    description: "选中了可选行，清除操作单独触发 clear。"
    default: null
    usage: "#树形数据"
  - name: "clear"
    type: "() => void"
    description: "触发了清除操作。"
    default: null
    usage: "#树形数据"
  - name: "row-click"
    type: "(row: TableRow, event: MouseEvent) => void"
    description: "表格行点击，包含不可选行的点击。"
    default: null
    usage: "#树形数据"
  - name: "cell-click"
    type: "(params: TableCellRenderParams, event: MouseEvent) => void"
    description: "数据单元格点击，携带其渲染上下文。"
    default: null
    usage: "#树形数据"
  - name: "tree-expand"
    type: "(row: TableRow, expanded: boolean) => void"
    description: "树节点展开或折叠。"
    default: null
    usage: "#树形数据"
  - name: "lazy-load"
    type: "(row: TableRow, children: TableRow[]) => void"
    description: "懒加载子节点完成。"
    default: null
    usage: "#树形数据"
  - name: "scroll"
    type: "(event: Event) => void"
    description: "内部表格视口滚动事件。"
    default: null
    usage: "#树形数据"
  - name: "focus"
    type: "(event: FocusEvent) => void"
    description: "触发器获得焦点。"
    default: null
    usage: "#树形数据"
  - name: "blur"
    type: "(event: FocusEvent) => void"
    description: "触发器失去焦点。"
    default: null
    usage: "#树形数据"
  - name: "prefix-click"
    type: "(event: MouseEvent) => void"
    description: "点击前缀内容。"
    default: null
    usage: "#树形数据"
  - name: "suffix-click"
    type: "(event: MouseEvent) => void"
    description: "点击后缀内容。"
    default: null
    usage: "#树形数据"
SLOTS:
  - name: "selected"
    type: "{ row: TableRow; label: string }"
    description: "触发器中的选中行标签。"
    default: null
    usage: "#自定义渲染"
  - name: "prefix"
    type: "Slot"
    description: "触发器前缀内容。"
    default: null
    usage: "#自定义渲染"
  - name: "suffix"
    type: "{ open: boolean; selectedRow: TableRow | null }"
    description: "触发器后缀装饰，不替换内置操作。"
    default: null
    usage: "#自定义渲染"
  - name: "clear-icon"
    type: "Slot"
    description: "清除操作的图标。"
    default: null
    usage: "#自定义渲染"
  - name: "cell"
    type: "TableCellRenderParams"
    description: "转发到 STable 的通用数据单元格插槽。"
    default: null
    usage: "#自定义渲染"
  - name: "cell-[key]"
    type: "TableCellRenderParams"
    description: "指定列的数据单元格插槽。"
    default: null
    usage: "#自定义渲染"
  - name: "header-cell"
    type: "TableHeaderRenderParams"
    description: "转发到 STable 的通用表头插槽。"
    default: null
    usage: "#自定义渲染"
  - name: "header-[key]"
    type: "TableHeaderRenderParams"
    description: "指定列的表头插槽。"
    default: null
    usage: "#自定义渲染"
  - name: "popup-header"
    type: "Slot"
    description: "弹层内表格上方的内容。"
    default: null
    usage: "#自定义渲染"
  - name: "popup-footer"
    type: "{ selectedRow: TableRow | null; close: () => void }"
    description: "弹层内表格下方的内容，提供关闭方法。"
    default: null
    usage: "#自定义渲染"
  - name: "empty"
    type: "Slot"
    description: "替换表格空状态内容。"
    default: null
    usage: "#自定义渲染"
EXPOSES:
  - name: "open"
    type: "() => void"
    description: "请求打开弹层，禁用或加载时不打开。"
    default: null
    usage: "#树形数据"
  - name: "close"
    type: "() => void"
    description: "请求关闭弹层，受控模式通过 update:open 通知。"
    default: null
    usage: "#树形数据"
  - name: "toggleRowExpand"
    type: "(row: TableRow, expanded?: boolean) => Promise<void> | undefined"
    description: "通过已挂载的内部表格切换或设置树节点展开状态。"
    default: null
    usage: "#树形数据"
  - name: "setExpandedKeys"
    type: "(keys: TableRowKey[]) => void"
    description: "通过内部表格设置树节点展开键。"
    default: null
    usage: "#树形数据"
  - name: "scrollToRow"
    type: "(rowOrIndex: TableRow | TableRowKey, align?: 'auto' | 'start' | 'center' | 'end') => void"
    description: "按行对象或行键定位已挂载的内部表格；数字未匹配到可见行键时，才按可见行索引定位。"
    default: null
    usage: "#树形数据"
  - name: "measure"
    type: "() => Promise<void> | undefined"
    description: "重新测量已挂载的内部表格布局与虚拟行。"
    default: null
    usage: "#树形数据"
description: '从普通、虚拟滚动或树形 Table 中选择一行数据。'
---

# Table select 表格选择器

<card>

## 树形数据

树形选择只是 Table 的一种数据模式。父行原地展开，可选叶子行负责更新绑定键值。

<template #example><table-select-tree /></template>

<template #template>

@[code{36-55}](../../.vuepress/components/table-select/tree.vue)

</template>

<template #script>

@[code{1-34}](../../.vuepress/components/table-select/tree.vue)

</template>

<template #style>

@[code{57-67}](../../.vuepress/components/table-select/tree.vue)

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

TableSelect 透传列插槽、命名渲染器和已选值插槽；更复杂的渲染规则仍集中在 Table 自身。

<template #example><table-select-custom-render /></template>

<template #template>

@[code{61-89}](../../.vuepress/components/table-select/custom-render.vue)

</template>

<template #script>

@[code{1-59}](../../.vuepress/components/table-select/custom-render.vue)

</template>

<template #style>

@[code{91-130}](../../.vuepress/components/table-select/custom-render.vue)

</template>

</card>
