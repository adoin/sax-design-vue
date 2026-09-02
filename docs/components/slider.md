---
PROPS:
  - name: variant
    type: String
    values: "classic | soft | steps"
    description: Select the slim rail, inset trough, or discrete step design.
    default: classic
    link: null
    usage: '#variants'

  - name: show-value
    type: Boolean
    values: "true, false"
    description: Keep the current value bubble visible.
    default: false
    link: null
    usage: '#variants'
  - name: shape
    type: String
    values: "rounded | square"
    description: Select rounded or square geometry for the track, thumb, ticks, and value bubble.
    default: rounded
    link: null
    usage: '#shape'
  - name: v-model
    type: Number
    values: "Number"
    description: Current value.
    default: 0
    link: null
    usage: '#default'

  - name: min
    type: Number
    values: "Number"
    description: Minimum value.
    default: 0
    link: null
    usage: '#default'

  - name: max
    type: Number
    values: "Number"
    description: Maximum value.
    default: 100
    link: null
    usage: '#default'

  - name: step
    type: Number
    values: "Number"
    description: Step increment.
    default: 1
    link: null
    usage: '#default'

  - name: disabled
    type: Boolean
    values: "true, false"
    description: Disable interaction.
    default: false
    link: null
    usage: '#default'

  - name: color
    type: String
    values: "primary, success, danger"
    description: Slider color.
    default: primary
    link: null
    usage: '#color'

  - name: text-fixed
    type: String
    values: "String"
    description: Suffix shown next to value.
    default:
    link: null
    usage: '#text-fixed'

  - name: ticks
    type: Boolean
    values: "true, false"
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
description: 'Select numeric values along a draggable track.'
NEWS:
  - default
  - color
  - ticks
  - text-fixed
---

# Slider

<card>

## Variants

`classic`, `soft`, and `steps` change the slider structure, not only its color. All variants use one native range input and keep the visual thumb exactly centered on the track.

<template #example>
<slider-variants />
</template>

<template #template>

@[code{11-42}](../.vuepress/components/slider/variants.vue)

</template>

<template #script>

@[code{1-9}](../.vuepress/components/slider/variants.vue)

</template>

<template #style>

@[code{44-57}](../.vuepress/components/slider/variants.vue)

</template>

</card>

<card>

## Shape

Set `shape="square"` to give the track, completed segment, thumb, ticks, and value bubble a consistent square geometry. Shape is independent from `variant`, so it works with `classic`, `soft`, and `steps`.

<template #example>
<slider-shape />
</template>

<template #template>

@[code{12-53}](../.vuepress/components/slider/shape.vue)

</template>

<template #script>

@[code{1-10}](../.vuepress/components/slider/shape.vue)

</template>

<template #style>

@[code{55-68}](../.vuepress/components/slider/shape.vue)

</template>

</card>

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

The thumb and completed track share the selected color. In `soft`, the track
automatically uses a translucent tone derived from that color. This example
pairs `classic`, `soft`, and `steps` with a different semantic color; the
`steps` item uses a step of 10 so its discrete points remain distinct.

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
