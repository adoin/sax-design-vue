---
PROPS:
  - name: height
    type: Number, String
    values: CSS height
    description: 进度条高度（像素）。
    default: 5
    link: null
    usage: '#height'

  - name: indeterminate
    type: Boolean
    values: true, false
    description: 不确定进度动画。
    default: false
    link: null
    usage: '#indeterminate'

  - name: percent
    type: Number
    values: 0 - 100
    description: 确定进度百分比（0–100）。
    default: 0
    link: null
    usage: '#default'

  - name: color
    type: String
    values: primary, success, danger, warning, dark
    description: 进度条颜色。
    default: primary
    link: null
    usage: '#color'
EVENTS: []
EXPOSES: []
description: "展示确定或不确定的加载进度。"
NEWS:
  - default
  - color
  - indeterminate
  - height
---

# Progress

<card>

## 默认


绑定 0–100 的 `percent` 显示标准进度条。

<template #example>
<progress-default />
</template>

<template #template>

@[code{1-5}](../../.vuepress/components/progress/default.vue)

</template>

<template #style>

@[code{7-15}](../../.vuepress/components/progress/default.vue)

</template>

</card>

<card>

## 颜色


应用主题色以匹配界面上下文。悬停进度条可查看默认插槽文字 tooltip。

<template #example>
<progress-color />
</template>

<template #template>

@[code{1-8}](../../.vuepress/components/progress/color.vue)

</template>

<template #style>

@[code{10-18}](../../.vuepress/components/progress/color.vue)

</template>

</card>

<card>

## 不确定


对未知时长操作使用 `indeterminate`。

<template #example>
<progress-indeterminate />
</template>

<template #template>

@[code{1-5}](../../.vuepress/components/progress/indeterminate.vue)

</template>

<template #style>

@[code{7-15}](../../.vuepress/components/progress/indeterminate.vue)

</template>

</card>

<card>

## 高度


通过 `height` 调整进度条粗细。

<template #example>
<progress-height />
</template>

<template #template>

@[code{1-6}](../../.vuepress/components/progress/height.vue)

</template>

<template #style>

@[code{8-16}](../../.vuepress/components/progress/height.vue)

</template>

</card>

<card>

## API

</card>
