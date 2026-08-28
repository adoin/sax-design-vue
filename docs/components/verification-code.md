---
description: 'Enter one-time codes with one real input and borderless visual slots.'
PROPS:
  - name: v-model
    type: String
    values: String
    description: Sanitized code value.
    default: ''
  - name: length
    type: Number
    values: Number
    description: Number of visual positions.
    default: 6
  - name: variant
    type: String
    values: soft | capsule | underline
    description: Borderless visual treatment.
    default: soft
  - name: mode
    type: String
    values: numeric | alphanumeric
    description: Accepted character set and virtual keyboard hint.
    default: numeric
  - name: mask
    type: Boolean | String
    values: Boolean | String
    description: Mask entered characters with a bullet or custom character.
    default: false
  - name: status
    type: String
    values: default | error | success
    description: Semantic visual state.
    default: default
EVENTS:
  - name: complete
    params: string
    description: Fired when all positions are filled.
  - name: input / change
    params: string
    description: Fired while editing or when the native input commits.
---

# Verification Code

<card>

## Borderless variants

The component always renders one native input. The cells are a visual overlay, so paste, password managers, mobile one-time-code autofill, selection, and keyboard input continue to work as one field.

<template #example>
<verification-code-default />
</template>

<template #template>

@[code{11-40}](../.vuepress/components/verification-code/default.vue)

</template>

<template #script>

@[code{1-9}](../.vuepress/components/verification-code/default.vue)

</template>

<template #style>

@[code{42-53}](../.vuepress/components/verification-code/default.vue)

</template>

</card>
