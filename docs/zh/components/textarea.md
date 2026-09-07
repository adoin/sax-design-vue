---
PROPS:
  - name: shape
    type: String
    values: 'rounded | square'
    description: 设置文本域及计数器的圆角或方形几何外观。
    default: rounded
    usage: '#外形'
  - name: v-model
    type: String
    values: 'string'
    description: 多行输入值。
    default: ''
    usage: '#default'
  - name: label
    type: String
    values: '标签文字'
    description: 浮动标签文本。
    default: null
    usage: '#label'
  - name: color
    type: String
    values: '主题色 | RGB | HEX | HSL'
    description: 设置文本域与计数器的强调色。
    default: primary
    usage: '#default'
  - name: counter
    type: Number | String
    values: '数字或数字字符串'
    description: 显示字符限制和计数器。
    default: null
    usage: '#counter'
  - name: counter-danger
    type: Boolean
    values: 'true | false'
    description: 超出限制时高亮计数器。
    default: false
    usage: '#counter'
  - name: placeholder
    type: String
    values: '占位文字'
    description: 设置原生 textarea 的占位文字。
    default: null
    usage: '#default'
  - name: name
    type: String
    values: '表单字段名'
    description: 设置原生表单字段名。
    default: null
    usage: '#default'
  - name: form
    type: String
    values: '表单元素 id'
    description: 将文本域关联到指定表单元素。
    default: null
    usage: '#default'
  - name: max-length
    type: Number | String
    values: '非负长度'
    description: 设置原生输入长度限制。
    default: null
    usage: '#advanced'
  - name: show-word-count
    type: Boolean
    values: 'true | false'
    description: 显示当前字符数。
    default: false
    usage: '#advanced'
  - name: count-method
    type: Function
    values: '({ value: string }) => number'
    description: 自定义显示的字符数。
    default: value.length
    usage: '#advanced'
  - name: auto-size
    type: Object
    values: '{ minRows, maxRows }'
    description: 在行数范围内随内容自动增高。
    default: null
    usage: '#advanced'
  - name: readonly
    type: Boolean
    values: 'true | false'
    description: 将原生 textarea 设为只读。
    default: false
    usage: '#advanced'
  - name: disabled
    type: Boolean
    values: 'true | false'
    description: 禁用编辑与交互。
    default: false
    usage: '#advanced'
  - name: editable
    type: Boolean
    values: 'true | false'
    description: 是否允许编辑文本域的值。
    default: true
    usage: '#advanced'
  - name: trim
    type: Boolean
    values: 'true | false'
    description: 提交变更时移除首尾空白字符。
    default: false
    usage: '#advanced'
  - name: rows
    type: Number | String
    values: '原生行数'
    description: 设置原生 textarea 的行数。
    default: null
    usage: '#advanced'
  - name: cols
    type: Number | String
    values: '原生列数'
    description: 设置原生 textarea 的列数。
    default: null
    usage: '#advanced'
  - name: resize
    type: String
    values: 'none | both | horizontal | vertical'
    description: 设置原生尺寸调整方向。
    default: null
    usage: '#advanced'
  - name: immediate
    type: Boolean
    values: 'true | false'
    description: 输入时立即更新，或在 change、blur 时提交值。
    default: true
    usage: '#advanced'
  - name: height
    type: String
    values: 'CSS height'
    description: 多行输入高度。
    default: null
    usage: '#height'
  - name: width
    type: String
    values: 'CSS width'
    description: 多行输入宽度。
    default: null
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

# Textarea 多行输入框

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
