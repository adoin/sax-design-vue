---
description: 'Table 的大数据与可视化功能、配置方式与可运行示例。'
---

# 大数据与可视化指南

<card class="table-doc-section-start">

## 大数据与可视化

虚拟渲染和索引数据源解决的是两层不同的成本：`virtual-config` 减少挂载的 DOM 节点，`virtualSource` 进一步让 Table 无需接收完整的行列数组。先配置这些基础能力，再按需提取表格数据用于图表。

### 虚拟滚动与动态行高

设置 `virtual-config` 可开启虚拟滚动，`height` 指定表体可视区域高度：数字按像素处理，CSS 长度按原值使用。设置 `height: 'auto'` 后，表体会占用查询区、工具栏、表头、可换行表尾、footer 插槽和分页之外的剩余空间。表格的父容器必须具有确定高度，可以是指定尺寸的块容器，也可以是允许收缩的 Flex/Grid 子项；否则不存在可分配的有界剩余空间。表尾换行或外部尺寸变化时，表体会自动调整到新的剩余高度。开启 `dynamic` 后行高会适应内容；`horizontal` 开启横向列虚拟化，`columnOverscan` 控制左右额外渲染的列数。列设置 `fixed="left"` 或 `fixed="right"` 可固定在相应边缘。

即使只挂载少量可见 DOM，通过 `data` 传入一百万个对象时，这些对象仍然存在于应用内存中。使用 `virtualSource` 时，`rowCount` 与 `columnCount` 只描述逻辑规模，不会创建对应数量的行列对象；Table 仅针对当前窗口调用 `row(index)` 和 `column(index)`。回调可以即时计算对象，也可以读取应用已有的索引存储，但 Table 自身不会保存完整逻辑数据集的数组。

`1_000_000` 是 JavaScript 的数字分隔符写法，数值与 `1000000` 完全相同。下划线只用于提高数字字面量的可读性，不会创建数组、预留内存或自动开启虚拟滚动。它之所以能表示逻辑行数，是因为 `virtualSource` 同时提供了按索引读取数据的回调。

下方第一个表格使用普通 `data` 数组展示 DOM 虚拟化；“巨量逻辑数据”区域使用 `virtualSource` 展示不创建完整数组的巨大逻辑行列空间。

数据会重排、更新或包含树节点时，建议提供稳定唯一的 `row-key`。横向滚动时，表格会稳定已经显示内容的行高，减少列窗口切换造成的上下跳动；列布局、容器尺寸或数据源变化后会自动适配新的内容高度。

<template #example><table-zh-virtual /></template>

<template #template>

@[code{157-223}](../../../.vuepress/components/table-zh/virtual.vue)

</template>

<template #script>

@[code{1-155}](../../../.vuepress/components/table-zh/virtual.vue)

</template>

<template #style>

@[code{225-302}](../../../.vuepress/components/table-zh/virtual.vue)

</template>

</card>

<card>

### 图表集成

开启 `chart-config` 后，使用 `getChartData(options)` 提取不可变快照；配置 `adapter` 后可用 `openChart(options)` 打开面板。按需导入的 `createTableSvgChartAdapter()` 支持柱状图和折线图，普通表格无需引入图表引擎。面板提供数据表格、类型切换与关闭按钮，支持 Tab 焦点循环及 Escape 关闭。

`scope: 'selection'` 使用当前矩形选区或显式 `bounds`；类别与数值列必须位于选区内，完整合并区域的数值只计一次。`filtered` 使用分页前已提供、已筛选并展开的树行，不加载远程页面或未加载的树节点。`aggregate` 读取现有 `group-config` 统计，默认取根分组；`groupKeys` 可指定子分组，`aggregate: 'summary'` 读取整体汇总。组统计范围沿用分组配置，不会重新统计其他页面。

<template #example><table-zh-chart /></template>

<template #template>

@[code{60-88}](../../../.vuepress/components/table-zh/chart.vue)

</template>

<template #script>

@[code{1-59}](../../../.vuepress/components/table-zh/chart.vue)

</template>

<template #style>

@[code{89-103}](../../../.vuepress/components/table-zh/chart.vue)

</template>

</card>

<card>

### 巨量数据图表

图表取数默认最多保留 1000 个点、32 个系列、10000 个单元格和 2000000 个元数据/类别字符。单元格预算包含每个点的类别与所有系列。超限返回 `reason: 'limit'` 和可用的不完整快照，`openChart` 不展示截断图表；缩小范围或明确调整预算后重试。`cancelChart()` 或 `AbortSignal` 可停止取数，复杂对象的快照与转换仍有独立内存成本。

本例使用百万行、十万列生成源，末端图表只读取选中的五行、两列，跨中心列和右固定列。生成源的 `filtered` 范围是适配器提供的全部逻辑行，不替适配器执行远程查询；远程筛选应先更新数据源。聚合按钮直接使用远程统计，不枚举组内成员。

<template #example><table-zh-chart-source /></template>

<template #template>

@[code{95-128}](../../../.vuepress/components/table-zh/chart-source.vue)

</template>

<template #script>

@[code{1-94}](../../../.vuepress/components/table-zh/chart-source.vue)

</template>

<template #style>

@[code{129-143}](../../../.vuepress/components/table-zh/chart-source.vue)

</template>

</card>
