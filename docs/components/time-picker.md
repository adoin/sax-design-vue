---
description: 'Select a time value with an editable input and time columns.'
PROPS:
  - name: color / size / label-float / label
    type: String / Boolean
    values: Theme color / small | default | large / label text
    description: Customize the trigger color, density, and floating label.
    default: '-'
    link: null
    usage: '#default'
  - name: format / clearable
    type: String / Boolean
    values: Day.js tokens / true | false
    description: Format and clear the selected time.
    default: 'HH:mm:ss / true'
    link: null
    usage: '#default'
  - name: disabled-hours / disabled-minutes / disabled-seconds / time-config
    type: Function / Object
    values: disabled time units and column configuration
    description: Restrict time choices and configure the time columns.
    default: '-'
    link: null
    usage: '#default'
  - name: v-model / model-value
    type: String | Date | number
    values:
    description: binding time value
    default: false
    link: null
    usage: '#default'
    code: null
  - name: timezone / value-format
    type: String
    values: IANA zone / Day.js token | timestamp
    description: Set the time zone; timestamp emits absolute milliseconds for today's wall time in that zone.
    default: ConfigProvider or system zone / '-'
  - name: auto-apply-now
    type: Boolean
    values: true | false
    description: Commit and close after clicking Now; a component value overrides ConfigProvider.
    default: ConfigProvider or true
EVENTS:
  - name: update:modelValue / change
    type: TimePickerValue
    description: Fire when the selected time is committed.
  - name: focus / blur
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

@[code{1-11}](../.vuepress/components/time-picker/default.vue)

</template>

<template #script>

@[code{13-17}](../.vuepress/components/time-picker/default.vue)

</template>

</card>
