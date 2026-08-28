---
PROPS:
  - name: show-close / teleported
    type: Boolean
    values: true | false
    description: Control close-button visibility and whether the drawer mounts to body.
    default: 'true / true'
  - name: model-value/v-model
    type: Boolean
    values: true | false
    description: Drawer visibility.
    default: false
  - name: placement
    type: String
    values: left | right | top | bottom
    description: Drawer edge.
    default: right
  - name: size
    type: String | Number
    values: CSS size
    description: Drawer width or height.
    default: 360px
  - name: mask-closable
    type: Boolean
    values: true | false
    description: Allows backdrop closing.
    default: true
description: 'Directional drawer.'
EVENTS:
  - name: update:modelValue
    type: Boolean
    description: Fires when the drawer visibility changes.
  - name: open / close
    description: Fire after the drawer is opened or closed.
---

# Drawer

<card><template #example><drawer-default /></template>

<template #template>

@[code{1-9}](../.vuepress/components/drawer/default.vue)

</template>

<template #script>

@[code{10-13}](../.vuepress/components/drawer/default.vue)

</template>

</card>
