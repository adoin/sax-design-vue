---
description: "Numeric input with bounds, stepping controls, and decimal precision."
PROPS:
  - name: v-model
    type: Number
    default: null
    description: "Bound numeric value; clearing can emit null."
    usage: '#default'
  - name: min
    type: Number
    default: -Infinity
    description: "Minimum allowed value."
    usage: '#range-and-step'
  - name: max
    type: Number
    default: Infinity
    description: "Maximum allowed value."
    usage: '#range-and-step'
  - name: step
    type: Number
    default: 1
    description: "Amount added or subtracted by each step."
    usage: '#range-and-step'
  - name: step-strictly
    type: Boolean
    default: false
    description: "Constrain committed values to multiples of step."
    usage: '#range-and-step'
  - name: precision
    type: Number
    default: null
    description: "Decimal places; must not be smaller than the decimal places in step."
    usage: '#range-and-step'
  - name: value-on-clear
    type: String | Number | null
    default: null
    description: "Value used after clearing: a number, min, max, or null."
    usage: '#range-and-step'
  - name: disabled
    type: Boolean
    default: false
    description: "Disable editing and stepping."
    usage: '#states'
  - name: readonly
    type: Boolean
    default: false
    description: "Display the value without allowing edits or steps."
    usage: '#states'
  - name: controls
    type: Boolean
    default: true
    description: "Show the decrease and increase buttons."
    usage: '#states'
  - name: color
    type: String
    default: light
    description: "Text and control color, using a theme color or CSS color."
    usage: '#colors'
  - name: background
    type: String
    default: primary
    description: "Surface color, preserved during hover and focus."
    usage: '#colors'
  - name: shape
    type: String
    default: rounded
    description: "Rounded or square geometry; inherits global configuration."
    usage: '#shape'
  - name: id
    type: String
    default: null
    description: "Native input id."
    usage: '#default'
  - name: name
    type: String
    default: null
    description: "Native input name."
    usage: '#default'
  - name: label
    type: String
    default: null
    description: "Input label."
    usage: '#default'
  - name: placeholder
    type: String
    default: null
    description: "Text displayed when empty."
    usage: '#default'
EVENTS:
  - name: update:modelValue
    type: '(value: number | null | undefined) => void'
    description: "Update the controlled value."
  - name: input
    type: '(value: number | null | undefined) => void'
    description: "Emit while typing or stepping."
  - name: change
    type: '(value: number | null | undefined, oldValue: number | null | undefined) => void'
    description: "Emit when a changed value is committed."
  - name: focus
    type: '(event: FocusEvent) => void'
    description: "Native input focus event."
  - name: blur
    type: '(event: FocusEvent) => void'
    description: "Native input blur event."
EXPOSES:
  - name: focus
    type: '() => void'
    description: "Focus the inner input."
  - name: blur
    type: '() => void'
    description: "Blur the inner input."
---

# Input Number

<card>

## Default

Bind a number with v-model. Click or hold the controls, type directly, or use ArrowUp / ArrowDown while the input is focused.

<template #example><input-number-default /></template>

<template #template>

@[code{5-9}](../.vuepress/components/input-number/default.vue)

</template>

<template #script>

@[code{1-4}](../.vuepress/components/input-number/default.vue)

</template>

<template #style>

@[code{10-18}](../.vuepress/components/input-number/default.vue)

</template>

</card>

<card>

## Range and step

Compare range limits, strict integer steps, decimal precision, and clear-value fallback. Precision should accommodate the decimal places in step.

<template #example><input-number-range /></template>

<template #template>

@[code{7-31}](../.vuepress/components/input-number/range.vue)

</template>

<template #script>

@[code{1-6}](../.vuepress/components/input-number/range.vue)

</template>

<template #style>

@[code{32-40}](../.vuepress/components/input-number/range.vue)

</template>

</card>

<card>

## States and controls

Disabled blocks interaction, readonly preserves a non-editable value, and controls=false hides the buttons while keeping typing and arrow-key stepping.

<template #example><input-number-states /></template>

<template #template>

@[code{7-13}](../.vuepress/components/input-number/states.vue)

</template>

<template #script>

@[code{1-6}](../.vuepress/components/input-number/states.vue)

</template>

<template #style>

@[code{14-22}](../.vuepress/components/input-number/states.vue)

</template>

</card>

<card>

## Colors

Color controls the text and step icons; background controls the surface. Hover and focus retain the chosen colors with a soft inset shadow. Choose custom colors with sufficient contrast.

<template #example><input-number-colors /></template>

<template #template>

@[code{7-23}](../.vuepress/components/input-number/colors.vue)

</template>

<template #script>

@[code{1-6}](../.vuepress/components/input-number/colors.vue)

</template>

<template #style>

@[code{24-32}](../.vuepress/components/input-number/colors.vue)

</template>

</card>

<card>

## Shape

Compare rounded and square side by side. Shape applies to the shell and inner input; explicit values override global configuration.

<template #example><input-number-shape /></template>

<template #template>

@[code{6-11}](../.vuepress/components/input-number/shape.vue)

</template>

<template #script>

@[code{1-5}](../.vuepress/components/input-number/shape.vue)

</template>

<template #style>

@[code{12-20}](../.vuepress/components/input-number/shape.vue)

</template>

</card>

