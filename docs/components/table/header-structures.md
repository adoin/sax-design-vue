---
description: 'Table header structures behavior, configuration, and runnable examples.'
---

# Header structures guide

<card class="table-doc-section-start">

## Header structures

Grouped headers describe relationships between columns. Use configuration objects for ordinary tables, including tables whose rows and column schema come from an API. Use nested `STableColumn` declarations when the hierarchy should remain visible in the template. The final example only extends grouped headers to extremely wide tables that already use `virtualSource`.

### Grouped headers

Nest columns with `children`. Group titles span adjacent visible leaves, while shallower leaf headers span multiple rows. Configure sorting, filtering and resizing on leaf columns. A group's `fixed` value is inherited; set a child to `fixed: false` to leave it unfixed. Give group columns stable `key` values when structural changes must persist.

Column settings present the complete column tree. Dropping in the middle of a group reparents the dragged node; dropping at a row edge places it before or after that sibling. Dragging a group moves its complete subtree, and cyclic drops are rejected. Fixing one leaf promotes it to an independent row-spanning header instead of copying ancestor titles into the fixed partition; fixing a group preserves its complete header structure. Clear `column-state` to restore the declared tree.

<template #example><table-grouped-headers /></template>

<template #template>

@[code{58-84}](../../.vuepress/components/table/grouped-headers.vue)

</template>

<template #script>

@[code{1-56}](../../.vuepress/components/table/grouped-headers.vue)

</template>

<template #style>

@[code{86-90}](../../.vuepress/components/table/grouped-headers.vue)

</template>

</card>

<card>

### Nested grouped headers

Nest column declarations in an `STableColumn` `#columns` slot. Group headers use `title` by default; provide `#header` only when overriding that content. Keep `#default` for leaf cell content. You can also pass a `children` array.

<template #example><table-grouped-declarations /></template>

<template #template>

@[code{8-32}](../../.vuepress/components/table/grouped-declarations.vue)

</template>

<template #script>

@[code{1-6}](../../.vuepress/components/table/grouped-declarations.vue)

</template>

</card>

<card>

### Virtual grouped headers

When columns already come from `virtualSource`, use `headerPath(index)` to return the group path for each leaf, ordered from the outer group to the inner group. Adjacent leaves with the same stable group `key` share one header cell, while `title` supplies the displayed label. Set `headerDepth` to the maximum number of header rows, including the leaf row, so the header height remains stable as the horizontal window changes.

<template #example><table-grouped-source /></template>

<template #template>

@[code{37-58}](../../.vuepress/components/table/grouped-source.vue)

</template>

<template #script>

@[code{1-35}](../../.vuepress/components/table/grouped-source.vue)

</template>

<template #style>

@[code{60-64}](../../.vuepress/components/table/grouped-source.vue)

</template>

</card>
