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
NEWS:
  - default
  - color
  - ticks
  - text-fixed
---

# Slider

<card>

## Default

<template #example>
<slider-default />
</template>

<template #template>

@[code vue](../.vuepress/components/slider/default.vue)

</template>

</card>

<card>

## Color

<template #example>
<slider-color />
</template>

<template #template>

@[code vue](../.vuepress/components/slider/color.vue)

</template>

</card>

<card>

## Ticks

<template #example>
<slider-ticks />
</template>

<template #template>

@[code vue](../.vuepress/components/slider/ticks.vue)

</template>

</card>

<card>

## Text Fixed

<template #example>
<slider-text-fixed />
</template>

<template #template>

@[code vue](../.vuepress/components/slider/text-fixed.vue)

</template>

</card>

<card>

## API

</card>
