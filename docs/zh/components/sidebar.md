---
description: '在可折叠侧边栏中组织次级导航。'
PROPS:
  - name: open/v-model:open
    type: Boolean
    values: true,false
    description: 是否显示组件。
    default: false
    link: null
    usage: '#open'
    code: null

  - name: v-model
    type: String
    values: id
    description: 当前激活的项目。
    default: null
    link: null
    usage: '#default'
    code: null

  - name: absolute
    type: boolean
    values: true,false
    description: 是否使用绝对定位。
    default: false
    link: null
    usage: '#default'
    code: null

  - name: reduce
    type: Boolean
    values: true,false
    description: 是否为宽度 50px 的收起状态。
    default: false
    link: null
    usage: '#reduce'
    code: null

  - name: hover-expand
    type: Boolean
    values: true,false
    description: 鼠标进入侧栏时展开，离开时收起。
    default: false
    link: null
    usage: '#hover-expand'
    code: null

  - name: shape
    type: string
    values: square
    description: 是否移除组件圆角。
    default: false
    link: null
    usage: null
    code: null

  - name: not-shadow
    type: Boolean
    values: true,false
    description: 移除侧边栏阴影。
    default: false
    link: null
    usage: null
    code: null

  - name: background
    type: String
    values: Theme colors, RGB, HEX
    description: 设置侧边栏背景颜色。
    default: false
    link: null
    usage: '#color'
    code: null

  - name: text-white
    type: Boolean
    values: true,false
    description: 将文本颜色改为白色。
    default: false
    link: null
    usage: '#color'
    code: null

  - name: not-line-active
    type: Boolean
    values: true,false
    description: 移除项目激活指示线。
    default: false
    link: null
    usage: null
    code: null

  - name: s-sidebar-item:to
    type: String
    values: url
    description: 生成新的 vue-router 路由。
    default: null
    link: null
    usage: null
    code: null

  - name: s-sidebar-item:href
    type: String
    values: url
    description: 生成新路由。
    default: null
    link: null
    usage: null
    code: null

  - name: right
    type: Boolean
    values: true,false
    description: 是否将组件定位在右侧。
    default: null
    link: null
    usage: null
    code: null

EVENTS:
  - name: update:modelValue
    type: String
    description: 当前激活侧边栏项变化时触发。
  - name: update:open
    type: Boolean
    description: 侧边栏打开或关闭时触发。
SLOTS:
  - name: logo
    type: slot
    values: null
    description: 在整个侧边栏顶部添加元素。
    default: null
    link: null
    usage: '#default'
    code: null

  - name: footer
    type: slot
    values: null
    description: 在侧边栏底部添加元素。
    default: null
    link: null
    usage: '#default'
    code: null

  - name: header
    type: slot
    values: null
    description: 在 Logo 下方、项目上方添加元素。
    default: null
    link: null
    usage: null
    code: null

  - name: s-sidebar-item#icon
    type: slot
    values: null
    description: 用于添加图标或代表字母的区域。
    default: null
    link: null
    usage: '#default'
    code: null

NEWS:
  - name
---

# Sidebar 侧边栏

<card>

## 默认

<docs-warn />

使用 `s-sidebar` 可创建侧边栏菜单，包含 `s-sidebar-item` 和 `s-sidebar-group` 两个子组件。

<template #example>
<sidebar-default />
</template>

<template #template>

@[code{1-102}](../../.vuepress/components/sidebar/default.vue)

</template>

<template #script>

@[code{104-108}](../../.vuepress/components/sidebar/default.vue)

</template>

<template #style>

@[code{110-116}](../../.vuepress/components/sidebar/default.vue)

</template>

</card>

<card>

## 分组

通过 `s-sidebar-group` 子组件可将项目分组并收起。

:::tip
组件提供 `header` 插槽；在其中放置带 **arrow** 属性且不设置 id 的 `s-sidebar-item`，可避免点击时改变激活状态。
:::

<template #example>
<sidebar-group />
</template>

<template #template>

@[code{1-170}](../../.vuepress/components/sidebar/group.vue)

</template>

<template #script>

@[code{172-176}](../../.vuepress/components/sidebar/group.vue)

</template>

<template #style>

@[code{178-184}](../../.vuepress/components/sidebar/group.vue)

</template>

</card>

<card>

## 收起

通过 `reduce` 可将组件收起为 50px 宽，仅显示图标；该属性支持动态切换。

:::tip
为确保侧边栏正常工作，项目需要提供 `icon` 插槽，可放置图标或文本首字母。
:::

<template #example>
<sidebar-reduce />
</template>

<template #template>

@[code{1-171}](../../.vuepress/components/sidebar/reduce.vue)

</template>

<template #script>

@[code{173-177}](../../.vuepress/components/sidebar/reduce.vue)

</template>

<template #style>

@[code{179-188}](../../.vuepress/components/sidebar/reduce.vue)

</template>

</card>

<card>

## 悬浮展开

通过 `hover-expand` 可用鼠标控制侧边栏展开和收起。

<template #example>
<sidebar-reduce-expand />
</template>

<template #template>

@[code{1-171}](../../.vuepress/components/sidebar/reduce-expand.vue)

</template>

<template #script>

@[code{173-177}](../../.vuepress/components/sidebar/reduce-expand.vue)

</template>

<template #style>

@[code{179-188}](../../.vuepress/components/sidebar/reduce-expand.vue)

</template>

</card>

<card>

## 颜色

设置侧边栏颜色；需要时可通过 `text-white` 将文本颜色改为白色。

<template #example>
<sidebar-color />
</template>

<template #template>

@[code{1-118}](../../.vuepress/components/sidebar/color.vue)

</template>

<template #script>

@[code{120-124}](../../.vuepress/components/sidebar/color.vue)

</template>

<template #style>

@[code{126-135}](../../.vuepress/components/sidebar/color.vue)

</template>

</card>

<card>

## 展开状态

通过 `open` 控制侧边栏显示或隐藏，默认值为 `false`。

<template #example>
<sidebar-open />
</template>

<template #template>

@[code{1-194}](../../.vuepress/components/sidebar/open.vue)

</template>

<template #script>

@[code{196-201}](../../.vuepress/components/sidebar/open.vue)

</template>

<template #style>

@[code{203-209}](../../.vuepress/components/sidebar/open.vue)

</template>

</card>

<card>

## 右侧定位

通过 `right` 将侧边栏定位到右侧，并切换对应动画。

<template #example>
<sidebar-right />
</template>

<template #template>

@[code{1-101}](../../.vuepress/components/sidebar/right.vue)

</template>

<template #script>

@[code{103-107}](../../.vuepress/components/sidebar/right.vue)

</template>

<template #style>

@[code{109-115}](../../.vuepress/components/sidebar/right.vue)

</template>

</card>
