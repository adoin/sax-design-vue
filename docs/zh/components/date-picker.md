---
description: '选择日期、日期范围和日期时间值。'
PROPS:
  - name: color / size / label-float / label / start-label / end-label
    type: String / Boolean
    values: 主题色 / small | default | large / 标签文字
    description: 为单值和范围日期输入同步主题色、尺寸与浮动标签。
    default: '-'
  - name: auto-close / clearable / editable / separator
    type: Boolean / Boolean / Boolean / String
    values: true | false / 日期范围分隔符
    description: 控制自动关闭、清空操作、输入编辑和日期范围分隔符。
    default: 'true / true / true / -'
  - name: auto-apply-now
    type: Boolean
    values: true | false
    description: 点击“此刻”后是否立即提交当前时间并关闭弹层；组件配置优先于 ConfigProvider。
    default: ConfigProvider 或按选择器原有行为
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
    values: Day.js 格式 token | timestamp
    description: 分别控制展示文本、输出值与 datetime 的时间片段；timestamp 输出毫秒数字。
    default: 随类型
    link: null
    usage: '#date-and-time'
    code: null
  - name: timezone
    type: String
    values: IANA 时区，如 Asia/Shanghai
    description: 解释墙上时间并换算绝对值；组件配置优先于 ConfigProvider。
    default: ConfigProvider 或系统时区
    usage: '#timezone'
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
EVENTS:
  - name: update:modelValue / change
    type: DatePickerValue
    description: 选中的日期或日期范围确认提交时触发。
  - name: focus / blur
    type: FocusEvent
    description: 日期输入框获得或失去焦点时触发。
  - name: clear
    description: 清空已选值后触发。
---

# Date picker 日期选择器

<card>

## 默认

使用 Date Picker 选择日期。示例同时展示单值、范围输入的自定义主题色和浮动标签。

<template #example>
<date-picker-default />
</template>

<template #template>

@[code{1-19}](../../.vuepress/components/date-picker/default.vue)

</template>

<template #script>

@[code{21-26}](../../.vuepress/components/date-picker/default.vue)

</template>

</card>

<card>

## 日期时间

设置 `type="datetime"` 可同时选择日期与时间。开启 `auto-apply-now` 后，点击“此刻”会立即更新 `v-model` 并关闭弹层；关闭时则保留当前时间，等待用户确认。该配置也可通过 `SConfigProvider` 全局设置。

<template #example>
<date-picker-datetime />
</template>

<template #template>

@[code{1-12}](../../.vuepress/components/date-picker/datetime.vue)

</template>

<template #script>

@[code{14-18}](../../.vuepress/components/date-picker/datetime.vue)

</template>

</card>

<card>

## 时区 {#timezone}

`timezone` 使用 IANA 时区。下面两个选择器都显示 `2026-08-05 14:00:22`，但上海与纽约对应的绝对毫秒不同。第一个从 `SConfigProvider` 继承，第二个在组件上覆盖。夏令时由运行环境的 IANA 数据处理。

<template #example>
<date-picker-timezone />
</template>

<template #template>

@[code{1-28}](../../.vuepress/components/date-picker/timezone.vue)

</template>

<template #script>

@[code{30-34}](../../.vuepress/components/date-picker/timezone.vue)

</template>

</card>

<card>

## 时间

仅需要时间值时使用 `s-time-picker`。它支持格式化、可编辑输入、清空和时/分/秒列选择。

<template #example>
<date-picker-time />
</template>

<template #template>

@[code{1-5}](../../.vuepress/components/date-picker/time.vue)

</template>

<template #script>

@[code{7-11}](../../.vuepress/components/date-picker/time.vue)

</template>

</card>

<card>

## 日期范围

设置 `type="daterange"` 选择日期范围，不再提供单独的 Date Range Picker
组件。空范围默认打开当前月和下个月；选择结束日期只更新内部草稿，点击“确定”后才更新 `v-model`。

<template #example>
<date-picker-daterange />
</template>

<template #template>

@[code{1-14}](../../.vuepress/components/date-picker/daterange.vue)

</template>

<template #script>

@[code{16-20}](../../.vuepress/components/date-picker/daterange.vue)

</template>

</card>

<card>

## 其他类型

月份、季度、年份与周选择器。

<template #example>
<date-picker-types />
</template>

<template #template>

@[code{1-16}](../../.vuepress/components/date-picker/types.vue)

</template>

<template #script>

@[code{18-22}](../../.vuepress/components/date-picker/types.vue)

</template>

</card>

<card>

## 日期时间范围

设置 `type="datetimerange"` 选择日期时间范围，开始/结束时间可分别设置。

<template #example>
<date-picker-datetimerange />
</template>

<template #template>

@[code{1-14}](../../.vuepress/components/date-picker/datetimerange.vue)

</template>

<template #script>

@[code{16-20}](../../.vuepress/components/date-picker/datetimerange.vue)

</template>

</card>

<card>

## 快捷选项

通过 `shortcuts` 提供快捷日期选择。

<template #example>
<date-picker-shortcuts />
</template>

<template #template>

@[code{1-35}](../../.vuepress/components/date-picker/shortcuts.vue)

</template>

<template #script>

@[code{11-35}](../../.vuepress/components/date-picker/shortcuts.vue)

</template>

</card>

<card>

## 禁用日期

通过 `disabled-date` 禁用特定日期。

<template #example>
<date-picker-disabled-date />
</template>

<template #template>

@[code{1-12}](../../.vuepress/components/date-picker/disabled-date.vue)

</template>

<template #script>

@[code{14-18}](../../.vuepress/components/date-picker/disabled-date.vue)

</template>

</card>

<card>

## 日期标记

通过 `festival-method` 为业务日期添加紧凑标签、提示圆点或自定义单元格样式，不改变选择器主题。

<template #example>
<date-picker-festival />
</template>

<template #template>

@[code{1-5}](../../.vuepress/components/date-picker/festival.vue)

</template>

<template #script>

@[code{7-16}](../../.vuepress/components/date-picker/festival.vue)

</template>

</card>
