---
PROPS:
  - name: max-rendered-items
    type: Number
    values: 'positive integer'
    description: Maximum simultaneously mounted rows including overscan. A sustained limit triggers a development warning; normal rendering resumes automatically when layout or overscan recovers. Increase this only for an intentionally dense viewport.
    default: '500'
    usage: '#dynamic-container-safety'
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
    description: Scroll viewport height. Unresolved percentage or auto layouts use a 320px intrinsic fallback and follow the parent again when its size resolves.
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
  - dynamic-container-safety
description: 'Windowed list rendering using a shared height-delta index, with measured dynamic row heights.'
---

# Virtual List

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

@[code{53-81}](../.vuepress/components/virtual-list/default.vue)

</template>

</card>

<card>

## Dynamic container safety

Percentage, flex, and grid layouts can resize or briefly lose a definite height. The viewport uses size containment with a 320px intrinsic fallback so its spacer cannot expand its own viewport. Once a parent height resolves, the viewport follows it automatically; this is not a permanent height lock. A hidden 0px container remains hidden and is remeasured when shown.

`max-rendered-items` limits mounted rows immediately, including excessive overscan, while keeping the current scroll position inside the rendered window. If the limit persists for 200ms in a visible container, development builds warn once per episode with layout and configuration suggestions. Transient spikes, hidden containers, and unmounted lists do not emit that warning. The mounting limit also applies in production.

This example switches between an unresolved parent, two definite heights, and a hidden container without creating a hundred-thousand-item array. Intentional dense layouts can increase the budget; the limit does not replace correct parent sizing. In flex/grid layouts, ensure the intended scrolling child can shrink, for example with `min-height: 0`.

<template #example>
<virtual-list-container-safety />
</template>

<template #template>

@[code{26-73}](../.vuepress/components/virtual-list/container-safety.vue)

</template>

<template #script>

@[code{1-24}](../.vuepress/components/virtual-list/container-safety.vue)

</template>

</card>
