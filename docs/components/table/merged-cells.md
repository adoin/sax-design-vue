---
description: 'Table merged cells behavior, configuration, and runnable examples.'
---

# Merged cells guide

<card class="table-doc-section-start">

## Merged cells

Merged regions work with ordinary data, editing and detail rows, and virtual windows.

### Merging cells

Use `merge-config.body` and `merge-config.footer` for body and footer ranges. Each range has zero-based `row` and `col` positions, plus positive `rowspan` and `colspan` values. A merged region displays its starting cell, retaining that column's slots, formatting and interactions.

For ordinary data, `row` refers to the current displayed rows after sorting, filtering, pagination and tree expansion; footer rows refer to the resolved rows from `footer-config` or `footer-data`. `col` follows visible fixed-left, center and fixed-right column order. Static ranges follow positions, so a query, page or column-order change applies them to the cells at the new positions. Recalculate ranges when grouping by content.

<template #example><table-merging /></template>

<template #template>

@[code{40-52}](../../.vuepress/components/table/merging.vue)

</template>

<template #script>

@[code{1-38}](../../.vuepress/components/table/merging.vue)

</template>

<template #style>

@[code{54-61}](../../.vuepress/components/table/merging.vue)

</template>

</card>

<card>

### Editing and details in merged rows

Double-click a team or project cell to edit, then save the update or cancel the draft. Editing a merged team changes only its origin row, leaving covered rows unchanged. Expand a project with the first column: merged regions split around its details, while the detail input remains independent. Toggle virtual rows and drag a header boundary to adjust column widths.

<template #example><table-merging-edit /></template>

<template #template>

@[code{61-101}](../../.vuepress/components/table/merging-edit.vue)

</template>

<template #script>

@[code{1-59}](../../.vuepress/components/table/merging-edit.vue)

</template>

<template #style>

@[code{103-122}](../../.vuepress/components/table/merging-edit.vue)

</template>

</card>

<card>

### Virtual merged regions

For generated data, merge row positions are absolute source indices, including when pagination is enabled. A synchronous `body` or `footer` function receives a half-open window (`rowStart`, `rowEnd`, `colStart`, `colEnd`), the area, counts, and `rowAt` / `columnAt` accessors. Return complete ranges that intersect that window, including ranges whose origins precede it. The function may run separately for fixed and center columns, or for a programmatically requested cell; keep it deterministic and free of side effects. A thrown rule returns no merged ranges for that query.

The example groups four rows and eight columns per region over generated data. Use **Last region** to locate a covered cell at the end of both axes; the active address resolves to its region's origin. Enable multiline content to see the merged region adapt automatically to content and column-layout changes. Editing and cell interactions use the original region owner's row and column.

<template #example><table-merging-source /></template>

<template #template>

@[code{46-84}](../../.vuepress/components/table/merging-source.vue)

</template>

<template #script>

@[code{1-44}](../../.vuepress/components/table/merging-source.vue)

</template>

<template #style>

@[code{86-101}](../../.vuepress/components/table/merging-source.vue)

</template>

</card>
