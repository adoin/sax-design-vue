---
description: "Compose role-based messages with timestamps, feedback and content slots."
PROPS:
  - name: "role"
    type: "'user' | 'assistant' | 'system' | 'tool'"
    description: "Message role controlling author fallback and assistant actions."
    default: "assistant"
    usage: "#default"
  - name: "content"
    type: "String"
    description: "Plain content, replaceable through the default slot."
    default: "''"
    usage: "#default"
  - name: "author"
    type: "String"
    description: "Visible author name; falls back to the localized role."
    default: null
    usage: "#default"
  - name: "sent-at"
    type: "String"
    description: "Visible timestamp text revealed by the timestamp button."
    default: null
    usage: "#default"
  - name: "datetime"
    type: "String"
    description: "Machine-readable ISO timestamp for the native time element."
    default: null
    usage: "#default"
  - name: "v-model:show-time"
    type: "Boolean"
    description: "Controlled timestamp visibility. Use v-model:show-time."
    default: "false"
    usage: "#default"
  - name: "show-time"
    type: "Boolean"
    description: "Controlled timestamp visibility. Use v-model:show-time."
    default: "false"
    usage: "#default"
  - name: "loading"
    type: "Boolean"
    description: "Show busy feedback and block normal actions. Chat Input keeps Stop available."
    default: "false"
    usage: "#default"
  - name: "actions"
    type: "Boolean"
    description: "Show the action row. Assistant messages include feedback and regenerate."
    default: "true"
    usage: "#default"
  - name: "v-model:feedback"
    type: "'like' | 'dislike' | null"
    description: "Controlled helpfulness selection; pressing the selected action clears it."
    default: "null"
    usage: "#default"
  - name: "feedback"
    type: "'like' | 'dislike' | null"
    description: "Controlled helpfulness selection; pressing the selected action clears it."
    default: "null"
    usage: "#default"
  - name: "disabled"
    type: "Boolean"
    description: "Disable component actions."
    default: "false"
    usage: "#default"
  - name: "shape"
    type: "'rounded' | 'square'"
    description: "Geometry resolved from the component and SConfigProvider."
    default: null
    usage: "#shape"
EVENTS:
  - name: "update:showTime"
    type: "(value: boolean) => void"
    description: "Timestamp visibility toggle requested."
  - name: "copy"
    type: "() => void"
    description: "Clipboard write succeeded."
  - name: "copy-error"
    type: "(error: unknown) => void"
    description: "Clipboard write failed."
  - name: "update:feedback"
    type: "(value: 'like' | 'dislike' | null) => void"
    description: "Feedback selected or cleared."
  - name: "regenerate"
    type: "() => void"
    description: "Regenerate the assistant response."
SLOTS:
  - name: "default"
    description: "Replace the default content."
  - name: "avatar"
    description: "Customize the role avatar."
  - name: "header"
    description: "Customize author and timestamp trigger."
  - name: "actions"
    type: "{ copy: () => Promise<void>; feedback: 'like' | 'dislike' | null }"
    description: "Customize the action row."
---

# Message

<card>

## Default

Use content for plain text or compose richer content in the default slot. Timestamp visibility and feedback are controlled. Assistant actions emit intent so the consumer can regenerate or persist feedback.

<template #example><message-default /></template>

<template #template>

@[code{10-22}](../.vuepress/components/message/default.vue)

</template>

<template #script>

@[code{1-8}](../.vuepress/components/message/default.vue)

</template>

<template #style>

@[code{24-37}](../.vuepress/components/message/default.vue)

</template>

</card>

<card>

## Shape

Compare rounded and square geometry side by side. Both previews share controlled state so the same content and actions can be compared. Omitting shape follows the global configuration.

<template #example><message-shape /></template>

<template #template>

@[code{10-39}](../.vuepress/components/message/shape.vue)

</template>

<template #script>

@[code{1-8}](../.vuepress/components/message/shape.vue)

</template>

<template #style>

@[code{41-60}](../.vuepress/components/message/shape.vue)

</template>

</card>
