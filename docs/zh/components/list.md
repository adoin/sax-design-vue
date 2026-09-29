---
PROPS:
  - name: items
    type: ListDataItem[]
    description: 数据列表；默认读取 title 或 label 和 subtitle。
    default: '[]'
    usage: '#virtual-list'
  - name: item-key
    type: ListItemKey
    description: 返回稳定且唯一的行键；省略时使用索引，排序或增删时建议提供。
    default: null
    usage: '#virtual-list'
  - name: virtual
    type: Boolean
    description: 虚拟渲染 items，仅挂载可见行及预渲染行。
    default: 'false'
    usage: '#virtual-list'
  - name: virtual-config
    type: ListVirtualConfig
    description: 视口 height 默认 320、估算行高 estimateSize 默认 48、overscan 默认 5、dynamic 默认 true。
    default: '{}'
    usage: '#virtual-list'
  - name: title
    type: String
    values: "String"
    description: 列表头部标题（s-list-header）。
    default: null
    link: null
    usage: '#header'

  - name: subtitle
    type: String
    values: "String"
    description: 列表副标题。
    default: null
    link: null
    usage: '#header'

  - name: icon
    type: String
    values: "Material icon"
    description: 列表项或标题图标。
    default: null
    link: null
    usage: '#icon'

  - name: color
    type: String
    values: "primary, success, danger"
    description: 头部颜色。
    default: primary
    link: null
    usage: '#header'
EVENTS: []
EXPOSES:
  - name: scrollToIndex
    type: "(index: number, align?: 'auto' | 'start' | 'center' | 'end') => void"
    description: 虚拟模式下定位指定数据索引。
    usage: '#virtual-list'
  - name: measure
    type: '() => void'
    description: 重新测量虚拟视口及已挂载行。
SLOTS:
  - name: default
    type: Slot
    description: 手写列表内容或数据列表前的标题；此部分不参与虚拟化。
  - name: item
    type: Slot
    scope: '{ item: ListDataItem; index: number }'
    description: 自定义数据行，普通和虚拟模式共用。
    usage: '#virtual-list'

description: "结构化列表，支持标题、图标、头像与自定义插槽。"
NEWS:
  - default
  - header
  - icon
  - content
  - avatar
---

# List 列表

<card>

## 默认


使用 `s-list-item` 显示标题与副标题行。

<template #example>
<list-zh-default />
</template>

<template #template>

@[code{1-8}](../../.vuepress/components/list-zh/default.vue)

</template>

</card>

<card>

## 标题行


在 `s-list-header` 下分组列表项。

<template #example>
<list-header />
</template>

<template #template>

@[code{1-19}](../../.vuepress/components/list/header.vue)

</template>

</card>

<card>

## 图标


为列表行添加前置图标。

<template #example>
<list-icon />
</template>

<template #template>

@[code{1-30}](../../.vuepress/components/list/icon.vue)

</template>

</card>

<card>

## 内容


在 item 插槽中放置操作或自定义内容。

<template #example>
<list-content />
</template>

<template #template>

@[code{1-27}](../../.vuepress/components/list/content.vue)

</template>

</card>

<card>

## 头像


使用 `avatar` 插槽放置头像或首字母。

<template #example>
<list-avatar />
</template>

<template #template>

@[code{1-30}](../../.vuepress/components/list/avatar.vue)

</template>

</card>

<card>

## 虚拟列表

将数据传给 `items` 并开启 `virtual`，通过 `#item` 自定义内容。此例包含 10,000 条不同高度的记录，复用共享虚拟列表的高度差索引。`virtual-config.dynamic` 默认开启；固定行高时可关闭，并将 `estimateSize` 设为实际行高。默认插槽中的标题保留在滚动区外，手写子组件不会自动虚拟化。

<template #example>
<list-zh-virtual />
</template>

<template #template>

@[code{1-30}](../../.vuepress/components/list-zh/virtual.vue)

</template>

<template #script>

@[code{32-48}](../../.vuepress/components/list-zh/virtual.vue)

</template>

<template #style>

@[code{50-63}](../../.vuepress/components/list-zh/virtual.vue)

</template>

</card>
