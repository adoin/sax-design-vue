---
PROPS:
  - name: type / status
    type: String
    values: primary | success | warning | danger | info
    description: 语义色。`status` 是 VXE 兼容别名，优先级更高。
    default: primary
  - name: content
    type: String
    values: text
    description: 未传默认插槽时展示的文本。
    default: null
  - name: closable
    type: Boolean
    values: true | false
    description: 显示关闭按钮。
    default: false
  - name: round
    type: Boolean
    values: true | false
    description: 胶囊圆角样式。
    default: false
EVENTS:
  - name: close
    description: 点击关闭按钮时触发。
  - name: click
    description: 点击标签主体时触发。
description: "适配 VXE Tag 约定的紧凑语义标签。"
---

# Tag 标签

<card>

## 默认

<template #example><tag-default /></template>

<template #template>

@[code{1-11}](../../.vuepress/components/tag/default.vue)

</template>

</card>
