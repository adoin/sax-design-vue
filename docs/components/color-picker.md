---
PROPS:
  - name: model-value/v-model
    type: String
    values: hex / rgb / rgba / hsl / hsla
    description: Selected color value.
    default: '#5667f4'
  - name: show-alpha
    type: Boolean
    values: true / false
    description: Enable opacity adjustment.
    default: 'false'
  - name: predefine
    type: Array
    values: Array&lt;{ name, value }&gt; / string[]
    description: Named preset colors. Values support HEX, RGB(A), and HSL(A); string arrays remain compatible.
    default: '[]'
  - name: format
    type: String
    values: hex / rgb / hsl
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

@[code{1-9}](../.vuepress/components/color-picker/default.vue)

</template>

<template #script>

@[code{11-22}](../.vuepress/components/color-picker/default.vue)

</template>

<template #style>

@[code{24-30}](../.vuepress/components/color-picker/default.vue)

</template>

</card>
