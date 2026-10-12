---
description: "组合带角色、时间、反馈和内容插槽的消息。"
PROPS:
  - name: "agent-icon"
    type: "String"
    description: "助手图标 PNG / SVG 地址，覆盖全局 agentIcon；空字符串恢复默认 SVG。"
    default: null
    usage: "#shared-agent-icon"
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
    description: "默认显示助手与用户操作栏；助手提供复制、反馈与重新生成，用户提供复制与编辑。系统和工具消息默认隐藏。"
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
  - name: "edit"
    type: "() => void"
    description: "请求编辑用户消息。"
SLOTS:
  - name: "agent-icon"
    type: "Slot"
    scope: "{ busy: boolean }"
    description: "自定义默认助手图标；avatar 插槽优先。"
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

使用 content 显示纯文本，或通过默认插槽组合更丰富的内容。用户消息采用紧凑气泡，头像在右侧；通过 avatar 插槽复用 SAvatar。助手默认使用与 Agent Editor 相同的 Agent 图标；点击消息正文或时间入口可展开受控时间。反馈均受控。助手操作发出意图，由消费方重新生成或保存评价。

<template #example><message-default-zh /></template>

<template #template>

@[code{9-34}](../../.vuepress/components/message/default-zh.vue)

</template>

<template #script>

@[code{1-7}](../../.vuepress/components/message/default-zh.vue)

</template>

<template #style>

@[code{36-49}](../../.vuepress/components/message/default-zh.vue)

</template>

</card>

<card>

## 共享 Agent 图标

在 SConfigProvider 设置一次 agent-icon，即可同时替换 Message 和 Agent Editor 的默认 Agent 图标；也可以通过 app.use(SaxDesignVue, { agentIcon: "/assistant.svg" }) 全局配置。组件的 agent-icon 可单独覆盖，插槽优先于图片地址。支持 PNG 和 SVG；空字符串恢复默认图标。

<template #example><message-shared-icon-zh /></template>

<template #template>

@[code{8-23}](../../.vuepress/components/message/shared-icon-zh.vue)

</template>

<template #script>

@[code{1-7}](../../.vuepress/components/message/shared-icon-zh.vue)

</template>

<template #style>

@[code{24-31}](../../.vuepress/components/message/shared-icon-zh.vue)

</template>

</card>
