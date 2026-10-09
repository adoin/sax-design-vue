---
PROPS:
  - name: texture
    type: String
    values: 'default | bubbles | waves | sparkle'
    description: Decorative fill texture, clipped to the filled region. default keeps the plain fill.
    default: default
    usage: '#textures'
  - name: texture-animated
    type: Boolean
    values: 'true | false'
    description: Animate the texture. Reduced motion, hidden pages, offscreen or inactive owners and completed progress pause playback. This does not disable the indeterminate segment.
    default: true
    usage: '#textures'
  - name: texture-duration
    type: Number
    values: 'Non-negative milliseconds'
    description: One texture cycle duration; zero displays a static texture.
    default: 2000
    usage: '#texture-controls'
  - name: texture-opacity
    type: Number
    values: '0 - 1'
    description: Texture layer opacity; zero hides the texture and one shows its full authored strength.
    default: 0.6
    usage: '#texture-controls'
  - name: height
    type: Number | String
    values: "CSS height"
    description: Progress bar height; numbers and numeric strings use pixels, other strings accept CSS length units.
    default: 5
    link: null
    usage: '#height'

  - name: indeterminate
    type: Boolean
    values: "true, false"
    description: Animated indeterminate progress.
    default: false
    link: null
    usage: '#indeterminate'

  - name: percent
    type: Number
    values: "0 - 100"
    description: Determinate progress percentage, clamped to 0–100; non-finite values display zero.
    default: 0
    link: null
    usage: '#default'

  - name: color
    type: String
    values: "primary | success | danger | warn | warning | dark | light | text | secondary | info | HEX | RGB | HSL"
    description: Progress color.
    default: primary
    link: null
    usage: '#colors'
EVENTS: []
EXPOSES: []
description: "Display determinate or indeterminate progress for loading states."
NEWS:
  - default
  - color
  - indeterminate
  - height
  - textures
  - texture-controls
  - textured-indeterminate
---

# Progress

<card>

## Default


Bind `percent` from 0 to 100 for a standard progress bar.

<template #example>
<progress-default />
</template>

<template #template>

@[code{1-9}](../.vuepress/components/progress/default.vue)

</template>

<template #style>

@[code{11-19}](../.vuepress/components/progress/default.vue)

</template>

</card>

<card>

## Colors


Apply theme colors to match your UI context. Hover a bar to see its default slot text in a tooltip.

<template #example>
<progress-color />
</template>

<template #template>

@[code{1-8}](../.vuepress/components/progress/color.vue)

</template>

<template #style>

@[code{10-18}](../.vuepress/components/progress/color.vue)

</template>

</card>

<card>

## Indeterminate


Use `indeterminate` for unknown-duration operations.

<template #example>
<progress-indeterminate />
</template>

<template #template>

@[code{1-5}](../.vuepress/components/progress/indeterminate.vue)

</template>

<template #style>

@[code{7-15}](../.vuepress/components/progress/indeterminate.vue)

</template>

</card>

<card>

## Height


Adjust bar thickness with the `height` prop.

<template #example>
<progress-height />
</template>

<template #template>

@[code{1-6}](../.vuepress/components/progress/height.vue)

</template>

<template #style>

@[code{8-16}](../.vuepress/components/progress/height.vue)

</template>

</card>

<card>

## Textures

Choose a fill pattern with `texture`: bubbles, sea waves or sparkle. `default` keeps the plain fill. Textures remain inside the completed portion and inherit the bar's base color. Move the slider to compare the same progress across patterns; at 0% or 100% texture motion pauses.

<template #example><progress-textures /></template>

<template #template>

@[code{14-45}](../.vuepress/components/progress/textures.vue)

</template>

<template #script>

@[code{1-12}](../.vuepress/components/progress/textures.vue)

</template>

<template #style>

@[code{47-88}](../.vuepress/components/progress/textures.vue)

</template>

</card>

<card>

## Texture controls

`texture-duration` sets one cycle in milliseconds; zero keeps the pattern static. Adjust `texture-opacity` to change the decorative strength. Patterns scale proportionally with the rendered bar height, including CSS lengths; compare 5, 8, 16 and 32px here. Sea waves continuously rise, curl and fall with alternating crests; sparkle changes brightness and ray size with staggered timing.

<template #example><progress-texture-controls /></template>

<template #template>

@[code{20-76}](../.vuepress/components/progress/texture-controls.vue)

</template>

<template #script>

@[code{1-19}](../.vuepress/components/progress/texture-controls.vue)

</template>

<template #style>

@[code{77-118}](../.vuepress/components/progress/texture-controls.vue)

</template>

</card>

<card>

## Textured indeterminate

Textures also attach to the moving indeterminate segment. `texture-animated=false` freezes only the pattern; the loading segment continues to move. Automatic motion pauses outside the viewport or on hidden pages. Reduced-motion preferences show a stationary indeterminate segment and static patterns.

<template #example><progress-textured-indeterminate /></template>

<template #template>

@[code{16-37}](../.vuepress/components/progress/textured-indeterminate.vue)

</template>

<template #script>

@[code{1-14}](../.vuepress/components/progress/textured-indeterminate.vue)

</template>

<template #style>

@[code{39-80}](../.vuepress/components/progress/textured-indeterminate.vue)

</template>

</card>
