---
PROPS:
  - name: hover
    type: String
    values: default, blur, zoom, dark, scale, curtain
    description: Hover animation style.
    default: default
    link: null
    usage: '#hover'

  - name: alternating
    type: Boolean
    values: true, false
    description: Alternate item offsets.
    default: false
    link: null
    usage: '#more'

  - name: not-border-radius
    type: Boolean
    values: true, false
    description: Disable rounded corners.
    default: false
    link: null
    usage: '#more'

  - name: not-margin
    type: Boolean
    values: true, false
    description: Remove item margins.
    default: false
    link: null
    usage: '#more'

  - name: src
    type: String
    values: URL
    description: Image source (s-image).
    default: null
    link: null
    usage: '#default'
EVENTS: []
EXPOSES: []
description: "Responsive image grids with hover effects and layout options."
NEWS:
  - default
  - hover
  - more
---

# Images

<card>

## Default


Place `s-image` elements inside `s-images`.

<template #example>
<images-default />
</template>

<template #template>

@[code{1-8}](../.vuepress/components/images/default.vue)

</template>

</card>

<card>

## Preview and fit

Set `preview` to open the shared image viewer. `preview-src-list` supports a custom gallery; `fit`, `width`, and `height` control single item rendering without changing grid styling.

<template #example>
<images-preview />
</template>

<template #template>

@[code{1-8}](../.vuepress/components/images/preview.vue)

</template>

</card>

<card>

## Hover


Pick a hover animation: zoom, blur, dark, scale, or curtain.

<template #example>
<images-hover />
</template>

<template #template>

@[code{1-12}](../.vuepress/components/images/hover.vue)

</template>

<template #style>

@[code{14-22}](../.vuepress/components/images/hover.vue)

</template>

</card>

<card>

## More Options


Fine-tune spacing and corners with `alternating` and margin props.

<template #example>
<images-more />
</template>

<template #template>

@[code{1-8}](../.vuepress/components/images/more.vue)

</template>

</card>

<card>

## API

</card>
