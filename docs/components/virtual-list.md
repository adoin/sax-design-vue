---
PROPS:
  - name: items
    type: Array
    values: unknown[]
    description: Source data rendered by the virtual list.
    default: '[]'
    link: null
    usage: '#dynamic-height'
  - name: height
    type: Number | String
    values: CSS height
    description: Scroll viewport height.
    default: '320'
    link: null
    usage: '#dynamic-height'
  - name: estimate-size
    type: Number
    values: pixels
    description: Initial estimate before a row is measured. Use a realistic upper estimate for dynamic rows.
    default: '48'
    link: null
    usage: '#dynamic-height'
  - name: dynamic
    type: Boolean
    values: true | false
    description: Measure every rendered row and support dynamic heights.
    default: 'true'
    link: null
    usage: '#dynamic-height'
  - name: item-key
    type: Function
    values: '(item, index) => string | number'
    description: Stable unique row key. Required when data can reorder or append.
    default: index
    link: null
    usage: '#dynamic-height'
EVENTS:
  - name: range-change
    description: Fires when rendered virtual row range changes.
  - name: scroll
    description: Native scroll event from the viewport.
EXPOSES:
  - name: scrollToIndex / scrollToOffset / measure
    description: Scroll programmatically or reset all dynamic row measurements.
description: "Windowed list rendering backed by TanStack Virtual, with measured dynamic row heights."
NEWS:
  - dynamic-height
---

# Virtual list

<card>

## Dynamic height

`s-virtual-list` only mounts rows near the viewport. It measures each rendered row, so wrapped text, expand/collapse state, and appended content retain correct offsets and scroll anchoring.

<template #example>
<virtual-list-default />
</template>

<template #template>

@[code{1-19}](../.vuepress/components/virtual-list/default.vue)

</template>

</card>
