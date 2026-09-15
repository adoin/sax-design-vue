---
description: 'Table 的列布局与管理功能、配置方式与可运行示例。'
---

# 列布局与管理指南

<card class="table-doc-section-start">

## 列布局与管理

固定列、列宽调整和列设置共同控制表格布局；需要持久化时，可保存并恢复用户的列设置。

### 普通固定列与滚动定位

左右固定列不依赖虚拟滚动。中间内容超出时横向滚动，固定列保留连续背景。下面通过 `scrollToColumn` 定位中间列，`scrollToRow` 定位行。

<template #example><table-zh-fixed-columns /></template>

<template #template>

@[code{24-54}](../../../.vuepress/components/table-zh/fixed-columns.vue)

</template>

<template #script>

@[code{1-22}](../../../.vuepress/components/table-zh/fixed-columns.vue)

</template>

<template #style>

@[code{56-66}](../../../.vuepress/components/table-zh/fixed-columns.vue)

</template>

</card>

<card>

### 拖动调整列宽

开启 `resize-config` 后可拖动表头边缘。右侧固定列从左边缘调整；列的 `minWidth`（数字或 px）与全局 `minWidth` 共同约束拖动，`resizable: false` 可禁用指定列。键盘左右键调整，Shift 加速，Home 到最小宽度，Escape 取消拖动。

`v-model:column-widths` 用于外部受控与恢复；未传时组件在内部保留结果，不修改原始 columns 或行数据。改变原始列 width 会清除该列的内部调整。拖动过程中预览宽度，松开后才提交事件；父级未接受受控更新时恢复原值。

<template #example>
<table-zh-resize />
</template>

<template #template>

@[code{91-125}](../../../.vuepress/components/table-zh/resize.vue)

</template>

<template #script>

@[code{1-89}](../../../.vuepress/components/table-zh/resize.vue)

</template>

<template #style>

@[code{127-140}](../../../.vuepress/components/table-zh/resize.vue)

</template>

</card>

<card>

### 列设置

在工具栏任一有序区域放置内置 `$columnConfig` 渲染器，即可显示或隐藏列、拖动手柄调整顺序、设置左右固定，以及恢复默认。等价的插槽写法是 `<template #toolbar_right><s-table-column-config /></template>`。两种写法都会关联当前 Table，因此入口可以和任意工具栏内容自由排列，无需额外的 Table 属性。分组列始终以容器包住全部后代；嵌套分组会增加一层内缩表面，并显示直接子列数量，不提供展开或收起操作。拖动时靠近列表边缘会自动滚动；键盘用户可聚焦手柄，按空格拾取、用方向键选择位置，再按回车放置。固定列始终位于对应边缘，顺序调整决定同一区域内的排列。隐藏列不会清除已有的排序、筛选或行选择。

`v-model:column-state` 接收 `TableColumnState[]`；不传时由组件管理。每项用 `key` 标识叶子或分组列；`placement: { parentKey, index }` 覆盖其父级与同级位置，`parentKey: null` 表示顶层。建议为需要保存顺序或层级的叶子和分组提供稳定且唯一的键。使用 `virtualSource` 时以原始列索引字符串标识，且只支持扁平列设置。

列设置提交时触发 `update:column-state` 和 `column-state-change`；列宽拖拽或键盘调整提交时触发 `update:column-widths` 和 `column-resize`。前两个更新事件适合受控状态，后两个变化事件适合记录用户操作。`columns` 保持为原始结构定义，不会被这些交互改写；清空列状态和列宽记录即可恢复 `columns` 中声明的顺序、固定位置与宽度。

<template #example><table-zh-column-manager /></template>

<template #template>

@[code{82-116}](../../../.vuepress/components/table-zh/column-manager.vue)

</template>

<template #script>

@[code{1-80}](../../../.vuepress/components/table-zh/column-manager.vue)

</template>

<template #style>

@[code{118-125}](../../../.vuepress/components/table-zh/column-manager.vue)

</template>

</card>

<card>

### 记住列设置

在 `$columnConfig.props` 或 `<s-table-column-config>` 上设置唯一的 `storageKey`，可将列设置保存在当前浏览器的 localStorage 中。未设置键时不会读写存储；不同表格或用户应使用不同的键。

非受控模式会在挂载时恢复已保存的设置。受控模式以父组件的 `column-state` 为准，只保存已接受的状态，初始恢复由应用负责。恢复默认后保存空设置。存储不可用或容量不足时，可监听 `column-storage-error` 处理错误。

<template #example><table-zh-column-persistence /></template>

<template #template>

@[code{8-19}](../../../.vuepress/components/table-zh/column-persistence.vue)

</template>

<template #script>

@[code{1-6}](../../../.vuepress/components/table-zh/column-persistence.vue)

</template>

</card>
