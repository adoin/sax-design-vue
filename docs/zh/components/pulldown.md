---
PROPS:
  - name: offset / teleported
    type: Number / Boolean
    values: 像素 / true | false
    description: 配置触发元素间距和 body 挂载。
    default: '12 / true'
  - name: v-model
    type: Boolean
    values: true / false
    description: 控制下拉面板显示状态。
    default: 'false'
  - name: trigger
    type: String
    values: click / hover / focus / contextmenu
    description: 打开触发方式。
    default: click
  - name: placement
    type: String
    values: Popper placement
    description: 下拉面板位置。
    default: bottom-start
EVENTS:
  - name: show / hide
    description: 显示状态事件。
description: "通用下拉容器。"
---

# 下拉容器

<card><template #example><pulldown-default /></template>

<template #template>

@[code{1-10}](../../.vuepress/components/pulldown/default.vue)

</template>

<template #script>

@[code{11-13}](../../.vuepress/components/pulldown/default.vue)

</template>

<template #style>

@[code{14-29}](../../.vuepress/components/pulldown/default.vue)

</template>

</card>
