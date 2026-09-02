---
PROPS:
  - name: hover
    type: String
    values: 'default, blur, zoom, dark, scale, curtain'
    description: 悬停动画样式。
    default: default
    link: null
    usage: '#hover'

  - name: alternating
    type: Boolean
    values: 'true, false'
    description: 交替项偏移。
    default: 'false'
    link: null
    usage: '#more'

  - name: not-border-radius
    type: Boolean
    values: 'true, false'
    description: 禁用圆角。
    default: 'false'
    link: null
    usage: '#more'

  - name: not-margin
    type: Boolean
    values: 'true, false'
    description: 移除项目间距。
    default: 'false'
    link: null
    usage: '#more'
CHILD_PROPS:
  - name: src
    type: String
    values: URL
    description: SImage 使用的图片地址。
    default: null
    usage: '#default'

  - name: alt
    type: String
    values: 文本
    description: SImage 的无障碍替代文本。
    default: null
    usage: '#尺寸与适配'

  - name: fit
    type: String
    values: fill | contain | cover | none | scale-down
    description: 控制原图如何适配给定的图片容器。
    default: cover
    usage: '#尺寸与适配'

  - name: position
    type: String
    values: CSS object-position
    description: 设置图片在容器内的对齐位置，尤其适用于 cover 裁切。
    default: center
    usage: '#尺寸与适配'

  - name: width
    type: String | Number
    values: CSS 长度 | 数字
    description: 设置 SImage 项宽度；数字按像素处理。
    default: null
    usage: '#尺寸与适配'

  - name: height
    type: String | Number
    values: CSS 长度 | 数字
    description: 设置 SImage 项的明确高度；数字按像素处理。
    default: null
    usage: '#尺寸与适配'

  - name: aspect-ratio
    type: String | Number
    values: CSS aspect-ratio
    description: 未设置 height 时预留稳定的图片容器比例。
    default: 1
    usage: '#尺寸与适配'

  - name: loading
    type: String
    values: eager | lazy
    description: 选择原生立即加载或懒加载模式。
    default: eager
    usage: '#尺寸与适配'

  - name: decoding
    type: String
    values: auto | sync | async
    description: 传递原生图片解码偏好。
    default: auto
    usage: '#尺寸与适配'

  - name: preview-src-list
    type: Array
    values: string[]
    description: 提供统一图片预览器打开的图片列表。
    default: '[]'
    usage: '#预览'

  - name: initial-index
    type: Number
    values: number >= 0
    description: 设置 preview-src-list 中的初始图片下标。
    default: '0'
    usage: '#预览'

  - name: preview
    type: Boolean
    values: true | false
    description: 允许通过鼠标或键盘打开统一图片预览器。
    default: 'false'
    usage: '#预览'
EVENTS:
  - name: load
    type: Event
    description: 原图加载完成后触发。

  - name: error
    type: Event
    description: 原图加载失败时触发。

  - name: preview
    type: null
    description: SImage 打开统一图片预览器时触发。
SLOTS:
  - name: default
    type: Slot
    values: SImage
    description: 向 SImages 添加图片项。
    default: null

  - name: placeholder
    type: Slot
    values: 自定义内容
    description: 替换 SImage 内置的加载骨架。
    default: null

  - name: error
    type: Slot
    values: 自定义内容
    description: 替换 SImage 内置的加载失败状态。
    default: null
EXPOSES: []
description: '响应式图片网格，支持悬停动效与布局选项。'
NEWS:
  - default
  - fit
  - hover
  - more
---

# Images（图片组）

<card>

## 默认

在 `s-images` 内放置 `s-image` 元素。

<template #example>
<images-zh-default />
</template>

<template #template>

@[code{1-12}](../../.vuepress/components/images-zh/default.vue)

</template>

</card>

<card>

## 尺寸与适配

原图比例不必与展示容器一致。可以选择 `contain`、`cover`、`fill`、`none` 或 `scale-down`，并通过 `position` 保留裁切时的重要区域；`aspect-ratio` 会在懒加载完成前预留稳定空间。

<template #example>
<images-zh-fit />
</template>

<template #template>

@[code{12-29}](../../.vuepress/components/images-zh/fit.vue)

</template>

<template #script>

@[code{1-10}](../../.vuepress/components/images-zh/fit.vue)

</template>

<template #style>

@[code{31-52}](../../.vuepress/components/images-zh/fit.vue)

</template>

</card>

<card>

## 预览

设置 `preview` 可打开统一图片预览器。`preview-src-list` 用于提供自定义相册，触发项同时支持键盘操作。

<template #example>
<images-zh-preview />
</template>

<template #template>

@[code{8-20}](../../.vuepress/components/images-zh/preview.vue)

</template>

<template #script>

@[code{1-6}](../../.vuepress/components/images-zh/preview.vue)

</template>

</card>

<card>

## 悬停

选择悬停动画：zoom、blur、dark、scale、curtain。

<template #example>
<images-hover />
</template>

<template #template>

@[code{1-12}](../../.vuepress/components/images/hover.vue)

</template>

<template #style>

@[code{14-22}](../../.vuepress/components/images/hover.vue)

</template>

</card>

<card>

## 更多

通过 `alternating` 与 margin 属性微调间距与圆角。

<template #example>
<images-more />
</template>

<template #template>

@[code{1-8}](../../.vuepress/components/images/more.vue)

</template>

</card>
