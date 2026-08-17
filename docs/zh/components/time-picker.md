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
    type: String | Date
    values:
    description: 绑定时间值
    default: false
    link: null
    usage: '#default'
    code: null
---

# Time picker 时间选择器

<card>

## 默认

使用 Time Picker 通过时/分/秒滚轮选择任意时间。

::: tip
在 SSR（如 [Nuxt](https://nuxt.com/)）或 SSG（如 [VitePress](https://vitepress.dev/)）中使用时，需要用
<code>\<client-only\> \<\/client-only\></code>
包裹。
:::

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

<card>

## API

</card>
