---
description: '通过可编辑输入框和时间列选择时间值。'
PROPS:
  - name: color / size / label-float / label
    type: String / Boolean
    values: 主题色 / small | default | large / 标签文字
    description: 设置时间输入触发器的主题色、尺寸和浮动标签。
    default: '-'
  - name: clearable / disabled-hours / disabled-minutes / disabled-seconds / editable / format / time-config
    type: Boolean / Function / String / Object
    values: 清空、禁用时间项、输入编辑和时间列配置
    description: 控制清空操作、可选时间、输入编辑、格式和时间列行为。
    default: '-'
  - name: v-model / model-value
    type: String | Date | number
    values:
    description: 绑定时间值
    default: false
    link: null
    usage: '#default'
    code: null
  - name: timezone / value-format
    type: String
    values: IANA 时区 / Day.js token | timestamp
    description: 设置时间所处时区；timestamp 输出当前时区“今天”对应的绝对毫秒。
    default: ConfigProvider 或系统时区 / '-'
  - name: auto-apply-now
    type: Boolean
    values: true | false
    description: 点击“此刻”后是否立即提交并关闭；组件配置优先于 ConfigProvider。
    default: ConfigProvider 或 true
EVENTS:
  - name: update:modelValue / change
    type: TimePickerValue
    description: 选中的时间确认提交时触发。
  - name: focus / blur
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

@[code{1-11}](../../.vuepress/components/time-picker/default.vue)

</template>

<template #script>

@[code{13-17}](../../.vuepress/components/time-picker/default.vue)

</template>

</card>
