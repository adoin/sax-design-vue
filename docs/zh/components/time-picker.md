---
description: '通过可编辑输入框和时间列选择时间值。'
PROPS:
  - name: shape
    type: String
    values: 'rounded | square'
    description: 为时间输入和时间面板统一设置圆角或方形外观。
    default: rounded
    usage: '#外形'
  - name: color
    type: String
    values: 'Sax Design 主题色 / RGB / HEX / HSL'
    description: 设置时间输入触发器与弹层的主题色。
    default: null
  - name: size
    type: String
    values: 'small | default | large'
    description: 设置时间输入触发器的尺寸。
    default: null
  - name: label-float
    type: Boolean
    values: 'true | false'
    description: 让标签作为占位内容，并在聚焦或存在值时上浮。
    default: false
    usage: '#标签'
  - name: label
    type: String
    values: 标签文字
    description: 设置常驻标签或上浮标签的文字。
    default: null
    usage: '#标签'
  - name: clearable
    type: Boolean / Function / String / Object
    values: '清空、禁用时间项、输入编辑和时间列配置'
    description: 控制清空操作、可选时间、输入编辑、格式和时间列行为。
    default: null
  - name: disabled-hours
    type: Boolean / Function / String / Object
    values: '清空、禁用时间项、输入编辑和时间列配置'
    description: 控制清空操作、可选时间、输入编辑、格式和时间列行为。
    default: null
  - name: disabled-minutes
    type: Boolean / Function / String / Object
    values: '清空、禁用时间项、输入编辑和时间列配置'
    description: 控制清空操作、可选时间、输入编辑、格式和时间列行为。
    default: null
  - name: disabled-seconds
    type: Boolean / Function / String / Object
    values: '清空、禁用时间项、输入编辑和时间列配置'
    description: 控制清空操作、可选时间、输入编辑、格式和时间列行为。
    default: null
  - name: editable
    type: Boolean / Function / String / Object
    values: '清空、禁用时间项、输入编辑和时间列配置'
    description: 控制清空操作、可选时间、输入编辑、格式和时间列行为。
    default: null
  - name: format
    type: Boolean / Function / String / Object
    values: '清空、禁用时间项、输入编辑和时间列配置'
    description: 控制清空操作、可选时间、输入编辑、格式和时间列行为。
    default: null
  - name: time-config
    type: Boolean / Function / String / Object
    values: '清空、禁用时间项、输入编辑和时间列配置'
    description: 控制清空操作、可选时间、输入编辑、格式和时间列行为。
    default: null
  - name: v-model
    type: String | Date | number
    values: ''
    description: 绑定时间值
    default: false
    link: null
    usage: '#default'
    code: null
  - name: model-value
    type: String | Date | number
    values: ''
    description: 绑定时间值
    default: false
    link: null
    usage: '#default'
    code: null
  - name: timezone
    type: String
    values: 'IANA 时区'
    description: 设置时间所处时区；timestamp 输出当前时区“今天”对应的绝对毫秒。
    default: ConfigProvider 或系统时区
  - name: value-format
    type: String
    values: 'Day.js token | timestamp'
    description: 设置时间所处时区；timestamp 输出当前时区“今天”对应的绝对毫秒。
    default: null
  - name: auto-apply-now
    type: Boolean
    values: 'true | false'
    description: 点击“此刻”后是否立即提交并关闭；组件配置优先于 ConfigProvider。
    default: ConfigProvider 或 true
EVENTS:
  - name: update:modelValue
    type: TimePickerValue
    description: 选中的时间确认提交时触发。
  - name: change
    type: TimePickerValue
    description: 选中的时间确认提交时触发。
  - name: focus
    type: FocusEvent
    description: 时间输入框获得或失去焦点时触发。
  - name: blur
    type: FocusEvent
    description: 时间输入框获得或失去焦点时触发。
  - name: clear
    description: 清空已选时间后触发。
---

# Time picker 时间选择器

<card>

## 默认

使用 Time Picker 通过时/分/秒滚轮选择任意时间。

<template #example>
<time-picker-default />
</template>

<template #template>

@[code{1-5}](../../.vuepress/components/time-picker/default.vue)

</template>

<template #script>

@[code{7-11}](../../.vuepress/components/time-picker/default.vue)

</template>

<template #style>

@[code{13-17}](../../.vuepress/components/time-picker/default.vue)

</template>

</card>

<card>

## 标签

使用 `label` 显示常驻标签；同时设置 `label-float` 后，标签会在聚焦或已有值时上浮。

<template #example><time-picker-label /></template>

<template #template>

@[code{1-14}](../../.vuepress/components/time-picker/label.vue)

</template>

<template #script>

@[code{16-21}](../../.vuepress/components/time-picker/label.vue)

</template>

<template #style>

@[code{23-28}](../../.vuepress/components/time-picker/label.vue)

</template>

</card>

<card>

## 外形

设置 `shape="square"` 可让输入触发器与传送到外层的时间面板统一使用直角外观。

<template #example><time-picker-shape /></template>

<template #template>

@[code{8-23}](../../.vuepress/components/time-picker/shape.vue)

</template>

<template #script>

@[code{1-6}](../../.vuepress/components/time-picker/shape.vue)

</template>

<template #style>

@[code{25-37}](../../.vuepress/components/time-picker/shape.vue)

</template>

</card>
