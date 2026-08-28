---
description: '从预设或生成的时间列表中选择时间。'
PROPS:
  - name: v-model / model-value
    type: String
    values:
    description: 绑定时间值。
    default: false
    link: null
    usage: '#default'
    code: null
EVENTS:
  - name: update:modelValue / change
    type: String
    description: 选中的时间选项变化时触发。
  - name: focus / blur
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
