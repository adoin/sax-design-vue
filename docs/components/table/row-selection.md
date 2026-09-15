---
description: 'Table row selection behavior, configuration, and runnable examples.'
---

# Row selection guide

<card class="table-doc-section-start">

## Row selection

Choose the selection model by interaction: a radio column for one row, a checkbox column for multiple rows, or row highlighting when no selection control is needed.

### Single selection

Add a `type="radio"` column and bind `v-model:highlight` to one row. `selection-config.selectableMethod` can prevent individual rows from being selected; the radio control is the default trigger.

<template #example><table-selection-single /></template>

<template #template>

@[code{30-41}](../../.vuepress/components/table/selection-single.vue)

</template>

<template #script>

@[code{1-28}](../../.vuepress/components/table/selection-single.vue)

</template>

<template #style>

@[code{43-50}](../../.vuepress/components/table/selection-single.vue)

</template>

</card>

<card>

### Multiple selection

Add a `type="checkbox"` column and bind `v-model:highlight` to an array. Select-all covers eligible filtered, expanded rows on the current page, not just the virtual window. `selectableMethod` disables rows and `reserve` retains selections from other pages when `row-key` is stable and unique.

The built-in paginator accepts the complete data array through `v-model:pager-config`. Local sorting and filtering run before pagination; trees paginate root nodes with their expanded descendants kept together.

<template #example><table-selection-multiple /></template>

<template #template>

@[code{28-50}](../../.vuepress/components/table/selection-multiple.vue)

</template>

<template #script>

@[code{1-26}](../../.vuepress/components/table/selection-multiple.vue)

</template>

<template #style>

@[code{52-65}](../../.vuepress/components/table/selection-multiple.vue)

</template>

</card>

<card>

### Highlight selection

Bind `v-model:highlight` without a radio or checkbox column when clicking a row should only highlight the current record. Add `multiple` when the highlighted model should be an array.

<template #example><table-selection-highlight /></template>

<template #template>

@[code{24-35}](../../.vuepress/components/table/selection-highlight.vue)

</template>

<template #script>

@[code{1-22}](../../.vuepress/components/table/selection-highlight.vue)

</template>

</card>
