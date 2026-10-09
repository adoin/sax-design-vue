---
description: An empty-content state with a configurable animated SVG illustration.
PROPS:
  - name: image
    type: String
    values: URL
    description: Custom image URL. Replaces the built-in SVG and its animation.
    default: null
    usage: '#custom-image'
  - name: image-size
    type: Number | String
    values: CSS size
    description: Sets both illustration box dimensions; numbers use px. The default box is 160 × 128px.
    default: null
    usage: '#image-size'
  - name: description
    type: String
    values: text
    description: Empty-state message.
    default: null
    usage: '#default'
  - name: animated
    type: Boolean
    values: true | false
    description: Enable a one-time opening animation followed by a brief sparkle. It finishes on the open box; reduced motion shows that static pose. Offscreen or hidden pages pause playback. Does not affect custom images or the image slot.
    default: true
    usage: '#animation'
SLOTS:
  - name: image
    description: Replace the illustration; takes precedence over image and the built-in SVG.
    usage: '#slots'
  - name: description
    description: Custom empty-state message.
    usage: '#slots'
  - name: default
    description: Actions below the message.
    usage: '#default'
---

# Empty

<card>

## Default

An open, completely empty box conveys missing content. Explain the state with description and offer the next action in the default slot.

<template #example><empty-default /></template>

<template #template>

@[code{1-5}](../.vuepress/components/empty/default.vue)

</template>

</card>

<card>

## Animation

Use animated to control the built-in scene. The three rectangular flaps open together from a partly open pose, revealing the empty interior. A few luminous stars briefly appear, then fade; the box stays open. Replay the example with the button, or restart an application instance by remounting it or re-enabling animated. Reduced motion keeps the scene static; offscreen or hidden pages pause it.

<template #example><empty-animation /></template>

<template #template>

@[code{7-27}](../.vuepress/components/empty/animation.vue)

</template>

<template #script>

@[code{1-5}](../.vuepress/components/empty/animation.vue)

</template>

<template #style>

@[code{29-43}](../.vuepress/components/empty/animation.vue)

</template>

</card>

<card>

## Image size

image-size sets both box dimensions while preserving the SVG aspect ratio. Numbers use px; CSS lengths also work. Custom images use the same size.

<template #example><empty-size /></template>

<template #template>

@[code{6-17}](../.vuepress/components/empty/size.vue)

</template>

<template #script>

@[code{1-4}](../.vuepress/components/empty/size.vue)

</template>

<template #style>

@[code{19-26}](../.vuepress/components/empty/size.vue)

</template>

</card>

<card>

## Custom image

Pass image to replace the default SVG. Custom images use object-fit: contain and do not receive built-in animation.

<template #example><empty-image /></template>

<template #template>

@[code{1-7}](../.vuepress/components/empty/image.vue)

</template>

</card>

<card>

## Slots

The image slot replaces the illustration and takes precedence over the image prop. Customize the message with description and place actions in the default slot.

<template #example><empty-slots /></template>

<template #template>

@[code{1-7}](../.vuepress/components/empty/slots.vue)

</template>

</card>
