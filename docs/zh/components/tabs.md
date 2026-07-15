---
PROPS:
  - name: v-model
    type: Number, String
    values: index or name
    description: 当前活动标签索引。
    default: 0
    link: null
    usage: '#default'

  - name: color
    type: String
    values: primary, success, danger
    description: 标签颜色。
    default: primary
    link: null
    usage: '#color'

  - name: alignment
    type: String
    values: left, center, right, fixed
    description: 标签对齐方式。
    default: left
    link: null
    usage: '#alignments'

  - name: position
    type: String
    values: top, bottom, left, right
    description: 标签栏位置。
    default: top
    link: null
    usage: '#position'

  - name: label
    type: String
    values: String
    description: Tab label (s-tab).
    default: Label
    link: null
    usage: '#default'

  - name: icon
    type: String
    values: Material icon
    description: Tab icon (s-tab).
    default: 
    link: null
    usage: '#icons'

  - name: disabled
    type: Boolean
    values: true, false
    description: Disable tab (s-tab).
    default: false
    link: null
    usage: '#default'
EVENTS:
  - name: update:modelValue
    params: number | string
    description: Active tab changed.

  - name: change
    params: number | string
    description: 活动标签变化时触发。
EXPOSES: []
description: "将内容组织为可切换的标签面板。"
NEWS:
  - default
  - color
  - alignments
  - position
  - icons
---

# 标签页

<card>

## 默认


在 `s-tabs` 上使用 `v-model` 控制当前标签。

<template #example>
<tabs-default />
</template>

<template #template>

@[code{1-6}](../../.vuepress/components/tabs/default.vue)

</template>

<template #script>

@[code{8-11}](../../.vuepress/components/tabs/default.vue)

</template>

</card>

<card>

## 颜色


为主题色活动指示器与标签着色。

<template #example>
<tabs-color />
</template>

<template #template>

@[code{1-6}](../../.vuepress/components/tabs/color.vue)

</template>

<template #script>

@[code{8-11}](../../.vuepress/components/tabs/color.vue)

</template>

</card>

<card>

## 对齐


将标签左对齐、居中、右对齐或固定宽度。

<template #example>
<tabs-alignments />
</template>

<template #template>

@[code{1-6}](../../.vuepress/components/tabs/alignments.vue)

</template>

<template #script>

@[code{8-11}](../../.vuepress/components/tabs/alignments.vue)

</template>

</card>

<card>

## 位置


将标签栏置于顶部、底部、左侧或右侧。

<template #example>
<tabs-position />
</template>

<template #template>

@[code{1-6}](../../.vuepress/components/tabs/position.vue)

</template>

<template #script>

@[code{8-11}](../../.vuepress/components/tabs/position.vue)

</template>

</card>

<card>

## 图标


为单个 `s-tab` 添加图标。

<template #example>
<tabs-icons />
</template>

<template #template>

@[code{1-6}](../../.vuepress/components/tabs/icons.vue)

</template>

<template #script>

@[code{8-11}](../../.vuepress/components/tabs/icons.vue)

</template>

</card>

<card>

## API

</card>
