---
description: "支持输入法的聊天输入，提供受控文本、附件、发送与取消。"
PROPS:
  - name: "v-model"
    type: "String"
    description: "受控草稿文本。"
    default: "''"
    usage: "#default"
  - name: "model-value"
    type: "String"
    description: "受控草稿文本。"
    default: "''"
    usage: "#default"
  - name: "attachments"
    type: "AgentAttachment[]"
    description: "受控附件描述，文件选择与上传由消费方接入。"
    default: "[]"
    usage: "#default"
  - name: "placeholder"
    type: "String"
    description: "输入提示，默认使用本地化文本。"
    default: null
    usage: "#default"
  - name: "label"
    type: "String"
    description: "无障碍名称，默认使用本地化文本。"
    default: null
    usage: "#default"
  - name: "disabled"
    type: "Boolean"
    description: "禁用组件操作。"
    default: "false"
    usage: "#default"
  - name: "loading"
    type: "Boolean"
    description: "显示忙碌状态并阻止普通操作；聊天输入保留停止入口。"
    default: "false"
    usage: "#default"
  - name: "submit-on-enter"
    type: "Boolean"
    description: "Enter 发送，Shift+Enter 换行；Ctrl/Command+Enter 也可发送，输入法组合事件不会发送。"
    default: "true"
    usage: "#default"
  - name: "max-length"
    type: "Number"
    description: "最大输入长度，传给 STextarea。"
    default: null
    usage: "#default"
  - name: "shape"
    type: "'rounded' | 'square'"
    description: "几何形态由组件属性与 SConfigProvider 共同解析。"
    default: null
    usage: "#shape"
EVENTS:
  - name: "update:modelValue"
    type: "(text: string) => void"
    description: "请求更新受控模型。"
  - name: "submit"
    type: "(text: string, attachments: AgentAttachment[]) => void"
    description: "提交有效内容。"
  - name: "stop"
    type: "() => void"
    description: "请求停止当前响应。"
  - name: "attach"
    type: "() => void"
    description: "请求打开业务文件选择流程。"
  - name: "remove-attachment"
    type: "(attachment: AgentAttachment) => void"
    description: "请求删除所选附件。"
SLOTS:
  - name: "default"
    description: "替换默认内容。"
  - name: "attachments"
    type: "{ attachments: AgentAttachment[] }"
    description: "自定义附件展示。"
  - name: "tools"
    description: "添加模型选择等输入工具。"
EXPOSES:
  - name: "focus"
    type: "() => void"
    description: "组件提供的 focus 接口。"
  - name: "submit"
    type: "() => void"
    description: "组件提供的 submit 接口。"
---

# Chat Input（聊天输入）

<card>

## 基础用法

使用 v-model 控制文本，loading 表示响应处理中。发送不会自动清空草稿。通过 attach 和 remove-attachment 接入 SUpload.pick 或自己的文件流程。Enter 发送、Shift+Enter 换行，输入法组合过程不会发送。

<template #example><chat-input-default-zh /></template>

<template #template>

@[code{30-42}](../../.vuepress/components/chat-input/default-zh.vue)

</template>

<template #script>

@[code{1-28}](../../.vuepress/components/chat-input/default-zh.vue)

</template>

<template #style>

@[code{44-57}](../../.vuepress/components/chat-input/default-zh.vue)

</template>

</card>

<card>

## 形状

圆角与方角并排展示。两侧共用受控状态，便于比较相同内容与操作；省略 shape 时会遵循全局配置。

<template #example><chat-input-shape-zh /></template>

<template #template>

@[code{30-59}](../../.vuepress/components/chat-input/shape-zh.vue)

</template>

<template #script>

@[code{1-28}](../../.vuepress/components/chat-input/shape-zh.vue)

</template>

<template #style>

@[code{61-80}](../../.vuepress/components/chat-input/shape-zh.vue)

</template>

</card>
