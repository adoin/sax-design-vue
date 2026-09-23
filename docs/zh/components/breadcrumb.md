---
PROPS:
  - name: items
    type: Array
    values: 'BreadcrumbItem[]（支持 children）'
    description: 未使用插槽时渲染的项；children 可传入树形导航数据，数据驱动的项可在宽度不足时自动折叠。
    default: []
    link: null
    usage: '#default'

  - name: separator
    type: String
    values: 'String'
    description: 项之间的分隔符。
    default: /
    link: null
    usage: '#separator'

  - name: color
    type: String
    values: 'primary, success, danger, warning, dark'
    description: 面包屑颜色。
    default: primary
    link: null
    usage: '#color'

  - name: align
    type: String
    values: 'left, center, right'
    description: 水平对齐方式。
    default: left
    link: null
    usage: '#align'
  - name: trigger
    type: String | Array
    values: 'hover, click'
    description: 树形菜单触发方式；与 Popper 触发方式一致。
    default: hover
  - name: collapse
    type: Boolean
    values: 'true, false'
    description: 数据驱动的项超出可用宽度时自动折叠连续的中间层级。插槽模式继续由调用方手动组合。
    default: true
    usage: '#responsive-overflow'
EVENTS: []
EXPOSES: []
description: '展示当前页面在导航层级中的位置。'
NEWS:
  - default
  - responsive-overflow
  - tree-overflow
  - color
  - separator
  - slot
  - align
---

# Breadcrumb 面包屑

<card>

## 默认

传入 `items` 数组或使用 `s-breadcrumb-item` 插槽组合。

<template #example>
<breadcrumb-zh-default />
</template>

<template #template>

@[code{1-3}](../../.vuepress/components/breadcrumb-zh/default.vue)

</template>

<template #script>

@[code{5-12}](../../.vuepress/components/breadcrumb-zh/default.vue)

</template>

</card>

<card>

## 响应式省略

容器变窄时，数据驱动的面包屑保留首尾层级，并把连续的中间层级折叠为横向省略号。悬浮或聚焦省略号可按顺序只读查看完整路径；点击可查看支持换行和跳转的完整路径。设置 `:collapse="false"` 可关闭自动折叠。插槽模式仍由调用方自行排布。

<template #example>
<breadcrumb-zh-overflow />
</template>

<template #template>

@[code{21-28}](../../.vuepress/components/breadcrumb-zh/overflow.vue)

</template>

<template #script>

@[code{1-19}](../../.vuepress/components/breadcrumb-zh/overflow.vue)

</template>

<template #style>

@[code{30-44}](../../.vuepress/components/breadcrumb-zh/overflow.vue)

</template>

</card>

<card>

## 树形快速跳转

`items` 支持 `children`。悬浮有子项的路径节点可展开多级菜单，点击任意子项快速跳转。

<template #example>
<breadcrumb-zh-tree />
</template>

<template #template>

@[code{1-3}](../../.vuepress/components/breadcrumb-zh/tree.vue)

</template>

<template #script>

@[code{5-33}](../../.vuepress/components/breadcrumb-zh/tree.vue)

</template>

</card>

<card>

## 树形省略

点击省略号可在换行面板中查看完整面包屑。每一级仍保留导航链接；有 `children` 的层级继续提供树形快捷菜单。独立的展开按钮负责打开子级，标题链接负责跳转。

<template #example>
<breadcrumb-zh-tree-overflow />
</template>

<template #template>

@[code{34-41}](../../.vuepress/components/breadcrumb-zh/tree-overflow.vue)

</template>

<template #script>

@[code{1-32}](../../.vuepress/components/breadcrumb-zh/tree-overflow.vue)

</template>

<template #style>

@[code{43-57}](../../.vuepress/components/breadcrumb-zh/tree-overflow.vue)

</template>

</card>

<card>

## 点击展开

设置 `trigger="click"` 后，点击有子项路径节点的展开按钮打开菜单；标题仍是导航链接。可传数组组合 Popper 支持的触发方式。

<template #example>
<breadcrumb-zh-tree-click />
</template>

<template #template>

@[code{1-3}](../../.vuepress/components/breadcrumb-zh/tree-click.vue)

</template>

<template #script>

@[code{5-32}](../../.vuepress/components/breadcrumb-zh/tree-click.vue)

</template>

</card>

<card>

## 颜色

通过 `color` 为主题色面包屑链接着色。

<template #example>
<breadcrumb-zh-color />
</template>

<template #template>

@[code{1-6}](../../.vuepress/components/breadcrumb-zh/color.vue)

</template>

<template #script>

@[code{8-18}](../../.vuepress/components/breadcrumb-zh/color.vue)

</template>

<template #style>

@[code{20-28}](../../.vuepress/components/breadcrumb-zh/color.vue)

</template>

</card>

<card>

## 分隔符

自定义项之间的分隔符。

<template #example>
<breadcrumb-zh-separator />
</template>

<template #template>

@[code{1-8}](../../.vuepress/components/breadcrumb-zh/separator.vue)

</template>

<template #script>

@[code{10-16}](../../.vuepress/components/breadcrumb-zh/separator.vue)

</template>

<template #style>

@[code{18-25}](../../.vuepress/components/breadcrumb-zh/separator.vue)

</template>

</card>

<card>

## 插槽

使用基于插槽的项手动构建面包屑。

<template #example>
<breadcrumb-zh-slot />
</template>

<template #template>

@[code{1-13}](../../.vuepress/components/breadcrumb-zh/slot.vue)

</template>

</card>

<card>

## 对齐

将路径左对齐、居中或右对齐。

<template #example>
<breadcrumb-zh-align />
</template>

<template #template>

@[code{1-7}](../../.vuepress/components/breadcrumb-zh/align.vue)

</template>

<template #script>

@[code{9-16}](../../.vuepress/components/breadcrumb-zh/align.vue)

</template>

<template #style>

@[code{18-25}](../../.vuepress/components/breadcrumb-zh/align.vue)

</template>

</card>
