---
description: 'Table 的外观配置与可运行示例。'
---

# 外观指南

<card class="table-doc-section-start">

## 外观

通过外观配置调整 Table 的密度与视觉节奏，不改变数据、列结构或交互模型。

### 尺寸

在一个完整的请求代理表格中切换 `small`、`default`、`large`。继承后的尺寸会同时作用于查询 `$input` 与 `$select`、固定查询按钮、工具栏渲染器、表格行、`$buttons` 行操作、筛选控件和分页。

<template #example><table-zh-size /></template>

<template #template>

@[code{198-223}](../../../.vuepress/components/table-zh/size.vue)

</template>

<template #script>

@[code{1-196}](../../../.vuepress/components/table-zh/size.vue)

</template>

<template #style>

@[code{225-245}](../../../.vuepress/components/table-zh/size.vue)

</template>

</card>
