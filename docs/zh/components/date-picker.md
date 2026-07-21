---
PROPS:
  - name: v-model / model-value
    type: Date | string | number | [Date, Date]
    values:
    description: 绑定日期值
    default: false
    link: null
    usage: '#default'
    code: null
  - name: type
    type: String
    values: date | datetime | daterange | datetimerange | month | year | week
    description: 选择器类型
    default: date
    link: null
    usage: '#types'
    code: null
---

# Date picker

<card>

## 默认

使用 Date Picker 选择日期。

::: tip
在 SSR（如 [Nuxt](https://nuxt.com/)）或 SSG（如 [VitePress](https://vitepress.dev/)）中使用时，需要用
<code>\<client-only\> \<\/client-only\></code>
包裹。
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

## 日期时间

设置 `type="datetime"` 可同时选择日期与时间。

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

## 日期范围

设置 `type="daterange"` 选择日期范围。

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

## 其他类型

月份、年份与周选择器。

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

## 日期时间范围

设置 `type="datetimerange"` 选择日期时间范围，开始/结束时间可分别设置。

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

## 快捷选项

通过 `shortcuts` 提供快捷日期选择。

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

## 禁用日期

通过 `disabled-date` 禁用特定日期。

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
