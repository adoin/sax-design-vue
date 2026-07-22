---
PROPS:
  - name: image
    type: String
    values: URL
    description: 自定义插画地址。
    default: null
  - name: image-size
    type: Number | String
    values: CSS size
    description: 插画容器尺寸。
    default: 96
  - name: description
    type: String
    values: text
    description: 空状态提示文本。
    default: null
description: "适配 VXE Empty 使用场景的空状态组件。"
---

# Empty 空状态

<card>

## 默认

<template #example><empty-default /></template>

<template #template>

@[code{1-5}](../../.vuepress/components/empty/default.vue)

</template>

</card>
