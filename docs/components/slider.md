---
PROPS:
  - name: v-model
    type: Number
    values: Number
    description: Current value.
    default: 0
    link: null
    usage: '#default'

  - name: min
    type: Number
    values: Number
    description: Minimum value.
    default: 0
    link: null
    usage: '#default'

  - name: max
    type: Number
    values: Number
    description: Maximum value.
    default: 100
    link: null
    usage: '#default'

  - name: step
    type: Number
    values: Number
    description: Step increment.
    default: 1
    link: null
    usage: '#default'

  - name: disabled
    type: Boolean
    values: true, false
    description: Disable interaction.
    default: false
    link: null
    usage: '#default'

  - name: color
    type: String
    values: primary, success, danger
    description: Slider color.
    default: primary
    link: null
    usage: '#color'

  - name: text-fixed
    type: String
    values: String
    description: Suffix shown next to value.
    default: 
    link: null
    usage: '#text-fixed'

  - name: ticks
    type: Boolean
    values: true, false
    description: Show tick marks.
    default: false
    link: null
    usage: '#ticks'
EVENTS:
  - name: update:modelValue
    params: number
    description: Value changed.

  - name: change
    params: number
    description: Value committed.
EXPOSES: []
description: "Select numeric values along a draggable track."
NEWS:
  - default
  - color
  - ticks
  - text-fixed
---

# Slider

<card>

## Default


Bind a number with `v-model` between `min` and `max`.

<template #example>
<slider-default />
</template>

<template #template>

@[code{1-3}](../.vuepress/components/slider/default.vue)

</template>

<template #script>

@[code{5-8}](../.vuepress/components/slider/default.vue)

</template>

</card>

<card>

## Color


Color the track and thumb to match your theme.

<template #example>
<slider-color />
</template>

<template #template>

@[code{1-7}](../.vuepress/components/slider/color.vue)

</template>

<template #script>

@[code{9-14}](../.vuepress/components/slider/color.vue)

</template>

<template #style>

@[code{16-24}](../.vuepress/components/slider/color.vue)

</template>

</card>

<card>

## Ticks


Display step ticks along the track.

<template #example>
<slider-ticks />
</template>

<template #template>

@[code{1-3}](../.vuepress/components/slider/ticks.vue)

</template>

<template #script>

@[code{5-8}](../.vuepress/components/slider/ticks.vue)

</template>

</card>

<card>

## Text Fixed


Append a suffix such as `%` next to the current value.

<template #example>
<slider-text-fixed />
</template>

<template #template>

@[code{1-3}](../.vuepress/components/slider/text-fixed.vue)

</template>

<template #script>

@[code{5-8}](../.vuepress/components/slider/text-fixed.vue)

</template>

</card>

<card>

## API

</card>
