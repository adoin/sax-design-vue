---
description: "Present controlled image generation progress, cancellation, retry and results."
PROPS:
  - name: "status"
    type: "AgentStatus"
    description: "Controlled process or review state."
    default: "pending"
    usage: "#default"
  - name: "progress"
    type: "Number"
    description: "Controlled percentage, clamped to 0–100; non-finite values become 0."
    default: "0"
    usage: "#default"
  - name: "src"
    type: "String"
    description: "Result image URL; rendered only when status is complete."
    default: null
    usage: "#default"
  - name: "alt"
    type: "String"
    description: "Meaningful alternative text for the generated image."
    default: null
    usage: "#default"
  - name: "resolution"
    type: "String"
    description: "Display-only resolution label; does not change the image source."
    default: "1024 × 768"
    usage: "#default"
  - name: "error"
    type: "String"
    description: "Error message displayed with the failed state."
    default: null
    usage: "#default"
  - name: "disabled"
    type: "Boolean"
    description: "Disable component actions."
    default: "false"
    usage: "#default"
EVENTS:
  - name: "cancel"
    type: "() => void"
    description: "Cancel active generation."
  - name: "retry"
    type: "() => void"
    description: "Retry generation after failure or cancellation."
  - name: "download"
    type: "(src: string) => void"
    description: "Download action requested; image results provide their URL."
  - name: "load"
    type: "() => void"
    description: "Result image loaded."
  - name: "image-error"
    type: "() => void"
    description: "Result image failed to load."
SLOTS:
  - name: "placeholder"
    type: "{ status: AgentStatus; progress: number }"
    description: "Customize pending, running or failed image feedback."
  - name: "actions"
    type: "{ status: AgentStatus }"
    description: "Customize the action row."
---

# Image Generation

<card>

## Default

Your service controls status, progress and the resulting URL. Cancellation and retry are events, and the completed image uses the built-in preview. Download emits the URL for your own download handler.

<template #example><image-generation-default /></template>

<template #template>

@[code{32-51}](../.vuepress/components/image-generation/default.vue)

</template>

<template #script>

@[code{1-30}](../.vuepress/components/image-generation/default.vue)

</template>

<template #style>

@[code{53-66}](../.vuepress/components/image-generation/default.vue)

</template>

</card>
