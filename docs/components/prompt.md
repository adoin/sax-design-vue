---
PROPS:
  - name: v-model
    type: Boolean
    values: true, false
    description: Dialog visibility.
    default: false
    link: null
    usage: '#default'

  - name: title
    type: String
    values: String
    description: Dialog title.
    default: Dialog
    link: null
    usage: '#default'

  - name: text
    type: String
    values: String
    description: Dialog body text.
    default: null
    link: null
    usage: '#default'

  - name: type
    type: String
    values: alert, confirm
    description: Prompt type.
    default: alert
    link: null
    usage: '#default'

  - name: color
    type: String
    values: primary, success, danger
    description: Accent color.
    default: primary
    link: null
    usage: '#default'

  - name: accept-text
    type: String
    values: String
    description: Accept button label.
    default: Accept
    link: null
    usage: '#default'

  - name: cancel-text
    type: String
    values: String
    description: Cancel button label.
    default: Cancel
    link: null
    usage: '#default'

  - name: buttons-hidden
    type: Boolean
    values: true, false
    description: Hide action buttons.
    default: false
    link: null
    usage: '#default'
EVENTS:
  - name: update:modelValue
    params: boolean
    description: Visibility change.

  - name: accept
    params: null
    description: Accept button clicked.

  - name: cancel
    params: null
    description: Cancel button clicked.

  - name: close
    params: null
    description: Dialog closed.
EXPOSES: []
NEWS:
  - default
  - alert
---

# Prompt

<card>

## Default

<template #example>
<prompt-default />
</template>

<template #template>

@[code vue](../.vuepress/components/prompt/default.vue)

</template>

</card>

<card>

## Alert

<template #example>
<prompt-alert />
</template>

<template #template>

@[code vue](../.vuepress/components/prompt/alert.vue)

</template>

</card>

<card>

## API

</card>
