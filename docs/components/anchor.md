---
PROPS:
  - name: model-value
    type: String
    values: 'href'
    description: Active anchor href.
    default: "''"
  - name: v-model
    type: String
    values: 'href'
    description: Active anchor href.
    default: "''"
  - name: items
    type: Array
    values: '{ href, title, disabled?, collapsible?, defaultCollapsed?, children? }[]'
    description: Recursive anchor items. children can nest further, while collapsible controls whether that item's descendants can be collapsed.
    default: '[]'
  - name: offset
    type: Number
    values: 'pixels'
    description: Active-state offset, scroll destination offset, and detection tolerance.
    default: '88'
  - name: target-offset
    type: Number
    values: 'pixels'
    description: Active-state offset, scroll destination offset, and detection tolerance.
    default: 'offset'
  - name: bounds
    type: Number
    values: 'pixels'
    description: Active-state offset, scroll destination offset, and detection tolerance.
    default: '5'
  - name: affix
    type: Boolean
    values: 'true / false'
    description: Keeps the anchor navigation sticky in the viewport.
    default: false
  - name: get-container
    type: Function
    values: '() => HTMLElement | Window'
    description: Returns the scroll container. Defaults to the page window.
    default: window
  - name: get-current-anchor
    type: Function
    values: '(activeHref) => href'
    description: Lets you override the highlighted href.
    default: undefined
  - name: replace
    type: Boolean
    values: 'true / false'
    description: Replaces browser history instead of appending a hash entry.
    default: false
  - name: direction
    type: String
    values: 'vertical / horizontal'
    description: Anchor layout direction. Nested items are available in vertical mode.
    default: vertical
  - name: scroll-behavior
    type: String
    values: 'auto / smooth'
    description: Scroll behavior after selecting an anchor.
    default: smooth
EVENTS:
  - name: change
    description: Fired when the active anchor changes.
  - name: click
    description: Fired when an anchor item is selected.
  - name: collapse-change
    description: Fired when a collapsible item opens or closes, with the item and collapsed state.
description: 'Navigate directly between related sections on the current page.'
---

# Anchor

<card>

<docs-warn />

<anchor-default />

<h2 id="anchor-default">Default</h2>

<template #example>

<anchor-basic />

</template>

<template #template>

@[code{1-5}](../.vuepress/components/anchor/basic.vue)

</template>

<template #script>

@[code{7-13}](../.vuepress/components/anchor/basic.vue)

</template>

<template #style>

@[code{15-20}](../.vuepress/components/anchor/basic.vue)

</template>

</card>

<card>

<h2 id="anchor-hierarchy">Hierarchy</h2>

Use `children` recursively for any depth. The parent remains a normal target.
Set `collapsible: true` to let that item hide its descendants, and use
`defaultCollapsed` for its initial state. If the active anchor is hidden in a
collapsed branch, its ancestors open so the current location remains visible.

<template #example>

<anchor-hierarchy />

</template>

<template #template>

@[code{1-5}](../.vuepress/components/anchor/hierarchy.vue)

</template>

<template #script>

@[code{7-38}](../.vuepress/components/anchor/hierarchy.vue)

</template>

<template #style>

@[code{40-45}](../.vuepress/components/anchor/hierarchy.vue)

</template>

</card>

<card>

<h3 id="anchor-secondary">Secondary link</h3>

Each item uses a stable `href` that points to a real page ID. `offset` controls
when an item becomes active, while `target-offset` controls the final scroll
position after a click.

<h2 id="anchor-horizontal">Horizontal</h2>

<template #example>

<anchor-horizontal />

</template>

<template #template>

@[code{1-5}](../.vuepress/components/anchor/horizontal.vue)

</template>

<template #script>

@[code{7-13}](../.vuepress/components/anchor/horizontal.vue)

</template>

<template #style>

@[code{15-20}](../.vuepress/components/anchor/horizontal.vue)

</template>

</card>

<card>

<h2 id="anchor-container">Scroll container</h2>

By default Anchor listens to the page window. For a panel or virtualized page,
provide `get-container` and return that scrolling element. The navigation and
active-state calculation then use the same container.

<template #example>

<anchor-container />

</template>

<template #template>

@[code{1-16}](../.vuepress/components/anchor/container.vue)

</template>

<template #script>

@[code{18-29}](../.vuepress/components/anchor/container.vue)

</template>

<template #style>

@[code{31-71}](../.vuepress/components/anchor/container.vue)

</template>

</card>

<card>

<h2 id="api">API</h2>

</card>
