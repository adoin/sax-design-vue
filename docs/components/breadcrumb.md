---
PROPS:
  - name: items
    type: Array
    values: 'BreadcrumbItem[] (supports children)'
    description: Items rendered when not using slots. Use children for tree navigation data; data-driven items can collapse when space is limited.
    default: []
    link: null
    usage: '#default'

  - name: separator
    type: String
    values: 'String'
    description: Separator between items.
    default: /
    link: null
    usage: '#separator'

  - name: color
    type: String
    values: 'primary, success, danger, warning, dark'
    description: Breadcrumb color.
    default: primary
    link: null
    usage: '#color'

  - name: align
    type: String
    values: 'left, center, right'
    description: Horizontal alignment.
    default: left
    link: null
    usage: '#align'
  - name: trigger
    type: String | Array
    values: 'hover, click'
    description: Tree menu trigger. Uses the same trigger modes as Popper.
    default: hover
  - name: collapse
    type: Boolean
    values: 'true, false'
    description: Automatically collapse a contiguous middle run when data-driven items exceed the available width. Slot-based trails remain manually composed.
    default: true
    usage: '#responsive-overflow'
EVENTS: []
EXPOSES: []
description: 'Show the current page location within a navigational hierarchy.'
NEWS:
  - default
  - responsive-overflow
  - tree-overflow
  - color
  - separator
  - slot
  - align
---

# Breadcrumb

<card>

## Default

Pass an `items` array or compose with `s-breadcrumb-item` slots.

<template #example>
<breadcrumb-default />
</template>

<template #template>

@[code{1-3}](../.vuepress/components/breadcrumb/default.vue)

</template>

<template #script>

@[code{5-12}](../.vuepress/components/breadcrumb/default.vue)

</template>

</card>

<card>

## Responsive overflow

When the container becomes too narrow, data-driven breadcrumbs keep the first and last levels and replace a middle run with a horizontal ellipsis. Hover or focus the ellipsis to read the full path in order; click it to inspect the interactive, wrapping trail. Set `:collapse="false"` to keep manual overflow behavior. Slot-based trails are composed by the caller and do not collapse automatically.

<template #example>
<breadcrumb-overflow />
</template>

<template #template>

@[code{21-28}](../.vuepress/components/breadcrumb/overflow.vue)

</template>

<template #script>

@[code{1-19}](../.vuepress/components/breadcrumb/overflow.vue)

</template>

<template #style>

@[code{30-44}](../.vuepress/components/breadcrumb/overflow.vue)

</template>

</card>

<card>

## Tree shortcuts

`items` supports `children`. Hover a path item with children to open a multi-level menu, then choose any item for a quick jump.

<template #example>
<breadcrumb-tree />
</template>

<template #template>

@[code{1-3}](../.vuepress/components/breadcrumb/tree.vue)

</template>

<template #script>

@[code{5-33}](../.vuepress/components/breadcrumb/tree.vue)

</template>

</card>

<card>

## Tree overflow

Click the ellipsis to open the complete breadcrumb in a wrapping panel. Every path level retains its link, and a level with `children` keeps its tree shortcut menu. The separate disclosure control opens children while the title link navigates.

<template #example>
<breadcrumb-tree-overflow />
</template>

<template #template>

@[code{34-41}](../.vuepress/components/breadcrumb/tree-overflow.vue)

</template>

<template #script>

@[code{1-32}](../.vuepress/components/breadcrumb/tree-overflow.vue)

</template>

<template #style>

@[code{43-57}](../.vuepress/components/breadcrumb/tree-overflow.vue)

</template>

</card>

<card>

## Click trigger

Set `trigger="click"` to open menus with a path item's disclosure button. The title remains a navigation link. You can pass an array to combine Popper trigger modes.

<template #example>
<breadcrumb-tree-click />
</template>

<template #template>

@[code{1-3}](../.vuepress/components/breadcrumb/tree-click.vue)

</template>

<template #script>

@[code{5-32}](../.vuepress/components/breadcrumb/tree-click.vue)

</template>

</card>

<card>

## Color

Theme breadcrumb links with the `color` prop.

<template #example>
<breadcrumb-color />
</template>

<template #template>

@[code{1-6}](../.vuepress/components/breadcrumb/color.vue)

</template>

<template #script>

@[code{8-18}](../.vuepress/components/breadcrumb/color.vue)

</template>

<template #style>

@[code{20-28}](../.vuepress/components/breadcrumb/color.vue)

</template>

</card>

<card>

## Separator

Customize the divider between items.

<template #example>
<breadcrumb-separator />
</template>

<template #template>

@[code{1-8}](../.vuepress/components/breadcrumb/separator.vue)

</template>

<template #script>

@[code{10-16}](../.vuepress/components/breadcrumb/separator.vue)

</template>

<template #style>

@[code{18-25}](../.vuepress/components/breadcrumb/separator.vue)

</template>

</card>

<card>

## Slot

Build breadcrumbs manually with slot-based items.

<template #example>
<breadcrumb-slot />
</template>

<template #template>

@[code{1-13}](../.vuepress/components/breadcrumb/slot.vue)

</template>

</card>

<card>

## Alignment

Align the trail to the left, center, or right.

<template #example>
<breadcrumb-align />
</template>

<template #template>

@[code{1-7}](../.vuepress/components/breadcrumb/align.vue)

</template>

<template #script>

@[code{9-16}](../.vuepress/components/breadcrumb/align.vue)

</template>

<template #style>

@[code{18-25}](../.vuepress/components/breadcrumb/align.vue)

</template>

</card>
