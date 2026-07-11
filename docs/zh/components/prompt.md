---
PROPS:
  - name: v-model
    type: Boolean
    values: true, false
    description: 可见性。
    default: false
    link: null
    usage: '#default'

  - name: title
    type: String
    values: String
    description: 对话框标题。
    default: Dialog
    link: null
    usage: '#default'

  - name: text
    type: String
    values: String
    description: 对话框正文。
    default: null
    link: null
    usage: '#default'

  - name: type
    type: String
    values: alert, confirm
    description: 提示类型。
    default: alert
    link: null
    usage: '#default'

  - name: color
    type: String
    values: primary, success, danger
    description: Accent color.
    default: primary
    link: null
    usage: '#default'

  - name: accept-text
    type: String
    values: String
    description: Accept button label.
    default: Accept
    link: null
    usage: '#default'

  - name: cancel-text
    type: String
    values: String
    description: Cancel button label.
    default: Cancel
    link: null
    usage: '#default'

  - name: buttons-hidden
    type: Boolean
    values: true, false
    description: Hide action buttons.
    default: false
    link: null
    usage: '#default'
EVENTS:
  - name: update:modelValue
    params: boolean
    description: Visibility change.

  - name: accept
    params: null
    description: 点击确认时触发。

  - name: cancel
    params: null
    description: 点击取消时触发。

  - name: close
    params: null
    description: 对话框关闭时触发。
EXPOSES: []
description: "用于提醒与确认的模态提示框，可自定义操作。"
NEWS:
  - default
  - alert
---

# 提示框

<card>

## 默认


使用 `v-model` 打开确认对话框。

<template #example>
<prompt-default />
</template>

<template #template>

@[code{1-4}](../.vuepress/components/prompt/default.vue)

</template>

<template #script>

@[code{6-9}](../.vuepress/components/prompt/default.vue)

</template>

</card>

<card>

## 警告


显示单按钮的警告式提示。

<template #example>
<prompt-alert />
</template>

<template #template>

@[code{1-4}](../.vuepress/components/prompt/alert.vue)

</template>

<template #script>

@[code{6-9}](../.vuepress/components/prompt/alert.vue)

</template>

</card>

<card>

## API

</card>
