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
description: "Organize content into switchable tab panels."
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


Control the active tab with `v-model` on `vs-tabs`.

<template #example>
<tabs-default />
</template>

<template #template>

@[code{1-6}](../.vuepress/components/tabs/default.vue)

</template>

<template #script>

@[code{8-11}](../.vuepress/components/tabs/default.vue)

</template>

</card>

<card>

## Color


Theme the active indicator and labels.

<template #example>
<tabs-color />
</template>

<template #template>

@[code{1-6}](../.vuepress/components/tabs/color.vue)

</template>

<template #script>

@[code{8-11}](../.vuepress/components/tabs/color.vue)

</template>

</card>

<card>

## Alignments


Align tabs to the left, center, right, or fixed width.

<template #example>
<tabs-alignments />
</template>

<template #template>

@[code{1-6}](../.vuepress/components/tabs/alignments.vue)

</template>

<template #script>

@[code{8-11}](../.vuepress/components/tabs/alignments.vue)

</template>

</card>

<card>

## Position


Place the tab bar on top, bottom, left, or right.

<template #example>
<tabs-position />
</template>

<template #template>

@[code{1-6}](../.vuepress/components/tabs/position.vue)

</template>

<template #script>

@[code{8-11}](../.vuepress/components/tabs/position.vue)

</template>

</card>

<card>

## Icons


Add icons to individual `vs-tab` items.

<template #example>
<tabs-icons />
</template>

<template #template>

@[code{1-6}](../.vuepress/components/tabs/icons.vue)

</template>

<template #script>

@[code{8-11}](../.vuepress/components/tabs/icons.vue)

</template>

</card>

<card>

## API

</card>
