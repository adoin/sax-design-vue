---
PROPS:
  - name: min-width
    type: Number
    values: "Pixels"
    description: Set the minimum menu width, constrained to the viewport.
    default: '184'
  - name: items
    type: ContextMenuItem[]
    values: "ContextMenuItem[]"
    description: Menu item definitions.
    default: '[]'
  - name: v-model
    type: Boolean
    values: "true / false"
    description: Controls menu visibility.
    default: 'false'
  - name: disabled
    type: Boolean
    values: "true / false"
    description: Disable the context trigger.
    default: 'false'
EXPOSES:
  - name: show
    type: '(event: MouseEvent | KeyboardEvent, target?: HTMLElement) => Promise<boolean>'
    description: Open at the pointer or keyboard origin and resolve whether opening succeeded.
    default: null
  - name: close
    type: '(restoreFocus?: boolean) => void'
    description: Close and restore the origin by default when focus remains inside the menu.
    default: null
EVENTS:
  - name: select
    type: '(item: ContextMenuItem) => void'
    description: Emitted when an enabled item is selected.
  - name: open
    type: '(event: MouseEvent | KeyboardEvent) => void'
    description: Emitted with the event that opened the menu.
  - name: close
    type: '() => void'
    description: Emitted when the menu closes.
description: "Right-click context menu."
---

# Context Menu

<card>

## Default

Right-click or focus the trigger and press Shift + F10 / the context-menu key. Arrows and Home / End move focus, Enter / Space selects, Escape closes and restores focus, and Tab closes before continuing navigation. The shared floating layer shifts menus into the viewport and teleports them by default.

<template #example><context-menu-default /></template>

<template #template>

@[code{19-47}](../.vuepress/components/context-menu/default.vue)

</template>

<template #script>

@[code{1-17}](../.vuepress/components/context-menu/default.vue)

</template>

<template #style>

@[code{49-147}](../.vuepress/components/context-menu/default.vue)

</template>

</card>

<card>

## Nested menus

Nest trigger regions to provide different menus at different levels. The nearest enabled Context Menu handles a right-click, the context-menu key or Shift + F10; enclosing menus do not open for the same event. Right-click the exposed part of an enclosing region to open its own menu.

Disable the inner menu below to let the middle menu handle that area. Focus a region with Tab to try the keyboard shortcuts. Menu actions update the selection shown below.

<template #example><context-menu-nested /></template>

<template #template>

@[code{12-65}](../.vuepress/components/context-menu/nested.vue)

</template>

<template #script>

@[code{1-10}](../.vuepress/components/context-menu/nested.vue)

</template>

<template #style>

@[code{67-132}](../.vuepress/components/context-menu/nested.vue)

</template>

</card>
