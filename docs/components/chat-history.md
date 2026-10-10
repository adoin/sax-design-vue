---
description: "Gather user prompts and navigate to a selected message with a brief highlight."
PROPS:
  - name: "message-target"
    type: "(message: AgentHistoryMessage) => HTMLElement | null | undefined"
    description: "Resolve a message element. By default, matches data-message-id inside the transcript; selection scrolls its owning viewport and briefly highlights the message."
    default: null
    usage: "#default"
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

Select a past user message to return to it with a brief highlight. Match transcript `data-message-id` values to message ids, or use `message-target` for an external list. Reduced motion uses a static highlight.

Bind visibility and use select to update active-id. History renders only user prompts and closes after selection. The example combines Message and Message Scroller.

<template #example><chat-history-default /></template>

<template #template>

@[code{58-78}](../.vuepress/components/chat-history/default.vue)

</template>

<template #script>

@[code{1-56}](../.vuepress/components/chat-history/default.vue)

</template>

<template #style>

@[code{80-93}](../.vuepress/components/chat-history/default.vue)

</template>

</card>
