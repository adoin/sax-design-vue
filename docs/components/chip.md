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

  - name: icon
    type: String
    values: Material icon name
    description: Leading icon inside chip.
    default: null
    link: null
    usage: '#icon'

  - name: icon-pack
    type: String
    values: Icon pack class
    description: Icon font class.
    default: material-icons
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

  - name: vs-remove
    params: boolean
    description: Emitted when chip removed in chips group.
EXPOSES: []
NEWS:
  - default
  - color
  - transparent
  - icon
  - closable
  - chips
---

# Chip

<card>

## Default

<template #example>
<chip-default />
</template>

<template #template>

@[code vue](../.vuepress/components/chip/default.vue)

</template>

</card>

<card>

## Color

<template #example>
<chip-color />
</template>

<template #template>

@[code vue](../.vuepress/components/chip/color.vue)

</template>

</card>

<card>

## Transparent

<template #example>
<chip-transparent />
</template>

<template #template>

@[code vue](../.vuepress/components/chip/transparent.vue)

</template>

</card>

<card>

## Icon

<template #example>
<chip-icon />
</template>

<template #template>

@[code vue](../.vuepress/components/chip/icon.vue)

</template>

</card>

<card>

## Closable

<template #example>
<chip-closable />
</template>

<template #template>

@[code vue](../.vuepress/components/chip/closable.vue)

</template>

</card>

<card>

## Add and Remove Items

<template #example>
<chip-chips />
</template>

<template #template>

@[code vue](../.vuepress/components/chip/chips.vue)

</template>

</card>

<card>

## API

</card>
