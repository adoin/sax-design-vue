---
description: "Conversation scrolling that follows new content while preserving history reading."
PROPS:
  - name: "v-model:items"
    type: "AgentHistoryMessage[]"
    description: "Controlled messages; stable unique ids retain measurements and history position."
    default: null
    usage: "#dynamic-virtual-scrolling"
  - name: "virtual"
    type: "Boolean"
    description: "Use dynamic-height virtualization; false renders all items. Applies only to items mode."
    default: "true"
    usage: "#dynamic-virtual-scrolling"
  - name: "estimated-item-height"
    type: "Number"
    description: "Initial unmeasured row-height estimate in px; actual heights are measured automatically."
    default: "96"
    usage: "#dynamic-virtual-scrolling"
  - name: "overscan"
    type: "Number"
    description: "Extra rendered messages before and after the visible range."
    default: "5"
    usage: "#dynamic-virtual-scrolling"
  - name: "load-more"
    type: "MessageScrollerLoadMore"
    description: "History callback receives an AbortSignal and returns older messages in chronological order; merged unique messages update items."
    default: null
    usage: "#dynamic-virtual-scrolling"
  - name: "has-more"
    type: "Boolean"
    description: "Whether more history exists; returning an empty array also stops automatic loading."
    default: "true"
    usage: "#dynamic-virtual-scrolling"
  - name: "load-threshold"
    type: "Number"
    description: "Distance from the top in px that triggers history loading."
    default: "64"
    usage: "#dynamic-virtual-scrolling"
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
  - name: "message-action"
    type: "(event: MessageScrollerAction) => void"
    description: "Default data-message actions include item, index, action, and optional feedback or error; custom message slots listen to SMessage events directly."

  - name: "update:items"
    type: "(items: AgentHistoryMessage[]) => void"
    description: "Requests the merged, deduplicated complete message list."
  - name: "load-error"
    type: "(error: unknown) => void"
    description: "History loading failed; cancellation or unmounting does not report an error."
  - name: "follow-change"
    type: "(following: boolean) => void"
    description: "Automatic following changed."
  - name: "reach-top"
    type: "() => void"
    description: "Viewport reached the beginning after scrolling."
SLOTS:
  - name: "message"
    type: "Slot"
    scope: "{ item: AgentHistoryMessage; index: number; following: boolean }"
    description: "Customize one data item; defaults to SMessage in items mode."
  - name: "default"
    type: "{ following: boolean; scrollToBottom: (smooth?: boolean) => void }"
    description: "Replace the default content."
  - name: "controls"
    type: "{ following: boolean; unread: boolean; scrollToBottom: (smooth?: boolean) => void; scrollToTop: () => void }"
    description: "Customize edge navigation and unread feedback."
EXPOSES:
  - name: "loadMore"
    type: "() => Promise<void>"
    description: "Manually requests history through the same concurrency and deduplication flow."
  - name: "scrollToTop"
    type: "() => void"
    description: "Scroll to the first message; virtual mode uses stable immediate positioning."
  - name: "scrollToBottom"
    type: "(smooth?: boolean) => void"
    description: "Scroll to the latest message; virtual mode positions immediately, while plain mode supports smooth scrolling."
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

New content follows the viewport while you are near the bottom. Scroll upward to read history without being pulled down. Prepending earlier direct message children preserves the viewport position. The floating down arrow returns to the latest message; a dot indicates unread content.

Hover a message or focus its action buttons to show the toolbar. Agent messages offer copy, like, dislike, and regenerate; user messages offer copy and edit. Touch devices keep actions visible. The example supports editing questions, toggling feedback, and replacing responses.

<template #example><message-scroller-default /></template>

<template #template>

@[code{48-88}](../.vuepress/components/message-scroller/default.vue)

</template>

<template #script>

@[code{1-46}](../.vuepress/components/message-scroller/default.vue)

</template>

<template #style>

@[code{90-110}](../.vuepress/components/message-scroller/default.vue)

</template>

</card>

<card>

## Dynamic virtual scrolling

Binding v-model:items enables dynamic-height virtualization, rendering only visible messages and the overscan range. Use <doc-type type="AgentHistoryMessage[]" /> with stable unique ids. Wrapped text, loaded images, and streamed content are remeasured automatically. Older history preserves the reading position; the bottom follows new content while reading history only marks unread content. Connect <doc-type type="MessageScrollerLoadMore" /> and return older messages without merging them yourself. The component provides concurrency protection, id deduplication, retry, and cancellation on unmount. This example includes human and Agent turns, varied answer lengths, and three history pages. virtual=false disables virtualization; omitting items retains the original slot layout.

<template #example><message-scroller-virtual /></template>

<template #template>

@[code{75-120}](../.vuepress/components/message-scroller/virtual.vue)

</template>

<template #script>

@[code{1-74}](../.vuepress/components/message-scroller/virtual.vue)

</template>

<template #style>

@[code{121-141}](../.vuepress/components/message-scroller/virtual.vue)

</template>

</card>
