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
    values: '{ href?, title, disabled?, boundary?, collapsible?, defaultCollapsed?, children? }[]'
    description: Recursive navigation items. Omit href for a grouping label; #hash scrolls locally, while another same-origin path uses the configured router. boundary overrides participation in the flattened previous/next sequence.
    default: '[]'
  - name: router
    type: AnchorRouterAdapter
    values: '{ push, replace?, current?, currentRoute? }'
    description: Router used by this Anchor. Local configuration overrides global anchor.router and structurally supports Vue Router-compatible routers.
    default: null
  - name: route-boundary
    type: Boolean | AnchorRouteBoundaryOptions
    description: Automatic floating previous/next boundary for the flattened eligible route sequence; false disables it, or configure threshold, armDelay and routeCooldown.
    default: true
  - name: offset
    type: Number
    values: 'pixels'
    description: Reading viewport top inset; also the legacy heading activation offset and click destination fallback when their dedicated props are omitted.
    default: '88'
  - name: active-strategy
    type: String
    values: 'heading / visible-section'
    description: Choose the heading-crossing rule or the section occupying most of the readable viewport. Local value overrides global anchor.activeStrategy.
    default: heading
  - name: active-offset
    type: Number
    values: 'pixels'
    description: Heading activation line measured from the scroll viewport top. Local value overrides global anchor.activeOffset; omitted value falls back to offset.
    default: 'offset'
  - name: target-offset
    type: Number
    values: 'pixels'
    description: Scroll destination inset after selecting a hash link; defaults to offset.
    default: 'offset'
  - name: bounds
    type: Number
    values: 'pixels'
    description: Detection tolerance around the heading line and page-bottom boundary.
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
    description: Fired with the selected item and MouseEvent before navigation; ordinary same-origin route clicks are then delegated to the configured adapter.
  - name: collapse-change
    description: Fired when a collapsible item opens or closes, with the item and collapsed state.
SLOTS:
  - name: active-icon
    type: 'Slot<{ item: AnchorItem, href: string }>'
    description: Replaces the active marker. It takes precedence over the global Anchor icon.
    default: null
  - name: route-previous
    type: 'Slot<{ item: AnchorRouteBoundaryItem, direction: previous, visible: boolean, navigating: boolean, progress: number }>'
    description: Replaces the automatic previous-route copy while keeping its link, icon and progress indicator.
    default: null
  - name: route-next
    type: 'Slot<{ item: AnchorRouteBoundaryItem, direction: next, visible: boolean, navigating: boolean, progress: number }>'
    description: Replaces the automatic next-route copy while keeping its link, icon and progress indicator.
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

Anchor has no router dependency. Provide a compatible router locally or through
global Anchor configuration when the item tree contains same-origin page paths.
Anchor classifies every `href` automatically: ordinary route clicks are
delegated, while modified clicks remain native links and can open in a new tab.

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

Use `children` recursively for any depth. A parent with `href` remains a normal
target; omit `href` when it is only a grouping label. Set `collapsible: true` to let that item hide its descendants, and use
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

Each item uses a stable `href` that points to a real page ID. The default
`heading` strategy activates a heading after it crosses `active-offset + bounds`.
Without `active-offset`, the line uses `offset`; `target-offset` independently
controls where a click scrolls. `visible-section` instead compares how much of
each heading-to-next-heading section occupies the viewport below `offset`.

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

<h2 id="anchor-route-boundary">Mixed route and anchor navigation</h2>

Provide `router` when one outline combines route-level chapters with headings inside each chapter; no mode switch is required. Anchor infers behavior per item. A bare `#hash` scrolls within the current document, another same-origin pathname uses the router, and a pathname plus hash uses the router only when its document differs. The previous/next sequence is flattened across groups and includes full routes without hashes by default; set `boundary: true` to include a cross-document hash such as an API endpoint, or `false` to exclude a route. Scrolling forward across the bottom edge opens the next entry at its start; scrolling backward across the top edge opens the previous entry at its end.

The router and page scroll owner control route-entry scrolling. Keep route changes instantaneous rather than relying on a global smooth-scroll rule, which can animate the new page backward from the previous page's scroll position. Hash-link clicks still use Anchor's `scroll-behavior` setting, which defaults to `smooth`.

The documentation outline uses `active-strategy="visible-section"` so its highlighted hash follows the section occupying most of the readable page area. The library default remains `heading` for existing applications. Set `active-strategy` on one Anchor, or set `anchor: { activeStrategy: 'visible-section', activeOffset: 160 }` in `SConfigProvider` or the installation options for a shared default. An explicit component prop takes precedence; `activeOffset` only changes the `heading` strategy.

When entering the next route through a boundary, the outline waits for its scroll position to settle at the new page start before selecting a page hash. The first heading stays active through the beginning of the chapter; later headings take over as they enter the reading area.

Pass a Vue Router-compatible object locally through `router`. For example, use [vue-smart-router](https://www.npmjs.com/package/vue-smart-router) or another compatible router to handle navigation.

```vue
<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { type AnchorItem, SAnchor } from 'sax-design-vue'

const router = useRouter()
const items: AnchorItem[] = [
  {
    title: 'Table guides',
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
    <SAnchor :items="items" :router="router" />
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
    activeStrategy: 'visible-section',
    activeOffset: 160,
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
[Try mixed navigation in the Table guides →](/components/table/large-data-and-visualization.html)
:::

<h3 id="anchor-container">Scroll container</h3>

Local anchors and route-aware outlines both listen to the page window by default. For
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
