---
PROPS:
  - name: offset-top
    type: Number
    values: 像素
    description: 内容距顶部达到该距离后固定。
    default: 0
  - name: offset-bottom
    type: Number
    values: 像素
    description: 将内容固定在底部，而非顶部。
    default: null
  - name: target
    type: Function
    values: () => HTMLElement | Window
    description: 滚动目标；传入容器元素可在局部区域固定。
    default: window
  - name: z-index
    type: Number
    values: number
    description: 固定状态下的层叠顺序。
    default: 100
EVENTS:
  - name: change
    description: 固定状态变化时触发，参数为布尔值。
SLOTS:
  - name: default
    type: Slot
    values: 任意内容
    description: 需要固定的内容。
    default: null
description: "将内容固定在视口或滚动容器边缘。"
---

# Affix 固钉

<card>

## 页面吸顶

不传 `target` 时监听页面滚动。内容经过 `offset-top` 后吸附到视口顶部。

<template #example><affix-viewport /></template>

<template #template>

@[code{1-24}](../../.vuepress/components/affix/viewport.vue)

</template>

</card>

<card>

## 容器吸顶

<template #example><affix-default /></template>

<template #template>

@[code{1-24}](../../.vuepress/components/affix/default.vue)

</template>

</card>

<card>

## 底部固定

<template #example><affix-bottom /></template>

<template #template>

@[code{1-20}](../../.vuepress/components/affix/bottom.vue)

</template>

</card>

<card>

## 自定义内容

默认插槽可固定工具栏、筛选项、状态信息或任意组件。

<template #example><affix-custom-content /></template>

<template #template>

@[code{1-33}](../../.vuepress/components/affix/custom-content.vue)

</template>

</card>
