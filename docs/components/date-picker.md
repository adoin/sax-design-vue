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
    values: date | datetime | daterange | datetimerange | month | year | week
    description: picker type
    default: date
    link: null
    usage: '#types'
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

Month, year and week pickers.

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

## API

</card>
