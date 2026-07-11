---
PROPS:
  - name: v-model
    type: Number, String
    values: index or name
    description: Active tab index.
    default: 0
    link: null
    usage: '#default'

  - name: color
    type: String
    values: primary, success, danger
    description: Active color.
    default: primary
    link: null
    usage: '#color'

  - name: alignment
    type: String
    values: left, center, right, fixed
    description: Tab alignment.
    default: left
    link: null
    usage: '#alignments'

  - name: position
    type: String
    values: top, bottom, left, right
    description: Tab bar position.
    default: top
    link: null
    usage: '#position'

  - name: label
    type: String
    values: String
    description: Tab label (vs-tab).
    default: Label
    link: null
    usage: '#default'

  - name: icon
    type: String
    values: Material icon
    description: Tab icon (vs-tab).
    default: 
    link: null
    usage: '#icons'

  - name: disabled
    type: Boolean
    values: true, false
    description: Disable tab (vs-tab).
    default: false
    link: null
    usage: '#default'
EVENTS:
  - name: update:modelValue
    params: number | string
    description: Active tab changed.

  - name: change
    params: number | string
    description: Active tab changed.
EXPOSES: []
NEWS:
  - default
  - color
  - alignments
  - position
  - icons
---

# Tabs

<card>

## Default

<template #example>
<tabs-default />
</template>

<template #template>

@[code vue](../.vuepress/components/tabs/default.vue)

</template>

</card>

<card>

## Color

<template #example>
<tabs-color />
</template>

<template #template>

@[code vue](../.vuepress/components/tabs/color.vue)

</template>

</card>

<card>

## Alignments

<template #example>
<tabs-alignments />
</template>

<template #template>

@[code vue](../.vuepress/components/tabs/alignments.vue)

</template>

</card>

<card>

## Position

<template #example>
<tabs-position />
</template>

<template #template>

@[code vue](../.vuepress/components/tabs/position.vue)

</template>

</card>

<card>

## Icons

<template #example>
<tabs-icons />
</template>

<template #template>

@[code vue](../.vuepress/components/tabs/icons.vue)

</template>

</card>

<card>

## API

</card>
