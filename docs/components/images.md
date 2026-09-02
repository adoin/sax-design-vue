---
PROPS:
  - name: hover
    type: String
    values: 'default, blur, zoom, dark, scale, curtain'
    description: Hover animation style.
    default: default
    link: null
    usage: '#hover'

  - name: alternating
    type: Boolean
    values: 'true, false'
    description: Alternate item offsets.
    default: 'false'
    link: null
    usage: '#more'

  - name: not-border-radius
    type: Boolean
    values: 'true, false'
    description: Disable rounded corners.
    default: 'false'
    link: null
    usage: '#more'

  - name: not-margin
    type: Boolean
    values: 'true, false'
    description: Remove item margins.
    default: 'false'
    link: null
    usage: '#more'
CHILD_PROPS:
  - name: src
    type: String
    values: URL
    description: Image source used by SImage.
    default: null
    usage: '#default'

  - name: alt
    type: String
    values: Text
    description: Accessible alternative text for SImage.
    default: null
    usage: '#sizing-and-fit'

  - name: fit
    type: String
    values: fill | contain | cover | none | scale-down
    description: Control how the source image fits inside the assigned box.
    default: cover
    usage: '#sizing-and-fit'

  - name: position
    type: String
    values: CSS object-position
    description: Align the image inside its box, especially when cover crops it.
    default: center
    usage: '#sizing-and-fit'

  - name: width
    type: String | Number
    values: CSS length | number
    description: Set the SImage item width; numbers are interpreted as pixels.
    default: null
    usage: '#sizing-and-fit'

  - name: height
    type: String | Number
    values: CSS length | number
    description: Set an explicit SImage item height; numbers are interpreted as pixels.
    default: null
    usage: '#sizing-and-fit'

  - name: aspect-ratio
    type: String | Number
    values: CSS aspect-ratio
    description: Reserve the image box ratio when height is not specified.
    default: 1
    usage: '#sizing-and-fit'

  - name: loading
    type: String
    values: eager | lazy
    description: Select native eager or lazy image loading.
    default: eager
    usage: '#sizing-and-fit'

  - name: decoding
    type: String
    values: auto | sync | async
    description: Forward the preferred native image decoding mode.
    default: auto
    usage: '#sizing-and-fit'

  - name: preview-src-list
    type: Array
    values: string[]
    description: Supply the image list opened by the shared preview viewer.
    default: '[]'
    usage: '#preview'

  - name: initial-index
    type: Number
    values: number >= 0
    description: Select the initial item in preview-src-list.
    default: '0'
    usage: '#preview'

  - name: preview
    type: Boolean
    values: true | false
    description: Enable mouse and keyboard access to the shared image viewer.
    default: 'false'
    usage: '#preview'
EVENTS:
  - name: load
    type: Event
    description: Emitted after the source image loads.

  - name: error
    type: Event
    description: Emitted when the source image fails to load.

  - name: preview
    type: null
    description: Emitted when SImage opens the shared preview viewer.
SLOTS:
  - name: default
    type: Slot
    values: SImage
    description: Add image items to SImages.
    default: null

  - name: placeholder
    type: Slot
    values: Custom content
    description: Replace the built-in loading skeleton for an SImage.
    default: null

  - name: error
    type: Slot
    values: Custom content
    description: Replace the built-in failed-image state for an SImage.
    default: null
EXPOSES: []
description: 'Responsive image grids with hover effects and layout options.'
NEWS:
  - default
  - fit
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

@[code{1-12}](../.vuepress/components/images/default.vue)

</template>

</card>

<card>

## Sizing and fit

The source ratio does not need to match its display box. Choose `contain`, `cover`, `fill`, `none`, or `scale-down`; use `position` to preserve the important region when cropping. `aspect-ratio` reserves stable space before a lazy image loads.

<template #example>
<images-fit />
</template>

<template #template>

@[code{12-29}](../.vuepress/components/images/fit.vue)

</template>

<template #script>

@[code{1-10}](../.vuepress/components/images/fit.vue)

</template>

<template #style>

@[code{31-52}](../.vuepress/components/images/fit.vue)

</template>

</card>

<card>

## Preview

Set `preview` to open the shared image viewer. `preview-src-list` supplies a custom gallery and the trigger remains keyboard accessible.

<template #example>
<images-preview />
</template>

<template #template>

@[code{8-20}](../.vuepress/components/images/preview.vue)

</template>

<template #script>

@[code{1-6}](../.vuepress/components/images/preview.vue)

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
