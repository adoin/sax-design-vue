---
PROPS:
  - name: show-close
    type: Boolean
    values: "true | false"
    description: 控制关闭按钮显示和是否挂载到 body。
    default: 'true'
  - name: teleported
    type: Boolean
    values: "true | false"
    description: 控制关闭按钮显示和是否挂载到 body。
    default: 'true'
  - name: model-value
    type: Boolean
    values: "true | false"
    description: 抽屉可见状态。
    default: false
  - name: v-model
    type: Boolean
    values: "true | false"
    description: 抽屉可见状态。
    default: false
  - name: placement
    type: String
    values: "left | right | top | bottom"
    description: 抽屉出现方向。
    default: right
  - name: size
    type: String | Number
    values: "CSS size"
    description: 抽屉宽度或高度。
    default: 360px
  - name: mask-closable
    type: Boolean
    values: "true | false"
    description: 是否允许点击遮罩关闭。
    default: true
description: '方向抽屉。'
EVENTS:
  - name: update:modelValue
    type: Boolean
    description: 抽屉显示状态变化时触发。
  - name: open
    description: 抽屉打开或关闭后触发。
  - name: close
    description: 抽屉打开或关闭后触发。
---

# Drawer 抽屉

<card><template #example><drawer-default /></template>

<template #template>

@[code{1-9}](../../.vuepress/components/drawer/default.vue)

</template>

<template #script>

@[code{10-13}](../../.vuepress/components/drawer/default.vue)

</template>

</card>
