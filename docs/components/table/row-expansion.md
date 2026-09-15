---
description: 'Table row expansion behavior, configuration, and runnable examples.'
---

# Row expansion guide

<card class="table-doc-section-start">

## Row expansion

Detail rows expand supporting content below a record and can be combined with asynchronous loading and virtual scrolling.

### Detail rows

Add a `type: 'expand'` column and use `#detail` for details, forms or nested tables. `v-model:detail-expanded-keys` uses stable row keys independently of tree `expanded-keys`. Focus the trigger with Tab and activate it with Enter or Space.

Without a controlled model, use `detailConfig.defaultExpandedKeys` for initial expansion and `expandableMethod` to restrict eligible rows. Keep form values in application state: slot components unmount when collapsed or outside the virtual window.

<template #example><table-details /></template>

<template #template>

@[code{35-68}](../../.vuepress/components/table/details.vue)

</template>

<template #script>

@[code{1-33}](../../.vuepress/components/table/details.vue)

</template>

<template #style>

@[code{70-88}](../../.vuepress/components/table/details.vue)

</template>

</card>

<card>

### Async details

Load details with `detailConfig.load`; the resolved result is passed to `#detail` as `data`. Customize progress and failures with `#detail-loading` and `#detail-error`, and call `reload()` to fetch again.

Collapsing, disabling details, replacing the data array or loader, and unmounting cancel affected requests and ignore stale results. Pass `signal` to your request client. Expanded records retain loaded data outside the virtual window; collapsing clears it, and replacing the data array reloads it.

<template #example><table-details-async /></template>

<template #template>

@[code{42-60}](../../.vuepress/components/table/details-async.vue)

</template>

<template #script>

@[code{1-40}](../../.vuepress/components/table/details-async.vue)

</template>

<template #style>

@[code{62-66}](../../.vuepress/components/table/details-async.vue)

</template>

</card>

<card>

### Details with virtual scrolling

Detail content expands its row automatically, and the table updates its layout when that content changes size or collapses. The panel stays within the visible table width while columns scroll horizontally.

Enable `detail-config` explicitly with a generated source and provide stable `rowKey` values. With **Asynchronous loading** off, `#detail` renders directly from the current row. Turn it on to load expanded rows through `detailConfig.load({ row, signal })`; collapsing a row or switching modes cancels unfinished requests. Switching modes preserves expanded keys and refreshes open content for the selected mode. This example generates one million rows and 100,000 columns on demand. `toggleRowDetail(index)` accepts a global source index; normal data uses the current visible index after sorting, filtering, pagination and tree expansion.

<template #example><table-details-source /></template>

<template #template>

@[code{61-105}](../../.vuepress/components/table/details-source.vue)

</template>

<template #script>

@[code{1-59}](../../.vuepress/components/table/details-source.vue)

</template>

<template #style>

@[code{107-122}](../../.vuepress/components/table/details-source.vue)

</template>

</card>
