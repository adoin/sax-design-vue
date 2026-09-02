---
PROPS:
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
    type: TableRow[]
    values: "Table 数据模式配置"
    description: 直接传递给内部 STable 的数据与列定义。
    default: '[]'
  - name: columns
    type: TableColumn[]
    values: "Table 数据模式配置"
    description: 直接传递给内部 STable 的数据与列定义。
    default: '[]'
  - name: row-key
    type: String | Function
    values: "稳定行键和触发器文案解析器"
    description: 解析绑定键值以及触发器中展示的已选文案。
    default: 'id'
  - name: label-key
    type: String
    values: "稳定行键和触发器文案解析器"
    description: 解析绑定键值以及触发器中展示的已选文案。
    default: 'label'
  - name: label-formatter
    type: Function
    values: "稳定行键和触发器文案解析器"
    description: 解析绑定键值以及触发器中展示的已选文案。
    default: null
  - name: tree-config
    type: TableTreeConfig
    values: "children | indent | expandAll | defaultExpandedKeys | expandOnClickRow | hasChildren | load"
    description: 开启 Table 树形数据模式并控制展开行。
    default: null
  - name: expanded-keys
    type: Array
    values: "children | indent | expandAll | defaultExpandedKeys | expandOnClickRow | hasChildren | load"
    description: 开启 Table 树形数据模式并控制展开行。
    default: null
  - name: virtual-config
    type: Boolean | TableVirtualConfig
    values: "true / false / '{ height, estimateSize, overscan, dynamic }'"
    description: 为大规模普通数据或树形数据开启 STable 行虚拟化。
    default: 'false'
  - name: renderers
    type: Object
    values: "Table 渲染器映射和行回调"
    description: 配置 Table 渲染、行样式以及某一行能否被选择。
    default: '{}'
  - name: row-class
    type: String | Function
    values: "Table 渲染器映射和行回调"
    description: 配置 Table 渲染、行样式以及某一行能否被选择。
    default: null
  - name: selectable
    type: Function
    values: "Table 渲染器映射和行回调"
    description: 配置 Table 渲染、行样式以及某一行能否被选择。
    default: null
  - name: show-header
    type: Boolean
    values: "true / false"
    description: 配置内部 Table 的表头、斑马纹、加载状态以及选择后是否关闭。
    default: 'true'
  - name: striped
    type: Boolean
    values: "true / false"
    description: 配置内部 Table 的表头、斑马纹、加载状态以及选择后是否关闭。
    default: 'false'
  - name: table-loading
    type: Boolean
    values: "true / false"
    description: 配置内部 Table 的表头、斑马纹、加载状态以及选择后是否关闭。
    default: 'false'
  - name: close-on-select
    type: Boolean
    values: "true / false"
    description: 配置内部 Table 的表头、斑马纹、加载状态以及选择后是否关闭。
    default: 'true'
  - name: clearable
    type: Boolean
    values: "true | false / square / 主题色或自定义颜色"
    description: 配置选择器触发器、反馈、宽度、形状和校验状态。
    default: 'false'
  - name: loading
    type: Boolean
    values: "true | false / square / 主题色或自定义颜色"
    description: 配置选择器触发器、反馈、宽度、形状和校验状态。
    default: 'false'
  - name: block
    type: Boolean
    values: "true | false / square / 主题色或自定义颜色"
    description: 配置选择器触发器、反馈、宽度、形状和校验状态。
    default: 'false'
  - name: shape
    type: String
    values: "rounded | square"
    description: 为选择器触发器与弹层表面统一设置圆角或方形外观。
    default: rounded
    usage: '#外形'
  - name: color
    type: Color
    values: "true | false / square / 主题色或自定义颜色"
    description: 配置选择器触发器、反馈、宽度、形状和校验状态。
    default: 'primary'
  - name: state
    type: Color
    values: "true | false / square / 主题色或自定义颜色"
    description: 配置选择器触发器、反馈、宽度、形状和校验状态。
    default: null
  - name: prefix-icon
    type: String
    values: "图标名或 '{ icon, content }'"
    description: 添加触发器前后缀内容，同名插槽优先级更高。
    default: null
  - name: suffix-icon
    type: String
    values: "图标名或 '{ icon, content }'"
    description: 添加触发器前后缀内容，同名插槽优先级更高。
    default: null
  - name: prefix-config
    type: Object
    values: "图标名或 '{ icon, content }'"
    description: 添加触发器前后缀内容，同名插槽优先级更高。
    default: null
  - name: suffix-config
    type: Object
    values: "图标名或 '{ icon, content }'"
    description: 添加触发器前后缀内容，同名插槽优先级更高。
    default: null
  - name: open
    type: Boolean
    values: "true"
    description: 受控设置弹层显隐，或设置初始打开状态。
    default: null
  - name: default-open
    type: Boolean
    values: "false"
    description: 受控设置弹层显隐，或设置初始打开状态。
    default: 'false'
  - name: popup-config
    type: Object
    values: "width | full | matchTriggerWidth | minWidth | maxWidth | height | maxHeight | placement | transfer | appendTo | offset | zIndex | className | style"
    description: 配置通用 Popper 的尺寸、位置和挂载目标。
    default: '{}'
  - name: placement
    type: String
    values: "width | full | matchTriggerWidth | minWidth | maxWidth | height | maxHeight | placement | transfer | appendTo | offset | zIndex | className | style"
    description: 配置通用 Popper 的尺寸、位置和挂载目标。
    default: 'bottom-start'
  - name: teleported
    type: Boolean
    values: "width | full | matchTriggerWidth | minWidth | maxWidth | height | maxHeight | placement | transfer | appendTo | offset | zIndex | className | style"
    description: 配置通用 Popper 的尺寸、位置和挂载目标。
    default: 'true'
  - name: flip
    type: Boolean
    values: "width | full | matchTriggerWidth | minWidth | maxWidth | height | maxHeight | placement | transfer | appendTo | offset | zIndex | className | style"
    description: 配置通用 Popper 的尺寸、位置和挂载目标。
    default: 'true'
  - name: strategy
    type: String
    values: "width | full | matchTriggerWidth | minWidth | maxWidth | height | maxHeight | placement | transfer | appendTo | offset | zIndex | className | style"
    description: 配置通用 Popper 的尺寸、位置和挂载目标。
    default: 'absolute'
EVENTS:
  - name: change
    description: 选择、清空以及 Table 行或单元格交互事件。
  - name: clear
    description: 选择、清空以及 Table 行或单元格交互事件。
  - name: row-click
    description: 选择、清空以及 Table 行或单元格交互事件。
  - name: cell-click
    description: 选择、清空以及 Table 行或单元格交互事件。
  - name: update:expanded-keys
    description: 从内部 STable 透传的事件。
  - name: tree-expand
    description: 从内部 STable 透传的事件。
  - name: lazy-load
    description: 从内部 STable 透传的事件。
  - name: scroll
    description: 从内部 STable 透传的事件。
  - name: visible-change
    description: 触发器与弹层显隐事件。
  - name: update:open
    description: 触发器与弹层显隐事件。
  - name: focus
    description: 触发器与弹层显隐事件。
  - name: blur
    description: 触发器与弹层显隐事件。
SLOTS:
  - name: selected
    type: scoped slot
    description: 自定义已选值以及触发器前后缀。
  - name: prefix
    type: scoped slot
    description: 自定义已选值以及触发器前后缀。
  - name: suffix
    type: scoped slot
    description: 自定义已选值以及触发器前后缀。
  - name: clear-icon
    type: scoped slot
    description: 自定义已选值以及触发器前后缀。
  - name: cell
    type: scoped slot
    description: 原样透传 STable 单元格和表头插槽及其作用域参数。
  - name: cell-[key]
    type: scoped slot
    description: 原样透传 STable 单元格和表头插槽及其作用域参数。
  - name: header-cell
    type: scoped slot
    description: 原样透传 STable 单元格和表头插槽及其作用域参数。
  - name: header-[key]
    type: scoped slot
    description: 原样透传 STable 单元格和表头插槽及其作用域参数。
  - name: popup-header
    type: scoped slot
    description: 自定义弹层头尾区域和空状态。
  - name: popup-footer
    type: scoped slot
    description: 自定义弹层头尾区域和空状态。
  - name: empty
    type: scoped slot
    description: 自定义弹层头尾区域和空状态。
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
