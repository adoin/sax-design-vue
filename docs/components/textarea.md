---
PROPS:
  - name: v-model
    type: String
    values: String
    description: Textarea value.
    default: ''
    link: null
    usage: '#default'

  - name: label
    type: String
    values: String
    description: Floating label text.
    default: null
    link: null
    usage: '#label'

  - name: color
    type: String
    values: primary, success, danger, warning, dark
    description: Component color.
    default: primary
    link: null
    usage: '#default'

  - name: counter
    type: Number, String
    values: Number
    description: Max length counter.
    default: null
    link: null
    usage: '#counter'

  - name: counter-danger
    type: Boolean
    values: true, false
    description: Highlight counter when limit exceeded.
    default: false
    link: null
    usage: '#counter'

  - name: height
    type: String
    values: CSS height
    description: Textarea height.
    default: null
    link: null
    usage: '#height'

  - name: width
    type: String
    values: CSS width
    description: Textarea width.
    default: null
    link: null
    usage: '#width'
EVENTS:
  - name: update:modelValue
    params: string
    description: Emitted when value changes.

  - name: input
    params: string
    description: Native input event.

  - name: focus
    params: FocusEvent
    description: Emitted on focus.

  - name: blur
    params: FocusEvent
    description: Emitted on blur.
EXPOSES: []
NEWS:
  - default
  - label
  - counter
  - width
  - height
---

# Textarea

<card>

## Default

<template #example>
<textarea-default />
</template>

<template #template>

@[code vue](../.vuepress/components/textarea/default.vue)

</template>

</card>

<card>

## Label

<template #example>
<textarea-label />
</template>

<template #template>

@[code vue](../.vuepress/components/textarea/label.vue)

</template>

</card>

<card>

## Counter

<template #example>
<textarea-counter />
</template>

<template #template>

@[code vue](../.vuepress/components/textarea/counter.vue)

</template>

</card>

<card>

## Width

<template #example>
<textarea-width />
</template>

<template #template>

@[code vue](../.vuepress/components/textarea/width.vue)

</template>

</card>

<card>

## Height

<template #example>
<textarea-height />
</template>

<template #template>

@[code vue](../.vuepress/components/textarea/height.vue)

</template>

</card>

<card>

## API

</card>
