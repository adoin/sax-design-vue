---
description: 'Table 的树形与分组功能、配置方式与可运行示例。'
---

# 树形与分组指南

<card class="table-doc-section-start">

## 树形与分组

树形数据和行分组都用于表达记录之间的层级关系。本节依次介绍树形查询、懒加载、本地分组、远程分组和虚拟分组。

### 树形排序与筛选

树形排序只调整同级节点，父子关系保持不变。筛选保留匹配节点及其祖先，并临时展开匹配路径；清除筛选后恢复原来的展开状态。懒加载节点只筛选已经加载的数据，不自动发起请求。

<template #example><table-zh-tree-query /></template>

<template #template>

@[code{37-59}](../../../.vuepress/components/table-zh/tree-query.vue)

</template>

<template #script>

@[code{1-35}](../../../.vuepress/components/table-zh/tree-query.vue)

</template>

<template #style>

@[code{61-71}](../../../.vuepress/components/table-zh/tree-query.vue)

</template>

</card>

<card>

### 树形表格与懒加载

树形数据直接由 `s-table` 处理。在一个配置列上设置 `treeNode`，再通过 `tree-config` 提供子节点或懒加载函数；设置 `line: true` 显示随展开状态连续绘制的父子连接线。本例展开 `components` 时会延迟 800ms 返回子节点，让加载状态和异步插入过程可直接观察。

<template #example><table-zh-tree /></template>

<template #template>

@[code{69-96}](../../../.vuepress/components/table-zh/tree.vue)

</template>

<template #script>

@[code{1-67}](../../../.vuepress/components/table-zh/tree.vue)

</template>

<template #style>

@[code{98-121}](../../../.vuepress/components/table-zh/tree.vue)

</template>

</card>

<card>

### 行分组与聚合

通过 `group-config.fields` 按字段嵌套分组。分组发生在排序、筛选、分页后；树数据以当前页的根分支分组，已展开后代保持在根分支内。组标题和小计不参与数据行选择或编辑。双击工时可编辑，成功更新后统计自动重算。

组小计覆盖该组当前提供的所有成员，收起不改变结果。整体汇总的 `summaryScope` 默认为 `page`，设置为 `filtered` 时统计已提供且符合筛选的可见树行，包含其他本地页；不会加载未展开或懒加载的后代。远程分页下，应用未提供的数据不在本地统计范围。

<template #example><table-zh-grouping /></template>

<template #template>

@[code{69-105}](../../../.vuepress/components/table-zh/grouping.vue)

</template>

<template #script>

@[code{1-67}](../../../.vuepress/components/table-zh/grouping.vue)

</template>

<template #style>

@[code{107-119}](../../../.vuepress/components/table-zh/grouping.vue)

</template>

</card>

<card>

### 远程分组请求

本例用模拟服务返回一页数据、页内分组范围和全量汇总。请求、取消和结果状态由应用管理，再把已接受的服务端结果传给 `remote`；分组元数据按当前数据页关联，过期、取消或失败的请求不会覆盖当前分组与统计。

使用真实接口时，让服务返回连续的组成员及 `TableGroupRemoteResult`，替换示例中的模拟查询即可。组小计为当前页提供的成员统计，整体汇总由服务定义；这里为全部 24 条记录的工时总和。

<template #example><table-zh-grouping-remote /></template>

<template #template>

@[code{85-115}](../../../.vuepress/components/table-zh/grouping-remote.vue)

</template>

<template #script>

@[code{1-83}](../../../.vuepress/components/table-zh/grouping-remote.vue)

</template>

</card>

<card>

### 远程分组与虚拟行

生成源使用 `mode: remote`。应用提供 `remote.groups` 的起始行、行数、子分组和聚合结果，以及 `remote.summary`；请求、取消和结果状态由应用管理，并将当前服务端结果传给 `remote`。表格不会遍历生成源来猜测分组。普通数组的远程范围使用当前页数据索引，生成源使用绝对源索引；兄弟范围必须有序、不重叠，并位于父范围内，未覆盖行保留普通显示。

此例按公式提供 100 万行、10 万列的分组元数据。滚动经过分组成员时，表头下方会临时显示当前父级；`parent-indicator.enabled` 控制是否开启，停止滚动后默认停留 1000ms，可通过 `hideDelay` 调整。`parent-indicator` 插槽保留左侧回退图标并自定义其余内容，可通过插槽参数中的 `jump` 返回父级行。展开末批会先更新分组状态，再定位末端；收起的行没有可见数据地址，程序定位前应展开所在组。分组标题、小计和数据共用虚拟窗口，索引空间随组数增长；本地分组和聚合则同步处理已提供行，计算及存储成本随行数和分组层级增长，大规模全局统计应交给服务端。

<template #example><table-zh-grouping-source /></template>

<template #template>

@[code{52-85}](../../../.vuepress/components/table-zh/grouping-source.vue)

</template>

<template #script>

@[code{1-50}](../../../.vuepress/components/table-zh/grouping-source.vue)

</template>

<template #style>

@[code{87-109}](../../../.vuepress/components/table-zh/grouping-source.vue)

</template>

</card>
