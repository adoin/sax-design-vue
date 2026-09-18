---
description: 'Table 的行展开功能、配置方式与可运行示例。'
---

# 行展开指南

<card class="table-doc-section-start">

## 行展开

详情行在当前记录下方展开补充内容，并可与异步加载和虚拟滚动组合使用。

### 表中表变更明细

外层 Table 每行展示一个字段的变更梗概，再通过 `#detail` 渲染另一个 `STable`，列出完整的修改前、修改后和处理结果。细致记录留在同一阅读流中，不再打开单独的弹出层。

`v-model:detail-expanded-keys` 使用稳定行键控制哪些梗概已展开。展开按钮支持 Tab 聚焦、Enter 和空格操作；收起父行时只卸载对应的明细子表。

<template #example><table-zh-details /></template>

<template #template>

@[code{217-274}](../../../.vuepress/components/table-zh/details.vue)

</template>

<template #script>

@[code{1-215}](../../../.vuepress/components/table-zh/details.vue)

</template>

<template #style>

@[code{276-326}](../../../.vuepress/components/table-zh/details.vue)

</template>

</card>

<card>

### 异步详情

通过 `detailConfig.load` 异步获取详情；返回结果由 `#detail` 的 `data` 接收。`#detail-loading` 和 `#detail-error` 可替换加载与错误提示，`reload()` 重新加载当前详情。

收起、关闭详情功能、更换数据数组或加载函数、卸载表格时，会取消相关请求并忽略过期结果。请将 `signal` 传给请求客户端。展开项在离开虚拟视口后保留加载结果，收起后清除；替换数据数组会重新加载。

<template #example><table-zh-details-async /></template>

<template #template>

@[code{42-58}](../../../.vuepress/components/table-zh/details-async.vue)

</template>

<template #script>

@[code{1-40}](../../../.vuepress/components/table-zh/details-async.vue)

</template>

<template #style>

@[code{60-64}](../../../.vuepress/components/table-zh/details-async.vue)

</template>

</card>

<card>

### 虚拟滚动中的详情

详情内容会自动撑开对应行，内容尺寸变化或收起后表格会同步更新布局。详情面板保持可见区域宽度，横向滚动时不会随着虚拟列移出视口。

生成数据源需显式设置 `detail-config` 并提供稳定的 `rowKey`。关闭「异步加载」时，`#detail` 直接使用当前行同步展示内容；开启后通过 `detailConfig.load({ row, signal })` 加载已展开行，收起或切换模式会取消未完成请求。切换模式会保留展开键，并按新模式更新已展开内容。此例按需生成 100 万行、10 万列，`toggleRowDetail(index)` 接受全局行索引；普通数据则使用当前排序、筛选、分页和树展开后的可见索引。

<template #example><table-zh-details-source /></template>

<template #template>

@[code{61-95}](../../../.vuepress/components/table-zh/details-source.vue)

</template>

<template #script>

@[code{1-59}](../../../.vuepress/components/table-zh/details-source.vue)

</template>

<template #style>

@[code{97-112}](../../../.vuepress/components/table-zh/details-source.vue)

</template>

</card>
