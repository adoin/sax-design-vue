---
PROPS:
  - name: v-model
    type: String
    values: String
    description: 多行输入值。
    default: ''
    link: null
    usage: '#default'

  - name: label
    type: String
    values: String
    description: 浮动标签文本。
    default: null
    link: null
    usage: '#label'

  - name: color
    type: String
    values: primary, success, danger, warning, dark
    description: 组件颜色。
    default: primary
    link: null
    usage: '#default'

  - name: counter
    type: Number, String
    values: Number
    description: 最大长度计数。
    default: null
    link: null
    usage: '#counter'

  - name: counter-danger
    type: Boolean
    values: true, false
    description: 超出限制时高亮计数器。
    default: false
    link: null
    usage: '#counter'

  - name: height
    type: String
    values: CSS height
    description: 多行输入高度。
    default: null
    link: null
    usage: '#height'

  - name: width
    type: String
    values: CSS width
    description: 多行输入宽度。
    default: null
    link: null
    usage: '#width'
EVENTS:
  - name: update:modelValue
    params: string
    description: 值变化时触发。

  - name: input
    params: string
    description: 原生 input 事件。

  - name: focus
    params: FocusEvent
    description: 获得焦点时触发。

  - name: blur
    params: FocusEvent
    description: 失去焦点时触发。
EXPOSES: []
description: "多行文本输入，支持标签、计数与尺寸配置。"
NEWS:
  - default
  - label
  - counter
  - width
  - height
---

# Textarea

<card>

## 默认


使用 `v-model` 绑定文本实现受控输入。

<template #example>
<textarea-default />
</template>

<template #template>

@[code{1-3}](../../.vuepress/components/textarea/default.vue)

</template>

<template #script>

@[code{5-8}](../../.vuepress/components/textarea/default.vue)

</template>

</card>

<card>

## 标签


在字段上方浮动标签，使表单更清晰。

<template #example>
<textarea-label />
</template>

<template #template>

@[code{1-3}](../../.vuepress/components/textarea/label.vue)

</template>

<template #script>

@[code{5-8}](../../.vuepress/components/textarea/label.vue)

</template>

</card>

<card>

## 计数器


显示剩余字符数，超出限制时警告。

<template #example>
<textarea-counter />
</template>

<template #template>

@[code{1-3}](../../.vuepress/components/textarea/counter.vue)

</template>

<template #script>

@[code{5-8}](../../.vuepress/components/textarea/counter.vue)

</template>

</card>

<card>

## 宽度


为表单布局设置固定宽度。

<template #example>
<textarea-width />
</template>

<template #template>

@[code{1-3}](../../.vuepress/components/textarea/width.vue)

</template>

<template #script>

@[code{5-8}](../../.vuepress/components/textarea/width.vue)

</template>

</card>

<card>

## 高度


控制多行输入的可见高度。

<template #example>
<textarea-height />
</template>

<template #template>

@[code{1-3}](../../.vuepress/components/textarea/height.vue)

</template>

<template #script>

@[code{5-8}](../../.vuepress/components/textarea/height.vue)

</template>

</card>

<card>

## API

</card>
