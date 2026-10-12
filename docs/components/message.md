---
description: "Compose role-based messages with timestamps, feedback and content slots."
PROPS:
  - name: "agent-icon"
    type: "String"
    description: "Assistant PNG / SVG URL overriding global agentIcon; an empty string restores the default SVG."
    default: null
    usage: "#shared-agent-icon"
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
    description: "Visible timestamp text revealed by selecting the message body or timestamp control."
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
    description: "Show icon actions. Defaults to enabled for assistant messages and disabled for other roles; explicitly set actions to override."
    default: null
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
  - name: "agent-icon"
    type: "Slot"
    scope: "{ busy: boolean }"
    description: "Customize the default assistant icon; avatar takes precedence."
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

Use content for plain text or compose richer content in the default slot. User content is a compact bubble; select the message body or its timestamp control to reveal a controlled timestamp. Feedback is controlled. Assistant actions emit intent so the consumer can regenerate or persist feedback.

<template #example><message-default /></template>

<template #template>

@[code{11-36}](../.vuepress/components/message/default.vue)

</template>

<template #script>

@[code{1-9}](../.vuepress/components/message/default.vue)

</template>

<template #style>

@[code{38-51}](../.vuepress/components/message/default.vue)

</template>

</card>

<card>

## Shared Agent icon

Set agent-icon once on SConfigProvider to replace the default Agent icon in both Message and Agent Editor, or configure app.use(SaxDesignVue, { agentIcon: "/assistant.svg" }). A component agent-icon overrides the shared value, and slots take precedence over URLs. PNG and SVG are supported; an empty string restores the default icon.

<template #example><message-shared-icon /></template>

<template #template>

@[code{8-23}](../.vuepress/components/message/shared-icon.vue)

</template>

<template #script>

@[code{1-7}](../.vuepress/components/message/shared-icon.vue)

</template>

<template #style>

@[code{24-31}](../.vuepress/components/message/shared-icon.vue)

</template>

</card>
