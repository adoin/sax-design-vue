---
description: 'Choose a time from a predefined or generated list.'
PROPS:
  - name: shape
    type: String
    values: 'rounded | square'
    description: Set rounded or square geometry for the select trigger and popup.
    default: rounded
    usage: '#shape'
  - name: label
    type: String
    values: Label text
    description: Set the persistent or floating label text.
    default: null
    usage: '#label'
  - name: label-float
    type: Boolean
    values: 'true | false'
    description: Use the label as a placeholder that floats on focus or when a value exists.
    default: false
    usage: '#label'
  - name: v-model
    type: String
    values: ''
    description: binding time value
    default: false
    link: null
    usage: '#default'
    code: null
  - name: model-value
    type: String
    values: ''
    description: binding time value
    default: false
    link: null
    usage: '#default'
    code: null
EVENTS:
  - name: update:modelValue
    type: String
    description: Fire when the selected time option changes.
  - name: change
    type: String
    description: Fire when the selected time option changes.
  - name: focus
    type: FocusEvent | Event
    description: Fire when the control gains or loses focus.
  - name: blur
    type: FocusEvent | Event
    description: Fire when the control gains or loses focus.
---

# Time select

<card>

## Default

Use Time Select for time input.

The available time range is 00:00 to 23:59

<template #example>
<time-select-default />
</template>

<template #template>

@[code{1-11}](../.vuepress/components/time-select/default.vue)

</template>

<template #script>

@[code{13-17}](../.vuepress/components/time-select/default.vue)

</template>

<template #style>

@[code{19-23}](../.vuepress/components/time-select/default.vue)

</template>

</card>

<card>

## Label

Use `label` for a persistent label. Add `label-float` to move it above the value when focused or filled.

<template #example><time-select-label /></template>

<template #template>

@[code{1-15}](../.vuepress/components/time-select/label.vue)

</template>

<template #script>

@[code{17-22}](../.vuepress/components/time-select/label.vue)

</template>

<template #style>

@[code{24-29}](../.vuepress/components/time-select/label.vue)

</template>

</card>

<card>

## Shape

Use `shape="square"` to keep the time input and its option popup visually consistent.

<template #example><time-select-shape /></template>

<template #template>

@[code{8-32}](../.vuepress/components/time-select/shape.vue)

</template>

<template #script>

@[code{1-6}](../.vuepress/components/time-select/shape.vue)

</template>

<template #style>

@[code{34-46}](../.vuepress/components/time-select/shape.vue)

</template>

</card>

<card>

## Time Formats

Use format to control format of time(hours and minutes).

Check the list [here](https://day.js.org/docs/en/display/format#list-of-all-available-formats) of all available formats of Day.js.

::: warning
Pay attention to capitalization
:::

<template #example>
<time-select-format />
</template>

<template #template>

@[code{1-12}](../.vuepress/components/time-select/format.vue)

</template>

<template #script>

@[code{14-18}](../.vuepress/components/time-select/format.vue)

</template>

</card>

<card>

## Fixed time ranges

If start( end ) time is picked at first, then the status of end( start ) time's options will change accordingly.

<template #example>
<time-select-time-range />
</template>

<template #template>

@[code{1-21}](../.vuepress/components/time-select/time-range.vue)

</template>

<template #script>

@[code{23-28}](../.vuepress/components/time-select/time-range.vue)

</template>

<template #style>

@[code{30-35}](../.vuepress/components/time-select/time-range.vue)

</template>

</card>

<card>

## Disabled

whether TimeSelect is disabled

<template #example>
<time-select-disabled />
</template>

<template #template>

@[code{1-12}](../.vuepress/components/time-select/disabled.vue)

</template>

<template #script>

@[code{14-18}](../.vuepress/components/time-select/disabled.vue)

</template>

</card>
