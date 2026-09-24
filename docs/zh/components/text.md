---
PROPS:
  - name: tag
    type: String
    values: '语义 HTML 标签'
    description: 选择渲染元素和语义颜色状态。
    default: 'span'
  - name: status
    type: String
    values: '主题状态'
    description: 选择渲染元素和语义颜色状态。
    default: null
  - name: content
    type: String | Number
    values: 'text'
    description: 未传默认插槽时的文本。
    default: null
  - name: effect
    type: TextEffect
    values: 'default | shimmer | typing | rainbow | neon | shadow'
    description: 选择文字特效；`shimmer` 生成扫光，`typing` 逐字显示 `content`，`rainbow` 循环语义色，`neon` 脉冲发光，`shadow` 移动柔和渐变投影；系统偏好减少动态效果时静态显示。
    default: 'default'
  - name: line-clamp
    type: false | Number
    values: 'false | 正整数'
    description: 文本省略行数；`false` 不省略，`1` 单行省略，`2+` 多行省略。
    default: false
description: '支持可选文字特效、文本省略与逐字打字效果的语义文本。'
---

# Text 文本

<card>

使用 `effect="shimmer"` 表示正在生成、思考等进行中的文案，使用 `effect="typing"` 将 `content` 逐字显示，使用 `rainbow`、`neon` 或 `shadow` 提供装饰性强调。该属性只提供视觉效果；业务状态需要被辅助技术播报时，应为所在区域补充合适的实时区域语义。

<template #example><text-zh-default /></template>

<template #template>

@[code{1-53}](../../.vuepress/components/text-zh/default.vue)

</template>

<template #style>

@[code{55-98}](../../.vuepress/components/text-zh/default.vue)

</template>

</card>
