---
PROPS:
  - name: bottom / right
    type: Number
    values: 像素
    description: 设置距视口的距离；设置 target 后，距离相对目标容器计算。
    default: '40 / 40'
  - name: target
    type: String
    values: CSS selector
    description: 滚动容器选择器，控件会定位在该容器内；默认 window。
    default: null
  - name: visibility-height
    type: Number
    values: pixels
    description: 超过该滚动高度后显示；与 visibility-bottom 任一满足即显示。
    default: 200
  - name: visibility-bottom
    type: Number
    values: pixels
    description: 距滚动容器底部不超过该距离后显示；与 visibility-height 任一满足即显示。
    default: null
  - name: behavior
    type: String
    values: auto | smooth
    description: 点击后的原生滚动行为。
    default: smooth
EVENTS:
  - name: click
    description: 开始回到顶部时触发。
SLOTS:
  - name: default
    type: Slot
    values: 图标或自定义内容
    description: 替换默认向上箭头。
    default: IconArrow
description: "浮动回到顶部控件。"
---

# Backtop 回到顶部

<card>

## 默认

滚动容器超过 96px 后出现，控件固定在容器右下角；不需要搭配 Affix。

<template #example><backtop-default /></template>

<template #template>

@[code{1-14}](../../.vuepress/components/backtop/default.vue)

</template>

</card>

<card>

## 接近底部显示

适合列表、动态加载等场景。`visibility-height` 与 `visibility-bottom` 是“或”关系；此例将前者设为很大数值，只演示距底部 72px 触发。

<template #example><backtop-bottom-distance /></template>

<template #template>

@[code{1-16}](../../.vuepress/components/backtop/bottom-distance.vue)

</template>

</card>

<card>

## 自定义图标

通过默认插槽替换内置箭头，可放入图标或任意自定义内容。

<template #example><backtop-custom-icon /></template>

<template #template>

@[code{1-18}](../../.vuepress/components/backtop/custom-icon.vue)

</template>

</card>
