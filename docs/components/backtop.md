---
PROPS:
  - name: bottom
    type: Number
    values: "pixels"
    description: Set the distance from the viewport, or from the target container when target is set.
    default: '40'
  - name: right
    type: Number
    values: "pixels"
    description: Set the distance from the viewport, or from the target container when target is set.
    default: '40'
  - name: target
    type: String
    values: "CSS selector"
    description: Scrollable container selector. The control is positioned inside this container. Defaults to the window.
    default: null
  - name: visibility-height
    type: Number
    values: "pixels"
    description: Minimum scroll offset before the control appears. Either this or visibility-bottom can show the control.
    default: 200
  - name: visibility-bottom
    type: Number
    values: "pixels"
    description: Shows when the remaining scroll distance reaches this value. Either this or visibility-height can show the control.
    default: null
  - name: behavior
    type: String
    values: "auto | smooth"
    description: Native scroll behavior after activation.
    default: smooth
EVENTS:
  - name: click
    description: Fired after scroll-to-top starts.
SLOTS:
  - name: default
    type: Slot
    values: "icon or custom content"
    description: Replace the default up arrow.
    default: IconArrow
description: "Floating scroll-to-top control."
---

# Backtop

<card>

## Default

Appears after the scroll container passes 96px and stays at its lower-right edge. It does not need Affix.

<template #example><backtop-default /></template>

<template #template>

@[code{1-14}](../.vuepress/components/backtop/default.vue)

</template>

<template #style>

@[code{16-31}](../.vuepress/components/backtop/default.vue)

</template>

</card>

<card>

## Near the bottom

Useful for lists and dynamic loading. `visibility-height` and `visibility-bottom` use OR logic. This example sets the former high to demonstrate the 72px remaining-distance trigger.

<template #example><backtop-bottom-distance /></template>

<template #template>

@[code{1-15}](../.vuepress/components/backtop/bottom-distance.vue)

</template>

<template #style>

@[code{17-32}](../.vuepress/components/backtop/bottom-distance.vue)

</template>

</card>

<card>

## Custom icon

Use the default slot to replace the built-in arrow with an icon or custom content.

<template #example><backtop-custom-icon /></template>

<template #template>

@[code{1-16}](../.vuepress/components/backtop/custom-icon.vue)

</template>

<template #style>

@[code{18-38}](../.vuepress/components/backtop/custom-icon.vue)

</template>

</card>
