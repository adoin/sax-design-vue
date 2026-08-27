---
description: '使用表头和单元格内容展示结构化表格数据。'
PROPS:
  - name: loading
    type: Boolean
    values: true | false
    description: 在表格内容上展示加载状态。
    default: false
  - name: v-model
    type: Object, Array
    values: Object, Array
    description: 当前选中的表格数据。
    default: null
    link: null
    usage: '#single-selected'
    code: null
  - name: striped
    type: Boolean
    values: true, false
    description: 为表格行添加斑马纹。
    default: null
    link: null
    usage: '#striped'
    code: null
  - name: s-tr:data
    type: Object
    values: Object
    description: 启用选择功能时必填；该对象会传入 v-model。
    default: null
    link: null
    usage: '#single-selected'
    code: null
  - name: s-tr:is-selected
    type: Boolean
    values: true, false
    description: 是否处于选中状态，可用于性能优化。
    default: false
    link: null
    usage: '#single-selected'
    code: null
  - name: s-td:edit
    type: Boolean
    values: true, false
    description: 是否可编辑；启用后显示下划线和指针光标。
    default: false
    link: null
    usage: '#edit-data'
    code: null
  - name: s-th:sort
    type: Boolean
    values: true, false
    description: 为对应的表头添加排序箭头。
    default: false
    link: null
    usage: '#sort'
    code: null
  - name: s-tr:color
    type: String, Theme colors
    values: color, theme colors
    description: 设置表格行颜色。
    default: null
    link: null
    usage: '#color'
    code: null

EVENTS:
  - name: update:modelValue
    type: Array | String | Number | Object
    description: 表格选择状态或绑定值变化时触发。
SLOTS:
  - name: header
    type: slot
    values: null
    description: 表格顶部区域，可放置搜索输入框等元素。
    default: null
    link: null
    usage: '#sort'
    code: >
      <template #header>
        ...
      </template>
  - name: thead
    type: slot
    values: null
    description: 表格 thead 区域，用于放置 `s-th` 组件。
    default: null
    link: null
    usage: '#default'
    code: >
      <template #thead>
        <s-tr>
          <s-th> Name </s-th>
          <s-th> Email </s-th>
          <s-th> Id </s-th>
        </s-tr>
      </template>
  - name: tbody
    type: slot
    values: null
    description: 表格 tbody 区域，用于放置 `s-tr` 组件。
    default: null
    link: null
    usage: '#default'
    code: >
      <template #tbody>
        <s-tr
          v-for="tr in users"
          :data="tr"
        >
          <s-td> {{ tr.name }} </s-td>
          <s-td> {{ tr.email }} </s-td>
          <s-td> {{ tr.id }} </s-td>
        </s-tr>
      </template>
  - name: s-tr:#expand
    type: slot
    values: null
    description: 表格行展开后的内容区域。
    default: null
    link: null
    usage: '#expand'
    code: null
  - name: notFound
    type: slot
    values: null
    description: 自定义表格没有数据时的展示内容。
    default: null
    link: null
    usage: '#miscellaneous'
    code: >
      <template #notFound> Not Found </template>
---

# Table 表格

<card>

## 默认

<docs-warn />

使用 `s-table` 及其 `s-tr`、`s-td`、`s-th` 子组件即可快速创建表格。

组件提供灵活的数据管理与自定义能力。

<template #example>
<table-default />
</template>

<template #template>

@[code{1-26} html{3}](../../.vuepress/components/table/default.vue)

</template>

<template #script>

@[code{28-109}](../../.vuepress/components/table/default.vue)

</template>

</card>

<card>

## 斑马纹

添加 `striped` 属性即可开启表格斑马纹。

<template #example>
<table-striped />
</template>

<template #template>

@[code{1-26} html{1}](../../.vuepress/components/table/striped.vue)

</template>

<template #script>

@[code{28-109}](../../.vuepress/components/table/default.vue)

</template>

</card>

<card>

## 颜色

为 `s-tr` 设置 `color` 属性即可改变该行颜色。

<template #example>
<table-color />
</template>

<template #template>

@[code{1-26} vue{14-17}](../../.vuepress/components/table/color.vue)

</template>

<template #script>

@[code{28-125}](../../.vuepress/components/table/color.vue)

</template>

</card>

<card>

## 分页

通过 `#footer` 插槽与 `s-pagination` 组件，可为表格添加分页功能。

可使用 `getPage` 根据页码生成数据项，并通过 `getLength` 生成分页总数。

这种数据处理方式兼顾了自定义自由度与实现效率。

参见示例。

<template #example>
<table-pagination />
</template>

<template #template>

@[code{1-38} vue{12,25}](../../.vuepress/components/table/pagination.vue)

</template>

<template #script>

@[code{40-126}](../../.vuepress/components/table/pagination.vue)

</template>

</card>

<card>

## 单选

通过表格的 v-model 与 `is-selected` 属性可启用单选功能。

::: tip 提示
请为 `tr` 设置 `data` 属性；其值会写入 v-model。
:::

<template #example>
<table-selected />
</template>

<template #template>

@[code{1-32} vue{3,15}](../../.vuepress/components/table/selected.vue)

</template>

<template #script>

@[code{34-119}](../../.vuepress/components/table/selected.vue)

</template>

</card>

<card>

## 多选

将 `v-model` 绑定为数组即可启用表格多选。

可搭配复选框及 `toggleSelectAll` 函数实现表头全选。

<template #example>
<table-multiple />
</template>

<template #template>

@[code{1-50} vue{3}](../../.vuepress/components/table/multiple.vue)

</template>

<template #script>

@[code{52-144}](../../.vuepress/components/table/multiple.vue)

</template>

</card>

<card>

## 可展开数据

在 `s-tr` 内使用 `#expand` 插槽，即可添加可展开数据行。

<template #example>
<table-expand />
</template>

<template #template>

@[code{1-48} vue{23-43}](../../.vuepress/components/table/expand.vue)

</template>

<template #script>

@[code{50-131}](../../.vuepress/components/table/expand.vue)

</template>

</card>

<card>

## 编辑数据

可结合 `s-dialog` 组件编辑表格中的数据。

<template #example>
<table-edit />
</template>

<template #template>

@[code{1-61} vue{15,21,32}](../../.vuepress/components/table/edit.vue)

</template>

<template #script>

@[code{63-150} vue{23-41}](../../.vuepress/components/table/edit.vue)

</template>

</card>

<card>

## 排序

排序功能独立实现，可使用全局函数 `sortData`。

::: tip 提示
`sortData` 需要 4 个参数：事件、表格数据、排序字段和排序类型。
:::

<command>

```ts
/**
 * return array was sorted
 */
declare function sortData<T extends Record<string, unknown>>(
  event: Event,
  arr: T[],
  sortKey: keyof T,
  sortType?: 'desc' | 'esc',
): T[]
```

</command>

<template #example>
<table-sort />
</template>

<template #template>

@[code{1-32} vue{6,9,12}](../../.vuepress/components/table/sort.vue)

</template>

<template #script>

@[code{34-118}](../../.vuepress/components/table/sort.vue)

</template>

</card>

<card>

## 综合示例

此示例组合展示各项功能。

<template #example>
<table-miscellaneous />
</template>

<template #template>

@[code{1-121}](../../.vuepress/components/table/miscellaneous.vue)

</template>

<template #script>

@[code{123-221}](../../.vuepress/components/table/miscellaneous.vue)

</template>

<template #style>

@[code{223-238}](../../.vuepress/components/table/miscellaneous.vue)

</template>

</card>

<card>

## 工具函数

组件采用更灵活的数据处理逻辑，服务端数据请求不会被组件直接接管；可按业务需求自行调用工具函数处理。

可用函数如下：

#### toggleSelectAll

参见[综合示例](#miscellaneous)：
<command>

```ts
/**
 * return empty array if all items are in selected, otherwise return originalData
 *
 * @param selected Array
 * @param originalData Array
 *
 * @returns Array
 */
declare function toggleSelectAll<T = any>(selected: T[], originalData: T[]): T[]
```

</command>

#### sortData

参见[排序示例](#sort)：
<command>

```ts
/**
 * return array was sorted
 */
declare function sortData<T extends Record<string, unknown>>(
  event: Event,
  arr: T[],
  sortKey: keyof T,
  sortType?: 'desc' | 'esc',
): T[]
```

</command>

</card>
