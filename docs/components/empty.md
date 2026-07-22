---
PROPS:
  - name: image
    type: String
    values: URL
    description: Custom illustration URL.
    default: null
  - name: image-size
    type: Number | String
    values: CSS size
    description: Illustration box size.
    default: 96
  - name: description
    type: String
    values: text
    description: Empty-state message.
    default: null
description: "A calm empty state compatible with VXE Empty use cases."
---

# Empty

<card>

## Default

<template #example><empty-default /></template>

<template #template>

@[code{1-5}](../.vuepress/components/empty/default.vue)

</template>

</card>
