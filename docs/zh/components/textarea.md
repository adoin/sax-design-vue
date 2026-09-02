---
PROPS:
  - name: shape
    type: String
    values: 'rounded | square'
    description: 设置文本域及计数器的圆角或方形几何外观。
    default: rounded
    usage: '#外形'
  - name: cols
    type: Number / Function / Boolean
    values: '原生行列数、统计函数和编辑状态'
    description: 配置文本区尺寸、字数统计、编辑能力和即时更新。
    default: null
  - name: count-method
    type: Number / Function / Boolean
    values: '原生行列数、统计函数和编辑状态'
    description: 配置文本区尺寸、字数统计、编辑能力和即时更新。
    default: null
  - name: editable
    type: Number / Function / Boolean
    values: '原生行列数、统计函数和编辑状态'
    description: 配置文本区尺寸、字数统计、编辑能力和即时更新。
    default: null
  - name: immediate
    type: Number / Function / Boolean
    values: '原生行列数、统计函数和编辑状态'
    description: 配置文本区尺寸、字数统计、编辑能力和即时更新。
    default: null
  - name: rows
    type: Number / Function / Boolean
    values: '原生行列数、统计函数和编辑状态'
    description: 配置文本区尺寸、字数统计、编辑能力和即时更新。
    default: null
  - name: v-model
    type: String
    values: 'String'
    description: 多行输入值。
    default: ''
    link: null
    usage: '#default'

  - name: label
    type: String
    values: 'String'
    description: 浮动标签文本。
    default: null
    link: null
    usage: '#label'

  - name: color
    type: String
    values: 'primary, success, danger, warning, dark'
    description: 组件颜色。
    default: primary
    link: null
    usage: '#default'

  - name: counter
    type: Number, String
    values: 'Number'
    description: 最大长度计数。
    default: null
    link: null
    usage: '#counter'

  - name: counter-danger
    type: Boolean
    values: 'true, false'
    description: 超出限制时高亮计数器。
    default: false
    link: null
    usage: '#counter'

  - name: height
    type: String
    values: 'CSS height'
    description: 多行输入高度。
    default: null
    link: null
    usage: '#height'

  - name: width
    type: String
    values: 'CSS width'
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
description: '多行文本输入，支持标签、计数与尺寸配置。'
NEWS:
  - default
  - label
  - counter
  - width
  - height
---

# Textarea（多行输入框）

<card>

## 默认

使用 `v-model` 绑定文本实现受控输入。

<template #example>
<textarea-default />
</template>

<template #template>

@[code{1-7}](../../.vuepress/components/textarea/default.vue)

</template>

<template #script>

@[code{9-12}](../../.vuepress/components/textarea/default.vue)

</template>

</card>

<card>

## 外形

设置 `shape="square"` 可让输入区域、聚焦表面与计数区域统一使用直角外观。

<template #example><textarea-shape /></template>

<template #template>

@[code{8-23}](../../.vuepress/components/textarea/shape.vue)

</template>

<template #script>

@[code{1-6}](../../.vuepress/components/textarea/shape.vue)

</template>

<template #style>

@[code{25-37}](../../.vuepress/components/textarea/shape.vue)

</template>

</card>

<card>

## 标签

标签在空字段内作为提示，聚焦或已有内容时完整上浮到边框上方，并与 Input 的标签基线保持一致。

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

@[code{1-8}](../../.vuepress/components/textarea/counter.vue)

</template>

<template #script>

@[code{10-15}](../../.vuepress/components/textarea/counter.vue)

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

## 高级能力

可用 `max-length`、`show-word-count`、`auto-size` 与 `trim`，获得字数限制和自动高度。

<template #example>
<textarea-advanced />
</template>

<template #template>

@[code{1-11}](../../.vuepress/components/textarea/advanced.vue)

</template>

<template #script>

@[code{13-17}](../../.vuepress/components/textarea/advanced.vue)

</template>

</card>
