---
PROPS:
  - name: items
    type: ListDataItem[]
    description: Data items; default content reads title or label and subtitle.
    default: '[]'
    usage: '#virtual-list'
  - name: item-key
    type: ListItemKey
    description: Return a stable unique row key. Defaults to the index; provide it when sorting or changing items.
    default: null
    usage: '#virtual-list'
  - name: virtual
    type: Boolean
    description: Window the items array, mounting only visible and overscan rows.
    default: 'false'
    usage: '#virtual-list'
  - name: virtual-config
    type: ListVirtualConfig
    description: Viewport height defaults to 320, estimateSize to 48, overscan to 5 and dynamic to true.
    default: '{}'
    usage: '#virtual-list'
  - name: title
    type: String
    values: "String"
    description: List header title (s-list-header).
    default: null
    link: null
    usage: '#header'

  - name: subtitle
    type: String
    values: "String"
    description: List header subtitle.
    default: null
    link: null
    usage: '#header'

  - name: icon
    type: String
    values: "Material icon"
    description: List item or header icon.
    default: null
    link: null
    usage: '#icon'

  - name: color
    type: String
    values: "primary, success, danger"
    description: Header color.
    default: primary
    link: null
    usage: '#header'
EVENTS: []
EXPOSES:
  - name: scrollToIndex
    type: "(index: number, align?: 'auto' | 'start' | 'center' | 'end') => void"
    description: Scroll to a data index in virtual mode.
    usage: '#virtual-list'
  - name: measure
    type: '() => void'
    description: Remeasure the virtual viewport and mounted rows.
SLOTS:
  - name: default
    type: Slot
    description: Manual list content or a header before data rows; this content is not virtualized.
  - name: item
    type: Slot
    scope: '{ item: ListDataItem; index: number }'
    description: Custom data-row content shared by normal and virtual modes.
    usage: '#virtual-list'

description: "Structured lists with headers, icons, avatars, and custom slots."
NEWS:
  - default
  - header
  - icon
  - content
  - avatar
---

# List

<card>

## Basic


Display title and subtitle rows with `s-list-item`.

<template #example>
<list-default />
</template>

<template #template>

@[code{1-14}](../.vuepress/components/list/default.vue)

</template>

</card>

<card>

## Header


Group items under `s-list-header`.

<template #example>
<list-header />
</template>

<template #template>

@[code{1-19}](../.vuepress/components/list/header.vue)

</template>

</card>

<card>

## Icon


Add leading icons to list rows.

<template #example>
<list-icon />
</template>

<template #template>

@[code{1-30}](../.vuepress/components/list/icon.vue)

</template>

</card>

<card>

## Content


Place actions or custom content in the item slot.

<template #example>
<list-content />
</template>

<template #template>

@[code{1-27}](../.vuepress/components/list/content.vue)

</template>

</card>

<card>

## Avatar


Use the `avatar` slot for profile images or initials.

<template #example>
<list-avatar />
</template>

<template #template>

@[code{1-30}](../.vuepress/components/list/avatar.vue)

</template>

</card>

<card>

## Virtual list

Pass data through `items` and enable `virtual`, using `#item` for custom content. This example contains 10,000 variable-height records and uses the shared height-delta index. Dynamic measurement is enabled by default; for fixed rows, disable `virtual-config.dynamic` and set `estimateSize` to the actual height. Default-slot headers stay outside the viewport; handwritten children are not automatically virtualized.

<template #example>
<list-virtual />
</template>

<template #template>

@[code{1-30}](../.vuepress/components/list/virtual.vue)

</template>

<template #script>

@[code{32-46}](../.vuepress/components/list/virtual.vue)

</template>

<template #style>

@[code{48-61}](../.vuepress/components/list/virtual.vue)

</template>

</card>
