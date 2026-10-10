---
description: "汇集用户提问并请求定位所选消息。"
PROPS:
  - name: "messages"
    type: "AgentHistoryMessage[]"
    description: "对话条目；历史提问列表仅汇集 user 消息。"
    default: "[]"
    usage: "#default"
  - name: "v-model"
    type: "Boolean"
    description: "受控显示状态。"
    default: "false"
    usage: "#default"
  - name: "model-value"
    type: "Boolean"
    description: "受控显示状态。"
    default: "false"
    usage: "#default"
  - name: "active-id"
    type: "String"
    description: "当前定位的提问 id。"
    default: null
    usage: "#default"
  - name: "label"
    type: "String"
    description: "无障碍名称，默认使用本地化文本。"
    default: null
    usage: "#default"
  - name: "shape"
    type: "'rounded' | 'square'"
    description: "几何形态由组件属性与 SConfigProvider 共同解析。"
    default: null
    usage: "#shape"
EVENTS:
  - name: "update:modelValue"
    type: "(value: boolean) => void"
    description: "请求更新受控模型。"
  - name: "select"
    type: "(message: AgentHistoryMessage) => void"
    description: "选择提问，供消费方执行定位。"
SLOTS:
  - name: default
    description: "对话内容；历史展开时淡化并暂停内部交互。"
  - name: "trigger"
    description: "自定义内置可访问触发器中的内容。"
  - name: "item"
    type: "{ message: AgentHistoryMessage }"
    description: "自定义历史提问。"
---

# Chat History（聊天历史）

<card>

## 基础用法

绑定显示状态，通过 select 在对话中定位。历史列表仅显示用户提问，选择后关闭。示例组合了 Message 与 Message Scroller。

<template #example><chat-history-default-zh /></template>

<template #template>

@[code{24-43}](../../.vuepress/components/chat-history/default-zh.vue)

</template>

<template #script>

@[code{1-22}](../../.vuepress/components/chat-history/default-zh.vue)

</template>

<template #style>

@[code{45-58}](../../.vuepress/components/chat-history/default-zh.vue)

</template>

</card>

<card>

## 形状

圆角与方角并排展示。两侧共用受控状态，便于比较相同内容与操作；省略 shape 时会遵循全局配置。

<template #example><chat-history-shape-zh /></template>

<template #template>

@[code{26-69}](../../.vuepress/components/chat-history/shape-zh.vue)

</template>

<template #script>

@[code{1-24}](../../.vuepress/components/chat-history/shape-zh.vue)

</template>

<template #style>

@[code{71-90}](../../.vuepress/components/chat-history/shape-zh.vue)

</template>

</card>
