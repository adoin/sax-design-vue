---
description: "汇集用户提问，定位并短暂高亮所选消息。"
PROPS:
  - name: "message-target"
    type: "(message: AgentHistoryMessage) => HTMLElement | null | undefined"
    description: "自定义消息元素解析器。默认在 transcript 中按 data-message-id 查找；选择后仅滚动消息所在视口并短暂高亮。"
    default: null
    usage: "#default"
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
EVENTS:
  - name: "update:modelValue"
    type: "(value: boolean) => void"
    description: "请求更新受控模型。"
  - name: "select"
    type: "(message: AgentHistoryMessage) => void"
    description: "选择提问时触发，可更新 active-id 或加载外部消息。"
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

点击自己的发言历史，可回到对应消息并短暂闪烁突出。为 transcript 消息设置 `data-message-id`，与 messages 的 id 对应；也可通过 `message-target` 对接外部消息列表。减少动态效果时使用静态高亮。

绑定显示状态，通过 select 更新 active-id。历史列表仅显示用户提问，选择后关闭。示例组合了 Message 与 Message Scroller。

<template #example><chat-history-default-zh /></template>

<template #template>

@[code{58-78}](../../.vuepress/components/chat-history/default-zh.vue)

</template>

<template #script>

@[code{1-56}](../../.vuepress/components/chat-history/default-zh.vue)

</template>

<template #style>

@[code{80-93}](../../.vuepress/components/chat-history/default-zh.vue)

</template>

</card>
