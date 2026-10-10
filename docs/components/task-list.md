---
description: "Controlled task status, progress and optional task actions."
PROPS:
  - name: "tasks"
    type: "AgentTask[]"
    description: "Tasks with stable ids, status and optional progress."
    default: "[]"
    usage: "#default"
  - name: "title"
    type: "String"
    description: "Heading text; process lists use a localized fallback."
    default: null
    usage: "#default"
  - name: "v-model:expanded"
    type: "Boolean"
    description: "Controlled disclosure state. Use v-model:expanded to respond to toggles."
    default: "true"
    usage: "#default"
  - name: "expanded"
    type: "Boolean"
    description: "Controlled disclosure state. Use v-model:expanded to respond to toggles."
    default: "true"
    usage: "#default"
  - name: "interactive"
    type: "Boolean"
    description: "Make task titles keyboard-operable actions. Status remains consumer-controlled."
    default: "false"
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
  - name: "task-click"
    type: "(task: AgentTask) => void"
    description: "Interactive task selected."
SLOTS:
  - name: "default"
    description: "Replace the default content."
  - name: "task"
    type: "{ task: AgentTask }"
    description: "Customize a task description."
---

# Task List

<card>

## Default

Set each task status and optional progress from your workflow. interactive enables title actions without changing task state automatically. Collapse the list with v-model:expanded.

<template #example><task-list-default /></template>

<template #template>

@[code{23-32}](../.vuepress/components/task-list/default.vue)

</template>

<template #script>

@[code{1-21}](../.vuepress/components/task-list/default.vue)

</template>

<template #style>

@[code{34-47}](../.vuepress/components/task-list/default.vue)

</template>

</card>

<card>

## Shape

Compare rounded and square geometry side by side. Both previews share controlled state so the same content and actions can be compared. Omitting shape follows the global configuration.

<template #example><task-list-shape /></template>

<template #template>

@[code{23-46}](../.vuepress/components/task-list/shape.vue)

</template>

<template #script>

@[code{1-21}](../.vuepress/components/task-list/shape.vue)

</template>

<template #style>

@[code{48-67}](../.vuepress/components/task-list/shape.vue)

</template>

</card>
