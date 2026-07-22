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

  - name: max-length / show-word-count
    type: Number, Boolean
    values: Number, true | false
    description: Native length limit and a VXE-compatible counter.
    default: null, false
    link: null
    usage: '#advanced'

  - name: auto-size
    type: Object
    values: '{ minRows, maxRows }'
    description: Grow height with content within row bounds.
    default: null
    link: null
    usage: '#advanced'

  - name: readonly / disabled / editable / trim
    type: Boolean
    values: true, false
    description: Control editing state and trim output on change.
    default: false, false, true, false
    link: null
    usage: '#advanced'

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
description: 'Multi-line text input with label, counter, and sizing options.'
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

Bind text with `v-model` for controlled input.

<template #example>
<textarea-default />
</template>

<template #template>

@[code{1-3}](../.vuepress/components/textarea/default.vue)

</template>

<template #script>

@[code{5-8}](../.vuepress/components/textarea/default.vue)

</template>

</card>

<card>

## Label

Float a label above the field for clearer forms.

<template #example>
<textarea-label />
</template>

<template #template>

@[code{1-3}](../.vuepress/components/textarea/label.vue)

</template>

<template #script>

@[code{5-8}](../.vuepress/components/textarea/label.vue)

</template>

</card>

<card>

## Counter

Show remaining characters and warn when the limit is exceeded.

<template #example>
<textarea-counter />
</template>

<template #template>

@[code{1-3}](../.vuepress/components/textarea/counter.vue)

</template>

<template #script>

@[code{5-8}](../.vuepress/components/textarea/counter.vue)

</template>

</card>

<card>

## Width

Set a fixed width for form layouts.

<template #example>
<textarea-width />
</template>

<template #template>

@[code{1-3}](../.vuepress/components/textarea/width.vue)

</template>

<template #script>

@[code{5-8}](../.vuepress/components/textarea/width.vue)

</template>

</card>

<card>

## Height

Control the visible height of the textarea.

<template #example>
<textarea-height />
</template>

<template #template>

@[code{1-3}](../.vuepress/components/textarea/height.vue)

</template>

<template #script>

@[code{5-8}](../.vuepress/components/textarea/height.vue)

</template>

</card>

<card>

## Advanced

Use VXE-aligned `max-length`, `show-word-count`, `auto-size` and `trim` for a bounded, automatically growing field.

<template #example>
<textarea-advanced />
</template>

<template #template>

@[code{1-11} html{5-8}](../.vuepress/components/textarea/advanced.vue)

</template>

<template #script>

@[code{13-16}](../.vuepress/components/textarea/advanced.vue)

</template>

## API

</card>
