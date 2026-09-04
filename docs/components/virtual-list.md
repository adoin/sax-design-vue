---
PROPS:
  - name: overscan
    type: Number
    values: 'item count'
    description: Render this many extra rows before and after the visible range.
    default: '5'
  - name: items
    type: Array
    values: 'unknown[]'
    description: Source data rendered by the virtual list.
    default: '[]'
    link: null
    usage: '#dynamic-height'
  - name: height
    type: Number | String
    values: 'CSS height'
    description: Scroll viewport height.
    default: '320'
    link: null
    usage: '#dynamic-height'
  - name: estimate-size
    type: Number
    values: 'pixels'
    description: Initial estimate before a row is measured. Use a realistic upper estimate for dynamic rows.
    default: '48'
    link: null
    usage: '#dynamic-height'
  - name: dynamic
    type: Boolean
    values: 'true | false'
    description: Measure every rendered row and support dynamic heights.
    default: 'true'
    link: null
    usage: '#dynamic-height'
  - name: retain-max-size
    type: Boolean
    values: 'true | false'
    description: Retain the largest measured size for every stable item key, useful when different virtual windows reveal different content.
    default: 'false'
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
  - name: scrollToIndex
    description: Scroll programmatically or reset all dynamic row measurements.
  - name: scrollToOffset
    description: Scroll programmatically or reset all dynamic row measurements.
  - name: scrollBy
    type: '(delta: number) => void'
    description: Scroll by a relative distance in logical pixels. Positive values move down and negative values move up, including generated lists with compressed scrollbar tracks.
  - name: measure
    description: Measure rendered rows, preserving the largest recorded height when retain-max-size is enabled.
  - name: resetMeasurements
    type: '() => Promise<void>'
    description: Clear recorded heights and measure the current layout again while retaining the visible row anchor. Call after changes to column widths or content that can reduce row heights.
NEWS:
  - dynamic-height
description: 'Windowed list rendering backed by TanStack Virtual, with measured dynamic row heights.'
---

# Virtual list

<card>

## Dynamic height

`s-virtual-list` only mounts rows near the viewport. It measures each rendered row, so wrapped text, expand/collapse state, and appended content retain correct offsets and scroll anchoring. Set `retain-max-size` when alternate virtual windows can expose taller content for the same stable item key.

Large generated lists compress the native scroll track when their total row height exceeds browser layout limits. `scrollToIndex` still uses the original item index, and `scrollToOffset` uses logical content pixels. Wheel movement keeps its normal pixel step, while dragging the native thumb navigates the full range.

<template #example>
<virtual-list-default />
</template>

<template #template>

@[code{1-27}](../.vuepress/components/virtual-list/default.vue)

</template>

<template #script>

@[code{29-51}](../.vuepress/components/virtual-list/default.vue)

</template>

<template #style>

@[code{53-79}](../.vuepress/components/virtual-list/default.vue)

</template>

</card>
