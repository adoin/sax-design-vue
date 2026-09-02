---
description: 'Select a time value with an editable input and time columns.'
PROPS:
  - name: shape
    type: String
    values: 'rounded | square'
    description: Apply rounded or square geometry to the input and time panel.
    default: rounded
    usage: '#shape'
  - name: color
    type: String
    values: 'Sax Design theme color / RGB / HEX / HSL'
    description: Set the theme color shared by the time trigger and popup.
    default: null
    link: null
    usage: '#default'
  - name: size
    type: String
    values: 'small | default | large'
    description: Set the time input trigger size.
    default: null
    link: null
    usage: '#default'
  - name: label-float
    type: Boolean
    values: 'true | false'
    description: Use the label as a placeholder that floats on focus or when a value exists.
    default: false
    link: null
    usage: '#label'
  - name: label
    type: String
    values: Label text
    description: Set the persistent or floating label text.
    default: null
    link: null
    usage: '#label'
  - name: format
    type: String
    values: 'Day.js tokens'
    description: Format and clear the selected time.
    default: 'HH:mm:ss'
    link: null
    usage: '#default'
  - name: clearable
    type: Boolean
    values: 'true | false'
    description: Format and clear the selected time.
    default: 'true'
    link: null
    usage: '#default'
  - name: disabled-hours
    type: Function / Object
    values: 'disabled time units and column configuration'
    description: Restrict time choices and configure the time columns.
    default: null
    link: null
    usage: '#default'
  - name: disabled-minutes
    type: Function / Object
    values: 'disabled time units and column configuration'
    description: Restrict time choices and configure the time columns.
    default: null
    link: null
    usage: '#default'
  - name: disabled-seconds
    type: Function / Object
    values: 'disabled time units and column configuration'
    description: Restrict time choices and configure the time columns.
    default: null
    link: null
    usage: '#default'
  - name: time-config
    type: Function / Object
    values: 'disabled time units and column configuration'
    description: Restrict time choices and configure the time columns.
    default: null
    link: null
    usage: '#default'
  - name: v-model
    type: String | Date | number
    values: ''
    description: binding time value
    default: false
    link: null
    usage: '#default'
    code: null
  - name: model-value
    type: String | Date | number
    values: ''
    description: binding time value
    default: false
    link: null
    usage: '#default'
    code: null
  - name: timezone
    type: String
    values: 'IANA zone'
    description: Set the time zone; timestamp emits absolute milliseconds for today's wall time in that zone.
    default: ConfigProvider or system zone
  - name: value-format
    type: String
    values: 'Day.js token | timestamp'
    description: Set the time zone; timestamp emits absolute milliseconds for today's wall time in that zone.
    default: null
  - name: auto-apply-now
    type: Boolean
    values: 'true | false'
    description: Commit and close after clicking Now; a component value overrides ConfigProvider.
    default: ConfigProvider or true
EVENTS:
  - name: update:modelValue
    type: TimePickerValue
    description: Fire when the selected time is committed.
  - name: change
    type: TimePickerValue
    description: Fire when the selected time is committed.
  - name: focus
    type: FocusEvent
    description: Fire when the time input gains or loses focus.
  - name: blur
    type: FocusEvent
    description: Fire when the time input gains or loses focus.
  - name: clear
    description: Fires after clearing the selected time.
---

# Time picker

<card>

## Default

Use Time Picker for arbitrary time input with hour/minute/second spinners.

<template #example>
<time-picker-default />
</template>

<template #template>

@[code{1-5}](../.vuepress/components/time-picker/default.vue)

</template>

<template #script>

@[code{7-11}](../.vuepress/components/time-picker/default.vue)

</template>

<template #style>

@[code{13-17}](../.vuepress/components/time-picker/default.vue)

</template>

</card>

<card>

## Label

Use `label` for a persistent label. Add `label-float` to move it above the value when focused or filled.

<template #example><time-picker-label /></template>

<template #template>

@[code{1-14}](../.vuepress/components/time-picker/label.vue)

</template>

<template #script>

@[code{16-21}](../.vuepress/components/time-picker/label.vue)

</template>

<template #style>

@[code{23-28}](../.vuepress/components/time-picker/label.vue)

</template>

</card>

<card>

## Shape

Use `shape="square"` to apply square geometry to both the input trigger and teleported time panel.

<template #example><time-picker-shape /></template>

<template #template>

@[code{8-23}](../.vuepress/components/time-picker/shape.vue)

</template>

<template #script>

@[code{1-6}](../.vuepress/components/time-picker/shape.vue)

</template>

<template #style>

@[code{25-37}](../.vuepress/components/time-picker/shape.vue)

</template>

</card>
