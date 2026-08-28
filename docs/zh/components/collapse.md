---
PROPS:
  - name: accordion
    type: Boolean
    values: true, false
    description: 同一时间仅展开一个面板。
    default: false
    link: null
    usage: '#accordion'

  - name: type
    type: String
    values: default, border, margin, shadow
    description: 视觉变体。
    default: shadow
    link: null
    usage: '#type'

  - name: open-hover
    type: Boolean
    values: true, false
    description: 悬停时展开面板。
    default: false
    link: null
    usage: '#open-hover'
EVENTS:
  - name: change
    params: null
    description: 展开面板变化时触发。
SLOTS:
  - name: default / header
    type: slot
    values: '-'
    description: 渲染面板内容或可交互标题。
  - name: icon-arrow
    type: scoped slot
    values: open | disabled
    description: 根据当前面板状态渲染自定义展开图标。
EXPOSES: []
description: "可展开/折叠的内容面板，多种视觉样式。"
NEWS:
  - default
  - accordion
  - type
  - open-hover
  - icon-arrow
---

# Collapse（折叠面板）

<card>

## 默认


在 `s-collapse-item` 中包裹区块，并使用 header 插槽。

<template #example>
<collapse-default />
</template>

<template #template>

@[code{1-12}](../../.vuepress/components/collapse/default.vue)

</template>

</card>

<card>

## 手风琴


使用 `accordion` 保持仅一个面板展开。

<template #example>
<collapse-accordion />
</template>

<template #template>

@[code{1-12}](../../.vuepress/components/collapse/accordion.vue)

</template>

</card>

<card>

## 类型


通过 `type` 切换容器样式。

<template #example>
<collapse-type />
</template>

<template #template>

@[code{1-14}](../../.vuepress/components/collapse/type.vue)

</template>

<template #style>

@[code{16-24}](../../.vuepress/components/collapse/type.vue)

</template>

</card>

<card>

## 悬停展开


悬停时展开面板而非点击。

<template #example>
<collapse-open-hover />
</template>

<template #template>

@[code{1-7}](../../.vuepress/components/collapse/open-hover.vue)

</template>

</card>

<card>

## 箭头图标


通过 `icon-arrow` 插槽配合 `SIcon` 为每个面板自定义展开箭头。

<template #example>
<collapse-icon-arrow />
</template>

<template #template>

@[code{1-35}](../../.vuepress/components/collapse/icon-arrow.vue)

</template>

<template #script>

@[code{37-39}](../../.vuepress/components/collapse/icon-arrow.vue)

</template>

</card>
