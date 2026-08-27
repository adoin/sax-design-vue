---
PROPS:
  - name: model-value/v-model
    type: String
    values: href
    description: 当前激活锚点 href。
    default: "''"
  - name: items
    type: Array
    values: '{ href, title, disabled?, children? }[]'
    description: 锚点导航项；垂直模式可通过 children 配置一层分级链接。
    default: '[]'
  - name: offset / target-offset / bounds
    type: Number
    values: pixels
    description: 分别控制激活判定偏移、点击滚动偏移和判定容差。
    default: '88 / offset / 5'
  - name: affix
    type: Boolean
    values: true / false
    description: 让锚点导航吸附在视口中。
    default: false
  - name: get-container
    type: Function
    values: () => HTMLElement | Window
    description: 返回滚动容器；默认监听页面 window。
    default: window
  - name: get-current-anchor
    type: Function
    values: (activeHref) => href
    description: 自定义高亮的 href。
    default: undefined
  - name: replace
    type: Boolean
    values: true / false
    description: 使用替换而非追加方式更新浏览器历史 hash。
    default: false
  - name: direction
    type: String
    values: vertical / horizontal
    description: 锚点布局方向；分级链接仅在垂直模式展示。
    default: vertical
  - name: scroll-behavior
    type: String
    values: auto / smooth
    description: 选择锚点后的滚动行为。
    default: smooth
EVENTS:
  - name: change
    description: 激活锚点变化时触发。
  - name: click
    description: 选择锚点项时触发。
description: '用于在当前页面的关联内容区块之间快速导航。'
---

# Anchor 锚点

<card>

<docs-warn />

<anchor-default />

<h2 id="anchor-default">默认用法</h2>

<template #example>

<anchor-basic />

</template>

<template #template>

@[code html](../../.vuepress/components/anchor/basic.vue)

</template>

</card>

<card>

<h2 id="anchor-hierarchy">分级锚点</h2>

通过 `children` 组织关联链接。父级仍是正常的跳转目标；子级用于指向更具体的内容区块。

<template #example>

<anchor-hierarchy />

</template>

<template #template>

@[code html](../../.vuepress/components/anchor/hierarchy.vue)

</template>

</card>

<card>

<h3 id="anchor-secondary">二级链接</h3>

每个项目使用稳定的 `href` 指向真实页面 ID。`offset` 控制项目何时高亮，`target-offset` 控制点击后的最终滚动位置。

<h2 id="anchor-horizontal">横向模式</h2>

<template #example>

<anchor-horizontal />

</template>

<template #template>

@[code html](../../.vuepress/components/anchor/horizontal.vue)

</template>

</card>

<card>

<h2 id="anchor-container">滚动容器</h2>

默认情况下 Anchor 监听页面 window。用于面板或虚拟页面时，可通过 `get-container` 返回实际滚动元素；导航和高亮计算会使用同一个容器。

<template #example>

<anchor-container />

</template>

<template #template>

@[code html](../../.vuepress/components/anchor/container.vue)

</template>

</card>

<card>

<h2 id="api">API</h2>

</card>
