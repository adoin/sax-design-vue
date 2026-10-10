---
description: "An IME-safe composer with controlled text, attachments, sending and cancellation."
PROPS:
  - name: "v-model"
    type: "String"
    description: "Controlled draft text."
    default: "''"
    usage: "#default"
  - name: "model-value"
    type: "String"
    description: "Controlled draft text."
    default: "''"
    usage: "#default"
  - name: "attachments"
    type: "AgentAttachment[]"
    description: "Controlled attachment descriptors. File selection and upload are provided by the consumer."
    default: "[]"
    usage: "#default"
  - name: "placeholder"
    type: "String"
    description: "Input hint with a localized default."
    default: null
    usage: "#default"
  - name: "label"
    type: "String"
    description: "Accessible name, with a localized default."
    default: null
    usage: "#default"
  - name: "disabled"
    type: "Boolean"
    description: "Disable component actions."
    default: "false"
    usage: "#default"
  - name: "loading"
    type: "Boolean"
    description: "Show busy feedback and block normal actions. Chat Input keeps Stop available."
    default: "false"
    usage: "#default"
  - name: "submit-on-enter"
    type: "Boolean"
    description: "Enter sends, Shift+Enter inserts a newline. Ctrl/Command+Enter also sends. Composition events never send."
    default: "true"
    usage: "#default"
  - name: "max-length"
    type: "Number"
    description: "Maximum input length, forwarded to STextarea."
    default: null
    usage: "#default"
  - name: "shape"
    type: "'rounded' | 'square'"
    description: "Geometry resolved from the component and SConfigProvider."
    default: null
    usage: "#shape"
EVENTS:
  - name: "update:modelValue"
    type: "(text: string) => void"
    description: "Controlled model update requested."
  - name: "submit"
    type: "(text: string, attachments: AgentAttachment[]) => void"
    description: "Validated content submitted."
  - name: "stop"
    type: "() => void"
    description: "Stop the active response."
  - name: "attach"
    type: "() => void"
    description: "Open the consumer file selection workflow."
  - name: "remove-attachment"
    type: "(attachment: AgentAttachment) => void"
    description: "Remove the selected attachment."
SLOTS:
  - name: "default"
    description: "Replace the default content."
  - name: "attachments"
    type: "{ attachments: AgentAttachment[] }"
    description: "Customize attachment presentation."
  - name: "tools"
    description: "Add model selection or other input tools."
EXPOSES:
  - name: "focus"
    type: "() => void"
    description: "Component-owned focus access."
  - name: "submit"
    type: "() => void"
    description: "Component-owned submit access."
---

# Chat Input

<card>

## Default

Use v-model for text and loading for an active response. Sending does not clear the draft automatically. Attach and remove-attachment let you connect SUpload.pick or your own file workflow. Enter sends, Shift+Enter inserts a newline, and IME composition never sends.

<template #example><chat-input-default /></template>

<template #template>

@[code{30-42}](../.vuepress/components/chat-input/default.vue)

</template>

<template #script>

@[code{1-28}](../.vuepress/components/chat-input/default.vue)

</template>

<template #style>

@[code{44-57}](../.vuepress/components/chat-input/default.vue)

</template>

</card>

<card>

## Shape

Compare rounded and square geometry side by side. Both previews share controlled state so the same content and actions can be compared. Omitting shape follows the global configuration.

<template #example><chat-input-shape /></template>

<template #template>

@[code{30-59}](../.vuepress/components/chat-input/shape.vue)

</template>

<template #script>

@[code{1-28}](../.vuepress/components/chat-input/shape.vue)

</template>

<template #style>

@[code{61-80}](../.vuepress/components/chat-input/shape.vue)

</template>

</card>
