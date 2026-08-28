---
description: 'Group related content and actions in a surfaced container.'
PROPS:
  - name: title
    type: String
    values: null
    description: Card title. The title slot takes precedence when both are provided.
    default: null
    link: null
    usage: '#default'
    code: null
  - name: text
    type: String
    values: null
    description: Card body text. The text slot takes precedence when both are provided.
    default: null
    link: null
    usage: '#default'
    code: null
  - name: type
    type: String
    values: 1,2,3,4,5
    description: Change the style of the letter and the position of the internals.
    default: null
    link: null
    usage: '#type-5'
    code: null

SLOTS:
  - name: text
    type: slot
    values: null
    description: Customize card body content. Overrides the text prop.
    default: null
    link: null
    usage: '#default'
    code: null
  - name: title
    type: slot
    values: null
    description: Customize card title content. Overrides the title prop.
    default: null
    link: null
    usage: '#default'
    code: null
  - name: buttons
    type: slot
    values: null
    description: Add the buttons to the card in the section determined by the type of card.
    default: null
    link: null
    usage: '#default'
    code: null
  - name: interactions
    type: slot
    values: null
    description: Add the interactions to the card in the section determined by the card type.
    default: null
    link: null
    usage: '#default'
    code: null
  - name: img
    type: slot
    values: null
    description: Add the image or video to the card in the section determined by the type of card.
    default: null
    link: null
    usage: '#default'
    code: null

NEWS:
  - name
---

# Card

<card>

<docs-warn />

## Default

Pass `title` and `text` for common text content. Use the named slots when custom markup is needed; slots take precedence over the matching props.

- title
- text
- buttons
- interactions
- img

<template #example>
<card-default />
</template>

<template #template>

@[code{1-21}](../.vuepress/components/card/default.vue)

</template>

<template #style>

@[code{24-34}](../.vuepress/components/card/default.vue)

</template>

</card>

<card>

## Type 2

Completely change the style of the letter with the property `type` and the value` 2`

<template #example>
<card-type2 />
</template>

<template #template>

@[code{1-24}](../.vuepress/components/card/type2.vue)

</template>

<template #style>

@[code{27-37}](../.vuepress/components/card/type2.vue)

</template>

</card>

<card>

## Type 3

Completely change the style of the letter with the property `type` and the value` 3`

<template #example>
<card-type3 />
</template>

<template #template>

@[code{1-24}](../.vuepress/components/card/type3.vue)

</template>

<template #style>

@[code{27-37}](../.vuepress/components/card/type3.vue)

</template>

</card>

<card>

## Type 4

Completely change the style of the letter with the `type` property and the value` 4`

<template #example>
<card-type4 />
</template>

<template #template>

@[code{1-24}](../.vuepress/components/card/type4.vue)

</template>

<template #style>

@[code{27-37}](../.vuepress/components/card/type4.vue)

</template>

</card>

<card>

## Type 5

Change the style of the letter completely with the `type` property and the value` 5`

<template #example>
<card-type5 />
</template>

<template #template>

@[code{1-24}](../.vuepress/components/card/type5.vue)

</template>

<template #style>

@[code{27-37}](../.vuepress/components/card/type5.vue)

</template>

</card>

<card>

## Group

To have a group of scrolling cards you can use the `s-card-group` component

<template #example>
<card-group />
</template>

<template #template>

@[code{1-26}](../.vuepress/components/card/group.vue)

</template>

<template #script>

@[code{28-33}](../.vuepress/components/card/group.vue)

</template>

<template #style>

@[code{34-44}](../.vuepress/components/card/group.vue)

</template>

</card>
