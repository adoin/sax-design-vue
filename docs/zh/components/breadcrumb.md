---
PROPS:
  - name: items
    type: Array
    values: BreadcrumbItem[]（支持 children）
    description: 未使用插槽时渲染的项；children 可传入树形导航数据。
    default: []
    link: null
    usage: '#default'

  - name: separator
    type: String
    values: String
    description: 项之间的分隔符。
    default: /
    link: null
    usage: '#separator'

  - name: color
    type: String
    values: primary, success, danger, warning, dark
    description: 面包屑颜色。
    default: primary
    link: null
    usage: '#color'

  - name: align
    type: String
    values: left, center, right
    description: 水平对齐方式。
    default: left
    link: null
    usage: '#align'
  - name: trigger
    type: String | Array
    values: hover, click
    description: 树形菜单触发方式；与 Popper 触发方式一致。
    default: hover
EVENTS: []
EXPOSES: []
description: "展示当前页面在导航层级中的位置。"
NEWS:
  - default
  - color
  - separator
  - slot
  - align
---

# Breadcrumb（面包屑）

<card>

## 默认


传入 `items` 数组或使用 `s-breadcrumb-item` 插槽组合。

<template #example>
<breadcrumb-default />
</template>

<template #template>

@[code{1-3}](../../.vuepress/components/breadcrumb/default.vue)

</template>

<template #script>

@[code{5-12}](../../.vuepress/components/breadcrumb/default.vue)

</template>

</card>

<card>

## 树形快速跳转

`items` 支持 `children`。悬浮有子项的路径节点可展开多级菜单，点击任意子项快速跳转。

<template #example>
<breadcrumb-tree />
</template>

<template #template>

@[code{1-3}](../../.vuepress/components/breadcrumb/tree.vue)

</template>

<template #script>

@[code{5-33}](../../.vuepress/components/breadcrumb/tree.vue)

</template>

</card>

<card>

## 点击展开

设置 `trigger="click"` 后，点击有子项的路径节点展开菜单。可传数组组合 Popper 支持的触发方式。

<template #example>
<breadcrumb-tree-click />
</template>

<template #template>

@[code{1-3}](../../.vuepress/components/breadcrumb/tree-click.vue)

</template>

<template #script>

@[code{5-32}](../../.vuepress/components/breadcrumb/tree-click.vue)

</template>

</card>

<card>

## 颜色


通过 `color` 为主题色面包屑链接着色。

<template #example>
<breadcrumb-color />
</template>

<template #template>

@[code{1-6}](../../.vuepress/components/breadcrumb/color.vue)

</template>

<template #script>

@[code{8-18}](../../.vuepress/components/breadcrumb/color.vue)

</template>

<template #style>

@[code{20-28}](../../.vuepress/components/breadcrumb/color.vue)

</template>

</card>

<card>

## 分隔符


自定义项之间的分隔符。

<template #example>
<breadcrumb-separator />
</template>

<template #template>

@[code{1-8}](../../.vuepress/components/breadcrumb/separator.vue)

</template>

<template #script>

@[code{10-16}](../../.vuepress/components/breadcrumb/separator.vue)

</template>

<template #style>

@[code{18-25}](../../.vuepress/components/breadcrumb/separator.vue)

</template>

</card>

<card>

## 插槽


使用基于插槽的项手动构建面包屑。

<template #example>
<breadcrumb-slot />
</template>

<template #template>

@[code{1-13}](../../.vuepress/components/breadcrumb/slot.vue)

</template>

</card>

<card>

## 对齐


将路径左对齐、居中或右对齐。

<template #example>
<breadcrumb-align />
</template>

<template #template>

@[code{1-7}](../../.vuepress/components/breadcrumb/align.vue)

</template>

<template #script>

@[code{9-16}](../../.vuepress/components/breadcrumb/align.vue)

</template>

<template #style>

@[code{18-25}](../../.vuepress/components/breadcrumb/align.vue)

</template>

</card>
