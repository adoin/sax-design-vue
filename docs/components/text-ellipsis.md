---
PROPS:
  - name: expand-text
    type: String
    values: "action labels"
    description: Override the action text shown while the text is collapsed.
    default: 'Read more'
    usage: '#default'
  - name: collapse-text
    type: String
    values: "action labels"
    description: Override the action text shown while the text is expanded.
    default: 'Read less'
    usage: '#default'
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

# Text Ellipsis

<card>

## Default

Set `line-clamp` and `expandable` to truncate long text. The expand action stays beside the final visible line and moves below the text only when the container is too narrow.

<template #example><text-ellipsis-default /></template>

<template #template>

@[code{9-16}](../.vuepress/components/text-ellipsis/default.vue)

</template>

<template #script>

@[code{1-7}](../.vuepress/components/text-ellipsis/default.vue)

</template>

</card>
