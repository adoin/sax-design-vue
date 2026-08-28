---
PROPS:
  - name: hide-on-click-modal / z-index
    type: Boolean / Number
    values: true | false / layer number
    description: Control modal click closing and overlay stacking order.
    default: 'true / -'
  - name: v-model
    type: Boolean
    values: true / false
    description: Controls preview visibility.
    default: 'false'
  - name: url-list
    type: Array
    values: string[]
    description: Preview image URLs.
    default: '[]'
  - name: initial-index
    type: Number
    values: '0+'
    description: First visible image index.
    default: '0'
  - name: infinite
    type: Boolean
    values: true / false
    description: Loop at both ends of the image list.
    default: 'true'
EVENTS:
  - name: close / switch
    description: Close preview or switch image events.
description: "Full-screen image preview."
---

# Image preview

<card><template #example><image-preview-default /></template>

<template #template>

@[code{1-16}](../.vuepress/components/image-preview/default.vue)

</template>

<template #script>

@[code{18-31}](../.vuepress/components/image-preview/default.vue)

</template>

<template #style>

@[code{33-45}](../.vuepress/components/image-preview/default.vue)

</template>

</card>
