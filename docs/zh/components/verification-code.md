---
description: '使用一个真实输入框完成短信验证码输入，并以无边框视觉格展示。'
PROPS:
  - name: v-model
    type: String
    values: String
    description: 清洗后的验证码值。
    default: ''
  - name: length
    type: Number
    values: Number
    description: 视觉位数。
    default: 6
  - name: variant
    type: String
    values: soft | capsule | underline
    description: 无边框视觉风格。
    default: soft
  - name: mode
    type: String
    values: numeric | alphanumeric
    description: 允许的字符集与移动端键盘提示。
    default: numeric
  - name: mask
    type: Boolean | String
    values: Boolean | String
    description: 使用圆点或自定义字符遮罩已输入内容。
    default: false
  - name: status
    type: String
    values: default | error | success
    description: 语义状态。
    default: default
EVENTS:
  - name: complete
    params: string
    description: 所有位置填写完成时触发。
  - name: input / change
    params: string
    description: 编辑过程中或原生输入提交时触发。
---

# Verification Code 验证码输入

<card>

## 无边框风格

组件始终只渲染一个原生输入框，分格仅作为视觉层。因此粘贴、密码管理器、移动端短信验证码自动填充、文本选择和键盘输入仍按一个字段工作。

<template #example>
<verification-code-default />
</template>

<template #template>

@[code{11-38}](../../.vuepress/components/verification-code/default.vue)

</template>

<template #script>

@[code{1-9}](../../.vuepress/components/verification-code/default.vue)

</template>

</card>
