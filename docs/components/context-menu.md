---
PROPS:
  - name: min-width
    type: Number | String
    values: "CSS length"
    description: Set the minimum menu width.
    default: '160'
  - name: items
    type: Array
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
EVENTS:
  - name: select
    description: Item selection and visibility events.
  - name: open
    description: Item selection and visibility events.
  - name: close
    description: Item selection and visibility events.
description: "Right-click context menu."
---

# Context menu

<card><template #example><context-menu-default /></template>

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
