---
description: "Conversation scrolling that follows new content while preserving history reading."
PROPS:
  - name: "height"
    type: "String | Number"
    description: "Viewport height. Numbers are pixels; CSS lengths are accepted."
    default: "360"
    usage: "#default"
  - name: "auto-follow"
    type: "Boolean"
    description: "Follow content while near the bottom. Reading earlier messages pauses following."
    default: "true"
    usage: "#default"
  - name: "threshold"
    type: "Number"
    description: "Distance from the bottom in pixels that counts as following."
    default: "48"
    usage: "#default"
  - name: "label"
    type: "String"
    description: "Accessible name, with a localized default."
    default: null
    usage: "#default"
EVENTS:
  - name: "follow-change"
    type: "(following: boolean) => void"
    description: "Automatic following changed."
  - name: "reach-top"
    type: "() => void"
    description: "Viewport reached the beginning after scrolling."
SLOTS:
  - name: "default"
    type: "{ following: boolean; scrollToBottom: (smooth?: boolean) => void }"
    description: "Replace the default content."
  - name: "controls"
    type: "{ following: boolean; unread: boolean; scrollToBottom: (smooth?: boolean) => void; scrollToTop: () => void }"
    description: "Customize edge navigation and unread feedback."
EXPOSES:
  - name: "scrollToTop"
    type: "() => void"
    description: "Component-owned scrollToTop access."
  - name: "scrollToBottom"
    type: "(smooth?: boolean) => void"
    description: "Component-owned scrollToBottom access."
  - name: "following"
    type: "Boolean"
    description: "Component-owned following access."
  - name: "viewport"
    type: "HTMLElement | null"
    description: "Component-owned viewport access."
---

# Message Scroller

<card>

## Default

New content follows the viewport while you are near the bottom. Scroll upward to read history without being pulled down. Prepending earlier direct message children preserves the viewport position. Use the edge controls to return to the first or latest message.

<template #example><message-scroller-default /></template>

<template #template>

@[code{21-35}](../.vuepress/components/message-scroller/default.vue)

</template>

<template #script>

@[code{1-19}](../.vuepress/components/message-scroller/default.vue)

</template>

<template #style>

@[code{37-50}](../.vuepress/components/message-scroller/default.vue)

</template>

</card>
