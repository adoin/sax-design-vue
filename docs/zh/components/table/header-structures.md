---
description: 'Table 的表头结构功能、配置方式与可运行示例。'
---

# 表头结构指南

<card class="table-doc-section-start">

## 表头结构

多级表头用于描述列之间的上下级关系。普通表格使用配置数组，接口返回的行数据和动态列结构也应整理为 `data` 与 `columns`；需要在模板中直接表达层级时使用嵌套 `STableColumn`。最后一个示例仅说明已经采用 `virtualSource` 的超宽表格如何增加分组表头。

### 多级表头

在列配置的 `children` 中嵌套子列。组标题自动跨越相邻的可见叶子列，较浅的叶子表头跨行显示；排序、筛选与列宽调整配置在叶子列上。组的 `fixed` 会向下继承，子列可用 `fixed: false` 解除固定。需要保存结构调整时，应为分组列提供稳定的 `key`。

列设置以树展示完整列结构。拖到分组行中部会移入该分组，拖到行的上下边缘会放到同级前后；拖动分组会携带完整子树，并拒绝形成循环的落点。单独固定叶子列时，该叶子会提升为独立的跨行表头，不会在固定区复制祖先标题；固定整个分组则保留其完整表头结构。清空 `column-state` 可恢复声明时的树。

<template #example><table-zh-grouped-headers /></template>

<template #template>

@[code{58-82}](../../../.vuepress/components/table-zh/grouped-headers.vue)

</template>

<template #script>

@[code{1-56}](../../../.vuepress/components/table-zh/grouped-headers.vue)

</template>

<template #style>

@[code{84-88}](../../../.vuepress/components/table-zh/grouped-headers.vue)

</template>

</card>

<card>

### 嵌套分组表头

在 `STableColumn` 的 `#columns` 插槽中嵌套列定义。组标题默认使用 `title`；仅在需要覆盖标题内容时提供 `#header`。`#default` 继续用于叶子单元格。也可以直接传入 `children` 数组。

<template #example><table-zh-grouped-declarations /></template>

<template #template>

@[code{8-32}](../../../.vuepress/components/table-zh/grouped-declarations.vue)

</template>

<template #script>

@[code{1-6}](../../../.vuepress/components/table-zh/grouped-declarations.vue)

</template>

</card>

<card>

### 虚拟列分组表头

列已经由 `virtualSource` 提供时，使用 `headerPath(index)` 返回每个叶子列从外层到内层的分组路径。相邻叶子使用相同且稳定的分组 `key` 时会共用一个表头单元格，`title` 是显示名称。`headerDepth` 设置为包含叶子层在内的最大表头行数，使横向窗口变化时表头高度保持稳定。

<template #example><table-zh-grouped-source /></template>

<template #template>

@[code{37-56}](../../../.vuepress/components/table-zh/grouped-source.vue)

</template>

<template #script>

@[code{1-35}](../../../.vuepress/components/table-zh/grouped-source.vue)

</template>

<template #style>

@[code{58-62}](../../../.vuepress/components/table-zh/grouped-source.vue)

</template>

</card>
