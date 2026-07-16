---
PROPS:
  - name: height
    type: Number, String
    values: CSS height
    description: Progress bar height in pixels.
    default: 5
    link: null
    usage: '#height'

  - name: indeterminate
    type: Boolean
    values: true, false
    description: Animated indeterminate progress.
    default: false
    link: null
    usage: '#indeterminate'

  - name: percent
    type: Number
    values: 0 - 100
    description: Determinate progress percentage.
    default: 0
    link: null
    usage: '#default'

  - name: color
    type: String
    values: primary, success, danger, warning, dark
    description: Progress color.
    default: primary
    link: null
    usage: '#color'
EVENTS: []
EXPOSES: []
description: "Display determinate or indeterminate progress for loading states."
NEWS:
  - default
  - color
  - indeterminate
  - height
---

# Progress

<card>

## Default


Bind `percent` from 0 to 100 for a standard progress bar.

<template #example>
<progress-default />
</template>

<template #template>

@[code{1-5}](../.vuepress/components/progress/default.vue)

</template>

<template #style>

@[code{7-15}](../.vuepress/components/progress/default.vue)

</template>

</card>

<card>

## Colors


Apply theme colors to match your UI context. Hover a bar to see its default slot text in a tooltip.

<template #example>
<progress-color />
</template>

<template #template>

@[code{1-8}](../.vuepress/components/progress/color.vue)

</template>

<template #style>

@[code{10-18}](../.vuepress/components/progress/color.vue)

</template>

</card>

<card>

## Indeterminate


Use `indeterminate` for unknown-duration operations.

<template #example>
<progress-indeterminate />
</template>

<template #template>

@[code{1-5}](../.vuepress/components/progress/indeterminate.vue)

</template>

<template #style>

@[code{7-15}](../.vuepress/components/progress/indeterminate.vue)

</template>

</card>

<card>

## Height


Adjust bar thickness with the `height` prop.

<template #example>
<progress-height />
</template>

<template #template>

@[code{1-6}](../.vuepress/components/progress/height.vue)

</template>

<template #style>

@[code{8-16}](../.vuepress/components/progress/height.vue)

</template>

</card>

<card>

## API

</card>
