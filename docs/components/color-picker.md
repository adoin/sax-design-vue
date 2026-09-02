---
PROPS:
  - name: shape
    type: String
    values: "rounded | square"
    description: Apply rounded or square geometry to the trigger and editor panel.
    default: rounded
    usage: '#shape'
  - name: model-value
    type: String
    values: "hex / rgb / rgba / hsl / hsla"
    description: Selected color value.
    default: '#5667f4'
  - name: v-model
    type: String
    values: "hex / rgb / rgba / hsl / hsla"
    description: Selected color value.
    default: '#5667f4'
  - name: show-alpha
    type: Boolean
    values: "true / false"
    description: Enable opacity adjustment.
    default: 'false'
  - name: predefine
    type: Array
    values: "Array&lt;{ name, value }&gt; / string[]"
    description: Named preset colors. Values support HEX, RGB(A), and HSL(A); string arrays remain compatible.
    default: '[]'
  - name: format
    type: String
    values: "hex / rgb / hsl"
    description: Initial editing and output format. It can also be switched in the panel.
    default: hex
EVENTS:
  - name: change
    description: Fired when a color is selected or changed.
description: 'Color picker.'
---

# Color picker

<card>

Clicking the trigger opens the complete picker directly. Adjust saturation,
brightness, hue and opacity, use the screen eyedropper, or switch between HEX,
RGB(A) and HSL(A) channel editing. The main panel no longer depends on a
second native picker.
The eyedropper uses the EyeDropper API first and automatically falls back to
the native color selector when that API is unavailable or fails.

<template #example><color-picker-default /></template>

<template #template>

@[code{1-11}](../.vuepress/components/color-picker/default.vue)

</template>

<template #script>

@[code{13-24}](../.vuepress/components/color-picker/default.vue)

</template>

<template #style>

@[code{26-38}](../.vuepress/components/color-picker/default.vue)

</template>

</card>

<card>

## Shape

Use `shape="square"` to apply square geometry to the color trigger and the complete editor panel.

<template #example><color-picker-shape /></template>

<template #template>

@[code{8-19}](../.vuepress/components/color-picker/shape.vue)

</template>

<template #script>

@[code{1-6}](../.vuepress/components/color-picker/shape.vue)

</template>

<template #style>

@[code{21-33}](../.vuepress/components/color-picker/shape.vue)

</template>

</card>
