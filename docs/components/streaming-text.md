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
    type: "{ text: string; busy: boolean }"
    description: "Replace the default content."
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

Append incoming chunks to text. Pausing preserves the reveal position; replacing the earlier prefix restarts it. finish reveals all pending text, while replay restarts the current answer. The streaming flag reflects the producer independently of the finish event.

<template #example><streaming-text-default /></template>

<template #template>

@[code{27-58}](../.vuepress/components/streaming-text/default.vue)

</template>

<template #script>

@[code{1-25}](../.vuepress/components/streaming-text/default.vue)

</template>

<template #style>

@[code{60-73}](../.vuepress/components/streaming-text/default.vue)

</template>

</card>
