---
PROPS:
  - name: v-model
    type: Boolean
    values: true, false
    description: 可关闭时的可见性。
    default: true
    link: null
    usage: '#closable'

  - name: text
    type: String
    values: String
    description: 标签文本。
    default: null
    link: null
    usage: '#default'

  - name: closable
    type: Boolean, String
    values: true, false
    description: 显示关闭按钮。
    default: false
    link: null
    usage: '#closable'

  - name: color
    type: String
    values: primary, success, danger, warning, dark, RGB, HEX
    description: 标签颜色。
    default: null
    link: null
    usage: '#color'

  - name: transparent
    type: Boolean
    values: true, false
    description: 透明背景样式。
    default: false
    link: null
    usage: '#transparent'

  - name: tag-style
    type: String
    values: default, outline, dashed, mark, arrow, flag
    description: 标签展示风格。mark 与 arrow 具有专门几何形态。
    default: default
    link: null
    usage: '#tag-styles'

  - name: round
    type: Boolean
    values: true, false
    description: 胶囊圆角。mark 与 arrow 使用兼容圆角的变体。
    default: false
    link: null
    usage: '#tag-styles'

  - name: size
    type: String
    values: small, default, large
    description: 标签尺寸。
    default: default
    link: null
    usage: '#tag-styles'

  - name: icon
    type: String
    values: Material icon name
    description: 标签内前置图标。
    default: null
    link: null
    usage: '#icon'

  - name: close-icon
    type: String
    values: Material icon name
    description: 关闭按钮图标。
    default: clear
    link: null
    usage: '#closable'
EVENTS:
  - name: update:modelValue
    params: boolean
    description: 可见性变化时触发（可关闭）。

  - name: click
    params: null
    description: 点击标签时触发。

  - name: close
    params: null
    description: 关闭标签时触发。

  - name: s-remove
    params: boolean
    description: 在标签组中移除时触发。
EXPOSES: []
description: '标签是表示输入、属性或操作的紧凑元素。'
NEWS:
  - default
  - color
  - transparent
  - tag-styles
  - icon
  - closable
  - chips
---

# Chip（标签）

<card>

## 默认

渲染简单标签，可选关闭行为。

<template #example>
<chip-default />
</template>

<template #template>

@[code{1-6}](../../.vuepress/components/chip/default.vue)

</template>

</card>

<card>

## 标签风格

通过 `tag-style` 选择展示形态。

<template #example>
<chip-styles />
</template>

<template #template>

@[code{1-25}](../../.vuepress/components/chip/styles.vue)

</template>

</card>

<card>

## 圆角

使用 `round` 获得胶囊标签。Arrow 保持左圆、右尖。

<template #example>
<chip-round />
</template>

<template #template>

@[code{1-8}](../../.vuepress/components/chip/round.vue)

</template>

</card>

<card>

## 尺寸

使用 `size` 适配紧凑控件或更强调的状态标签。

<template #example>
<chip-sizes />
</template>

<template #template>

@[code{1-7}](../../.vuepress/components/chip/sizes.vue)

</template>

</card>

<card>

## 组合用法

先了解各个属性，再组合颜色、展示形态、圆角、尺寸和图标。

<template #example>
<chip-combinations />
</template>

<template #template>

@[code{1-13}](../../.vuepress/components/chip/combinations.vue)

</template>

</card>

<card>

## 颜色

使用 Sax Design 色板或自定义值为标签着色。

<template #example>
<chip-color />
</template>

<template #template>

@[code{1-8}](../../.vuepress/components/chip/color.vue)

</template>

</card>

<card>

## 透明

使用 `transparent` 获得更轻的描边外观。

<template #example>
<chip-transparent />
</template>

<template #template>

@[code{1-6}](../../.vuepress/components/chip/transparent.vue)

</template>

</card>

<card>

## 图标

通过 `icon` 添加前置图标。

<template #example>
<chip-icon />
</template>

<template #template>

@[code{1-6}](../../.vuepress/components/chip/icon.vue)

</template>

</card>

<card>

## 可关闭

启用 `closable` 后可交互移除标签。

<template #example>
<chip-closable />
</template>

<template #template>

@[code{1-5}](../../.vuepress/components/chip/closable.vue)

</template>

<template #script>

@[code{7-13}](../../.vuepress/components/chip/closable.vue)

</template>

</card>

<card>

## 增删条目

组合 `s-chips` 与多个 `s-chip` 子项以增删标签。

<template #example>
<chip-chips />
</template>

<template #template>

@[code{1-8}](../../.vuepress/components/chip/chips.vue)

</template>

<template #script>

@[code{10-13}](../../.vuepress/components/chip/chips.vue)

</template>

<template #style>

@[code{15-23}](../../.vuepress/components/chip/chips.vue)

</template>

</card>

<card>

## API

</card>
