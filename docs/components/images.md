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
    description: Image source (vs-image).
    default: null
    link: null
    usage: '#default'
EVENTS: []
EXPOSES: []
NEWS:
  - default
  - hover
  - more
---

# Images

<card>

## Default

<template #example>
<images-default />
</template>

<template #template>

@[code vue](../.vuepress/components/images/default.vue)

</template>

</card>

<card>

## Hover

<template #example>
<images-hover />
</template>

<template #template>

@[code vue](../.vuepress/components/images/hover.vue)

</template>

</card>

<card>

## More Options

<template #example>
<images-more />
</template>

<template #template>

@[code vue](../.vuepress/components/images/more.vue)

</template>

</card>

<card>

## API

</card>
