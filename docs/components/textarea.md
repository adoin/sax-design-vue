---
PROPS:
  - name: shape
    type: String
    values: 'rounded | square'
    description: Set rounded or square geometry for the field and counter.
    default: rounded
    usage: '#shape'
  - name: v-model
    type: String
    values: 'string'
    description: Textarea value.
    default: ''
    usage: '#default'
  - name: label
    type: String
    values: 'label text'
    description: Floating label text.
    default: null
    usage: '#label'
  - name: color
    type: String
    values: 'theme color | RGB | HEX | HSL'
    description: Set the field and counter accent color.
    default: primary
    usage: '#default'
  - name: counter
    type: Number | String
    values: 'number | numeric string'
    description: Display a character limit and counter.
    default: null
    usage: '#counter'
  - name: counter-danger
    type: Boolean
    values: 'true | false'
    description: Highlight counter when limit exceeded.
    default: false
    usage: '#counter'
  - name: placeholder
    type: String
    values: 'placeholder text'
    description: Set the native textarea placeholder.
    default: null
    usage: '#default'
  - name: name
    type: String
    values: 'form field name'
    description: Set the native form field name.
    default: null
    usage: '#default'
  - name: form
    type: String
    values: 'form element id'
    description: Associate the textarea with a form element.
    default: null
    usage: '#default'
  - name: max-length
    type: Number | String
    values: 'non-negative length'
    description: Set the native input length limit.
    default: null
    usage: '#advanced'
  - name: show-word-count
    type: Boolean
    values: 'true | false'
    description: Show the current character count.
    default: false
    usage: '#advanced'
  - name: count-method
    type: Function
    values: '({ value: string }) => number'
    description: Customize the displayed character count.
    default: value.length
    usage: '#advanced'
  - name: auto-size
    type: Object
    values: '{ minRows, maxRows }'
    description: Grow height with content within row bounds.
    default: null
    usage: '#advanced'
  - name: readonly
    type: Boolean
    values: 'true | false'
    description: Set the native textarea to read-only.
    default: false
    usage: '#advanced'
  - name: disabled
    type: Boolean
    values: 'true | false'
    description: Disable editing and interaction.
    default: false
    usage: '#advanced'
  - name: editable
    type: Boolean
    values: 'true | false'
    description: Allow the textarea value to be edited.
    default: true
    usage: '#advanced'
  - name: trim
    type: Boolean
    values: 'true | false'
    description: Trim leading and trailing whitespace when a change is committed.
    default: false
    usage: '#advanced'
  - name: rows
    type: Number | String
    values: 'native row count'
    description: Set the native textarea row count.
    default: null
    usage: '#advanced'
  - name: cols
    type: Number | String
    values: 'native column count'
    description: Set the native textarea column count.
    default: null
    usage: '#advanced'
  - name: resize
    type: String
    values: 'none | both | horizontal | vertical'
    description: Control the native resize direction.
    default: null
    usage: '#advanced'
  - name: immediate
    type: Boolean
    values: 'true | false'
    description: Update while typing, or commit the value on change and blur.
    default: true
    usage: '#advanced'
  - name: height
    type: String
    values: 'CSS height'
    description: Textarea height.
    default: null
    usage: '#height'
  - name: width
    type: String
    values: 'CSS width'
    description: Textarea width.
    default: null
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

@[code{1-7}](../.vuepress/components/textarea/default.vue)

</template>

<template #script>

@[code{9-12}](../.vuepress/components/textarea/default.vue)

</template>

</card>

<card>

## Shape

Use `shape="square"` to apply straight corners to the field, focus surface, and counter area.

<template #example><textarea-shape /></template>

<template #template>

@[code{8-23}](../.vuepress/components/textarea/shape.vue)

</template>

<template #script>

@[code{1-6}](../.vuepress/components/textarea/shape.vue)

</template>

<template #style>

@[code{25-37}](../.vuepress/components/textarea/shape.vue)

</template>

</card>

<card>

## Label

The label starts inside an empty field, then moves fully above the border on focus or when a value is present, matching the Input label baseline.

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

@[code{1-8}](../.vuepress/components/textarea/counter.vue)

</template>

<template #script>

@[code{10-15}](../.vuepress/components/textarea/counter.vue)

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

Use `max-length`, `show-word-count`, `auto-size` and `trim` for a bounded, automatically growing field.

<template #example>
<textarea-advanced />
</template>

<template #template>

@[code{1-11}](../.vuepress/components/textarea/advanced.vue)

</template>

<template #script>

@[code{13-17}](../.vuepress/components/textarea/advanced.vue)

</template>

</card>
