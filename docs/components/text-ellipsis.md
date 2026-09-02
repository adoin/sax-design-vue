---
PROPS:
  - name: expand-text
    type: String
    values: "action labels"
    description: Customize labels used to expand and collapse content.
    default: 'Expand'
  - name: collapse-text
    type: String
    values: "action labels"
    description: Customize labels used to expand and collapse content.
    default: 'Collapse'
  - name: content
    type: String
    values: "text"
    description: Text to truncate when no default slot is supplied.
    default: "''"
  - name: line-clamp
    type: Number
    values: "lines"
    description: Number of visible lines when collapsed.
    default: '1'
  - name: expandable
    type: Boolean
    values: "true / false"
    description: Show expand and collapse action.
    default: 'false'
description: 'Expandable text ellipsis.'
EVENTS:
  - name: update:expanded
    type: Boolean
    description: Fire when the expanded state changes.
  - name: change
    type: Boolean
    description: Fire when the expanded state changes.
---

# Text ellipsis

<card><template #example><text-ellipsis-default /></template>

<template #template>

@[code{1-8}](../.vuepress/components/text-ellipsis/default.vue)

</template>

<template #script>

@[code{9-14}](../.vuepress/components/text-ellipsis/default.vue)

</template>

</card>
