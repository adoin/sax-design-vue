---
PROPS:
  - name: v-model
    type: String | Number
    values: MenuKey
    description: Currently selected menu key.
    default: undefined
  - name: options
    type: MenuOption[]
    values: Menu tree
    description: Items, groups, and dividers.
    default: '[]'
  - name: mode
    type: String
    values: vertical / horizontal
    description: Root menu direction.
    default: vertical
  - name: submenu-mode
    type: String
    values: inline / popup
    description: Inline expansion or cascading popups; inferred from mode and collapse by default.
    default: auto
  - name: trigger
    type: String
    values: hover / click
    description: Popup submenu trigger.
    default: auto
  - name: variant
    type: String
    values: soft / floating / plain
    description: Visual treatment.
    default: soft
  - name: v-model:open-keys
    type: MenuKey[]
    values: Open menu keys
    description: Controlled open branches.
    default: undefined
  - name: default-openeds
    type: MenuKey[]
    values: Initial menu keys
    description: Initially open branches in uncontrolled mode.
    default: '[]'
  - name: collapse
    type: Boolean
    values: true / false
    description: Collapse into an icon rail and open children as popups.
    default: false
  - name: unique-open
    type: Boolean
    values: true / false
    description: Keep one branch per level open.
    default: false
  - name: selectable-parents
    type: Boolean
    values: true / false
    description: Allow parent nodes to be selected.
    default: false
  - name: close-on-select
    type: Boolean
    values: true / false
    description: Close the popup chain after selection.
    default: true
  - name: teleported
    type: Boolean
    values: true / false
    description: Teleport the first popup level to the floating layer container.
    default: true
  - name: show-delay
    type: Number
    values: milliseconds
    description: Hover open delay.
    default: 120
  - name: hide-delay
    type: Number
    values: milliseconds
    description: Hover close delay.
    default: 180
  - name: popup-offset
    type: Number
    values: pixels
    description: Space between trigger and popup.
    default: 8
  - name: popup-class
    type: String
    values: class name
    description: Additional popup class.
    default: undefined
EVENTS:
  - name: update:modelValue / select
    description: Emitted when an item is selected.
  - name: update:openKeys / open / close
    description: Emitted when branch expansion changes.
description: 'A multi-level menu with inline, cascading popup, and horizontal navigation modes.'
---

# Menu

<card>

## Inline hierarchy

The admin-style sidebar keeps its collapse control in the footer, reduces to an icon rail, and automatically moves child menus into popups.

<template #example><menu-default /></template><template #template>

@[code](../.vuepress/components/menu/default.vue)

</template></card>

<card>

## Cascading popups

Choose hover or click triggers, independent second- and third-level positioning, and the `floating` style.

<template #example><menu-popup /></template><template #template>

@[code](../.vuepress/components/menu/popup.vue)

</template></card>

<card>

## Horizontal navigation

Horizontal menus use popups by default and support arrows, Enter, Space, and Escape.

<template #example><menu-horizontal /></template><template #template>

@[code](../.vuepress/components/menu/horizontal.vue)

</template></card>

<card>

## Data model

`MenuOption` supports `children`, `icon`, `description`, `badge`, `href`, and `disabled`; set `type` to `group` or `divider` for structural rows.

</card>
