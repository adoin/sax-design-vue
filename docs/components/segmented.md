---
PROPS:
  - name: variant
    type: String
    values: pill | text | tile
    description: Borderless presentation style.
    default: pill
  - name: block
    type: Boolean
    values: true | false
    description: Fill the available width.
    default: false
  - name: model-value/v-model
    type: String | Number
    values: option value
    description: Selected option value.
    default: null
  - name: options
    type: Array
    values: '{ label, value, disabled? }[]'
    description: Segment definitions.
    default: '[]'
EVENTS:
  - name: change
    description: Fired when selection changes.
description: 'Segmented single choice.'
---

# Segmented

<card>

## Variants

The three variants use surface, spacing, weight, and shadow to separate options without borders. Arrow keys move between enabled options.

<template #example><segmented-default /></template>

<template #template>

@[code{16-28}](../.vuepress/components/segmented/default.vue)

</template>

<template #script>

@[code{1-14}](../.vuepress/components/segmented/default.vue)

</template>

<template #style>

@[code{30-42}](../.vuepress/components/segmented/default.vue)

</template>

</card>
