---
description: '将超过指定高度的插槽内容自动收起。'
PROPS:
  - name: collapsed-height
    type: number | string
    values: '像素数值或 10rem 等 CSS 长度'
    description: 收起时的最大可见高度；百分比高度需要父容器具有确定高度。
    default: 160
    usage: '#default'
  - name: v-model:expanded
    type: Boolean
    values: 'true | false'
    description: 控制展开状态；不使用 v-model 时组件也可自行切换。
    default: false
    usage: '#default'
  - name: fade
    type: Boolean
    values: 'true | false'
    description: 收起时渐隐内容下缘。
    default: true
    usage: '#default'
  - name: expand-text
    type: String
    values: '操作文案'
    description: 自定义收起状态的展开文案。
    default: '展开内容'
    usage: '#default'
  - name: collapse-text
    type: String
    values: '操作文案'
    description: 自定义展开状态的收起文案。
    default: '收起内容'
    usage: '#default'
EVENTS:
  - name: update:expanded
    type: Boolean
    values: 'true | false'
    description: 展开状态变化时触发。
    default: null
    usage: '#default'
  - name: change
    type: Boolean
    values: 'true | false'
    description: 用户切换展开状态后触发。
    default: null
    usage: '#default'
SLOTS:
  - name: default
    type: VNode[]
    values: '任意 Vue 内容'
    description: 需要测量、收起及展开的内容；切换时不会卸载。
    default: null
    usage: '#default'
---

# Content Ellipsis 内容省略

<card>

## 默认

Content Ellipsis 适用于标题、标签、列表或控件等结构化内容。若只需省略纯文本并在末行接续操作，请使用 [Text Ellipsis（文本省略）](./text-ellipsis.md)。

`collapsed-height` 限制初始可见高度。仅当插槽内容超过限制时才显示操作；内容或宽度变化后会自动重新测量。键盘焦点进入被隐藏的控件时，组件会展开完整内容。

<template #example><content-ellipsis-zh-default /></template>

<template #template>

@[code{7-22}](../../.vuepress/components/content-ellipsis-zh/default.vue)

</template>

<template #script>

@[code{1-5}](../../.vuepress/components/content-ellipsis-zh/default.vue)

</template>

<template #style>

@[code{24-45}](../../.vuepress/components/content-ellipsis-zh/default.vue)

</template>

</card>
