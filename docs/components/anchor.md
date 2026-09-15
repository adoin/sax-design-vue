---
PROPS:
  - name: mode
    type: String
    values: 'anchor / router'
    description: anchor handles page hashes; router derives adjacent route boundaries from sibling items and delegates navigation to the router adapter.
    default: anchor
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
    description: Recursive navigation items. A hash href scrolls within the page; a route or URL href renders as a normal link. children can nest further, while collapsible controls whether that item's descendants can be collapsed.
    default: '[]'
  - name: router
    type: AnchorRouterAdapter
    values: '{ push, replace?, current?, currentRoute? }'
    description: Router used by this Anchor. Local configuration overrides global anchor.router and structurally supports Vue Router-compatible routers.
    default: null
  - name: route-boundary
    type: Boolean | AnchorRouteBoundaryOptions
    description: Automatic floating previous/next boundary in router mode; false disables it, or configure threshold, armDelay and routeCooldown.
    default: true
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
    description: Fired with the selected item and MouseEvent before navigation; router mode then delegates an ordinary route click to the configured adapter.
  - name: collapse-change
    description: Fired when a collapsible item opens or closes, with the item and collapsed state.
SLOTS:
  - name: active-icon
    type: 'Slot<{ item: AnchorItem, href: string }>'
    description: Replaces the active marker. It takes precedence over the global Anchor icon.
    default: null
  - name: route-previous
    type: 'Slot<{ item: AnchorRouteBoundaryItem, direction: previous, visible: boolean, navigating: boolean, progress: number }>'
    description: Replaces the automatic previous-route copy in router mode while keeping its link, icon and progress indicator.
    default: null
  - name: route-next
    type: 'Slot<{ item: AnchorRouteBoundaryItem, direction: next, visible: boolean, navigating: boolean, progress: number }>'
    description: Replaces the automatic next-route copy in router mode while keeping its link, icon and progress indicator.
    default: null
description: 'Navigate between sections on the current page or related routes.'
---

# Anchor

<card>

<docs-warn />

<anchor-default />

<h2 id="anchor-default">Default</h2>

Use a hash `href` for a heading on the current page, or pass a relative,
root-relative, or absolute URL to navigate to another route. Anchor renders
semantic links, so route items keep standard browser behaviors such as opening
in a new tab and copying the destination.

Anchor has no router dependency. In `router` mode, provide a compatible router
locally or through global Anchor configuration; ordinary clicks are delegated
automatically, while modified clicks remain native links and can open in a new
tab.

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

The active marker uses a built-in inline location SVG, so the default does not depend on an icon collection. Set `anchor: { activeIcon: 'collection:name' }` in `SConfigProvider` or the library install options to use a global icon. The `active-icon` slot has the highest priority and receives the active `item` and `href`.

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

<h2 id="anchor-route-boundary">Router mode</h2>

Set `mode="router"` and keep using the normal recursive `items` structure. Anchor finds the item matching the router's current location, derives the nearest route siblings, and creates the floating previous/next boundary internally. Hash children remain page anchors and do not enter the route sequence.

Pass a Vue Router-compatible object locally through `router`. For example, use [vue-smart-router](https://www.npmjs.com/package/vue-smart-router) or another compatible router to handle navigation.

```vue
<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { type AnchorItem, SAnchor } from 'sax-design-vue'

const router = useRouter()
const items: AnchorItem[] = [
  {
    title: 'Table guides',
    href: '/table',
    children: [
      { title: 'Data', href: '/table/data' },
      { title: 'Selection', href: '/table/selection' },
      { title: 'Sorting', href: '/table/sorting' },
    ],
  },
]
</script>

<template>
  <aside>
    <SAnchor mode="router" :items="items" :router="router" />
  </aside>
  <RouterView />
</template>
```

For application-wide reuse, provide the router once when installing Sax Design Vue. A local `router` prop always takes precedence:

```ts
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import SaxDesignVue from 'sax-design-vue'
import App from './App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/table/data', component: () => import('./DataGuide.vue') },
    {
      path: '/table/selection',
      component: () => import('./SelectionGuide.vue'),
    },
    { path: '/table/sorting', component: () => import('./SortingGuide.vue') },
  ],
})
const app = createApp(App)

app.use(router)
app.use(SaxDesignVue, {
  anchor: {
    router,
    routeBoundary: {
      threshold: 160,
      armDelay: 320,
      routeCooldown: 1500,
    },
  },
})
```

Set `:route-boundary="false"` to disable edge scrolling for one Anchor, or pass an object to override the boundary thresholds locally. Routers with another API can be adapted once with `{ current, push, replace }`.

```ts
import type { AnchorRouterAdapter } from 'sax-design-vue'

const routerAdapter: AnchorRouterAdapter = {
  current: () => customRouter.location.value,
  push: (href) => customRouter.go(href),
  replace: (href) => customRouter.replaceWith(href),
}
```

`current()` should read reactive route state. If the router exposes no reactive location, synchronize the active route through Anchor's `v-model` instead.

::: tip Live example
[Try router mode in the Table guides →](/components/table/large-data-and-visualization.html)
:::

<h3 id="anchor-container">Scroll container</h3>

Regular anchors and router mode both listen to the page window by default. For
a panel or virtualized page, provide `get-container` and return that scrolling
element. Anchor navigation, active-state calculation and route boundaries then
use the same container.

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
