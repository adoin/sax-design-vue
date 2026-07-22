---
PROPS:
  - name: v-model / model-value
    type: Date | string | number | [Date, Date]
    values:
    description: binding date value
    default: false
    link: null
    usage: '#default'
    code: null
  - name: type
    type: String
    values: date | datetime | daterange | datetimerange | month | quarter | year | week
    description: picker type
    default: date
    link: null
    usage: '#types'
    code: null
  - name: label-format / value-format / time-format
    type: String
    values: Day.js format tokens
    description: Control displayed text, emitted value, or datetime time segment independently.
    default: type-based
    link: null
    usage: '#date-and-time'
    code: null
  - name: multiple / limit-count
    type: Boolean / Number
    values:
    description: Toggle multiple values and optionally cap the selected count.
    default: 'false / -'
    link: null
    usage: '#other-types'
    code: null
  - name: show-clear-button / show-confirm-button
    type: Boolean
    values: true | false
    description: Control footer action visibility.
    default: true
    link: null
    usage: '#date-and-time'
    code: null
  - name: min-date / max-date / start-date / end-date
    type: Date | string | number
    values:
    description: Restrict selectable dates with inclusive lower and upper bounds.
    default: '-'
    link: null
    usage: '#default'
    code: null
  - name: default-date / default-time
    type: Date | string | number | [DateLike, DateLike]
    values:
    description: Set initial panel date and time when the model is empty.
    default: '-'
    link: null
    usage: '#date-and-time'
    code: null
  - name: start-day / select-day
    type: Number
    values: 0-6
    description: Set the first weekday and the returned day for week selection.
    default: '0 / -'
    link: null
    usage: '#other-types'
    code: null
  - name: time-config
    type: Object
    values: hours | minutes | seconds | *DisabledMethod
    description: Configure time-column values and disabled options.
    default: '-'
    link: null
    usage: '#date-and-time'
    code: null
  - name: popup-config
    type: Object
    values: placement | transfer | width | height | zIndex | className
    description: Configure popup placement, mounting, size, layer and class.
    default: '-'
    link: null
    usage: '#default'
    code: null
---

# Date picker

<card>

## Default

Use Date Picker for date input.

::: tip
This component requires the
<code>\<client-only\> \<\/client-only\></code>
wrap when used in SSR (eg: [Nuxt](https://nuxt.com/)) and SSG (eg: [VitePress](https://vitepress.dev/)).
:::

<template #example>
<date-picker-default />
</template>

<template #template>

@[code{1-11}](../.vuepress/components/date-picker/default.vue)

</template>

<template #script>

@[code{13-17}](../.vuepress/components/date-picker/default.vue)

</template>

</card>

<card>

## Date and time

Set `type="datetime"` to pick date and time.

<template #example>
<date-picker-datetime />
</template>

<template #template>

@[code{1-12}](../.vuepress/components/date-picker/datetime.vue)

</template>

<template #script>

@[code{14-18}](../.vuepress/components/date-picker/datetime.vue)

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

Set `type="daterange"` to pick a date range.

<template #example>
<date-picker-daterange />
</template>

<template #template>

@[code{1-14}](../.vuepress/components/date-picker/daterange.vue)

</template>

<template #script>

@[code{16-20}](../.vuepress/components/date-picker/daterange.vue)

</template>

</card>

<card>

## Other types

Month, quarter, year and week pickers.

<template #example>
<date-picker-types />
</template>

<template #template>

@[code{1-16}](../.vuepress/components/date-picker/types.vue)

</template>

<template #script>

@[code{18-22}](../.vuepress/components/date-picker/types.vue)

</template>

</card>

<card>

## Date time range

Set `type="datetimerange"` to pick a date-time range with separate start/end time panels.

<template #example>
<date-picker-datetimerange />
</template>

<template #template>

@[code{1-14}](../.vuepress/components/date-picker/datetimerange.vue)

</template>

<template #script>

@[code{16-20}](../.vuepress/components/date-picker/datetimerange.vue)

</template>

</card>

<card>

## Shortcuts

Use `shortcuts` to provide quick selection options.

<template #example>
<date-picker-shortcuts />
</template>

<template #template>

@[code{1-35}](../.vuepress/components/date-picker/shortcuts.vue)

</template>

<template #script>

@[code{11-35}](../.vuepress/components/date-picker/shortcuts.vue)

</template>

</card>

<card>

## Disabled date

Use `disabled-date` to disable specific dates.

<template #example>
<date-picker-disabled-date />
</template>

<template #template>

@[code{1-12}](../.vuepress/components/date-picker/disabled-date.vue)

</template>

<template #script>

@[code{14-18}](../.vuepress/components/date-picker/disabled-date.vue)

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

@[code{7-16}](../.vuepress/components/date-picker/festival.vue)

</template>

</card>

<card>

## API

</card>
