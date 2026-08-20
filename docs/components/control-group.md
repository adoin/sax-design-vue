---
description: 'Join related form controls into one continuous field.'
lastUpdated: false
PROPS:
  - name: block
    type: Boolean
    values: true | false
    description: Make the group fill its container and share the available width.
    default: false
CHILD_PROPS:
  - name: span
    type: Number
    values: 1–24
    description: Set it on a direct child to define its share of the 24-column grid. Children without it evenly divide <code>24 - the sum of declared spans</code>.
    default: auto
SLOTS:
  - name: default
    type: Slot
    values: Input, Select, Cascader, DatePicker, TimePicker, or compatible form controls
    description: Controls rendered in their original order without gaps.
    default: null
---

# Control Group

Control Group joins related controls into a continuous field while each child keeps its own value, events, validation, and popup behavior. It uses a 24-column grid: direct children can declare `span`, while children without it evenly share the remaining space.

<card>

## Select and input

Place a Select and Input next to each other when users need to choose a prefix before entering a value. The Select below uses `span="8"`, so the unset Input automatically receives the remaining 16 columns.

<template #example><control-group-basic /></template>

<template #template>

@[code{1-39}](../.vuepress/components/control-group/basic.vue)

</template>

</card>

<card>

## Multiple controls and spans

Select, Input, Cascader, Date Picker, and Time Picker can share connected rows. The first row declares spans of 4, 4, 7, and 4, so the unset Input receives the remaining 5 columns; the second row demonstrates a connected date, time, and regular input.

<template #example><control-group-spans /></template>

<template #template>

@[code](../.vuepress/components/control-group/spans.vue)

</template>

</card>

<card>

## Full width

Use `block` when the continuous field should fill its container.

<template #example><control-group-block /></template>

<template #template>

@[code{1-40}](../.vuepress/components/control-group/block.vue)

</template>

</card>

## API
