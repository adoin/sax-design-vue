---
PROPS:
  - name: v-model
    type: Boolean
    values: true, false
    description: Visibility when closable.
    default: true
    link: null
    usage: '#closable'

  - name: text
    type: String
    values: String
    description: Chip label text.
    default: null
    link: null
    usage: '#default'

  - name: closable
    type: Boolean, String
    values: true, false
    description: Show close button.
    default: false
    link: null
    usage: '#closable'

  - name: color
    type: String
    values: primary, success, danger, warning, dark, RGB, HEX
    description: Chip color.
    default: null
    link: null
    usage: '#color'

  - name: transparent
    type: Boolean
    values: true, false
    description: Transparent background style.
    default: false
    link: null
    usage: '#transparent'

  - name: tag-style
    type: String
    values: default, outline, dashed, mark, arrow, flag
    description: Tag presentation. Mark and arrow include distinct geometry.
    default: default
    link: null
    usage: '#tag-styles'

  - name: round
    type: Boolean
    values: true, false
    description: Pill geometry. Mark and arrow use round-safe variants.
    default: false
    link: null
    usage: '#tag-styles'

  - name: size
    type: String
    values: small, default, large
    description: Chip size.
    default: default
    link: null
    usage: '#tag-styles'

  - name: icon
    type: String
    values: Material icon name
    description: Leading icon inside chip.
    default: null
    link: null
    usage: '#icon'

  - name: close-icon
    type: String
    values: Material icon name
    description: Close button icon.
    default: clear
    link: null
    usage: '#closable'
EVENTS:
  - name: update:modelValue
    params: boolean
    description: Emitted when visibility changes (closable).

  - name: click
    params: null
    description: Emitted on chip click.

  - name: close
    params: null
    description: Emitted when chip is closed.

  - name: s-remove
    params: boolean
    description: Emitted when chip removed in chips group.
EXPOSES: []
description: 'Chips are compact elements that represent an input, attribute, or action.'
NEWS:
  - default
  - color
  - transparent
  - tag-styles
  - icon
  - closable
  - chips
---

# Chip

<card>

## Default

Render simple chips with optional close behavior.

<template #example>
<chip-default />
</template>

<template #template>

@[code{1-6}](../.vuepress/components/chip/default.vue)

</template>

</card>

<card>

## Tag styles

Choose a presentation with `tag-style`.

<template #example>
<chip-styles />
</template>

<template #template>

@[code{1-25}](../.vuepress/components/chip/styles.vue)

</template>

</card>

<card>

## Round

Use `round` for pill chips. Arrow remains left-round and right-pointed.

<template #example>
<chip-round />
</template>

<template #template>

@[code{1-8}](../.vuepress/components/chip/round.vue)

</template>

</card>

<card>

## Size

Use `size` to fit compact controls or stronger status labels.

<template #example>
<chip-sizes />
</template>

<template #template>

@[code{1-7}](../.vuepress/components/chip/sizes.vue)

</template>

</card>

<card>

## Combinations

Combine color, tag style, round, size, and icons after reviewing each property above.

<template #example>
<chip-combinations />
</template>

<template #template>

@[code{1-13}](../.vuepress/components/chip/combinations.vue)

</template>

</card>

<card>

## Color

Color chips using the Sax Design palette or custom values.

<template #example>
<chip-color />
</template>

<template #template>

@[code{1-8}](../.vuepress/components/chip/color.vue)

</template>

</card>

<card>

## Transparent

Use `transparent` for a lighter, outlined appearance.

<template #example>
<chip-transparent />
</template>

<template #template>

@[code{1-6}](../.vuepress/components/chip/transparent.vue)

</template>

</card>

<card>

## Icon

Add a leading icon with the `icon` prop.

<template #example>
<chip-icon />
</template>

<template #template>

@[code{1-6}](../.vuepress/components/chip/icon.vue)

</template>

</card>

<card>

## Closable

Remove chips interactively when `closable` is enabled.

<template #example>
<chip-closable />
</template>

<template #template>

@[code{1-5}](../.vuepress/components/chip/closable.vue)

</template>

<template #script>

@[code{7-13}](../.vuepress/components/chip/closable.vue)

</template>

</card>

<card>

## Add and Remove Items

Combine `s-chips` with multiple `s-chip` children to add and remove tags.

<template #example>
<chip-chips />
</template>

<template #template>

@[code{1-8}](../.vuepress/components/chip/chips.vue)

</template>

<template #script>

@[code{10-13}](../.vuepress/components/chip/chips.vue)

</template>

<template #style>

@[code{15-23}](../.vuepress/components/chip/chips.vue)

</template>

</card>

<card>

## API

</card>
