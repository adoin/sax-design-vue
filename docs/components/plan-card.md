---
description: "Review a structured plan and approve or reject it explicitly."
PROPS:
  - name: "title"
    type: "String"
    description: "Heading text; process lists use a localized fallback."
    default: "''"
    usage: "#default"
  - name: "description"
    type: "String"
    description: "Supporting plan text."
    default: null
    usage: "#default"
  - name: "tasks"
    type: "AgentTask[]"
    description: "Tasks with stable ids, status and optional progress."
    default: "[]"
    usage: "#default"
  - name: "content"
    type: "String"
    description: "Plain content, replaceable through the default slot."
    default: null
    usage: "#default"
  - name: "v-model:expanded"
    type: "Boolean"
    description: "Controlled disclosure state. Use v-model:expanded to respond to toggles."
    default: "false"
    usage: "#default"
  - name: "expanded"
    type: "Boolean"
    description: "Controlled disclosure state. Use v-model:expanded to respond to toggles."
    default: "false"
    usage: "#default"
  - name: "status"
    type: "'pending' | 'approved' | 'rejected'"
    description: "Controlled process or review state."
    default: "pending"
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
  - name: "update:expanded"
    type: "(value: boolean) => void"
    description: "Disclosure toggle requested."
  - name: "approve"
    type: "() => void"
    description: "Approve the pending plan."
  - name: "reject"
    type: "() => void"
    description: "Reject the proposed changes or plan."
  - name: "download"
    type: "() => void"
    description: "Download action requested; image results provide their URL."
SLOTS:
  - name: "default"
    description: "Replace the default content."
  - name: "actions"
    type: "{ status: 'pending' | 'approved' | 'rejected' }"
    description: "Customize the action row."
---

# Plan Card

<card>

## Default

A plan remains pending until the consumer changes its status. Expand its details and use approve or reject to connect your execution policy. Download exports the provided plan text; approval never starts a service inside the component.

<template #example><plan-card-default /></template>

<template #template>

@[code{15-30}](../.vuepress/components/plan-card/default.vue)

</template>

<template #script>

@[code{1-13}](../.vuepress/components/plan-card/default.vue)

</template>

<template #style>

@[code{32-45}](../.vuepress/components/plan-card/default.vue)

</template>

</card>

<card>

## Shape

Compare rounded and square geometry side by side. Both previews share controlled state so the same content and actions can be compared. Omitting shape follows the global configuration.

<template #example><plan-card-shape /></template>

<template #template>

@[code{12-47}](../.vuepress/components/plan-card/shape.vue)

</template>

<template #script>

@[code{1-10}](../.vuepress/components/plan-card/shape.vue)

</template>

<template #style>

@[code{49-68}](../.vuepress/components/plan-card/shape.vue)

</template>

</card>
