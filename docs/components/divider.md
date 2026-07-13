---
PROPS:
  - name: position
    type: String
    values: left, left-center, center, right-center, right
    description: Text/icon position along the line.
    default: center
    link: null
    usage: '#position'

  - name: color
    type: String
    values: primary, success, danger, warning, dark, RGB, HEX
    description: Line and text color.
    default: rgba(0,0,0,.1)
    link: null
    usage: '#color'

  - name: background
    type: String
    values: primary, success, danger, warning, dark, RGB, HEX
    description: Background behind divider text.
    default: transparent
    link: null
    usage: '#background'

  - name: icon
    type: String
    values: Material icon name
    description: Show an icon instead of slot text.
    default: null
    link: null
    usage: '#icons'

  - name: icon-pack
    type: String
    values: Icon pack class
    description: Icon font class (e.g. material-icons).
    default: material-icons
    link: null
    usage: '#icons'

  - name: border-style
    type: String
    values: solid, dashed, dotted
    description: CSS border style for the line.
    default: solid
    link: null
    usage: '#style'

  - name: border-height
    type: String
    values: CSS size
    description: Border width of the divider line.
    default: 1px
    link: null
    usage: '#style'
EVENTS: []
EXPOSES: []
description: "Divide text or section components with flexible color, icon, and layout options."
NEWS:
  - default
  - text
  - position
  - color
  - background
  - icons
  - style
---

# Divider

<card>

## Default


Add a horizontal line between blocks of content with `vs-divider`.

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

## Text


Place text inside the divider to label a section break.

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


Control text alignment with the `position` prop: left, left-center, center, right-center, or right.

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

## Color


Change the color of the line and the text using theme colors, RGB, or HEX.

<template #example>
<divider-color />
</template>

<template #template>

@[code{1-12}](../.vuepress/components/divider/color.vue)

</template>

<template #style>

@[code{14-22}](../.vuepress/components/divider/color.vue)

</template>

</card>

<card>

## Background


Highlight divider text with a custom `background` color.

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


Use Material Icons inside the divider via the `icon` prop.

<template #example>
<divider-icons />
</template>

<template #template>

@[code{1-10}](../.vuepress/components/divider/icons.vue)

</template>

<template #style>

@[code{12-20}](../.vuepress/components/divider/icons.vue)

</template>

</card>

<card>

## Style


Switch line appearance with `border-style` (solid, dashed, dotted).

<template #example>
<divider-style />
</template>

<template #template>

@[code{1-7}](../.vuepress/components/divider/style.vue)

</template>

<template #style>

@[code{9-17}](../.vuepress/components/divider/style.vue)

</template>

</card>

<card>

## API

</card>
