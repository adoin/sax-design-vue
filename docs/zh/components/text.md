---
PROPS:
  - name: tag / status
    type: String / String
    values: 语义 HTML 标签 / 主题状态
    description: 选择渲染元素和语义颜色状态。
    default: 'span / -'
  - name: content
    type: String | Number
    values: text
    description: 未传默认插槽时的文本。
    default: null
  - name: line-clamp
    type: false | Number
    values: false | 正整数
    description: 文本省略行数；`false` 不省略，`1` 单行省略，`2+` 多行省略。
    default: false
  - name: typing
    type: Boolean | Number
    values: false | true | milliseconds
    description: 对 `content` 启用逐字打字效果；`true` 使用默认速度，数字表示每个字符的间隔毫秒数。
    default: false
description: '支持文本省略与逐字打字效果的语义文本。'
---

# Text 文本

<card><template #example><text-default /></template>

<template #template>

@[code{1-31}](../../.vuepress/components/text/default.vue)

</template>

<template #style>

@[code{33-60}](../../.vuepress/components/text/default.vue)

</template>

</card>
