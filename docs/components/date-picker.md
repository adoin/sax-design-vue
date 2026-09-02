---
description: 'Select dates, date ranges, and date-time values.'
PROPS:
  - name: shape
    type: String
    values: "rounded | square"
    description: Apply rounded or square geometry to the input and picker panel.
    default: rounded
    usage: '#shape'
  - name: color
    type: String / Boolean
    values: "Theme color / small | default | large / label text"
    description: Share input color, density, and floating labels across single and range date triggers.
    default: null
    link: null
    usage: '#default'
  - name: size
    type: String / Boolean
    values: "Theme color / small | default | large / label text"
    description: Share input color, density, and floating labels across single and range date triggers.
    default: null
    link: null
    usage: '#default'
  - name: label-float
    type: String / Boolean
    values: "Theme color / small | default | large / label text"
    description: Share input color, density, and floating labels across single and range date triggers.
    default: null
    link: null
    usage: '#default'
  - name: label
    type: String / Boolean
    values: "Theme color / small | default | large / label text"
    description: Share input color, density, and floating labels across single and range date triggers.
    default: null
    link: null
    usage: '#default'
  - name: start-label
    type: String / Boolean
    values: "Theme color / small | default | large / label text"
    description: Share input color, density, and floating labels across single and range date triggers.
    default: null
    link: null
    usage: '#default'
  - name: end-label
    type: String / Boolean
    values: "Theme color / small | default | large / label text"
    description: Share input color, density, and floating labels across single and range date triggers.
    default: null
    link: null
    usage: '#default'
  - name: auto-close
    type: Boolean
    values: "true | false / date range separator"
    description: Control close timing, clear action availability, and range text separator.
    default: 'true'
    link: null
    usage: '#default'
    code: null
  - name: clearable
    type: Boolean
    values: "true | false / date range separator"
    description: Control close timing, clear action availability, and range text separator.
    default: 'true'
    link: null
    usage: '#default'
    code: null
  - name: separator
    type: String
    values: "true | false / date range separator"
    description: Control close timing, clear action availability, and range text separator.
    default: null
    link: null
    usage: '#default'
    code: null
  - name: auto-apply-now
    type: Boolean
    values: "true | false"
    description: Commit the current time and close after clicking Now; a component value overrides ConfigProvider.
    default: ConfigProvider or the picker's existing behavior
  - name: v-model
    type: Date | string | number | [Date
    values: ""
    description: binding date value
    default: false
    link: null
    usage: '#default'
    code: null
  - name: model-value
    type: Date]
    values: ""
    description: binding date value
    default: false
    link: null
    usage: '#default'
    code: null
  - name: type
    type: String
    values: "date | datetime | daterange | datetimerange | month | quarter | year | week"
    description: picker type
    default: date
    link: null
    usage: '#types'
    code: null
  - name: label-format
    type: String
    values: "Day.js format tokens | timestamp"
    description: Control displayed text, emitted value, or datetime time segment independently; timestamp emits milliseconds as a number.
    default: type-based
    link: null
    usage: '#date-and-time'
    code: null
  - name: value-format
    type: String
    values: "Day.js format tokens | timestamp"
    description: Control displayed text, emitted value, or datetime time segment independently; timestamp emits milliseconds as a number.
    default: type-based
    link: null
    usage: '#date-and-time'
    code: null
  - name: time-format
    type: String
    values: "Day.js format tokens | timestamp"
    description: Control displayed text, emitted value, or datetime time segment independently; timestamp emits milliseconds as a number.
    default: type-based
    link: null
    usage: '#date-and-time'
    code: null
  - name: timezone
    type: String
    values: "IANA zone such as Asia/Shanghai"
    description: Interpret wall time and convert absolute values; a component value overrides ConfigProvider.
    default: ConfigProvider or system zone
    usage: '#timezone'
  - name: multiple
    type: Boolean
    values: ""
    description: Toggle multiple values and optionally cap the selected count.
    default: 'false'
    link: null
    usage: '#other-types'
    code: null
  - name: limit-count
    type: Number
    values: ""
    description: Toggle multiple values and optionally cap the selected count.
    default: null
    link: null
    usage: '#other-types'
    code: null
  - name: show-clear-button
    type: Boolean
    values: "true | false"
    description: Control footer action visibility.
    default: true
    link: null
    usage: '#date-and-time'
    code: null
  - name: show-confirm-button
    type: Boolean
    values: "true | false"
    description: Control footer action visibility.
    default: true
    link: null
    usage: '#date-and-time'
    code: null
  - name: min-date
    type: Date | string | number
    values: ""
    description: Restrict selectable dates with inclusive lower and upper bounds.
    default: null
    link: null
    usage: '#default'
    code: null
  - name: max-date
    type: Date | string | number
    values: ""
    description: Restrict selectable dates with inclusive lower and upper bounds.
    default: null
    link: null
    usage: '#default'
    code: null
  - name: start-date
    type: Date | string | number
    values: ""
    description: Restrict selectable dates with inclusive lower and upper bounds.
    default: null
    link: null
    usage: '#default'
    code: null
  - name: end-date
    type: Date | string | number
    values: ""
    description: Restrict selectable dates with inclusive lower and upper bounds.
    default: null
    link: null
    usage: '#default'
    code: null
  - name: default-date
    type: Date | string | number | [DateLike
    values: ""
    description: Set initial panel date and time when the model is empty.
    default: null
    link: null
    usage: '#date-and-time'
    code: null
  - name: default-time
    type: DateLike]
    values: ""
    description: Set initial panel date and time when the model is empty.
    default: null
    link: null
    usage: '#date-and-time'
    code: null
  - name: start-day
    type: Number
    values: "0-6"
    description: Set the first weekday and the returned day for week selection.
    default: '0'
    link: null
    usage: '#other-types'
    code: null
  - name: select-day
    type: Number
    values: "0-6"
    description: Set the first weekday and the returned day for week selection.
    default: null
    link: null
    usage: '#other-types'
    code: null
  - name: time-config
    type: Object
    values: "hours | minutes | seconds | *DisabledMethod"
    description: Configure time-column values and disabled options.
    default: null
    link: null
    usage: '#date-and-time'
    code: null
  - name: popup-config
    type: Object
    values: "placement | transfer | width | height | zIndex | className"
    description: Configure popup placement, mounting, size, layer and class.
    default: null
    link: null
    usage: '#default'
    code: null
EVENTS:
  - name: update:modelValue
    type: DatePickerValue
    description: Fire when the selected date or date range is committed.
  - name: change
    type: DatePickerValue
    description: Fire when the selected date or date range is committed.
  - name: focus
    type: FocusEvent
    description: Fire when the date input gains or loses focus.
  - name: blur
    type: FocusEvent
    description: Fire when the date input gains or loses focus.
  - name: clear
    description: Fires after clearing the selected value.
---

# Date picker

<card>

## Default

Use Date Picker for date input. The example also shows custom color and floating
labels for single and range triggers.

<template #example>
<date-picker-default />
</template>

<template #template>

@[code{1-19}](../.vuepress/components/date-picker/default.vue)

</template>

<template #script>

@[code{21-26}](../.vuepress/components/date-picker/default.vue)

</template>

<template #style>

@[code{28-34}](../.vuepress/components/date-picker/default.vue)

</template>

</card>

<card>

## Shape

Use `shape="square"` to apply square geometry to both the input trigger and teleported calendar panel.

<template #example><date-picker-shape /></template>

<template #template>

@[code{8-23}](../.vuepress/components/date-picker/shape.vue)

</template>

<template #script>

@[code{1-6}](../.vuepress/components/date-picker/shape.vue)

</template>

<template #style>

@[code{25-37}](../.vuepress/components/date-picker/shape.vue)

</template>

</card>

<card>

## Date and time

Set `type="datetime"` to pick date and time. With `auto-apply-now`, clicking Now immediately updates `v-model` and closes the popup. When disabled, the current time remains staged until confirmation. The same default can be configured through `SConfigProvider`.

<template #example>
<date-picker-datetime />
</template>

<template #template>

@[code{1-9}](../.vuepress/components/date-picker/datetime.vue)

</template>

<template #script>

@[code{11-15}](../.vuepress/components/date-picker/datetime.vue)

</template>

</card>

<card>

## Time zone {#timezone}

`timezone` accepts an IANA zone. Both pickers below display `2026-08-05 14:00:22`, while Shanghai and New York map that wall time to different absolute milliseconds. The first inherits `SConfigProvider`; the second overrides it locally. Daylight-saving transitions follow the runtime IANA data.

<template #example>
<date-picker-timezone />
</template>

<template #template>

@[code{1-28}](../.vuepress/components/date-picker/timezone.vue)

</template>

<template #script>

@[code{30-35}](../.vuepress/components/date-picker/timezone.vue)

</template>

<template #style>

@[code{37-65}](../.vuepress/components/date-picker/timezone.vue)

</template>

</card>

<card>

## Time

Use `s-time-picker` when only a time value is needed. It shares the same
formatting, editable input, clear action, and time-column selection behavior.

<template #example>
<date-picker-time />
</template>

<template #template>

@[code{1-5}](../.vuepress/components/date-picker/time.vue)

</template>

<template #script>

@[code{7-11}](../.vuepress/components/date-picker/time.vue)

</template>

</card>

<card>

## Date range

Set `type="daterange"` to pick a date range; there is no separate Date Range
Picker component. An empty value opens on the current and following months.
Selecting the end date only updates the draft, and `v-model` changes after
Confirm.

<template #example>
<date-picker-daterange />
</template>

<template #template>

@[code{1-5}](../.vuepress/components/date-picker/daterange.vue)

</template>

<template #script>

@[code{7-11}](../.vuepress/components/date-picker/daterange.vue)

</template>

</card>

<card>

## Other types

Month, quarter, year and week pickers.

<template #example>
<date-picker-types />
</template>

<template #template>

@[code{1-14}](../.vuepress/components/date-picker/types.vue)

</template>

<template #script>

@[code{16-24}](../.vuepress/components/date-picker/types.vue)

</template>

<template #style>

@[code{26-30}](../.vuepress/components/date-picker/types.vue)

</template>

</card>

<card>

## Date time range

Set `type="datetimerange"` to pick a date-time range with separate start/end time panels.

<template #example>
<date-picker-datetimerange />
</template>

<template #template>

@[code{1-10}](../.vuepress/components/date-picker/datetimerange.vue)

</template>

<template #script>

@[code{12-16}](../.vuepress/components/date-picker/datetimerange.vue)

</template>

</card>

<card>

## Shortcuts

Use `shortcuts` to provide quick selection options.

<template #example>
<date-picker-shortcuts />
</template>

<template #template>

@[code{1-9}](../.vuepress/components/date-picker/shortcuts.vue)

</template>

<template #script>

@[code{11-38}](../.vuepress/components/date-picker/shortcuts.vue)

</template>

</card>

<card>

## Disabled date

Use `disabled-date` to disable specific dates.

<template #example>
<date-picker-disabled-date />
</template>

<template #template>

@[code{1-9}](../.vuepress/components/date-picker/disabled-date.vue)

</template>

<template #script>

@[code{11-17}](../.vuepress/components/date-picker/disabled-date.vue)

</template>

</card>

<card>

## Date markers

Use `festival-method` to add a compact label, notice dot, or custom cell style
for business dates without changing the picker theme.

<template #example>
<date-picker-festival />
</template>

<template #template>

@[code{1-5}](../.vuepress/components/date-picker/festival.vue)

</template>

<template #script>

@[code{7-17}](../.vuepress/components/date-picker/festival.vue)

</template>

</card>
