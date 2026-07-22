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
    values: date | datetime | daterange | datetimerange | month | quarter | year | week
    description: 选择器类型
    default: date
    link: null
    usage: '#types'
    code: null
  - name: label-format / value-format / time-format
    type: String
    values: Day.js 格式 token
    description: 分别控制展示文本、输出值与 datetime 的时间片段。
    default: 随类型
    link: null
    usage: '#date-and-time'
    code: null
  - name: multiple / limit-count
    type: Boolean / Number
    values:
    description: 开启多选，并可限制最多选中数量。
    default: 'false / -'
    link: null
    usage: '#other-types'
    code: null
  - name: show-clear-button / show-confirm-button
    type: Boolean
    values: true | false
    description: 控制底部清除、确认按钮显示。
    default: true
    link: null
    usage: '#date-and-time'
    code: null
  - name: min-date / max-date / start-date / end-date
    type: Date | string | number
    values:
    description: 设置可选日期的包含式最小、最大边界。
    default: '-'
    link: null
    usage: '#default'
    code: null
  - name: default-date / default-time
    type: Date | string | number | [DateLike, DateLike]
    values:
    description: 未绑定值时设置面板初始日期与时间。
    default: '-'
    link: null
    usage: '#date-and-time'
    code: null
  - name: start-day / select-day
    type: Number
    values: 0-6
    description: 设置每周第一天及周选择时返回的日期。
    default: '0 / -'
    link: null
    usage: '#other-types'
    code: null
  - name: time-config
    type: Object
    values: hours | minutes | seconds | *DisabledMethod
    description: 配置时间列候选值和禁用规则。
    default: '-'
    link: null
    usage: '#date-and-time'
    code: null
  - name: popup-config
    type: Object
    values: placement | transfer | width | height | zIndex | className
    description: 配置弹层方向、挂载、尺寸、层级和类名。
    default: '-'
    link: null
    usage: '#default'
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

## 时间

仅需要时间值时使用 `s-time-picker`。它支持格式化、可编辑输入、清空和时/分/秒列选择。

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

月份、季度、年份与周选择器。

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

## 日期标记

通过 `festival-method` 为业务日期添加紧凑标签、提示圆点或自定义单元格样式，不改变选择器主题。

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
