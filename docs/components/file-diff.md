---
description: "Display proposed file changes and expose explicit review actions."
PROPS:
  - name: "filename"
    type: "String"
    description: "Filename shown in the header; also used for code downloads."
    default: "''"
    usage: "#default"
  - name: "lines"
    type: "FileDiffLine[]"
    description: "Precomputed diff lines with optional original and new line numbers."
    default: "[]"
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
  - name: "apply"
    type: "() => void"
    description: "Apply the proposed changes."
  - name: "reject"
    type: "() => void"
    description: "Reject the proposed changes or plan."
SLOTS:
  - name: "actions"
    description: "Customize the action row."
---

# File Diff

<card>

## Default

Provide context, add and remove rows with their original line numbers. Apply and reject emit decisions; the consumer owns filesystem changes.

<template #example><file-diff-default /></template>

<template #template>

@[code{19-30}](../.vuepress/components/file-diff/default.vue)

</template>

<template #script>

@[code{1-17}](../.vuepress/components/file-diff/default.vue)

</template>

<template #style>

@[code{32-45}](../.vuepress/components/file-diff/default.vue)

</template>

</card>

<card>

## Shape

Compare rounded and square geometry side by side. Both previews share controlled state so the same content and actions can be compared. Omitting shape follows the global configuration.

<template #example><file-diff-shape /></template>

<template #template>

@[code{19-46}](../.vuepress/components/file-diff/shape.vue)

</template>

<template #script>

@[code{1-17}](../.vuepress/components/file-diff/shape.vue)

</template>

<template #style>

@[code{48-67}](../.vuepress/components/file-diff/shape.vue)

</template>

</card>
