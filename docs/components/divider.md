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

<template #example>
<divider-default />
</template>

<template #template>

@[code vue](../.vuepress/components/divider/default.vue)

</template>

</card>

<card>

## Text

<template #example>
<divider-text />
</template>

<template #template>

@[code vue](../.vuepress/components/divider/text.vue)

</template>

</card>

<card>

## Text Position

<template #example>
<divider-position />
</template>

<template #template>

@[code vue](../.vuepress/components/divider/position.vue)

</template>

</card>

<card>

## Color

<template #example>
<divider-color />
</template>

<template #template>

@[code vue](../.vuepress/components/divider/color.vue)

</template>

</card>

<card>

## Background

<template #example>
<divider-background />
</template>

<template #template>

@[code vue](../.vuepress/components/divider/background.vue)

</template>

</card>

<card>

## Icons

<template #example>
<divider-icons />
</template>

<template #template>

@[code vue](../.vuepress/components/divider/icons.vue)

</template>

</card>

<card>

## Style

<template #example>
<divider-style />
</template>

<template #template>

@[code vue](../.vuepress/components/divider/style.vue)

</template>

</card>

<card>

## API

</card>
