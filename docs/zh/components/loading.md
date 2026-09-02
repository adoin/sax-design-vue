---
description: "指示内容或操作正在加载。"
PROPS:
  #__________________________________
  - name: type
    type: String
    values: "atom,ball,scale,waves,border,points,square,circles,corners,default,gradient,rectangle,square-rotate"
    description: 设置加载动画类型。
    default: default
    link: null
    usage: '#type'
    code: null
    #__________________________________
  - name: color
    type: String
    values: "Theme colors, RGB, HEX"
    description: 设置加载动画颜色。
    default: primary
    link: /theme/
    usage: '#color'
    code: null
    #__________________________________
  - name: background
    type: String
    values: "Theme colors, RGB, HEX"
    description: 设置加载层背景颜色。
    default: '#fff'
    link: /theme/
    usage: '#background'
    code: null
    #__________________________________
  - name: text
    type: String
    values: "String"
    description: 在加载动画下方添加文本。
    default: null
    link: null
    usage: '#text'
    code: null
    #__________________________________
  - name: percent
    type: Number
    values: "0 - 100 (%)"
    description: 在加载动画内显示百分比文本。
    default: null
    link: null
    usage: '#percent'
    code: null
    #__________________________________
  - name: progress
    type: Number
    values: "0 - 100"
    description: 为加载层添加进度条，值为进度百分比。
    default: null
    link: null
    usage: '#progress'
    code: null
    #__________________________________
  - name: target
    type: String | HTMLElement | Ref<HTMLElement> | Vue Component
    values: "String: Element Selector, HTMLElement: Selector element, Ref HTMLElement"
    description: 指定加载层实例挂载的父元素。
    default: null
    link: null
    usage: '#target'
    code: null
    #__________________________________
  - name: opacity
    type: Number
    values: "0 - 1"
    description: 设置背景透明度。
    default: '0.6'
    link: null
    usage: '#target'
    code: null
    #__________________________________
  - name: scale
    type: Number
    values: "null"
    description: 设置加载动画尺寸。
    default: '1'
    link: null
    usage: '#target'
    code: null
  #__________________________________
  - name: setPercent
    type: Function
    values: "(percent: Number) => void"
    description: 加载层创建后更新百分比值。
    default: null
    link: null
    usage: '#percent'
    code: null
  #__________________________________
  - name: setProgress
    type: Function
    values: "(progress: Number) => void"
    description: 加载层创建后更新进度值。
    default: null
    link: null
    usage: '#progress'
    code: null
  #__________________________________
  - name: setText
    type: Function
    values: "(text: String) => void"
    description: 加载层创建后更新文本属性值。
    default: null
    link: null
    usage: '#text'
    code: null

UPDATES:
  - type
---

# Loading 加载

<card>

## 默认

<docs-warn />

使用 Sax Design Vue 的函数式 API 创建加载层。

<Command>

```ts
import { SLoading, SLoadingFn } from 'sax-design-vue'

SLoadingFn(options)

// Or use via service
SLoading.service(options)
```

</Command>

<template #example>
<loading-default />
</template>

<template #template>

@[code{1-5}](../../.vuepress/components/loading/default.vue)

</template>

<template #script>

@[code{7-16}](../../.vuepress/components/loading/default.vue)

</template>

</card>

<card>

## 类型 <Badge text="Update" type="warn" />

通过 `type` 设置加载动画类型。

可用类型：

- atom
- ball
- scale
- waves
- border
- points
- square
- circles
- corners
- default
- gradient
- rectangle
- square-rotate

::: tip
点击示例加载层可在整页中打开。
:::

<template #example>
<loading-type />
</template>

<template #template>

@[code{1-11}](../../.vuepress/components/loading/type.vue)

</template>

<template #script>

@[code{13-64}](../../.vuepress/components/loading/type.vue)

</template>

<template #style>

@[code{66-111}](../../.vuepress/components/loading/type.vue)

</template>

</card>

<card>

## 颜色

通过 `color` 设置加载动画颜色，支持主题色、**RGB**、**HEX**。

<template #example>
<loading-color />
</template>

<template #template>

@[code{1-17}](../../.vuepress/components/loading/color.vue)

</template>

<template #script>

@[code{19-87}](../../.vuepress/components/loading/color.vue)

</template>

<template #style>

@[code{89-166}](../../.vuepress/components/loading/color.vue)

</template>

</card>

<card>

## 背景

通过 `background` 属性可修改加载层背景。

<template #example>
<loading-background />
</template>

<template #template>

@[code{1-11}](../../.vuepress/components/loading/background.vue)

</template>

<template #script>

@[code{13-29}](../../.vuepress/components/loading/background.vue)

</template>

<template #style>

@[code{31-64}](../../.vuepress/components/loading/background.vue)

</template>

</card>

<card>

## 文本

通过 `text` 添加加载说明，例如正在加载或加载失败提示。

<template #example>
<loading-text />
</template>

<template #template>

@[code{1-7}](../../.vuepress/components/loading/text.vue)

</template>

<template #script>

@[code{9-21}](../../.vuepress/components/loading/text.vue)

</template>

<template #style>

@[code{23-27}](../../.vuepress/components/loading/text.vue)

</template>

</card>

<card>

## 百分比

通过 `percent` 显示加载百分比；需要更新时使用加载实例的 `setPercent` 方法。

<template #example>
<loading-percent />
</template>

<template #template>

@[code{1-7}](../../.vuepress/components/loading/percent.vue)

</template>

<template #script>

@[code{9-33}](../../.vuepress/components/loading/percent.vue)

</template>

<template #style>

@[code{35-39}](../../.vuepress/components/loading/percent.vue)

</template>

</card>

<card>

## 进度条

通过 `progress` 在顶部显示加载进度条；值为 0 至 100 的百分比。

<template #example>
<loading-progress />
</template>

<template #template>

@[code{1-7}](../../.vuepress/components/loading/progress.vue)

</template>

<template #script>

@[code{9-33}](../../.vuepress/components/loading/progress.vue)

</template>

<template #style>

@[code{34-38}](../../.vuepress/components/loading/progress.vue)

</template>

</card>

<card>

## 目标元素

通过 `target` 可将加载层用于指定 DOM 元素；可传唯一的 `id`、`class` 选择器，也可传元素本身，例如 `$refs`。

::: tip
请确保目标元素已设置定位样式。
:::

<template #example>
<loading-target />
</template>

<template #template>

@[code{1-17}](../../.vuepress/components/loading/target.vue)

</template>

<template #script>

@[code{19-49}](../../.vuepress/components/loading/target.vue)

</template>

<template #style>

@[code{51-79}](../../.vuepress/components/loading/target.vue)

</template>

</card>
