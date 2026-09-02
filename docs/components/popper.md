---
PROPS:
  - name: loading
    type: Boolean
    values: "true | false / lifecycle guard"
    description: Show loading feedback and guard opening or closing.
    default: 'false'
  - name: process-before-open
    type: Function
    values: "true | false / lifecycle guard"
    description: Show loading feedback and guard opening or closing.
    default: '() => true'
  - name: process-before-close
    type: Function
    values: "true | false / lifecycle guard"
    description: Show loading feedback and guard opening or closing.
    default: '() => true'
  - name: v-model:visible
    type: Boolean
    values: "true | false"
    description: Control whether the floating content is shown.
    default: 'null'
  - name: visible
    type: Boolean
    values: "true | false"
    description: Control whether the floating content is shown.
    default: 'null'
  - name: trigger
    type: String | String[]
    values: "hover | focus | click | contextmenu"
    description: Event or events that open the popper.
    default: hover
  - name: placement
    type: String
    values: "floating-ui placement | pixels | absolute | fixed"
    description: Configure the floating content position.
    default: 'bottom'
  - name: offset
    type: Number | Object
    values: "floating-ui placement | pixels | absolute | fixed"
    description: Configure the floating content position.
    default: '12'
  - name: strategy
    type: String
    values: "floating-ui placement | pixels | absolute | fixed"
    description: Configure the floating content position.
    default: 'absolute'
  - name: disabled
    type: Boolean
    values: "true | false"
    description: Control availability, arrow, mounting location and lifecycle.
    default: 'false'
  - name: show-arrow
    type: Boolean
    values: "true | false"
    description: Control availability, arrow, mounting location and lifecycle.
    default: 'true'
  - name: teleported
    type: Boolean
    values: "true | false"
    description: Control availability, arrow, mounting location and lifecycle.
    default: 'true'
  - name: persistent
    type: Boolean
    values: "true | false"
    description: Control availability, arrow, mounting location and lifecycle.
    default: 'false'
  - name: content
    type: String
    values: "text or HTML"
    description: Provide content without using the content slot.
    default: null
  - name: raw-content
    type: Boolean
    values: "text or HTML"
    description: Provide content without using the content slot.
    default: 'false'
  - name: popper-class
    type: String | Object | Array
    values: "CSS values"
    description: Customize rendered floating content and layer order.
    default: "''"
  - name: popper-style
    type: String | Object | Array
    values: "CSS values"
    description: Customize rendered floating content and layer order.
    default: "''"
  - name: z-index
    type: Number
    values: "CSS values"
    description: Customize rendered floating content and layer order.
    default: null
EVENTS:
  - name: before-show
    description: Fired during the visibility lifecycle.
  - name: show
    description: Fired during the visibility lifecycle.
  - name: before-hide
    description: Fired during the visibility lifecycle.
  - name: hide
    description: Fired during the visibility lifecycle.
SLOTS:
  - name: default
    type: slot
    values: "null"
    description: popper triggering & reference element
    default: null
    link: null
    usage: '#default'
    code: null

  - name: content
    type: slot
    values: "null"
    description: customize content
    default: null
    link: null
    usage: '#slot'
    code: >
description: 'Position floating content next to a trigger element.'
---

# Popper

<card>

## Default

<template #example>
<popper-default />
</template>

<template #template>

@[code{1-9}](../.vuepress/components/popper/default.vue)

</template>

</card>
