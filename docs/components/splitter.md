---
PROPS:
  - name: model-value/v-model
    type: SplitterModelValue
    values: recursive layout tree
    description: Direction and size tree for the complete split layout.
    default: "{ type: 'horizontal', size: ['rest', 'rest'] }"
  - name: min-size
    type: Number
    values: 0 - 1
    description: Default minimum ratio for every region.
    default: '0.08'
  - name: keyboard-step
    type: Number
    values: 0 - 1
    description: Arrow-key ratio step; follows precision when omitted.
    default: precision step
  - name: precision
    type: Number
    values: 0 - 8
    description: Decimal precision used to snap every resize.
    default: '2'
  - name: gap
    type: Number / String / [Size, Size]
    values: single / [rowGap, columnGap]
    description: Row and column layout space occupied by separator buttons.
    default: '12'
  - name: disabled
    type: Boolean
    values: true / false
    description: Disable resizing for the complete layout.
    default: 'false'
EVENTS:
  - name: update:modelValue
    description: Emits the complete updated layout tree while resizing.
  - name: change
    description: Emits the complete layout tree when resizing finishes.
SLOTS:
  - name: default
    description: Any number of recursively nested SplitterItem components.
description: 'Resizable layout with arbitrary regions, two directions, and recursive nesting.'
---

# Splitter

<card>

Supports any number of regions, two directions, and recursive nesting.

## Regions and nesting

Nest more items inside the matching `SplitterItem`.

<template #example><splitter-default /></template>

<template #template>

@[code{16-33}](../.vuepress/components/splitter/default.vue)

</template>

<template #script>

@[code{1-14}](../.vuepress/components/splitter/default.vue)

</template>

<template #style>

@[code{35-110}](../.vuepress/components/splitter/default.vue)

</template>

</card>

<card>

## Rest and precision

`use-rest` keeps the remaining space; `precision` snaps to `0.01` by default.

<template #example><splitter-sizing /></template>

<template #template>

@[code{10-30}](../.vuepress/components/splitter/sizing.vue)

</template>

<template #script>

@[code{1-8}](../.vuepress/components/splitter/sizing.vue)

</template>

<template #style>

@[code{32-110}](../.vuepress/components/splitter/sizing.vue)

</template>

</card>

<card>

## Gap

A single value controls both directions. Arrays use `[rowGap, columnGap]`; `0` consumes no space and remains draggable.

<template #example><splitter-gap /></template>

<template #template>

@[code{12-41}](../.vuepress/components/splitter/gap.vue)

</template>

<template #script>

@[code{1-10}](../.vuepress/components/splitter/gap.vue)

</template>

<template #style>

@[code{43-149}](../.vuepress/components/splitter/gap.vue)

</template>

</card>

<card>

## Data model

```ts
type SplitterSize = number | 'rest'

interface SplitterGroupValue {
  type: 'horizontal' | 'vertical'
  size: Array<SplitterSize | SplitterGroupValue>
  value?: SplitterSize
}
```

Mismatched item counts are evenly recalculated. Object entries represent nested groups.

## SplitterItem

| Prop       | Type      | Default              | Description                                                    |
| ---------- | --------- | -------------------- | -------------------------------------------------------------- |
| `min`      | `number`  | inherited `min-size` | Minimum ratio for this region                                  |
| `max`      | `number`  | `1`                  | Maximum ratio for this region                                  |
| `disabled` | `boolean` | `false`              | Disable the separator after this region                        |
| `use-rest` | `boolean` | `false`              | Permanently consume this level's remainder; only one per level |

Supports pointer, touch, arrow, `Home`, and `End` keys.

Splitter does not clip item content. Add `overflow: auto` to an inner container when scrolling is needed.

</card>
