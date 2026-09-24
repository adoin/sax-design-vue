---
description: 'Tabs with overflow collapse, editable items, context menus, and borderless visual variants.'
PROPS:
  - name: v-model
    type: String | Number
    values: "s-tab name"
    description: Active tab value.
    default: '0'
  - name: model-value
    type: String | Number
    values: "or index when name is omitted"
    description: Active tab value.
    default: '0'
  - name: type
    type: String
    values: "line / pill / card / connected-card / editable-card"
    description: Navigation style. connected-card joins the active tab and its pane into one continuous surface; editable-card is the backward-compatible editable card preset.
    default: line
  - name: overflow
    type: String
    values: "collapse / scroll / wrap"
    description: Collapse, scroll, or wrap tabs when horizontal space runs out.
    default: collapse
  - name: alignment
    type: String
    values: "left / center / right / fixed"
    description: Tab alignment or equal-width layout.
    default: left
  - name: position
    type: String
    values: "top / bottom / left / right"
    description: Tab bar position.
    default: top
  - name: size
    type: String
    values: "small / default / large"
    description: Tab size.
    default: default
  - name: animated
    type: Boolean
    values: "true / false"
    description: Animate panel and navigation changes.
    default: 'true'
  - name: render-mode
    type: "'all' | 'lazy' | 'active-only'"
    values: "all | lazy | active-only"
    description: Mount all panes, retain visited panes, or keep only the active pane mounted.
    default: all
    usage: '#render-modes'
  - name: destroy-on-hide
    type: Boolean
    values: "true / false"
    description: Deprecated compatibility alias for render-mode="active-only". An explicit render-mode wins.
    default: 'false'
    usage: '#render-modes'
  - name: lazy
    type: Boolean
    values: "true / false"
    description: Deprecated compatibility alias for render-mode="lazy". An explicit render-mode wins.
    default: 'false'
    usage: '#render-modes'
  - name: editable
    type: Boolean
    values: "true / false"
    description: Show add and close controls independently from the selected visual type.
    default: 'false'
  - name: hide-add
    type: Boolean
    values: "true / false"
    description: Hide the add action when editing controls are enabled.
    default: 'false'
  - name: color
    type: String
    values: "theme color / RGB / HEX"
    description: Active color.
    default: primary
  - name: aria-label
    type: String
    values: "text"
    description: Accessible navigation name. Defaults to the component locale.
    default: Tabs
CHILD_PROPS:
  - name: name
    type: String | Number
    values: "unique value"
    description: Stable s-tab identity and v-model value.
    default: current index
  - name: label
    type: String
    values: "text"
    description: Tab title and overflow-menu fallback text.
    default: Label
  - name: icon
    type: String
    values: "icon name"
    description: Optional tab icon and badge.
    default: null
  - name: badge
    type: String | Number
    values: "badge content"
    description: Optional tab icon and badge.
    default: null
  - name: disabled
    type: Boolean
    values: "true"
    description: Disable a tab or allow closing it when editing controls are enabled.
    default: false
  - name: closable
    type: Boolean
    values: "false"
    description: Disable a tab or allow closing it when editing controls are enabled.
    default: true
  - name: render-mode
    type: "'all' | 'lazy' | 'active-only'"
    values: "all | lazy | active-only"
    description: Override the parent mounting policy for this pane.
    default: null
    usage: '#pane-override'
  - name: force-render
    type: Boolean
    values: "true / false"
    description: Deprecated compatibility alias for this pane's render-mode="all". An explicit pane render-mode wins.
    default: 'false'
    usage: '#pane-override'
EVENTS:
  - name: change
    description: Emits value and pane when the active tab changes.
  - name: tab-click
    description: Emits value, event, and pane when a tab is activated.
  - name: add
    description: Requests editable tab mutations; the parent still owns the array.
  - name: remove
    description: Requests editable tab mutations; the parent still owns the array.
  - name: edit
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
  - name: add-icon
    description: Replaces editable and overflow icons.
  - name: close-icon
    description: Replaces editable and overflow icons.
  - name: more-icon
    description: Replaces editable and overflow icons.
---

# Tabs

<card>

Tabs uses semantic `tablist / tab / tabpanel` roles with arrow, Home, and End keyboard navigation. Every visual mode uses spacing, surface depth, and shadow instead of visible borders.

Choose one `render-mode`: `all` mounts every pane immediately, `lazy` mounts visited panes and keeps them, and `active-only` unmounts a pane when it becomes inactive. Use `active-only` for expensive panes when retaining every visited subtree would consume too much memory; state that must survive belongs outside the pane.

The former `lazy`, `destroy-on-hide`, and `force-render` props remain compatibility aliases. Explicit `render-mode` wins; if both parent aliases are true, `destroy-on-hide` wins as before.

</card>

<card>

## Render modes

Switch modes and tabs to compare how many pane subtrees are mounted. `all` keeps every pane, `lazy` grows as panes are visited, and `active-only` keeps one pane at a time. The example disables animation so the mount count updates without a leaving pane's brief transition overlap.

<template #example><tabs-render-mode /></template>

<template #template>

@[code{36-57}](../.vuepress/components/tabs/render-mode.vue)

</template>

<template #script>

@[code{1-34}](../.vuepress/components/tabs/render-mode.vue)

</template>

<template #style>

@[code{59-71}](../.vuepress/components/tabs/render-mode.vue)

</template>

</card>

<card>

## Pane override

Set `render-mode` on one `s-tab` when its state should be retained while the parent uses `active-only` for other panes. The mounted count shows that the draft pane remains in the DOM while the active pane changes.

<template #example><tabs-pane-render-mode /></template>

<template #template>

@[code{23-42}](../.vuepress/components/tabs/pane-render-mode.vue)

</template>

<template #script>

@[code{1-21}](../.vuepress/components/tabs/pane-render-mode.vue)

</template>

<template #style>

@[code{44-56}](../.vuepress/components/tabs/pane-render-mode.vue)

</template>

</card>

<card>

## Style and layout

Switch line, pill, card, position, size, and panel motion in one example.

<template #example><tabs-default /></template>

<template #template>

@[code{116-177}](../.vuepress/components/tabs/default.vue)

</template>

<template #script>

@[code{1-114}](../.vuepress/components/tabs/default.vue)

</template>

<template #style>

@[code{179-277}](../.vuepress/components/tabs/default.vue)

</template>

</card>

<card>

## Overflow collapse

The default `overflow="collapse"` keeps the active tab visible and moves tabs that do not fit into a More popover. This example uses a narrow container to show the collapse behavior.

<template #example><tabs-overflow /></template>

<template #template>

@[code{50-67}](../.vuepress/components/tabs/overflow.vue)

</template>

<template #script>

@[code{1-48}](../.vuepress/components/tabs/overflow.vue)

</template>

<template #style>

@[code{69-88}](../.vuepress/components/tabs/overflow.vue)

</template>

</card>

<card>

## Add and remove

`editable` enables mutation requests for any visual type while application state remains the single source of truth. `editable-card` keeps its original editable card behavior for compatibility.

<template #example><tabs-editable /></template>

<template #template>

@[code{45-66}](../.vuepress/components/tabs/editable.vue)

</template>

<template #script>

@[code{1-43}](../.vuepress/components/tabs/editable.vue)

</template>

<template #style>

@[code{68-77}](../.vuepress/components/tabs/editable.vue)

</template>

</card>

<card>

## Context menu

Use the `s-tab` label slot with `SContextMenu` to add contextual actions to a tab label.

<template #example><tabs-context-menu /></template>

<template #template>

@[code{83-107}](../.vuepress/components/tabs/context-menu.vue)

</template>

<template #script>

@[code{1-81}](../.vuepress/components/tabs/context-menu.vue)

</template>

<template #style>

@[code{109-126}](../.vuepress/components/tabs/context-menu.vue)

</template>

</card>
