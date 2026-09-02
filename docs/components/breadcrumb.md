---
PROPS:
  - name: items
    type: Array
    values: "BreadcrumbItem[] (supports children)"
    description: Items rendered when not using slots. Use children for tree navigation data.
    default: []
    link: null
    usage: '#default'

  - name: separator
    type: String
    values: "String"
    description: Separator between items.
    default: /
    link: null
    usage: '#separator'

  - name: color
    type: String
    values: "primary, success, danger, warning, dark"
    description: Breadcrumb color.
    default: primary
    link: null
    usage: '#color'

  - name: align
    type: String
    values: "left, center, right"
    description: Horizontal alignment.
    default: left
    link: null
    usage: '#align'
  - name: trigger
    type: String | Array
    values: "hover, click"
    description: Tree menu trigger. Uses the same trigger modes as Popper.
    default: hover
EVENTS: []
EXPOSES: []
description: "Show the current page location within a navigational hierarchy."
NEWS:
  - default
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

## Click trigger

Set `trigger="click"` to open menus by clicking a path item. You can pass an array to combine Popper trigger modes.

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
