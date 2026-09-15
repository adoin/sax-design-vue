---
description: 'Table sorting and filtering behavior, configuration, and runnable examples.'
---

# Sorting and filtering guide

<card class="table-doc-section-start">

## Sorting and filtering

Sorting changes row order and filtering changes the visible row set. Configure them locally, or enable their remote modes when the server owns data processing.

### Sorting and multiple fields

Set `sortable` on a column to show separate ascending (up) and descending (down) buttons. Click the active direction again to clear that column. `sort-config.multiple` preserves multi-column priority; priority numbers appear only when two or more columns are sorted and disappear when only one remains. `v-model:sort-by` controls the state. Source arrays are not mutated and null / undefined values remain last.

<template #example><table-sorting /></template>

<template #template>

@[code{24-44}](../../.vuepress/components/table/sorting.vue)

</template>

<template #script>

@[code{1-22}](../../.vuepress/components/table/sorting.vue)

</template>

<template #style>

@[code{46-58}](../../.vuepress/components/table/sorting.vue)

</template>

</card>

<card>

### Column sorting rules

Each column independently configures `sortMethod`: `'number'` compares numbers and numeric strings numerically; `'string'` uses lexical string comparison. Omit it to retain automatic natural sorting (for example, Task 2 before Task 10).

Functions receive `(a, b, rowA, rowB)`: the first two arguments are field values and the last two are the original rows. Return `true` / `1` when a should follow b in ascending order, or `false` / `0` otherwise. The table checks the reverse pair to distinguish "before" from a tie, so keep the function pure and consistent. Standard negative / zero / positive comparators such as `(a, b) => Number(a) - Number(b)` are also supported. Descending reverses the comparison; ties preserve input order or defer to the next sort field.

<template #example><table-sort-methods /></template>

<template #template>

@[code{31-42}](../../.vuepress/components/table/sort-methods.vue)

</template>

<template #script>

@[code{1-29}](../../.vuepress/components/table/sort-methods.vue)

</template>

<template #style>

@[code{44-52}](../../.vuepress/components/table/sort-methods.vue)

</template>

</card>

<card>

### Filters and custom filters

Column filters are combined with AND. Options within a column allow multiple values, or one value with `filter-multiple=false`. `filterRender` selects a global renderer for the panel; this example uses `$input` and `$radio`. A custom filter slot still has precedence when a unique layout is required. Changes are applied only on confirmation, and `filterMethod` owns matching.

<template #example><table-filtering /></template>

<template #template>

@[code{50-62}](../../.vuepress/components/table/filtering.vue)

</template>

<template #script>

@[code{1-48}](../../.vuepress/components/table/filtering.vue)

</template>

<template #style>

@[code{64-71}](../../.vuepress/components/table/filtering.vue)

</template>

</card>

<card>

### Remote sorting and filtering

Set `remote: true` separately in `sort-config`, `filter-config`, and `pager-config` to keep query and paging state without reprocessing the server's current-page data. Set the paginator's `total` from the server response. Request data on `page-change`, or watch the controlled page and page size as this example does. Reset the page to 1 in your application when a remote sort or filter changes.

A delayed function simulates server sorting, filtering, and pagination here; replace it with a request in production. New queries cancel pending work to avoid stale results. `virtualSource` is never fully enumerated for a query; local pagination reads only the current page's row indices.

<template #example><table-remote-query /></template>

<template #template>

@[code{68-80}](../../.vuepress/components/table/remote-query.vue)

</template>

<template #script>

@[code{1-66}](../../.vuepress/components/table/remote-query.vue)

</template>

</card>
