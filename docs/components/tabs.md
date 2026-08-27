---
description: 'Tabs with overflow collapse, editable items, context menus, and borderless visual variants.'
PROPS:
  - name: v-model / model-value
    type: String | Number
    values: s-tab name, or index when name is omitted
    description: Active tab value.
    default: '0'
  - name: type
    type: String
    values: line / pill / card / connected-card / editable-card
    description: Navigation style. connected-card joins the active tab and its pane into one continuous surface; editable-card is the backward-compatible editable card preset.
    default: line
  - name: overflow
    type: String
    values: collapse / scroll / wrap
    description: Collapse, scroll, or wrap tabs when horizontal space runs out.
    default: collapse
  - name: alignment
    type: String
    values: left / center / right / fixed
    description: Tab alignment or equal-width layout.
    default: left
  - name: position
    type: String
    values: top / bottom / left / right
    description: Tab bar position.
    default: top
  - name: size
    type: String
    values: small / default / large
    description: Tab size.
    default: default
  - name: animated
    type: Boolean
    values: true / false
    description: Animate panel and navigation changes.
    default: 'true'
  - name: destroy-on-hide
    type: Boolean
    values: true / false
    description: Unmount hidden panel content.
    default: 'false'
  - name: lazy
    type: Boolean
    values: true / false
    description: Mount each panel on first activation, then keep visited panels mounted.
    default: 'false'
  - name: editable
    type: Boolean
    values: true / false
    description: Show add and close controls independently from the selected visual type.
    default: 'false'
  - name: hide-add
    type: Boolean
    values: true / false
    description: Hide the add action when editing controls are enabled.
    default: 'false'
  - name: color
    type: String
    values: theme color / RGB / HEX
    description: Active color.
    default: primary
  - name: aria-label
    type: String
    values: text
    description: Accessible navigation name. Defaults to the component locale.
    default: Tabs
CHILD_PROPS:
  - name: name
    type: String | Number
    values: unique value
    description: Stable s-tab identity and v-model value.
    default: current index
  - name: label
    type: String
    values: text
    description: Tab title and overflow-menu fallback text.
    default: Label
  - name: icon / badge
    type: String / String | Number
    values: icon name / badge content
    description: Optional tab icon and badge.
    default: —
  - name: disabled / closable
    type: Boolean
    values: true / false
    description: Disable a tab or allow closing it when editing controls are enabled.
    default: false / true
  - name: force-render
    type: Boolean
    values: true / false
    description: Keep this panel mounted when destroy-on-hide is enabled.
    default: 'false'
EVENTS:
  - name: change
    description: Emits value and pane when the active tab changes.
  - name: tab-click
    description: Emits value, event, and pane when a tab is activated.
  - name: add / remove / edit
    description: Requests editable tab mutations; the parent still owns the array.
  - name: tab-contextmenu
    description: Emits value, event, and pane for a tab context-menu event.
SLOTS:
  - name: label
    description: Customizes every label with pane, active, and value.
  - name: s-tab#label
    description: Customizes one label and can compose ContextMenu.
  - name: extra
    description: Trailing tab-bar actions.
  - name: add-icon / close-icon / more-icon
    description: Replaces editable and overflow icons.
---

# Tabs

<card>

Tabs uses semantic `tablist / tab / tabpanel` roles with arrow, Home, and End keyboard navigation. Every visual mode uses spacing, surface depth, and shadow instead of visible borders.

`lazy` mounts a panel on first activation and keeps it for later switches; `destroy-on-hide` continuously unmounts inactive panels.

</card>

<card>

## Lazy mounting

Add `lazy` when panel content is expensive. Only the active panel mounts initially; each visited panel mounts once and remains available for later switches.

<template #example><tabs-lazy /></template>

<template #template>

@[code](../.vuepress/components/tabs/lazy.vue)

</template>

</card>

<card>

## Style and layout

Switch line, pill, card, position, size, and panel motion in one example.

<template #example><tabs-default /></template>

<template #template>

@[code](../.vuepress/components/tabs/default.vue)

</template>

</card>

<card>

## Overflow collapse

The default `overflow="collapse"` keeps the active tab visible and moves remaining tabs into a More popover.

<template #example><tabs-overflow /></template>

<template #template>

@[code](../.vuepress/components/tabs/overflow.vue)

</template>

</card>

<card>

## Add and remove

`editable` enables mutation requests for any visual type while application state remains the single source of truth. `editable-card` keeps its original editable card behavior for compatibility.

<template #example><tabs-editable /></template>

<template #template>

@[code](../.vuepress/components/tabs/editable.vue)

</template>

</card>

<card>

## Context menu

Compose the `s-tab` label slot with the repository's existing `SContextMenu` instead of duplicating menu behavior inside Tabs.

<template #example><tabs-context-menu /></template>

<template #template>

@[code](../.vuepress/components/tabs/context-menu.vue)

</template>

</card>
