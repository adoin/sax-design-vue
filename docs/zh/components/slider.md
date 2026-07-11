---
PROPS:
  - name: v-model
    type: Number
    values: Number
    description: 当前值。
    default: 0
    link: null
    usage: '#default'

  - name: min
    type: Number
    values: Number
    description: 最小值。
    default: 0
    link: null
    usage: '#default'

  - name: max
    type: Number
    values: Number
    description: 最大值。
    default: 100
    link: null
    usage: '#default'

  - name: step
    type: Number
    values: Number
    description: 步进增量。
    default: 1
    link: null
    usage: '#default'

  - name: disabled
    type: Boolean
    values: true, false
    description: Disable interaction.
    default: false
    link: null
    usage: '#default'

  - name: color
    type: String
    values: primary, success, danger
    description: 滑块颜色。
    default: primary
    link: null
    usage: '#color'

  - name: text-fixed
    type: String
    values: String
    description: 值旁显示的后缀。
    default: 
    link: null
    usage: '#text-fixed'

  - name: ticks
    type: Boolean
    values: true, false
    description: 显示刻度线。
    default: false
    link: null
    usage: '#ticks'
EVENTS:
  - name: update:modelValue
    params: number
    description: Value changed.

  - name: change
    params: number
    description: Value committed.
EXPOSES: []
description: "沿轨道拖动选择数值。"
NEWS:
  - default
  - color
  - ticks
  - text-fixed
---

# 滑块

<card>

## 默认


在 `min` 与 `max` 之间用 `v-model` 绑定数值。

<template #example>
<slider-default />
</template>

<template #template>

@[code{1-3}](../.vuepress/components/slider/default.vue)

</template>

<template #script>

@[code{5-8}](../.vuepress/components/slider/default.vue)

</template>

</card>

<card>

## 颜色


为轨道与滑块着色以匹配主题。

<template #example>
<slider-color />
</template>

<template #template>

@[code{1-7}](../.vuepress/components/slider/color.vue)

</template>

<template #script>

@[code{9-14}](../.vuepress/components/slider/color.vue)

</template>

<template #style>

@[code{16-24}](../.vuepress/components/slider/color.vue)

</template>

</card>

<card>

## 刻度


沿轨道显示步进刻度。

<template #example>
<slider-ticks />
</template>

<template #template>

@[code{1-3}](../.vuepress/components/slider/ticks.vue)

</template>

<template #script>

@[code{5-8}](../.vuepress/components/slider/ticks.vue)

</template>

</card>

<card>

## 固定文本


在当前值旁追加后缀，如 `%`。

<template #example>
<slider-text-fixed />
</template>

<template #template>

@[code{1-3}](../.vuepress/components/slider/text-fixed.vue)

</template>

<template #script>

@[code{5-8}](../.vuepress/components/slider/text-fixed.vue)

</template>

</card>

<card>

## API

</card>
