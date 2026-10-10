---
description: "组合带角色、时间、反馈和内容插槽的消息。"
PROPS:
  - name: "role"
    type: "'user' | 'assistant' | 'system' | 'tool'"
    description: "消息角色，影响默认作者名称与助手操作。"
    default: "assistant"
    usage: "#default"
  - name: "content"
    type: "String"
    description: "纯文本内容，可通过默认插槽替换。"
    default: "''"
    usage: "#default"
  - name: "author"
    type: "String"
    description: "作者名称，默认使用本地化角色名称。"
    default: null
    usage: "#default"
  - name: "sent-at"
    type: "String"
    description: "点击消息正文或时间入口后显示的时间文本。"
    default: null
    usage: "#default"
  - name: "datetime"
    type: "String"
    description: "原生 time 元素使用的机器可读 ISO 时间。"
    default: null
    usage: "#default"
  - name: "v-model:show-time"
    type: "Boolean"
    description: "受控时间显示状态，使用 v-model:show-time。"
    default: "false"
    usage: "#default"
  - name: "show-time"
    type: "Boolean"
    description: "受控时间显示状态，使用 v-model:show-time。"
    default: "false"
    usage: "#default"
  - name: "loading"
    type: "Boolean"
    description: "显示忙碌状态并阻止普通操作；聊天输入保留停止入口。"
    default: "false"
    usage: "#default"
  - name: "actions"
    type: "Boolean"
    description: "显示操作栏；助手消息包含反馈与重新生成操作。"
    default: null
    usage: "#default"
  - name: "v-model:feedback"
    type: "'like' | 'dislike' | null"
    description: "受控评价状态，再次点击当前选项会清除评价。"
    default: "null"
    usage: "#default"
  - name: "feedback"
    type: "'like' | 'dislike' | null"
    description: "受控评价状态，再次点击当前选项会清除评价。"
    default: "null"
    usage: "#default"
  - name: "disabled"
    type: "Boolean"
    description: "禁用组件操作。"
    default: "false"
    usage: "#default"
  - name: "shape"
    type: "'rounded' | 'square'"
    description: "几何形态由组件属性与 SConfigProvider 共同解析。"
    default: null
    usage: "#shape"
EVENTS:
  - name: "update:showTime"
    type: "(value: boolean) => void"
    description: "请求切换时间显示。"
  - name: "copy"
    type: "() => void"
    description: "成功写入剪贴板。"
  - name: "copy-error"
    type: "(error: unknown) => void"
    description: "写入剪贴板失败。"
  - name: "update:feedback"
    type: "(value: 'like' | 'dislike' | null) => void"
    description: "选择或清除评价。"
  - name: "regenerate"
    type: "() => void"
    description: "请求重新生成助手回答。"
SLOTS:
  - name: "default"
    description: "替换默认内容。"
  - name: "avatar"
    description: "自定义角色头像。"
  - name: "header"
    description: "自定义作者与时间入口。"
  - name: "actions"
    type: "{ copy: () => Promise<void>; feedback: 'like' | 'dislike' | null }"
    description: "自定义操作栏。"
---

# Message（消息）

<card>

## 基础用法

使用 content 显示纯文本，或通过默认插槽组合更丰富的内容。用户消息采用紧凑气泡；点击消息正文或时间入口可展开受控时间。反馈均受控。助手操作发出意图，由消费方重新生成或保存评价。

<template #example><message-default-zh /></template>

<template #template>

@[code{9-29}](../../.vuepress/components/message/default-zh.vue)

</template>

<template #script>

@[code{1-7}](../../.vuepress/components/message/default-zh.vue)

</template>

<template #style>

@[code{31-44}](../../.vuepress/components/message/default-zh.vue)

</template>

</card>

<card>

## 形状

圆角与方角并排展示。两侧共用受控状态，便于比较相同内容与操作；省略 shape 时会遵循全局配置。

<template #example><message-shape-zh /></template>

<template #template>

@[code{8-37}](../../.vuepress/components/message/shape-zh.vue)

</template>

<template #script>

@[code{1-6}](../../.vuepress/components/message/shape-zh.vue)

</template>

<template #style>

@[code{39-58}](../../.vuepress/components/message/shape-zh.vue)

</template>

</card>
