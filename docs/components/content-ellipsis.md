---
description: 'Collapse overflowing slot content to a measured height.'
PROPS:
  - name: collapsed-height
    type: number | string
    values: 'pixel number or CSS length such as 10rem'
    description: Maximum visible height while collapsed. Percentage heights require a sized parent.
    default: 160
    usage: '#default'
  - name: v-model:expanded
    type: Boolean
    values: 'true | false'
    description: Control the expanded state; the component also works without v-model.
    default: false
    usage: '#default'
  - name: fade
    type: Boolean
    values: 'true | false'
    description: Fade the lower edge of clipped content.
    default: true
    usage: '#default'
  - name: expand-text
    type: String
    values: 'action label'
    description: Override the label shown while content is collapsed.
    default: 'Show more'
    usage: '#default'
  - name: collapse-text
    type: String
    values: 'action label'
    description: Override the label shown while content is expanded.
    default: 'Show less'
    usage: '#default'
EVENTS:
  - name: update:expanded
    type: Boolean
    values: 'true | false'
    description: Emitted when the expanded state changes.
    default: null
    usage: '#default'
  - name: change
    type: Boolean
    values: 'true | false'
    description: Emitted after the expand action changes state.
    default: null
    usage: '#default'
SLOTS:
  - name: default
    type: VNode[]
    values: 'any Vue content'
    description: Content to measure, clip, and reveal without unmounting it.
    default: null
    usage: '#default'
---

# Content Ellipsis

<card>

## Default

Use Content Ellipsis for structured content such as headings, tags, lists, or controls. For plain text that should end with an inline action, use [Text Ellipsis](./text-ellipsis.md).

`collapsed-height` limits the initial visible area. The action appears only when the slot is taller than that limit; changes to the slot or its width are measured automatically. Hidden controls reveal the full content when reached by keyboard focus.

<template #example><content-ellipsis-default /></template>

<template #template>

@[code{7-25}](../.vuepress/components/content-ellipsis/default.vue)

</template>

<template #script>

@[code{1-5}](../.vuepress/components/content-ellipsis/default.vue)

</template>

<template #style>

@[code{27-48}](../.vuepress/components/content-ellipsis/default.vue)

</template>

</card>
