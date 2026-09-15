---
description: 'Table trees and groups behavior, configuration, and runnable examples.'
---

# Trees and groups guide

<card class="table-doc-section-start">

## Trees and groups

Tree data and row groups both express hierarchy between records. The examples progress from tree queries and lazy loading to local, remote, and virtual grouping.

### Tree sorting and filtering

Tree sorting reorders siblings without detaching children. Filtering retains matches and their ancestors, temporarily expanding matching paths. Clearing filters restores the previous expansion state. Only loaded lazy nodes are searched; filtering never starts a load request.

<template #example><table-tree-query /></template>

<template #template>

@[code{37-59}](../../.vuepress/components/table/tree-query.vue)

</template>

<template #script>

@[code{1-35}](../../.vuepress/components/table/tree-query.vue)

</template>

<template #style>

@[code{61-71}](../../.vuepress/components/table/tree-query.vue)

</template>

</card>

<card>

### Tree table and lazy loading

Tree data remains part of `s-table`. Mark one configured column with `treeNode`, then provide children or a lazy loader through `tree-config`. Set `line: true` to show continuous parent-child guides that follow expansion state. Expanding `components` in this example waits 800ms before returning its children so the loading state and asynchronous insertion remain visible.

<template #example><table-tree /></template>

<template #template>

@[code{1-28}](../../.vuepress/components/table/tree.vue)

</template>

<template #script>

@[code{30-102}](../../.vuepress/components/table/tree.vue)

</template>

<template #style>

@[code{104-127}](../../.vuepress/components/table/tree.vue)

</template>

</card>

<card>

### Row grouping and aggregation

Use `group-config.fields` for nested field grouping. Groups are built after sorting, filtering and pagination. A tree root and its currently expanded descendants remain in one branch. Headings and subtotals are separate from selectable/editable data rows. Double-click Hours to edit; accepted updates recalculate aggregates.

Each subtotal includes all supplied members of that group, independent of collapse state. The overall `summaryScope` defaults to `page`; `filtered` includes supplied visible tree rows matching the filter across local pages. It does not load collapsed or lazy descendants. With remote pagination, unavailable pages are outside the local aggregation scope.

<template #example><table-grouping /></template>

<template #template>

@[code{111-151}](../../.vuepress/components/table/grouping.vue)

</template>

<template #script>

@[code{1-109}](../../.vuepress/components/table/grouping.vue)

</template>

<template #style>

@[code{153-165}](../../.vuepress/components/table/grouping.vue)

</template>

</card>

<card>

### Requesting grouped pages

The simulated service returns page data, page-relative group ranges and an overall summary. The application owns requests, cancellation and result state, then passes each accepted server result to `remote`. Group metadata follows the accepted page, so stale, cancelled or failed responses do not replace the displayed groups or totals.

With a real endpoint, return contiguous group members and `TableGroupRemoteResult` from the service. Subtotals cover supplied page members; the service defines the overall summary scope. Here it includes hours from all 24 records.

<template #example><table-grouping-remote /></template>

<template #template>

@[code{85-115}](../../.vuepress/components/table/grouping-remote.vue)

</template>

<template #script>

@[code{1-83}](../../.vuepress/components/table/grouping-remote.vue)

</template>

</card>

<card>

### Remote groups and virtual rows

Generated sources use `mode: remote`. The application supplies `remote.groups` with starts, counts, children and aggregates, plus `remote.summary`. The application owns fetching, cancellation and result state, then passes the current server result to `remote`. The table does not scan generated rows to infer groups. Remote ranges use page data indices for ordinary arrays and absolute source indices for generated sources. Sibling ranges must be ordered, disjoint and inside their parent; uncovered rows remain visible.

This example provides formula-based metadata for one million rows and one hundred thousand columns. While scrolling through group members, a temporary bar below the header shows the current parent. `parent-indicator.enabled` controls the feature, and `hideDelay` controls its 1000ms default post-scroll delay. The `parent-indicator` slot keeps the fixed return icon, customizes the remaining content, and exposes `jump` for returning to the parent row. Open last batch updates expansion before locating the final cell. Collapsed members have no visible data address; expand their group before programmatic navigation. Group headings, subtotals and data share a virtual window, with range metadata proportional to group count. Local grouping/aggregation processes supplied rows synchronously, so computation and storage grow with rows and group depth; use server aggregation for large global datasets.

<template #example><table-grouping-source /></template>

<template #template>

@[code{52-85}](../../.vuepress/components/table/grouping-source.vue)

</template>

<template #script>

@[code{1-50}](../../.vuepress/components/table/grouping-source.vue)

</template>

<template #style>

@[code{87-109}](../../.vuepress/components/table/grouping-source.vue)

</template>

</card>
