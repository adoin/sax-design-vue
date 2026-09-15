---
description: 'Table 的行选择功能、配置方式与可运行示例。'
---

# 行选择指南

<card class="table-doc-section-start">

## 行选择

根据交互方式选择模型：单选使用单选列，多选使用复选列，只需标记当前记录时使用行高亮。

### 单选

添加 `type="radio"` 列，并通过 `v-model:highlight` 绑定一行数据。`selection-config.selectableMethod` 可禁止选择指定行；默认由单选控件触发。

<template #example><table-zh-selection-single /></template>

<template #template>

@[code{30-41}](../../../.vuepress/components/table-zh/selection-single.vue)

</template>

<template #script>

@[code{1-28}](../../../.vuepress/components/table-zh/selection-single.vue)

</template>

<template #style>

@[code{43-50}](../../../.vuepress/components/table-zh/selection-single.vue)

</template>

</card>

<card>

### 多选

添加 `type="checkbox"` 列，并通过 `v-model:highlight` 绑定数组。全选作用于当前页筛选后、展开的可选行，不受虚拟窗口限制。`selectableMethod` 可禁选，提供稳定唯一的 `row-key` 后，`reserve` 可保留其他页的选择。

内置分页器通过 `v-model:pager-config` 接收完整数据。本地排序和筛选先于分页执行；树形表格按根节点分页，展开的后代跟随所属根节点。

<template #example><table-zh-selection-multiple /></template>

<template #template>

@[code{28-48}](../../../.vuepress/components/table-zh/selection-multiple.vue)

</template>

<template #script>

@[code{1-26}](../../../.vuepress/components/table-zh/selection-multiple.vue)

</template>

<template #style>

@[code{50-63}](../../../.vuepress/components/table-zh/selection-multiple.vue)

</template>

</card>

<card>

### 高亮选择

不添加单选列或复选列，直接通过 `v-model:highlight` 绑定当前高亮行。模型需要数组时添加 `multiple`。

<template #example><table-zh-selection-highlight /></template>

<template #template>

@[code{24-35}](../../../.vuepress/components/table-zh/selection-highlight.vue)

</template>

<template #script>

@[code{1-22}](../../../.vuepress/components/table-zh/selection-highlight.vue)

</template>

</card>
