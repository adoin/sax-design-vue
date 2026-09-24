---
description: 'Table 的单元格合并功能、配置方式与可运行示例。'
---

# 单元格合并指南

<card class="table-doc-section-start">

## 单元格合并

合并区域可以用于普通数据、编辑与详情行，也可以跨虚拟窗口渲染。

### 合并单元格

通过 `merge-config.body` 和 `merge-config.footer` 分别指定正文与表尾的合并区域。每项包含从零开始的 `row`、`col`，以及大于零的 `rowspan`、`colspan`。合并区域显示起点单元格的内容，继续使用其列插槽、格式化和交互。

对于连续 JSON 行中同一字段值相同这一常见场景，可使用 `createTableRowspanMerges(rows, { field, col })`。它按传入行的当前顺序计算，支持点路径字段，忽略无需合并的单行区间，并返回可直接赋给 `merge-config.body`、固定为 `colspan: 1` 的范围。多列独立纵向合并时可分别调用；只有需要归一化比较时才传 `equals`。横向或相交区域继续显式配置。

普通数据的 `row` 对应排序、筛选、分页和树展开后的当前显示行；表尾的 `row` 对应 `footer-config` 或 `footer-data` 解析后的表尾行。`col` 按左固定列、中心列、右固定列的可见顺序计算。固定范围跟随位置，查询、分页或列重排后会应用到新位置的单元格；需要按内容分组时应重新计算范围。

<template #example><table-zh-merging /></template>

<template #template>

@[code{26-38}](../../../.vuepress/components/table-zh/merging.vue)

</template>

<template #script>

@[code{1-24}](../../../.vuepress/components/table-zh/merging.vue)

</template>

<template #style>

@[code{40-47}](../../../.vuepress/components/table-zh/merging.vue)

</template>

</card>

<card>

### 合并编辑与详情

双击团队或项目单元格进入编辑，点击保存接受更新，或取消保留原值。合并团队只编辑起点行，不会同时修改被覆盖行的数据。通过首列展开任意项目的详情；合并区域在详情上下分段绘制，详情中的输入保持独立。可切换虚拟行，并拖动表头真实边界调整列宽。

<template #example><table-zh-merging-edit /></template>

<template #template>

@[code{43-83}](../../../.vuepress/components/table-zh/merging-edit.vue)

</template>

<template #script>

@[code{1-41}](../../../.vuepress/components/table-zh/merging-edit.vue)

</template>

<template #style>

@[code{85-104}](../../../.vuepress/components/table-zh/merging-edit.vue)

</template>

</card>

<card>

### 虚拟合并区域

生成数据源的合并行位置使用绝对源索引，开启分页时也保持此规则。`body` 或 `footer` 可接收同步函数，参数包含半开窗口 `rowStart`、`rowEnd`、`colStart`、`colEnd`，以及区域、行列数量和 `rowAt` / `columnAt` 访问器。函数需要返回与窗口相交的完整范围，包括起点位于窗口之前的范围。固定列、中心列和程序定位的目标可能分别触发查询；规则应保持确定性，不执行副作用。规则抛出异常时，该次查询不合并单元格。

下例在生成数据中每四行、八列组成一个区域。点击「末端区域」可定位到两个轴末端的被覆盖单元格，活动地址归一到其区域起点。开启多行内容可观察合并区域随内容和列布局自动调整高度。编辑和单元格交互使用合并起点对应的行、列上下文。

<template #example><table-zh-merging-source /></template>

<template #template>

@[code{46-82}](../../../.vuepress/components/table-zh/merging-source.vue)

</template>

<template #script>

@[code{1-44}](../../../.vuepress/components/table-zh/merging-source.vue)

</template>

<template #style>

@[code{84-99}](../../../.vuepress/components/table-zh/merging-source.vue)

</template>

</card>
