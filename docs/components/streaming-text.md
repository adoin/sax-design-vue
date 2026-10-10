---
description: "Reveal accumulated plain text safely with pause, replay and reduced-motion support."
PROPS:
  - name: "text"
    type: "String"
    description: "The accumulated plain response. Append chunks to this string; replacing its prefix restarts reveal."
    default: "''"
    usage: "#default"
  - name: "interval"
    type: "Number"
    description: "Reveal tick interval in milliseconds. 0 shows all immediately; long text uses at most 200 ticks."
    default: "18"
    usage: "#default"
  - name: "paused"
    type: "Boolean"
    description: "Pause reveal without losing its current position."
    default: "false"
    usage: "#default"
  - name: "animate"
    type: "Boolean"
    description: "Enable reveal animation. Reduced-motion preferences still show text immediately."
    default: "true"
    usage: "#default"
  - name: "streaming"
    type: "Boolean"
    description: "Whether the producer is still streaming, independent of local reveal completion."
    default: "false"
    usage: "#default"
EVENTS:
  - name: "finish"
    type: "() => void"
    description: "The currently accumulated text has finished revealing, including empty text. This does not indicate that the producer has stopped."
SLOTS:
  - name: "default"
    type: "Slot"
    scope: "{ text: string; busy: boolean; chunks: { text: string; key: string }[]; paragraphs: { text: string; key: string }[][]; wordClass: string }"
    description: "Render structured content with safe chunks, paragraph groups and the matching reveal class."
EXPOSES:
  - name: "finish"
    type: "() => void"
    description: "Component-owned finish access."
  - name: "replay"
    type: "() => void"
    description: "Component-owned replay access."
---

# Streaming Text

<card>

## Default

New text arrives with a brief blue, violet and pink tint before returning to the normal text color. The status row and full response remain after completion. Code Block demonstrates a terminal panel reveal and incremental command output; commands are displayed, never executed.

Append incoming chunks to text. Pausing preserves the reveal position; replacing the earlier prefix restarts it. finish reveals all pending text, while replay restarts the current answer. The streaming flag reflects the producer independently of the finish event.

<template #example><streaming-text-default /></template>

<template #template>

@[code{27-84}](../.vuepress/components/streaming-text/default.vue)

</template>

<template #script>

@[code{1-25}](../.vuepress/components/streaming-text/default.vue)

</template>

<template #style>

@[code{86-122}](../.vuepress/components/streaming-text/default.vue)

</template>

</card>
