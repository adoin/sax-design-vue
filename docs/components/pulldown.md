---
PROPS:
  - name: offset
    type: Number
    values: "pixels"
    description: Configure trigger spacing and body mounting.
    default: '12'
  - name: teleported
    type: Boolean
    values: "true | false"
    description: Configure trigger spacing and body mounting.
    default: 'true'
  - name: v-model
    type: Boolean
    values: "true / false"
    description: Controls dropdown visibility.
    default: 'false'
  - name: trigger
    type: String
    values: "click / hover / focus / contextmenu"
    description: Open trigger.
    default: click
  - name: placement
    type: String
    values: "Popper placement"
    description: Dropdown position.
    default: bottom-start
EVENTS:
  - name: show
    description: Visibility lifecycle events.
  - name: hide
    description: Visibility lifecycle events.
description: "Generic dropdown container."
---

# Pulldown

<card><template #example><pulldown-default /></template>

<template #template>

@[code{1-10}](../.vuepress/components/pulldown/default.vue)

</template>

<template #script>

@[code{11-13}](../.vuepress/components/pulldown/default.vue)

</template>

<template #style>

@[code{14-29}](../.vuepress/components/pulldown/default.vue)

</template>

</card>
