---
PROPS:
  - name: aside-position
    type: String
    values: "start | end"
    description: Places the aside before or after the main content.
    default: start
  - name: aside-width
    type: String | Number
    values: "CSS size"
    description: Width of the aside slot.
    default: 240
  - name: header-height
    type: String | Number
    values: "CSS size"
    description: Optional fixed height for the header slot.
    default: null
  - name: footer-height
    type: String | Number
    values: "CSS size"
    description: Optional fixed height for the footer slot.
    default: null
  - name: gap
    type: String | Number
    values: "CSS size"
    description: Gap between layout surfaces.
    default: 16
  - name: padding
    type: String | Number
    values: "CSS size"
    description: Padding around the application shell.
    default: 16
  - name: min-height
    type: String | Number
    values: "CSS size"
    description: Minimum height of the application shell.
    default: 100%
  - name: responsive
    type: Boolean
    values: "true | false"
    description: Stacks the aside and main region below 768px.
    default: true
  - name: sticky-header
    type: Boolean
    values: "true | false"
    description: Keeps the header surface visible while scrolling.
    default: false
  - name: sticky-header-offset
    type: String | Number
    values: "CSS size"
    description: Top offset of the SLayout sticky header; falls back to layout padding when omitted.
    default: null
  - name: sticky-header-z-index
    type: Number
    values: "number"
    description: Stacking level of the SLayout sticky header.
    default: 10
  - name: aside-outside-collapsible
    type: Boolean
    values: "true | false"
    description: Adds the built-in collapse control to the aside-outside tool surface.
    default: true
  - name: aside-outside-collapsed
    type: Boolean
    values: "true | false"
    description: Controls the collapsed state of the SLayout attached tools.
    default: false
  - name: sticky
    type: Boolean
    values: "true | false"
    description: Enables sticky positioning on a standalone SLayoutHeader.
    default: false
  - name: sticky-offset
    type: String | Number
    values: "CSS size"
    description: Top offset of a standalone sticky SLayoutHeader.
    default: 0
  - name: z-index
    type: Number
    values: "number"
    description: Stacking level of a standalone sticky SLayoutHeader.
    default: 10
  - name: direction
    type: String
    values: "horizontal | vertical"
    description: SLayoutContainer flex direction.
    default: horizontal
  - name: wrap
    type: Boolean
    values: "true | false"
    description: Allows SLayoutContainer children to wrap.
    default: false
  - name: align
    type: String
    values: "start | center | end | stretch"
    description: Cross-axis alignment for SLayoutContainer.
    default: stretch
  - name: justify
    type: String
    values: "start | center | end | space-around | space-between | space-evenly"
    description: Main-axis distribution for SLayoutContainer.
    default: start
  - name: size
    type: String | Number
    values: "CSS size"
    description: Header/Footer height or Aside width.
    default: null
  - name: outside-position
    type: String
    values: "start | end"
    description: Position of the SLayoutAside outside slot relative to the rail.
    default: end
  - name: outside-collapsible
    type: Boolean
    values: "true | false"
    description: Shows the built-in collapse and expand control for the outside slot.
    default: true
  - name: outside-collapsed
    type: Boolean
    values: "true | false"
    description: Controls the collapsed state of the SLayoutAside outside slot.
    default: false
description: 'A responsive application shell and composable semantic layout surfaces.'
EVENTS:
  - name: update:asideOutsideCollapsed
    type: Boolean
    description: Fire when the outside aside surface is collapsed or expanded.
  - name: aside-outside-collapse
    type: Boolean
    description: Fire when the outside aside surface is collapsed or expanded.
---

# Layout

<card>

`SLayout` handles the standard application frame with named slots. It only renders
the regions you provide, so the same API works for full dashboards, content pages,
and settings views. Every surface uses spacing and elevation instead of dividers.

## Application shell

Use the `header`, `aside`, default, and `footer` slots to assemble a complete page.
Set `aside-position="end"` for a right rail. On small screens the regions stack to
avoid horizontal scrolling.

<template #example><layout-default /></template>

<template #template>

@[code{1-83}](../.vuepress/components/layout/default.vue)

</template>

<template #style>

@[code{85-308}](../.vuepress/components/layout/default.vue)

</template>

</card>

<card>

## Attached aside tools

Use the `aside-outside` slot to attach settings, language, theme, or similar
actions outside the rail. `SLayout` forwards it to the internal `SLayoutAside`
`outside` slot, while the aside owns the connected curve, placement, shadow,
responsive fallback, and the collapse/expand control at the outer edge. The
collapsed rail keeps a directional arrow visible and exposes hover and keyboard
feedback. When composing `SLayoutAside` directly, use `#outside`.

<template #example><layout-aside-outside /></template>

<template #template>

@[code{11-78}](../.vuepress/components/layout/aside-outside.vue)

</template>

<template #script>

@[code{1-9}](../.vuepress/components/layout/aside-outside.vue)

</template>

<template #style>

@[code{80-216}](../.vuepress/components/layout/aside-outside.vue)

</template>

</card>

<card>

## Free composition

For non-standard structures, combine `SLayoutContainer`, `SLayoutHeader`,
`SLayoutAside`, `SLayoutBody`, and `SLayoutFooter` directly. Containers support
`direction`, `gap`, `wrap`, `align`, and `justify`, and can be nested freely.
`SLayoutHeader` can opt into sticky positioning directly; use `sticky-offset` to
clear an existing top navigation bar. Use the `SLayoutAside` `outside` slot for
settings, language, and theme tools; the aside owns the seamless attached surface.

<template #example><layout-composition /></template>

<template #template>

@[code{1-18}](../.vuepress/components/layout/composition.vue)

</template>

<template #style>

@[code{20-50}](../.vuepress/components/layout/composition.vue)

</template>

</card>

<card>

## Slots

| Slot            | Purpose                                                                          |
| --------------- | -------------------------------------------------------------------------------- |
| `header`        | Application header or top navigation.                                            |
| `aside`         | Primary navigation or contextual rail.                                           |
| `aside-outside` | Tools attached outside the rail; forwarded to the `SLayoutAside` `outside` slot. |
| `default`       | The semantic main content region.                                                |
| `footer`        | Page-level footer content.                                                       |

When using `SLayoutAside` directly, provide its `outside` slot. The attached tool
surface is only rendered when that slot exists. Both outside slots expose
`collapsed` and `toggle`; use `aside-outside-collapsible="false"` on `SLayout` or
`outside-collapsible="false"` on `SLayoutAside` to remove the built-in control.
State changes emit `update:asideOutsideCollapsed` / `aside-outside-collapse` on
`SLayout` and `update:outsideCollapsed` / `outside-collapse` on `SLayoutAside`.

</card>
