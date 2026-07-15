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
    description: 未使用默认插槽时显示的正文。
    default: null
    link: null
    usage: '#default'

  - name: type
    type: String
    values: alert, confirm
    description: alert 显示头部关闭按钮且点击遮罩可关闭；confirm 点击遮罩会抖动提示。
    default: alert
    link: null
    usage: '#alert'

  - name: color
    type: String
    values: primary, success, danger, warning, dark
    description: 标题与确认按钮的主题色。
    default: primary
    link: null
    usage: '#validation'

  - name: is-valid
    type: Boolean | String
    values: true, false, none
    description: 为 false 时禁用确认按钮；none 表示不做校验。
    default: none
    link: null
    usage: '#validation'

  - name: accept-text
    type: String
    values: String
    description: 确认按钮文案。
    default: Accept
    link: null
    usage: '#default'

  - name: cancel-text
    type: String
    values: String
    description: 取消按钮文案。
    default: Cancel
    link: null
    usage: '#default'

  - name: buttons-hidden
    type: Boolean
    values: true, false
    description: 隐藏底部操作按钮。
    default: false
    link: null
    usage: '#default'
EVENTS:
  - name: update:modelValue
    params: boolean
    description: 可见性变化。

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
description: "带插槽、校验与操作按钮的提醒/确认对话框，对应官方 Dialogs / vs-prompt。"
NEWS:
  - default
  - alert
  - validation
---

# 提示框

在 Vuesax 3.x 中，**Prompt** 位于 [Dialogs](https://lusaxweb.github.io/vuesax/components/dialogs.html) 分类下，组件名为 `vs-prompt`。它与 [Popup](https://lusaxweb.github.io/vuesax/components/popup.html)（`vs-popup`）不是同一个组件——Popup 是通用弹层容器。若需要功能更完整的模态框，请使用 [Dialog](/zh/components/dialog)。

<card>

## 默认

通过默认插槽在提示框内放置输入框、选择器或任意自定义内容。

<template #example>
<prompt-default />
</template>

<template #template>

@[code{1-12}](../.vuepress/components/prompt/default.vue)

</template>

<template #script>

@[code{14-35}](../.vuepress/components/prompt/default.vue)

</template>

<template #style>

@[code{37-60}](../.vuepress/components/prompt/default.vue)

</template>

</card>

<card>

## 警告

设置 `type="alert"` 后，头部会显示关闭按钮，点击遮罩也会关闭。

<template #example>
<prompt-alert />
</template>

<template #template>

@[code{1-12}](../.vuepress/components/prompt/alert.vue)

</template>

<template #script>

@[code{14-18}](../.vuepress/components/prompt/alert.vue)

</template>

</card>

<card>

## 校验

使用 `is-valid` 控制确认按钮是否可用，直到插槽内表单填写有效。

<template #example>
<prompt-validation />
</template>

<template #template>

@[code{1-22}](../.vuepress/components/prompt/validation.vue)

</template>

<template #script>

@[code{24-40}](../.vuepress/components/prompt/validation.vue)

</template>

</card>

<card>

## API

</card>
