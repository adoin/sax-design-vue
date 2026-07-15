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
description: "带插槽、校验与 Accept/Cancel 的确认/警告提示框。复杂自定义布局请用 Dialog。"
NEWS:
  - default
  - alert
  - validation
---

# 提示框

**Prompt 就是确认/警告提示框**，与 [Dialog（对话框）](/zh/components/dialog) 不重复。

| | **Prompt**（`vs-prompt`） | **Dialog**（`vs-dialog`） |
|---|---|---|
| 定位 | 快捷 **确认**、**警告**、带校验的短表单 | **通用**模态容器 |
| 结构 | 固定：标题 + 内容 + **Accept / Cancel** 底栏 | `#header`、默认插槽、`#footer` 完全自定义 |
| 典型场景 | “确定删除？”, 验证码, 姓名校验 | 登录面板、嵌套弹窗、全屏内容 |
| 点击遮罩（confirm） | 抖动提示，需点按钮 | 可关闭或 `prevent-close` 禁止关闭 |

Vuesax 3.x 里两者同属 Dialogs 系列（`vs-prompt` 是同一套 dialog 的预设形态）。**Popup**（`vs-popup`）则是另一种带标题的内容弹层，本项目尚未迁移。

**选用建议：** 需要内置确定/取消 → **Prompt**；需要自己搭整套布局 → **Dialog**。

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
