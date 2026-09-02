---
description: 'Enter one-time codes with one real input and borderless visual slots.'
PROPS:
  - name: shape
    type: String
    values: 'rounded | square'
    description: Set rounded or square geometry for the visual code cells.
    default: rounded
    usage: '#shape'
  - name: v-model
    type: String
    values: 'String'
    description: Sanitized code value.
    default: ''
  - name: length
    type: Number
    values: 'Number'
    description: Number of visual positions.
    default: 6
  - name: variant
    type: String
    values: 'soft | capsule | underline'
    description: Borderless visual treatment.
    default: soft
  - name: mode
    type: String
    values: 'numeric | alphanumeric'
    description: Accepted character set and virtual keyboard hint.
    default: numeric
  - name: mask
    type: Boolean | String
    values: 'Boolean | String'
    description: Mask entered characters with a bullet or custom character.
    default: false
  - name: status
    type: String
    values: 'default | error | success'
    description: Semantic visual state.
    default: default
EVENTS:
  - name: complete
    params: string
    description: Fired when all positions are filled.
  - name: input
    params: string
    description: Fired while editing or when the native input commits.
  - name: change
    params: string
    description: Fired while editing or when the native input commits.
---

# Verification Code

<card>

## Borderless variants

The component always renders one native input. The cells are a visual overlay, so paste, password managers, mobile one-time-code autofill, selection, and keyboard input continue to work as one field.

The default `mode="numeric"` accepts digits only. Use `mode="alphanumeric"` for verification codes containing English letters and digits.

<template #example>
<verification-code-default />
</template>

<template #template>

@[code{11-41}](../.vuepress/components/verification-code/default.vue)

</template>

<template #script>

@[code{1-9}](../.vuepress/components/verification-code/default.vue)

</template>

<template #style>

@[code{43-54}](../.vuepress/components/verification-code/default.vue)

</template>

</card>

<card>

## Shape

Use `shape="square"` to give every visual code cell the same square geometry while retaining the single native input.

<template #example><verification-code-shape /></template>

<template #template>

@[code{8-19}](../.vuepress/components/verification-code/shape.vue)

</template>

<template #script>

@[code{1-6}](../.vuepress/components/verification-code/shape.vue)

</template>

<template #style>

@[code{21-32}](../.vuepress/components/verification-code/shape.vue)

</template>

</card>
