---
PROPS:
  - name: variant
    type: String
    values: "classic | soft | steps"
    description: 选择细轨、柔和内嵌轨道或离散刻度风格。
    default: classic
    link: null
    usage: '#风格'

  - name: show-value
    type: Boolean
    values: "true, false"
    description: 始终显示当前值浮层。
    default: false
    link: null
    usage: '#风格'
  - name: shape
    type: String
    values: "rounded | square"
    description: 为轨道、滑块点、刻度点和数值气泡选择圆形或方形几何外观。
    default: rounded
    link: null
    usage: '#外形'
  - name: v-model
    type: Number
    values: "Number"
    description: 当前值。
    default: 0
    link: null
    usage: '#default'

  - name: min
    type: Number
    values: "Number"
    description: 最小值。
    default: 0
    link: null
    usage: '#default'

  - name: max
    type: Number
    values: "Number"
    description: 最大值。
    default: 100
    link: null
    usage: '#default'

  - name: step
    type: Number
    values: "Number"
    description: 步进增量。
    default: 1
    link: null
    usage: '#default'

  - name: disabled
    type: Boolean
    values: "true, false"
    description: 禁用交互。
    default: false
    link: null
    usage: '#default'

  - name: color
    type: String
    values: "primary, success, danger"
    description: 滑块颜色。
    default: primary
    link: null
    usage: '#color'

  - name: text-fixed
    type: String
    values: "String"
    description: 值旁显示的后缀。
    default:
    link: null
    usage: '#text-fixed'

  - name: ticks
    type: Boolean
    values: "true, false"
    description: 显示刻度线。
    default: false
    link: null
    usage: '#ticks'
EVENTS:
  - name: update:modelValue
    params: number
    description: 值变化时触发。

  - name: change
    params: number
    description: 值提交时触发。
EXPOSES: []
description: '沿轨道拖动选择数值。'
NEWS:
  - default
  - color
  - ticks
  - text-fixed
---

# Slider（滑块）

<card>

## 风格

`classic`、`soft`、`steps` 改变的是轨道和滑块的结构，而不只是颜色。所有风格都使用同一个原生范围输入，并保证滑块与轨道中心线严格对齐。

<template #example>
<slider-variants />
</template>

<template #template>

@[code{11-42}](../../.vuepress/components/slider/variants.vue)

</template>

<template #script>

@[code{1-9}](../../.vuepress/components/slider/variants.vue)

</template>

<template #style>

@[code{44-57}](../../.vuepress/components/slider/variants.vue)

</template>

</card>

<card>

## 外形

设置 `shape="square"` 后，轨道、已完成轨道、滑块点、刻度点和数值气泡会统一使用方形几何外观。形状与 `variant` 相互独立，因此可与 `classic`、`soft`、`steps` 组合使用。

<template #example>
<slider-shape />
</template>

<template #template>

@[code{12-53}](../../.vuepress/components/slider/shape.vue)

</template>

<template #script>

@[code{1-10}](../../.vuepress/components/slider/shape.vue)

</template>

<template #style>

@[code{55-68}](../../.vuepress/components/slider/shape.vue)

</template>

</card>

<card>

## 默认

在 `min` 与 `max` 之间用 `v-model` 绑定数值。

<template #example>
<slider-default />
</template>

<template #template>

@[code{1-3}](../../.vuepress/components/slider/default.vue)

</template>

<template #script>

@[code{5-8}](../../.vuepress/components/slider/default.vue)

</template>

</card>

<card>

## 颜色

滑块与已完成轨道共用所选颜色；在 `soft` 风格下，轨道会自动使用由该颜色计算出的柔和透明色阶。本例分别为 `classic`、`soft`、`steps` 搭配不同的语义色，其中 `steps` 使用步长 10，确保离散刻度清晰分开。

<template #example>
<slider-color />
</template>

<template #template>

@[code{1-7}](../../.vuepress/components/slider/color.vue)

</template>

<template #script>

@[code{9-14}](../../.vuepress/components/slider/color.vue)

</template>

<template #style>

@[code{16-24}](../../.vuepress/components/slider/color.vue)

</template>

</card>

<card>

## 刻度

沿轨道显示步进刻度。

<template #example>
<slider-ticks />
</template>

<template #template>

@[code{1-3}](../../.vuepress/components/slider/ticks.vue)

</template>

<template #script>

@[code{5-8}](../../.vuepress/components/slider/ticks.vue)

</template>

</card>

<card>

## 固定文本

在当前值旁追加后缀，如 `%`。

<template #example>
<slider-text-fixed />
</template>

<template #template>

@[code{1-3}](../../.vuepress/components/slider/text-fixed.vue)

</template>

<template #script>

@[code{5-8}](../../.vuepress/components/slider/text-fixed.vue)

</template>

</card>
