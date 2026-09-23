---
PROPS:
  - name: direction
    type: String
    values: 'horizontal, vertical'
    description: Divider direction; vertical is intended for inline content.
    default: horizontal
    link: null
    usage: '#vertical'

  - name: position
    type: String
    values: 'left, left-center, center, right-center, right'
    description: Label position along a horizontal divider.
    default: center
    link: null
    usage: '#position'

  - name: variant
    type: String
    values: 'plain, soft, solid'
    description: Label treatment; plain has no background, soft uses a tint, and solid uses the accent color.
    default: plain
    link: null
    usage: '#variant'

  - name: color
    type: String
    values: 'default, primary, success, warning, danger, dark, RGB, HEX'
    description: Accent for the line and label; the line is softened to keep the label readable.
    default: default
    link: null
    usage: '#color'

  - name: background
    type: String
    values: 'Theme color, RGB, HEX, or CSS color'
    description: Optional exact label surface color; opaque HEX/RGB/HSL colors choose black or white text automatically. Use label-color for other CSS colors.
    default: transparent
    link: null
    usage: '#background'

  - name: label-color
    type: String
    values: 'Theme color, RGB, HEX, or CSS color'
    description: Explicit label foreground color; overrides the automatic color used by variant and background.
    default: null
    link: null
    usage: '#background'

  - name: gap
    type: String
    values: 'CSS size'
    description: Space between horizontal line segments and their label.
    default: 12px
    link: null
    usage: '#configurator'

  - name: icon
    type: String
    values: 'Icon name'
    description: Show an icon instead of slot text; give icon-only dividers an accessible name.
    default: null
    link: null
    usage: '#icons'

  - name: border-style
    type: String
    values: 'solid, dashed, dotted'
    description: CSS border style for the line.
    default: solid
    link: null
    usage: '#style'

  - name: border-height
    type: String
    values: 'CSS size'
    description: Line thickness in both horizontal and vertical modes.
    default: 1px
    link: null
    usage: '#style'
EVENTS: []
EXPOSES: []
description: 'Separate content with a quiet line, an integrated label, or an optional accent treatment.'
NEWS:
  - default
  - vertical
  - text
  - position
  - variant
  - color
  - background
  - icons
  - style
  - configurator
---

# Divider

<card>

## Default

Add a horizontal line between blocks of content with `s-divider`.

<template #example>
<divider-default />
</template>

<template #template>

@[code{1-7}](../.vuepress/components/divider/default.vue)

</template>

<template #style>

@[code{9-17}](../.vuepress/components/divider/default.vue)

</template>

</card>

<card>

## Vertical

Set `direction="vertical"` to separate inline text, links, or actions. Its height follows the current font size; text and icon content are not rendered in vertical mode.

<template #example>
<divider-vertical />
</template>

<template #template>

@[code{1-23}](../.vuepress/components/divider/vertical.vue)

</template>

<template #style>

@[code{25-40}](../.vuepress/components/divider/vertical.vue)

</template>

</card>

<card>

## Text

Place a short label inside the divider. The default plain treatment leaves the label transparent and gives the line a deliberate gap on each side.

<template #example>
<divider-text />
</template>

<template #template>

@[code{1-5}](../.vuepress/components/divider/text.vue)

</template>

<template #style>

@[code{7-15}](../.vuepress/components/divider/text.vue)

</template>

</card>

<card>

## Text Position

Use `position` to move a short label to the start, quarter, center, three-quarter, or end position. The line remains separate from the label at every position.

<template #example>
<divider-position />
</template>

<template #template>

@[code{1-9}](../.vuepress/components/divider/position.vue)

</template>

<template #style>

@[code{11-19}](../.vuepress/components/divider/position.vue)

</template>

</card>

<card>

## Variant

Choose `plain` for a quiet section label, `soft` for a low-contrast tinted capsule, or `solid` for a compact accent marker. The line layout and label position remain the same.

<template #example>
<divider-variant />
</template>

<template #template>

@[code{1-7}](../.vuepress/components/divider/variant.vue)

</template>

<template #style>

@[code{9-16}](../.vuepress/components/divider/variant.vue)

</template>

</card>

<card>

## Color

Use a theme color or CSS color as the accent. The line stays muted while the label keeps readable contrast; omit `color` for the neutral default.

<template #example>
<divider-color />
</template>

<template #template>

@[code{1-10}](../.vuepress/components/divider/color.vue)

</template>

<template #style>

@[code{12-20}](../.vuepress/components/divider/color.vue)

</template>

</card>

<card>

## Background

Set `background` only when the label needs a custom surface. It retains a rounded, compact shape. Opaque HEX/RGB/HSL colors choose black or white text by contrast; use `label-color` to override that choice or to pair with other CSS colors. Named dark surfaces receive light text automatically.

<template #example>
<divider-background />
</template>

<template #template>

@[code{1-12}](../.vuepress/components/divider/background.vue)

</template>

<template #style>

@[code{14-22}](../.vuepress/components/divider/background.vue)

</template>

</card>

<card>

## Icons

Use an icon name for a compact visual marker. Icon-only dividers should include an `aria-label` describing the section break.

<template #example>
<divider-icons />
</template>

<template #template>

@[code{1-16}](../.vuepress/components/divider/icons.vue)

</template>

<template #style>

@[code{18-26}](../.vuepress/components/divider/icons.vue)

</template>

</card>

<card>

## Style

Use `border-style` and `border-height` to set line pattern and thickness independently of the label treatment.

<template #example>
<divider-style />
</template>

<template #template>

@[code{1-11}](../.vuepress/components/divider/style.vue)

</template>

<template #style>

@[code{13-21}](../.vuepress/components/divider/style.vue)

</template>

</card>

<card>

## Configurator

Combine direction, content, position, spacing, label treatment, accent, custom surface, line style, and thickness. Vertical dividers use only the line settings; horizontal dividers can carry text or an icon.

<template #example>
<divider-configurator />
</template>

<template #template>

@[code{76-196}](../.vuepress/components/divider/configurator.vue)

</template>

<template #script>

@[code{1-74}](../.vuepress/components/divider/configurator.vue)

</template>

<template #style>

@[code{198-271}](../.vuepress/components/divider/configurator.vue)

</template>

</card>
