---
PROPS:
  - name: model-value/v-model
    type: String
    values: href
    description: Active anchor href.
    default: "''"
  - name: items
    type: Array
    values: '{ href, title, disabled?, children? }[]'
    description: Anchor items. Use children for one nested level in vertical mode.
    default: '[]'
  - name: offset / target-offset / bounds
    type: Number
    values: pixels
    description: Active-state offset, scroll destination offset, and detection tolerance.
    default: '88 / offset / 5'
  - name: affix
    type: Boolean
    values: true / false
    description: Keeps the anchor navigation sticky in the viewport.
    default: false
  - name: get-container
    type: Function
    values: () => HTMLElement | Window
    description: Returns the scroll container. Defaults to the page window.
    default: window
  - name: get-current-anchor
    type: Function
    values: (activeHref) => href
    description: Lets you override the highlighted href.
    default: undefined
  - name: replace
    type: Boolean
    values: true / false
    description: Replaces browser history instead of appending a hash entry.
    default: false
  - name: direction
    type: String
    values: vertical / horizontal
    description: Anchor layout direction. Nested items are available in vertical mode.
    default: vertical
  - name: scroll-behavior
    type: String
    values: auto / smooth
    description: Scroll behavior after selecting an anchor.
    default: smooth
EVENTS:
  - name: change
    description: Fired when the active anchor changes.
  - name: click
    description: Fired when an anchor item is selected.
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

@[code html](../.vuepress/components/anchor/basic.vue)

</template>

</card>

<card>

<h2 id="anchor-hierarchy">Hierarchy</h2>

Use `children` to organize related links. The parent remains a normal target;
child items represent the more specific sections beneath it.

<template #example>

<anchor-hierarchy />

</template>

<template #template>

@[code html](../.vuepress/components/anchor/hierarchy.vue)

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

@[code html](../.vuepress/components/anchor/horizontal.vue)

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

@[code html](../.vuepress/components/anchor/container.vue)

</template>

</card>

<card>

<h2 id="api">API</h2>

</card>
