---
PROPS:
  - name: items
    type: Array
    values: unknown[]
    description: 虚拟列表的数据源。
    default: '[]'
    link: null
    usage: '#dynamic-height'
  - name: height
    type: Number | String
    values: CSS height
    description: 滚动视口高度。
    default: '320'
    link: null
    usage: '#dynamic-height'
  - name: estimate-size
    type: Number
    values: pixels
    description: 行元素真实测量前的高度估算。动态行高建议给偏大的合理值。
    default: '48'
    link: null
    usage: '#dynamic-height'
  - name: dynamic
    type: Boolean
    values: true | false
    description: 测量渲染行，支持内容变化后的动态行高。
    default: 'true'
    link: null
    usage: '#dynamic-height'
  - name: item-key
    type: Function
    values: '(item, index) => string | number'
    description: 稳定唯一行 key。数据重排或追加时必须设置。
    default: index
    link: null
    usage: '#dynamic-height'
EVENTS:
  - name: range-change
    description: 已渲染虚拟行区间变化时触发。
  - name: scroll
    description: 滚动视口的原生 scroll 事件。
EXPOSES:
  - name: scrollToIndex / scrollToOffset / measure
    description: 编程滚动，或重置动态行高测量缓存。
description: "基于 TanStack Virtual 的窗口化列表，支持真实测量动态行高。"
NEWS:
  - dynamic-height
---

# 虚拟列表

<card>

## 动态行高

`s-virtual-list` 只挂载视口附近的行。每个已渲染行会被真实测量，因此文本换行、展开收起、追加内容都会更新偏移量并保持滚动锚点。

<template #example>
<virtual-list-default />
</template>

<template #template>

@[code{1-19}](../.vuepress/components/virtual-list/default.vue)

</template>

</card>
