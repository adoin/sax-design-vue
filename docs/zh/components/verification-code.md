---
description: '使用一个真实输入框完成短信验证码输入，并以无边框视觉格展示。'
PROPS:
  - name: shape
    type: String
    values: 'rounded | square'
    description: 设置验证码视觉格的圆角或方形外观。
    default: rounded
    usage: '#外形'
  - name: v-model
    type: String
    values: 'String'
    description: 清洗后的验证码值。
    default: ''
  - name: length
    type: Number
    values: 'Number'
    description: 视觉位数。
    default: 6
  - name: variant
    type: String
    values: 'soft | capsule | underline'
    description: 无边框视觉风格。
    default: soft
  - name: mode
    type: String
    values: 'numeric | alphanumeric'
    description: 允许的字符集与移动端键盘提示。
    default: numeric
  - name: mask
    type: Boolean | String
    values: 'Boolean | String'
    description: 使用圆点或自定义字符遮罩已输入内容。
    default: false
  - name: status
    type: String
    values: 'default | error | success'
    description: 语义状态。
    default: default
EVENTS:
  - name: complete
    params: string
    description: 所有位置填写完成时触发。
  - name: input
    params: string
    description: 编辑过程中或原生输入提交时触发。
  - name: change
    params: string
    description: 编辑过程中或原生输入提交时触发。
---

# Verification Code 验证码输入

<card>

## 无边框风格

组件始终只渲染一个原生输入框，分格仅作为视觉层。因此粘贴、密码管理器、移动端短信验证码自动填充、文本选择和键盘输入仍按一个字段工作。

默认 `mode="numeric"` 仅接受数字；设置 `mode="alphanumeric"` 后可输入英文与数字混合验证码。

<template #example>
<verification-code-default />
</template>

<template #template>

@[code{11-41}](../../.vuepress/components/verification-code/default.vue)

</template>

<template #script>

@[code{1-9}](../../.vuepress/components/verification-code/default.vue)

</template>

<template #style>

@[code{43-54}](../../.vuepress/components/verification-code/default.vue)

</template>

</card>

<card>

## 外形

设置 `shape="square"` 可让所有验证码视觉单元统一使用直角外观，同时仍保留单一原生输入框。

<template #example><verification-code-shape /></template>

<template #template>

@[code{8-19}](../../.vuepress/components/verification-code/shape.vue)

</template>

<template #script>

@[code{1-6}](../../.vuepress/components/verification-code/shape.vue)

</template>

<template #style>

@[code{21-32}](../../.vuepress/components/verification-code/shape.vue)

</template>

</card>
