---
description: 'Table large data and visualization behavior, configuration, and runnable examples.'
---

# Large data and visualization guide

<card class="table-doc-section-start">

## Large data and visualization

Virtual rendering and indexed sources solve different costs. `virtual-config` limits mounted DOM nodes; `virtualSource` additionally lets Table operate without receiving complete row and column arrays. Configure those foundations first, then extract table data for charts when needed.

### Virtual rows and dynamic heights

Enable virtualization with `virtual-config` and set `height` to define the row viewport. A number uses pixels and a CSS length is forwarded as written. Set `height: 'auto'` to let the body consume the space left after the query area, toolbar, header, wrapping footer rows, footer slot and pagination. The table's parent must provide a definite height, either as a sized block or as a shrinkable flex/grid item; otherwise there is no bounded remainder to distribute. Footer wrapping and external size changes automatically update the body's remaining height. With `dynamic`, row height adapts to content; `horizontal` enables column virtualization and `columnOverscan` controls extra columns rendered on each side. Set `fixed="left"` or `fixed="right"` on a column to keep it at that edge.

Passing one million objects through `data` still keeps those objects in application memory even though only a small DOM window is mounted. With `virtualSource`, `rowCount` and `columnCount` describe the logical size without allocating rows or columns. Table asks `row(index)` and `column(index)` only for the current window. The callbacks may compute an object or read an existing indexed store; Table itself does not retain an array for the complete logical dataset.

`1_000_000` is JavaScript numeric-separator syntax and has exactly the same numeric value as `1000000`. The underscores only make a number literal easier to read; they do not create an array, reserve memory, or enable virtualization. The count becomes meaningful only because `virtualSource` pairs it with the index callbacks.

The first table below demonstrates DOM virtualization with a normal `data` array. The “Massive logical data” area uses `virtualSource` to demonstrate a large logical row and column space without creating complete arrays.

Supply a stable, unique `row-key` when rows can be reordered, updated or expanded as a tree. During horizontal scrolling, the table stabilizes heights for content that has already been displayed, reducing vertical movement as the column window changes. Column layout, container size and data-source changes automatically adapt row heights to the new content.

<template #example><table-virtual /></template>

<template #template>

@[code{157-226}](../../.vuepress/components/table/virtual.vue)

</template>

<template #script>

@[code{1-155}](../../.vuepress/components/table/virtual.vue)

</template>

<template #style>

@[code{228-305}](../../.vuepress/components/table/virtual.vue)

</template>

</card>

<card>

### Chart integration

Enable `chart-config` to extract immutable snapshots with `getChartData(options)`. Add an `adapter` to open the panel with `openChart(options)`. The optional `createTableSvgChartAdapter()` export provides bar and line charts without introducing a chart engine into ordinary tables. The panel offers a data table, chart-type controls and a close button, with Tab focus containment and Escape closing.

`scope: 'selection'` uses the current cell range or explicit `bounds`; mapped columns must be inside that range, and numeric values in complete merged regions are counted once. `filtered` reads supplied, filtered and expanded tree rows before local pagination. It never fetches remote pages or unloaded children. `aggregate` consumes existing `group-config` statistics: root groups by default, explicit nested `groupKeys`, or the overall summary with `aggregate: 'summary'`. Statistics retain the grouping configuration's scope rather than recomputing other pages.

<template #example><table-chart /></template>

<template #template>

@[code{62-92}](../../.vuepress/components/table/chart.vue)

</template>

<template #script>

@[code{1-61}](../../.vuepress/components/table/chart.vue)

</template>

<template #style>

@[code{93-107}](../../.vuepress/components/table/chart.vue)

</template>

</card>

<card>

### Large-source charts

Extraction defaults to 1000 points, 32 series, 10000 cells and 2000000 metadata/category characters. Each point's category and all series count toward the cell budget. Exceeding a budget returns `reason: 'limit'` with an incomplete snapshot; `openChart` never displays a truncated chart. Narrow the scope or explicitly adjust the budget before retrying. `cancelChart()` and `AbortSignal` cancel extraction; snapshots and conversions of complex objects still have separate memory costs.

This example uses one million generated rows and 100000 columns. The last-range chart reads only five rows and two columns spanning the center and right-fixed region. For generated sources, `filtered` means all logical rows supplied by the adapter, not a new remote query; update the source after remote filtering. Aggregate charts consume supplied remote statistics without enumerating group members.

<template #example><table-chart-source /></template>

<template #template>

@[code{97-132}](../../.vuepress/components/table/chart-source.vue)

</template>

<template #script>

@[code{1-96}](../../.vuepress/components/table/chart-source.vue)

</template>

<template #style>

@[code{133-147}](../../.vuepress/components/table/chart-source.vue)

</template>

</card>
