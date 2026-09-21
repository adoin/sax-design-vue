---
description: 'Table 的数据与列定义功能、配置方式与可运行示例。'
---

# 数据与列定义指南

<card class="table-doc-section-start">

## 数据与列定义

从传入数据、定义列和渲染内容开始，涵盖配置项与嵌套两种写法，以及文本溢出、加载和空态等基础展示能力。

### 配置项写法

通过 `data` 提供行数据，`columns` 定义列的字段、标题和显示方式。也可以将表格属性放入一个对象，通过 `v-bind` 统一传入。

推荐将该对象声明为 `SaxGridSetting<Row, QueryForm>`。`Row` 会贯穿列字段、单元格和编辑回调、渲染器、树与分组函数、聚合、插槽、事件、代理结果和 Table 实例方法；字段名称会校验 `Row` 的有效键以及最多两层对象嵌套路径。可选的第二个泛型会贯穿查询模型、Form 配置项、查询与工具栏上下文以及代理请求。省略任一泛型时使用开放的 `Recordable` 兜底，后端生成的普通 interface 无需增加索引签名。

`width` 指定固定列宽；未设置 `width` 的列以 `minWidth`（默认 120px）为基础，均分剩余空间。容器宽度不足时，可横向滚动查看其余列。

`align` 同时控制表头和单元格的左中右对齐。列上的 `align` 仍覆盖这两个表面；列或表格上的 `headerAlign` 只覆盖表头。都未声明时继承 `SConfigProvider.table.align` / `table.headerAlign`，再默认为居左。

<template #example><table-zh-default /></template>

<template #template>

@[code{37-39}](../../../.vuepress/components/table-zh/default.vue)

</template>

<template #script>

@[code{1-35}](../../../.vuepress/components/table-zh/default.vue)

</template>

</card>

<card>

### 嵌套写法

需要在模板中直观看到列结构时，使用 `s-table-column`。列可以直接持有作用域插槽，而所有行仍由 `data` 提供。

使用 `v-for` 声明列时，为每列提供稳定的 key。调整声明顺序会同步更新表头和单元格；移除自定义单元格插槽后，会恢复列渲染器或原始值。

<template #example><table-zh-columns /></template>

<template #template>

@[code{24-48}](../../../.vuepress/components/table-zh/columns.vue)

</template>

<template #script>

@[code{1-22}](../../../.vuepress/components/table-zh/columns.vue)

</template>

<template #style>

@[code{50-57}](../../../.vuepress/components/table-zh/columns.vue)

</template>

</card>

<card>

### 插槽与渲染器

配置列的 `slots.default` 既可填写具名插槽字符串，也可直接传入单元格渲染函数。表格不会根据字段名隐式生成 `cell-*`、`header-*`、`edit-*` 或 `footer-*` 插槽；需要列专属模板时，通过 `columns[].slots` 显式映射应用自己的唯一名称，或在 `STableColumn` 内使用局部插槽。可复用的显示、编辑、表单、筛选和工具栏行为来自共享的全局 [`renderer` 注册表](./renderer.md)；独立说明集中介绍注册方式、使用位置、回调契约和所有内置名称。

单元格函数接收 `TableCellRenderParams`，包括 `row`、`column`、`value`、`index` 和 `rowIndex`；切换示例代码的 TSX 写法可查看 JSX 形式。渲染优先级为：配置显式映射的 default 插槽、通用单元格插槽、内联或局部渲染器、全局渲染器、字段原始值。

<template #example><table-zh-rendering /></template>

<template #template>

@[code{67-84}](../../../.vuepress/components/table-zh/rendering.vue)

</template>

<template #script>

@[code{1-65}](../../../.vuepress/components/table-zh/rendering.vue)

</template>

<template #style>

@[code{86-105}](../../../.vuepress/components/table-zh/rendering.vue)

</template>

<template #script-tsx>

@[code{1-64}](../../../.vuepress/example-sources/table-zh/rendering-tsx.vue)

</template>

</card>

<card>

### 文本溢出与提示

`show-overflow` 可选择自动换行（false）、仅省略（ellipsis）、原生提示（title）或浮动提示（tooltip / true）。只有内容溢出才显示提示，鼠标悬停和键盘聚焦均可触发；表头支持独立的 `show-header-overflow`，列配置优先于表格配置。

<template #example><table-zh-overflow /></template>

<template #template>

@[code{30-51}](../../../.vuepress/components/table-zh/overflow.vue)

</template>

<template #script>

@[code{1-28}](../../../.vuepress/components/table-zh/overflow.vue)

</template>

<template #style>

@[code{53-63}](../../../.vuepress/components/table-zh/overflow.vue)

</template>

</card>

<card>

### 加载、空态与表格插槽

通过 `header`、`footer` 和 `empty` 插槽自定义表格周边内容。使用 `loading` 显示加载状态，`show-header` 控制表头显隐，`row-class` 自定义行样式；列的 `field` 支持嵌套字段路径。

<template #example><table-zh-states /></template>

<template #template>

@[code{20-52}](../../../.vuepress/components/table-zh/states.vue)

</template>

<template #script>

@[code{1-18}](../../../.vuepress/components/table-zh/states.vue)

</template>

<template #style>

@[code{54-82}](../../../.vuepress/components/table-zh/states.vue)

</template>

</card>
