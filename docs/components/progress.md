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
NEWS:
  - default
  - color
  - indeterminate
  - height
---

# Progress

<card>

## Default

<template #example>
<progress-default />
</template>

<template #template>

@[code vue](../.vuepress/components/progress/default.vue)

</template>

</card>

<card>

## Colors

<template #example>
<progress-color />
</template>

<template #template>

@[code vue](../.vuepress/components/progress/color.vue)

</template>

</card>

<card>

## Indeterminate

<template #example>
<progress-indeterminate />
</template>

<template #template>

@[code vue](../.vuepress/components/progress/indeterminate.vue)

</template>

</card>

<card>

## Height

<template #example>
<progress-height />
</template>

<template #template>

@[code vue](../.vuepress/components/progress/height.vue)

</template>

</card>

<card>

## API

</card>
