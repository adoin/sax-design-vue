---
PROPS:
  - name: target
    type: String
    values: CSS selector
    description: 滚动容器选择器，默认 window。
    default: null
  - name: visibility-height
    type: Number
    values: pixels
    description: 超过该滚动高度后显示。
    default: 200
  - name: behavior
    type: String
    values: auto | smooth
    description: 点击后的原生滚动行为。
    default: smooth
EVENTS:
  - name: click
    description: 开始回到顶部时触发。
description: "兼容 VXE Backtop 的浮动回到顶部控件。"
---

# Backtop 回到顶部

<card>

## 默认

<template #example><backtop-default /></template>

<template #template>

@[code{1-6}](../../.vuepress/components/backtop/default.vue)

</template>

</card>
