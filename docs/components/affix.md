---
PROPS:
  - name: offset-top
    type: Number
    values: pixels
    description: Distance from the top edge before the content is pinned.
    default: 0
  - name: offset-bottom
    type: Number
    values: pixels
    description: Pin content to the bottom edge instead of the top.
    default: null
  - name: target
    type: Function
    values: () => HTMLElement | Window
    description: Scroll target. Use a container element for local pinning.
    default: window
  - name: z-index
    type: Number
    values: number
    description: Stacking order while pinned.
    default: 100
EVENTS:
  - name: change
    description: Fires when the pinned state changes. Receives a boolean.
SLOTS:
  - name: default
    type: Slot
    values: any content
    description: Content that should be pinned.
    default: null
description: "Pins content to a viewport or scroll container edge."
---

# Affix

<card>

## Viewport pinning

Without `target`, Affix listens to the page. Content pins to the viewport top after it reaches `offset-top`.

<template #example><affix-viewport /></template>

<template #template>

@[code{1-24}](../.vuepress/components/affix/viewport.vue)

</template>

</card>

<card>

## Container pinning

<template #example><affix-default /></template>

<template #template>

@[code{1-24}](../.vuepress/components/affix/default.vue)

</template>

</card>

<card>

## Bottom

<template #example><affix-bottom /></template>

<template #template>

@[code{1-20}](../.vuepress/components/affix/bottom.vue)

</template>

</card>

<card>

## Custom content

The default slot can pin a toolbar, filter row, status, or any other component.

<template #example><affix-custom-content /></template>

<template #template>

@[code{1-33}](../.vuepress/components/affix/custom-content.vue)

</template>

</card>
