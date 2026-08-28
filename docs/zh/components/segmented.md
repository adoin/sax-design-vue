---
PROPS:
  - name: variant
    type: String
    values: pill | text | tile
    description: 无边框展示风格。
    default: pill
  - name: block
    type: Boolean
    values: true | false
    description: 是否占满可用宽度。
    default: false
  - name: model-value/v-model
    type: String | Number
    values: option value
    description: 当前选中的选项值。
    default: null
  - name: options
    type: Array
    values: '{ label, value, disabled? }[]'
    description: 分段选项定义。
    default: '[]'
EVENTS:
  - name: change
    description: 选项变化时触发。
description: "分段单选控件。"
---
# Segmented 分段控制
<card>

## 风格

三种风格分别通过底色、留白、字重和阴影区分选项，不使用边框。方向键可以在可用选项间切换。

<template #example><segmented-default /></template><template #template>

@[code{1-7}](../../.vuepress/components/segmented/default.vue)

</template></card>
