---
description: "Gather user prompts and request navigation to a selected message."
PROPS:
  - name: "messages"
    type: "AgentHistoryMessage[]"
    description: "Conversation entries. Only user messages are included in the history list."
    default: "[]"
    usage: "#default"
  - name: "v-model"
    type: "Boolean"
    description: "Controlled visibility."
    default: "false"
    usage: "#default"
  - name: "model-value"
    type: "Boolean"
    description: "Controlled visibility."
    default: "false"
    usage: "#default"
  - name: "active-id"
    type: "String"
    description: "Id of the currently located prompt."
    default: null
    usage: "#default"
  - name: "label"
    type: "String"
    description: "Accessible name, with a localized default."
    default: null
    usage: "#default"
  - name: "shape"
    type: "'rounded' | 'square'"
    description: "Geometry resolved from the component and SConfigProvider."
    default: null
    usage: "#shape"
EVENTS:
  - name: "update:modelValue"
    type: "(value: boolean) => void"
    description: "Controlled model update requested."
  - name: "select"
    type: "(message: AgentHistoryMessage) => void"
    description: "Prompt selected for consumer-owned navigation."
SLOTS:
  - name: default
    description: "Transcript content; dimmed and made inert while history is open."
  - name: "trigger"
    description: "Customize content inside the built-in accessible trigger."
  - name: "item"
    type: "{ message: AgentHistoryMessage }"
    description: "Customize a history prompt."
---

# Chat History

<card>

## Default

Bind visibility and handle select to navigate in your transcript. History renders only user prompts and closes after selection. The example combines Message and Message Scroller.

<template #example><chat-history-default /></template>

<template #template>

@[code{24-43}](../.vuepress/components/chat-history/default.vue)

</template>

<template #script>

@[code{1-22}](../.vuepress/components/chat-history/default.vue)

</template>

<template #style>

@[code{45-58}](../.vuepress/components/chat-history/default.vue)

</template>

</card>

<card>

## Shape

Compare rounded and square geometry side by side. Both previews share controlled state so the same content and actions can be compared. Omitting shape follows the global configuration.

<template #example><chat-history-shape /></template>

<template #template>

@[code{26-69}](../.vuepress/components/chat-history/shape.vue)

</template>

<template #script>

@[code{1-24}](../.vuepress/components/chat-history/shape.vue)

</template>

<template #style>

@[code{71-90}](../.vuepress/components/chat-history/shape.vue)

</template>

</card>
