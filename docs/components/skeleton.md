---
description: "Default and declarative skeletons with shapes, nested rows, and content reveal."
PROPS:
  - name: loading
    type: boolean
    values: "true | false"
    description: "Show placeholders; false reveals content."
    default: true
    usage: '#loading-content'
  - name: rows
    type: SkeletonRow[]
    description: "Row declarations; omission uses the default text layout."
    default: null
    usage: '#declarative-rows'
  - name: repeat
    type: number
    description: "Repeat the entire layout; a positive integer."
    default: 1
    usage: '#declarative-rows'
  - name: gap
    type: SkeletonLength
    description: "Default spacing between rows and items; numbers are pixels and strings are CSS lengths."
    default: 16
    usage: '#declarative-rows'
  - name: animation
    type: SkeletonAnimation
    values: "shimmer | pulse | none"
    description: "Placeholder animation."
    default: shimmer
    usage: '#animation'
  - name: label
    type: string
    description: "Loading status for assistive technology; defaults to localized copy."
    default: null
    usage: '#loading-content'
SLOTS:
  - name: default
    type: Slot
    description: "Content shown after loading."
    default: null
    usage: '#loading-content'
  - name: placeholder
    type: Slot
    description: "Custom placeholders replacing the rows layout."
    default: null
    usage: '#loading-content'
---

# Skeleton

<card>

## Default

Render a title and three text placeholders without configuration. Skeleton fills the available width.

<template #example>
<skeleton-default />
</template>

<template #template>

@[code{1-3}](../.vuepress/components/skeleton/default.vue)

</template>

</card>

<card>

## Declarative rows

Each entry in `rows` is a row. An array is the short form; strings create default shapes. Objects set `width`, `height`, `size`, and `flex`. A `group` nests rows for an avatar beside multiple text lines. Use `repeat` to reuse a whole layout for lists. See <doc-type type="SkeletonRow" />, <doc-type type="SkeletonElement" />, <doc-type type="SkeletonGroup" /> for the configuration types.

<template #example>
<skeleton-rows />
</template>

<template #template>

@[code{46-56}](../.vuepress/components/skeleton/rows.vue)

</template>

<template #script>

@[code{1-45}](../.vuepress/components/skeleton/rows.vue)

</template>

<template #style>

@[code{57-64}](../.vuepress/components/skeleton/rows.vue)

</template>

</card>

<card>

## Loading content

Control `loading` to reveal the default slot. The `placeholder` slot can replace the declared layout. Match the placeholder dimensions to the final content for a stable reveal; Skeleton does not fetch data.

<template #example>
<skeleton-loading />
</template>

<template #template>

@[code{20-38}](../.vuepress/components/skeleton/loading.vue)

</template>

<template #script>

@[code{1-19}](../.vuepress/components/skeleton/loading.vue)

</template>

<template #style>

@[code{39-69}](../.vuepress/components/skeleton/loading.vue)

</template>

</card>

<card>

## Animation

Choose shimmer, pulse, or no animation. Motion is disabled automatically when the system requests reduced motion. Theme tokens adapt the placeholders to light and dark modes.

<template #example>
<skeleton-animation />
</template>

<template #template>

@[code{1-16}](../.vuepress/components/skeleton/animation.vue)

</template>

<template #style>

@[code{17-27}](../.vuepress/components/skeleton/animation.vue)

</template>

</card>
