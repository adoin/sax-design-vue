---
PROPS:
  - name: type / status
    type: String
    values: primary | success | warning | danger | info
    description: Semantic color. `status` is the VXE-compatible alias and takes priority.
    default: primary
  - name: content
    type: String
    values: text
    description: Text when no default slot is supplied.
    default: null
  - name: closable
    type: Boolean
    values: true | false
    description: Shows the close affordance.
    default: false
  - name: round
    type: Boolean
    values: true | false
    description: Uses a pill shape.
    default: false
EVENTS:
  - name: close
    description: Fired from the close control.
  - name: click
    description: Fired from the tag body.
description: "Compact semantic label compatible with VXE Tag conventions."
---

# Tag

<card>

## Default

<template #example><tag-default /></template>

<template #template>

@[code{1-11}](../.vuepress/components/tag/default.vue)

</template>

</card>
