---
description: "按页浏览较长的数据集合。"
PROPS:
  - name: v-model:current-page
    type: Number
    values: number
    description: 当前所在页码。
    default: 1
    link: null
    usage: '#default'
    code: >
      <s-pagination v-model:current-page="page" :total="20" />
  - name: total
    type: Number
    values: number
    description: 数据总条数。
    default: null
    link: null
    usage: '#default'
    code: >
      <s-pagination v-model:current-page="page" :total="20" />
  - name: color
    type: String
    values: Theme colors, RGB, HEX
    description: 设置组件基础颜色。
    default: primary
    link: null
    usage: '#color'
    code: >
      <s-pagination color="danger" v-model:current-page="page" :total="20" />

  - name: disabled
    type: Boolean
    values: true, false
    description: 是否禁用整个组件。
    default: false
    link: null
    usage: '#disabled'
    code: >
      <s-pagination disabled v-model:current-page="page" :total="20" />

  - name: shape
    type: String
    values: circle, square
    description: 设置按钮为圆形或方形样式。
    default: null
    link: null
    usage: '#shape'
    code: >
      <s-pagination shape="circle" v-model:current-page="page" :total="20" />

      <s-pagination square v-model:current-page="page" :total="20" />

  - name: buttons-dotted
    type: Boolean
    values: true, false
    description: 隐藏按钮内页码并调整其尺寸。
    default: false
    link: null
    usage: '#buttons-dotted'
    code: >
      <s-pagination buttons-dotted v-model:current-page="page" :total="20" />

  - name: disabled-items
    type: Number[]
    values: null
    description: 指定禁用状态的页码项。
    default: null
    link: null
    usage: '#disabled-items'
    code: >
      <s-pagination :disabled-items="[3,4,9,10,11,12,19]" v-model:current-page="page" :total="20" />

  - name: loading-items
    type: Number[]
    values: null
    description: 指定加载状态的页码项。
    default: null
    link: null
    usage: '#loading-items'
    code: >
      <s-pagination :loading-items="[3,4,9,10,11,12,19]" v-model:current-page="page" :total="20" />

  - name: not-margin
    type: Boolean
    values: true, false
    description: 移除页码项间距，并改为无圆角的紧凑样式。
    default: false
    link: null
    usage: '#not-margin'
    code: >
      <s-pagination not-margin v-model:current-page="page" :total="20" />

  - name: progress
    type: Boolean
    values: true, false
    description: 根据当前页与总页数显示进度条。
    default: false
    link: null
    usage: '#progress'
    code: >
      <s-pagination progress v-model:current-page="page" :total="20" />

  - name: infinite
    type: Boolean
    values: true, false
    description: 是否启用无限分页。
    default: false
    link: null
    usage: '#infinite'
    code: >
      <s-pagination infinite v-model:current-page="page" :total="100" />

  - name: v-model:page-size
    type: Number
    values: null
    description: 每页数据条数。
    default: 10
    link: null
    usage: '#default'
    code: null

  - name: default-page-size
    type: Number
    values: null
    description: 每页条数的默认初始值。
    default: null
    link: null
    usage: null
    code: null

  - name: page-count
    type: Number
    values: null
    description: 总页数。设置 total 或 page-count 之一即可显示页码；使用 page-sizes 时必须设置 total。
    default: null
    link: null
    usage: null
    code: null

  - name: pager-count
    type: Number
    values: 5, 7, 9, 11, 13, 15, 17, 19, 21
    description: 页码按钮数量；总页数超过该值时会折叠。
    default: 7
    link: null
    usage: null
    code: null

  - name: default-current-page
    type: Number
    values: null
    description: 当前页的默认初始值。
    default: null
    link: null
    usage: null
    code: null

  - name: layout
    type: String, String[]
    values: prev, pager, next, jumper, ->, total, slot, sizes
    description: 分页布局，可传数组或以逗号分隔的元素字符串。
    default: [prev, pager, next, jumper, ->, total, slot, sizes]
    link: null
    usage: '#default'
    code: null

  - name: page-sizes
    type: Array
    values: number[]
    description: 每页数据条数选项。
    default: [10, 20, 30, 40, 50, 100]
    link: null
    usage: null
    code: null

  - name: hide-on-single-page
    type: Boolean
    values: true, false
    description: 每页数据条数选项。
    default: false
    link: null
    usage: '#hide-on-single-page'
    code: null

  - name: prev-text
    type: String
    values: null
    description: 上一页按钮文本。
    default: null
    link: null
    usage: null
    code: null

  - name: prev-icon
    type: String, Component
    values: null
    description: 上一页按钮图标，优先级高于 prev-text。
    default: ChevronLeft
    link: null
    usage: null
    code: null

  - name: next-text
    type: String
    values: null
    description: 下一页按钮文本。
    default: null
    link: null
    usage: null
    code: null

  - name: next-icon
    type: String, Component
    values: null
    description: 下一页按钮图标，优先级高于 next-text。
    default: ChevronRight
    link: null
    usage: null
    code: null

SLOTS:
  - name: default
    type: slot
    values: null
    description: 自定义内容；使用时需在 layout 中声明 slot。
    default: null
    link: null
    usage: '#slot'
    code: >
      <s-pagination v-model:current-page="page" :total="20">
        <template #default="{ currentPage, total, pageSize, pageSizes, pageCount }">
          // do something
        </template>
      </s-pagination>
---

# Pagination 分页

<card>

## 默认

<docs-warn />

### 布局

通过数组或逗号分隔的字符串设置 Pagination 布局。

可用值：

- `prev`：上一页按钮
- `next`：下一页按钮
- `jumper`：跳转输入框
- `pager`：页码列表
- `sizes`：每页条数选择器
- `total`：总条数
- `->`：其后的元素右对齐

::: warning 注意
组件会检测部分已废弃用法；若分页未显示或行为异常，请检查以下规则：

必须设置 `total` 或 `page-count` 之一，二者同时存在时优先使用 `page-count`。
设置 `current-page` 后，还需监听 `@update:current-page`，否则分页无法更新。
当布局包含 `sizes` 且设置了 `page-size` 时，还需监听 `@update:page-size`，否则每页条数变更不会生效。
:::

使用 `s-pagination` 即可快速添加分页，至少需要设置 `total`。

<template #example>
<pagination-default />
</template>

<template #template>

@[code{1-9} html{3}](../../.vuepress/components/pagination/default.vue)

</template>

<template #script>

@[code{11-15}](../../.vuepress/components/pagination/default.vue)

</template>

</card>

<card>

## 颜色

<coloren />

<template #example>
<pagination-color />
</template>

<template #template>

@[code{1-19} html{4}](../../.vuepress/components/pagination/color.vue)

</template>

<template #script>

@[code{21-27}](../../.vuepress/components/pagination/color.vue)

</template>

<template #style>

@[code{29-51}](../../.vuepress/components/pagination/color.vue)

</template>

</card>

<card>

## 禁用

添加布尔属性 `disabled`，即可切换组件禁用状态。

<template #example>
<pagination-disabled />
</template>

<template #template>

@[code{1-5} vue{3}](../../.vuepress/components/pagination/disabled.vue)

</template>

<template #script>

@[code{7-11}](../../.vuepress/components/pagination/disabled.vue)

</template>

</card>

<card>

## 形状

### 圆形

添加布尔属性 `circle`，即可将组件内元素改为圆形。

<template #example>
<pagination-circle />
</template>

<template #template>

@[code{1-5} vue{3}](../../.vuepress/components/pagination/circle.vue)

</template>

<template #script>

@[code{7-11}](../../.vuepress/components/pagination/circle.vue)

</template>

</card>

<card>

### 方形

添加布尔属性 `square`，即可将组件内元素改为方形。

<template #example>
<pagination-square />
</template>

<template #template>

@[code{1-5} vue{3}](../../.vuepress/components/pagination/square.vue)

</template>

<template #script>

@[code{7-11}](../../.vuepress/components/pagination/square.vue)

</template>

</card>

<card>

## 点状按钮

通过 `buttons-dotted` 完全切换组件样式，并移除各按钮中的页码。

<template #example>
<pagination-buttons-dotted />
</template>

<template #template>

@[code{1-5} vue{3}](../../.vuepress/components/pagination/buttons-dotted.vue)

</template>

<template #script>

@[code{7-11}](../../.vuepress/components/pagination/buttons-dotted.vue)

</template>

</card>

<card>

## 禁用页码

通过 `disabled-items` 指定要禁用的页码；该属性为页码数组。

::: tip
通过上一页、下一页切换时，会跳过被禁用的页码。
:::

<template #example>
<pagination-disabled-items />
</template>

<template #template>

@[code{1-9} vue{5}](../../.vuepress/components/pagination/disabled-items.vue)

</template>

<template #script>

@[code{11-30}](../../.vuepress/components/pagination/disabled-items.vue)

</template>

</card>

<card>

## 加载页码

通过 `loading-items` 指定处于加载状态的页码；该属性为页码数组。

::: tip
通过上一页、下一页切换时，会跳过加载中的页码。
:::

<template #example>
<pagination-loading-items />
</template>

<template #template>

@[code{1-9} vue{5}](../../.vuepress/components/pagination/loading-items.vue)

</template>

<template #script>

@[code{11-15}](../../.vuepress/components/pagination/loading-items.vue)

</template>

</card>

<card>

## 紧凑模式

通过 `not-margin` 移除按钮间距并调整圆角，形成紧凑样式。

<template #example>
<pagination-not-margin />
</template>

<template #template>

@[code{1-5} vue{3}](../../.vuepress/components/pagination/not-margin.vue)

</template>

<template #script>

@[code{7-11}](../../.vuepress/components/pagination/not-margin.vue)

</template>

</card>

<card>

## 进度条

通过 `progress` 为分页添加进度条，展示当前页进度。

<template #example>
<pagination-progress />
</template>

<template #template>

@[code{1-5} vue{3}](../../.vuepress/components/pagination/progress.vue)

</template>

<template #script>

@[code{7-11}](../../.vuepress/components/pagination/progress.vue)

</template>

</card>

<card>

## 无限分页

通过 `infinite` 启用无限分页；此时前后翻页按钮不会进入禁用状态。

<template #example>
<pagination-infinite />
</template>

<template #template>

@[code{1-5} vue{3}](../../.vuepress/components/pagination/infinite.vue)

</template>

<template #script>

@[code{7-11}](../../.vuepress/components/pagination/infinite.vue)

</template>

</card>

<card>

## API

</card>
