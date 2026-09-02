---
description: 'Toggle a boolean setting between two states.'
PROPS:
  - name: variant
    type: String
    values: "classic | soft | text"
    description: Select a structurally distinct borderless switch style.
    default: classic
  - name: active-text
    type: String
    values: "String"
    description: Labels used by the text variant.
    default: ON
  - name: inactive-text
    type: String
    values: "String"
    description: Labels used by the text variant.
    default: OFF
  - name: active-value
    type: String | Number | Boolean
    values: "custom bound value"
    description: Value emitted for the active state.
    default: 'true'
  - name: inactive-value
    type: String | Number | Boolean
    values: "custom bound value"
    description: Value emitted for the inactive state.
    default: 'false'
  - name: shape
    type: String
    values: "rounded | square"
    description: Select rounded or square geometry for the track and thumb.
    default: 'rounded'
    usage: '#shape'
  - name: v-model
    type: Boolean | String | Number
    values: "Values matched against active-value and inactive-value"
    description: Set the current switch value; an unmatched value can be represented as indeterminate.
    default: false
    link: null
    usage: '#default'
    code: >
      <template>
        <s-switch v-model="active" />
        <s-switch v-model="active2" />
        <s-switch v-model="active3" disabled />
      </template>

  - name: color
    type: String
    values: "Theme colors, RGB y HEX"
    description: Change the color of the component when it is in active state.
    default: primary
    link: null
    usage: '#color'
    code: null

  - name: loading
    type: Boolean
    values: "true, false"
    description: Replace the thumb with an equal-size loading indicator that follows the selected shape.
    default: false
    link: null
    usage: '#loading'
    code: >
      <template>
        <s-switch v-model="loading">Loading state</s-switch>
        <s-switch v-model="roundedValue" :loading="loading" />
        <s-switch v-model="squareValue" :loading="loading" shape="square" />
      </template>

      <script setup lang="ts">
        import { shallowRef } from "vue"

        const loading = shallowRef(true)
        const roundedValue = shallowRef(false)
        const squareValue = shallowRef(true)
      </script>

  - name: indeterminate
    type: Boolean
    values: "true, false"
    description: Center the thumb while the bound value matches neither active-value nor inactive-value; the next selection enters a normal definite state.
    default: false
    link: null
    usage: '#indeterminate'
    code: >
      <template>
        <s-switch v-model="value" indeterminate />
      </template>

  - name: notValue
    type: String
    values: "String"
    description: Determine the return value of the component when inactive.
    default: null
    link: null
    usage: null
    code: null

EVENTS:
  - name: update:modelValue
    type: Boolean | String | Number
    description: Fire with the configured active or inactive value when the switch changes.
  - name: input
    type: Boolean | String | Number
    description: Fire with the configured active or inactive value when the switch changes.
  - name: change
    type: Boolean | String | Number
    description: Fire with the configured active or inactive value when the switch changes.
SLOTS:
  - name: default
    type: slot
    values: "null"
    description: Add text within the component.
    default: null
    link: null
    usage: '#text'
    code: >
      <template>
        <s-switch v-model="active">
          Suscribe
        </s-switch>
        <s-switch v-model="active2">
          <template #off>
              Off
          </template>
          <template #on>
              On
          </template>
        </s-switch>
        <s-switch v-model="active3">
          <template #off>
              default
          </template>
          <template #on>
              Premium
          </template>
        </s-switch>
      </template>
  - name: on
    type: slot
    values: "null"
    description: Add text within the component when it is in active state.
    default: null
    link: null
    usage: '#icons'
    code: >
      <s-switch v-model="active1">
        <template #off>
            <s-icon   name="bxs:volume-mute" />
        </template>
        <template #on>
            <s-icon   name="bxs:volume-full" />
        </template>
      </s-switch>
  - name: off
    type: slot
    values: "null"
    description: Add text within the component when it is in idle state.
    default: null
    link: null
    usage: '#icons'
    code: >
      <s-switch v-model="active1">
        <template #off>
            <s-icon   name="bxs:volume-mute" />
        </template>
        <template #on>
            <s-icon   name="bxs:volume-full" />
        </template>
      </s-switch>
  - name: circle
    type: slot
    values: "null"
    description: Add an icon to the circle within the component.
    default: null
    link: null
    usage: '#icons'
    code: >
      <s-switch color="#7d33ff" v-model="active6">
        <template #circle>
            <s-icon v-if="active6"  name="bxl:instagram-alt" />
            <s-icon v-else   name="bxl:instagram" />
        </template>
      </s-switch>
---

# Switch

<card>

## Variants

Use `variant` to choose a classic moving knob, a soft inset control, or a text state. Icons belong in the existing content slots rather than a separate structural variant. Every style keeps the same native checkbox semantics and borderless focus treatment.

<template #example>
<switch-variants />
</template>

<template #template>

@[code{22-35}](../.vuepress/components/switch/variants.vue)

</template>

<template #script>

@[code{1-20}](../.vuepress/components/switch/variants.vue)

</template>

<template #style>

@[code{37-49}](../.vuepress/components/switch/variants.vue)

</template>

</card>

<card>

## Default

<docs-warn />

Generate a switch element easily with beautiful animations and functionality

<template #example>
<switch-default />
</template>

<template #template>

@[code{1-7}](../.vuepress/components/switch/default.vue)

</template>

<template #script>

@[code{9-15}](../.vuepress/components/switch/default.vue)

</template>

<template #style>

@[code{17-26}](../.vuepress/components/switch/default.vue)

</template>

</card>

<card>

## Color

Change the color of the component when it is in active state, the allowed values ​​are (main colors of Sax Design, RGB, HEX)

<template #example>
<switch-color />
</template>

<template #template>

@[code{1-11}](../.vuepress/components/switch/color.vue)

</template>

<template #script>

@[code{13-23}](../.vuepress/components/switch/color.vue)

</template>

<template #style>

@[code{25-34}](../.vuepress/components/switch/color.vue)

</template>

</card>

<card>

## Text

Add text with the default slot, or use the `on` and `off` slots for state-specific content. The track reserves enough width for the longer state label, so it does not jump when toggled. When a moving knob is present, the current label is centered in the remaining space beside it and stays fully visible.

<template #example>
<switch-text />
</template>

<template #template>

@[code{9-27}](../.vuepress/components/switch/text.vue)

</template>

<template #script>

@[code{1-7}](../.vuepress/components/switch/text.vue)

</template>

<template #style>

@[code{29-37}](../.vuepress/components/switch/text.vue)

</template>

</card>

<card>

## Icons

Add icons through the default, `on`, `off`, or `circle` slots. The `circle` slot customizes the classic moving knob directly; no separate icon variant is needed.

<template #example>
<switch-icons />
</template>

<template #template>

@[code{1-41}](../.vuepress/components/switch/icons.vue)

</template>

<template #script>

@[code{43-52}](../.vuepress/components/switch/icons.vue)

</template>

<template #style>

@[code{54-63}](../.vuepress/components/switch/icons.vue)

</template>

</card>

<card>

## Shape

Set `shape="square"` to use a square track and thumb. Loading and indeterminate states preserve the same square geometry.

<template #example>
<switch-square />
</template>

<template #template>

@[code{1-7}](../.vuepress/components/switch/square.vue)

</template>

<template #script>

@[code{9-15}](../.vuepress/components/switch/square.vue)

</template>

<template #style>

@[code{17-26}](../.vuepress/components/switch/square.vue)

</template>

</card>

<card>

## Loading

Set `loading` to replace the moving thumb with an equal-size spinner. It stays at the current state position; with `shape="square"`, a fixed square outline advances around its four sides instead of rotating the whole square.

<template #example>
<switch-loading />
</template>

<template #template>

@[code{9-24}](../.vuepress/components/switch/loading.vue)

</template>

<template #script>

@[code{1-7}](../.vuepress/components/switch/loading.vue)

</template>

<template #style>

@[code{26-34}](../.vuepress/components/switch/loading.vue)

</template>

</card>

<card>

## Indeterminate

Use `indeterminate` when the bound value matches neither `active-value` nor `inactive-value`. The thumb starts in the middle; after selection, the value becomes definite and the thumb resumes its normal left/right movement.

<template #example>
<switch-indeterminate />
</template>

<template #template>

@[code{9-29}](../.vuepress/components/switch/indeterminate.vue)

</template>

<template #script>

@[code{1-7}](../.vuepress/components/switch/indeterminate.vue)

</template>

<template #style>

@[code{31-39}](../.vuepress/components/switch/indeterminate.vue)

</template>

</card>

<card>

## Example

A usual example when using the switch component

<template #example>
<switch-example />
</template>

<template #template>

@[code{1-43}](../.vuepress/components/switch/example.vue)

</template>

<template #script>

@[code{45-53}](../.vuepress/components/switch/example.vue)

</template>

<template #style>

@[code{55-79}](../.vuepress/components/switch/example.vue)

</template>

</card>
