---
PROPS:
  - name: target
    type: String
    values: CSS selector
    description: Scrollable container selector. Defaults to the window.
    default: null
  - name: visibility-height
    type: Number
    values: pixels
    description: Minimum scroll offset before the control appears.
    default: 200
  - name: behavior
    type: String
    values: auto | smooth
    description: Native scroll behavior after activation.
    default: smooth
EVENTS:
  - name: click
    description: Fired after scroll-to-top starts.
description: "Floating scroll-to-top control compatible with VXE Backtop."
---

# Backtop

<card>

## Default

<template #example><backtop-default /></template>

<template #template>

@[code{1-6}](../.vuepress/components/backtop/default.vue)

</template>

</card>
