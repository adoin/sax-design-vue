---
description: '从预设或生成的时间列表中选择时间。'
PROPS:
  - name: shape
    type: String
    values: 'rounded | square'
    description: 设置时间选择触发器和弹层的圆角或方形外观。
    default: rounded
    usage: '#外形'
  - name: label
    type: String
    values: 标签文字
    description: 设置常驻标签或上浮标签的文字。
    default: null
    usage: '#标签'
  - name: label-float
    type: Boolean
    values: 'true | false'
    description: 让标签作为占位内容，并在聚焦或存在值时上浮。
    default: false
    usage: '#标签'
  - name: v-model
    type: String
    values: ''
    description: 绑定时间值。
    default: false
    link: null
    usage: '#default'
    code: null
  - name: model-value
    type: String
    values: ''
    description: 绑定时间值。
    default: false
    link: null
    usage: '#default'
    code: null
EVENTS:
  - name: update:modelValue
    type: String
    description: 选中的时间选项变化时触发。
  - name: change
    type: String
    description: 选中的时间选项变化时触发。
  - name: focus
    type: FocusEvent | Event
    description: 控件获得或失去焦点时触发。
  - name: blur
    type: FocusEvent | Event
    description: 控件获得或失去焦点时触发。
---

# Time select 时间选择

<card>

## 默认

使用 Time Select 输入时间。

可选时间范围为 00:00 至 23:59。

<template #example>
<time-select-default />
</template>

<template #template>

@[code{1-11}](../../.vuepress/components/time-select/default.vue)

</template>

<template #script>

@[code{13-17}](../../.vuepress/components/time-select/default.vue)

</template>

<template #style>

@[code{19-23}](../../.vuepress/components/time-select/default.vue)

</template>

</card>

<card>

## 标签

使用 `label` 显示常驻标签；同时设置 `label-float` 后，标签会在聚焦或存在值时上浮。

<template #example><time-select-label /></template>

<template #template>

@[code{1-15}](../../.vuepress/components/time-select/label.vue)

</template>

<template #script>

@[code{17-22}](../../.vuepress/components/time-select/label.vue)

</template>

<template #style>

@[code{24-29}](../../.vuepress/components/time-select/label.vue)

</template>

</card>

<card>

## 外形

设置 `shape="square"` 可让时间输入框和选项弹层保持一致的直角外观。

<template #example><time-select-shape /></template>

<template #template>

@[code{8-32}](../../.vuepress/components/time-select/shape.vue)

</template>

<template #script>

@[code{1-6}](../../.vuepress/components/time-select/shape.vue)

</template>

<template #style>

@[code{34-46}](../../.vuepress/components/time-select/shape.vue)

</template>

</card>

<card>

## 时间格式

使用 `format` 控制时间（小时和分钟）格式。

可查看 [Day.js 格式列表](https://day.js.org/docs/en/display/format#list-of-all-available-formats)。

::: warning
注意大小写。
:::

<template #example>
<time-select-format />
</template>

<template #template>

@[code{1-12}](../../.vuepress/components/time-select/format.vue)

</template>

<template #script>

@[code{14-18}](../../.vuepress/components/time-select/format.vue)

</template>

</card>

<card>

## 固定时间范围

先选择开始（结束）时间后，结束（开始）时间的可选项状态会随之更新。

<template #example>
<time-select-time-range />
</template>

<template #template>

@[code{1-21}](../../.vuepress/components/time-select/time-range.vue)

</template>

<template #script>

@[code{23-28}](../../.vuepress/components/time-select/time-range.vue)

</template>

<template #style>

@[code{30-35}](../../.vuepress/components/time-select/time-range.vue)

</template>

</card>

<card>

## 禁用

是否禁用 TimeSelect。

<template #example>
<time-select-disabled />
</template>

<template #template>

@[code{1-12}](../../.vuepress/components/time-select/disabled.vue)

</template>

<template #script>

@[code{14-18}](../../.vuepress/components/time-select/disabled.vue)

</template>

</card>
