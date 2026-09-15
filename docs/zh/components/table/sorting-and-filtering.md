---
description: 'Table 的排序与筛选功能、配置方式与可运行示例。'
---

# 排序与筛选指南

<card class="table-doc-section-start">

## 排序与筛选

排序改变行顺序，筛选改变可见数据集合。数据由表格处理时使用本地模式；数据由服务端处理时启用对应的远程模式。

### 排序与多字段排序

列设置 `sortable` 后显示独立的升序（上三角）和降序（下三角）按钮，再次点击已选方向取消该列排序。`sort-config.multiple` 保留多列优先级，仅在至少两列参与排序时显示优先级数字，取消至只剩一列时自动隐藏。`v-model:sort-by` 控制排序状态；不会修改源数组，null / undefined 始终排在末尾。

<template #example><table-zh-sorting /></template>

<template #template>

@[code{24-40}](../../../.vuepress/components/table-zh/sorting.vue)

</template>

<template #script>

@[code{1-22}](../../../.vuepress/components/table-zh/sorting.vue)

</template>

<template #style>

@[code{42-54}](../../../.vuepress/components/table-zh/sorting.vue)

</template>

</card>

<card>

### 列级排序规则

每列通过 `sortMethod` 独立指定规则：`'number'` 将数字及数字字符串按数值排序，`'string'` 按字符串字典序比较。不设置时保留自动自然排序，例如“任务 2”排在“任务 10”前。

函数接收 `(a, b, rowA, rowB)`，前两项为字段值，后两项为原始行对象。升序时 a 应排在 b 后面就返回 `true` / `1`，否则返回 `false` / `0`。表格会反向比较一次，以区分“排在前面”和“相等”，因此函数需保持纯函数且比较规则一致。也支持 `(a, b) => Number(a) - Number(b)` 这类返回负数 / 零 / 正数的标准比较器。降序自动反转；相等时保留原始顺序，或交给下一排序字段判断。

<template #example><table-zh-sort-methods /></template>

<template #template>

@[code{31-42}](../../../.vuepress/components/table-zh/sort-methods.vue)

</template>

<template #script>

@[code{1-29}](../../../.vuepress/components/table-zh/sort-methods.vue)

</template>

<template #style>

@[code{44-52}](../../../.vuepress/components/table-zh/sort-methods.vue)

</template>

</card>

<card>

### 筛选与自定义筛选

不同列之间取交集，同列可多选或通过 `filter-multiple=false` 限制为单选。`filterRender` 用全局渲染器生成面板控件，本例使用 `$input` 和 `$radio`；需要独特布局时仍可使用优先级更高的筛选插槽。修改后点击确认才会生效，匹配逻辑放在 `filterMethod` 中。

<template #example><table-zh-filtering /></template>

<template #template>

@[code{50-62}](../../../.vuepress/components/table-zh/filtering.vue)

</template>

<template #script>

@[code{1-48}](../../../.vuepress/components/table-zh/filtering.vue)

</template>

<template #style>

@[code{64-71}](../../../.vuepress/components/table-zh/filtering.vue)

</template>

</card>

<card>

### 远程排序与筛选

分别在 `sort-config`、`filter-config` 和 `pager-config` 中设置 `remote: true`，表格只维护查询与分页状态，不重复处理服务端返回的当前页数据。分页配置中的 `total` 传服务端返回的总条数；可监听 `page-change` 请求数据，或像本例一样监听受控页码和每页条数。远程排序、筛选变化时，由业务将页码重置为 1。

此处用延迟函数模拟服务端排序、筛选和分页，实际业务替换为请求即可；新查询会取消旧定时器，避免旧结果覆盖新结果。`virtualSource` 不会为了排序或筛选遍历生成全部数据；启用本地分页时只按页范围读取行。

<template #example><table-zh-remote-query /></template>

<template #template>

@[code{68-80}](../../../.vuepress/components/table-zh/remote-query.vue)

</template>

<template #script>

@[code{1-66}](../../../.vuepress/components/table-zh/remote-query.vue)

</template>

</card>
