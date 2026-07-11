---
PROPS:
  - name: items
    type: Array
    values: BreadcrumbItem[]
    description: Items rendered when not using slots.
    default: []
    link: null
    usage: '#default'

  - name: separator
    type: String
    values: String
    description: Separator between items.
    default: /
    link: null
    usage: '#separator'

  - name: color
    type: String
    values: primary, success, danger, warning, dark
    description: Breadcrumb color.
    default: primary
    link: null
    usage: '#color'

  - name: align
    type: String
    values: left, center, right
    description: Horizontal alignment.
    default: left
    link: null
    usage: '#align'
EVENTS: []
EXPOSES: []
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

<template #example>
<breadcrumb-default />
</template>

<template #template>

@[code vue](../.vuepress/components/breadcrumb/default.vue)

</template>

</card>

<card>

## Color

<template #example>
<breadcrumb-color />
</template>

<template #template>

@[code vue](../.vuepress/components/breadcrumb/color.vue)

</template>

</card>

<card>

## Separator

<template #example>
<breadcrumb-separator />
</template>

<template #template>

@[code vue](../.vuepress/components/breadcrumb/separator.vue)

</template>

</card>

<card>

## Slot

<template #example>
<breadcrumb-slot />
</template>

<template #template>

@[code vue](../.vuepress/components/breadcrumb/slot.vue)

</template>

</card>

<card>

## Alignment

<template #example>
<breadcrumb-align />
</template>

<template #template>

@[code vue](../.vuepress/components/breadcrumb/align.vue)

</template>

</card>

<card>

## API

</card>
