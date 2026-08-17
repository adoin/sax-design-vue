---
PROPS:
  - name: loading / process-before-open / process-before-close
    type: Boolean / Function / Function
    values: true | false / lifecycle guard
    description: Show loading feedback and guard opening or closing.
    default: 'false / () => true / () => true'
  - name: v-model:visible / visible
    type: Boolean
    values: true | false
    description: Control whether the floating content is shown.
    default: 'null'
  - name: trigger
    type: String | String[]
    values: hover | focus | click | contextmenu
    description: Event or events that open the popper.
    default: hover
  - name: placement / offset / strategy
    type: String / Number | Object / String
    values: floating-ui placement | pixels | absolute | fixed
    description: Configure the floating content position.
    default: 'bottom / 12 / absolute'
  - name: disabled / show-arrow / teleported / persistent
    type: Boolean
    values: true | false
    description: Control availability, arrow, mounting location and lifecycle.
    default: 'false / true / true / false'
  - name: content / raw-content
    type: String / Boolean
    values: text or HTML
    description: Provide content without using the content slot.
    default: '- / false'
  - name: popper-class / popper-style / z-index
    type: String | Object | Array / String | Object | Array / Number
    values: CSS values
    description: Customize rendered floating content and layer order.
    default: "'' / '' / -"
EVENTS:
  - name: before-show / show / before-hide / hide
    description: Fired during the visibility lifecycle.
description: 'Position floating content next to a trigger element.'
SLOTS:
  - name: default
    type: slot
    values: null
    description: popper triggering & reference element
    default: null
    link: null
    usage: '#default'
    code: null

  - name: content
    type: slot
    values: null
    description: customize content
    default: null
    link: null
    usage: '#slot'
    code: >
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
