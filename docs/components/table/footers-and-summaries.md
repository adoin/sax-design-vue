---
description: 'Table footers and summaries behavior, configuration, and runnable examples.'
---

# Footers and summaries guide

<card class="table-doc-section-start">

## Footers and summaries

Footers present aggregate data or supporting content. These examples cover ordinary, nested, and virtual-column footers.

### Footer data rows

Use `footer-config.rows` to build one or more footer rows. Each row combines fixed cells in `values` with aggregate cells in `aggregates`. An aggregate uses `key` as the output column field and `field` as the source field. `method` accepts `count`, `sum`, `average`, `min`, `max`, or a custom function. Footer rows share column widths, fixed positions and horizontal scrolling with the body, including visibility and order changes from column settings. Set `footer-row-key` for stable row identities.

When a footer is configured inside `SaxGridSetting<Row>`, `Row` flows through `footerConfig.rows[].aggregates[].method` into `cells`. There is no need to declare `TableRow` or annotate the callback parameter manually:

```ts
import { computed } from 'vue'
import type { SaxGridSetting } from 'sax-design-vue'

interface OrderRow {
  amount: string
  state: 'ready' | 'cancelled'
}

const tableOptions = computed<SaxGridSetting<OrderRow>>(() => ({
  footerConfig: {
    rows: [
      {
        aggregates: [
          {
            key: 'amount',
            field: 'amount',
            method: (cells) =>
              cells.filter(({ row }) => row.state === 'ready').length,
          },
        ],
      },
    ],
  },
}))
```

Here `cells` is inferred as `readonly TableAggregateCell<OrderRow>[]`. It follows source order within the selected aggregate scope. `value` is read from `field`, or is `undefined` when no field is configured; `row` is the complete `OrderRow`; and `rowIndex` is its zero-based index in the aggregate input. For a standalone aggregate, import `TableAggregateFunction` from `sax-design-vue` and declare it as `TableAggregateFunction<OrderRow>`. The open `Recordable` fallback is used only when no `Row` generic is supplied.

Built-in numeric aggregates use decimal arithmetic. Exact decimal strings such as `'0.1'` remain exact through addition and averaging, and decimal aggregate results are returned as strings (`count` remains a number). Values already rounded by earlier JavaScript number calculations cannot be recovered, so monetary and other precision-sensitive source values should be supplied as decimal strings. Set `scope` to `data` (default), `filtered`, or `page` to select the rows being summarized. A custom function collects its cell array before running. For very large local data sets, use the advanced `{ initial, step, finish }` reducer form to retain constant auxiliary memory. Both custom forms own their precision strategy.

`footer-config` and `footer-data` differ only in where footer row values come from. Both use the same leaf columns and the same rendering precedence: a column-specific footer slot, the generic `footer-cell` slot, `column.footer`, a named local footer renderer, `footerFormatter`, then the raw field value. Use `footer-data` when the server supplies an aggregate, when the footer does not derive from locally available rows, or when every footer value is application-defined. A nonempty `footer-data` value takes precedence over `footer-config`; this is also the required path for `virtual-source`, whose complete logical dataset may not exist in local memory.

<template #example><table-footer-data /></template>

<template #template>

@[code{102-128}](../../.vuepress/components/table/footer-data.vue)

</template>

<template #script>

@[code{1-100}](../../.vuepress/components/table/footer-data.vue)

</template>

<template #style>

@[code{130-138}](../../.vuepress/components/table/footer-data.vue)

</template>

</card>

<card>

### Nested footers and the bottom slot

Nested `STableColumn` declarations support the same `footer-config` as configured columns; an aggregate `field` refers to a leaf-column field. Use `#footer` on one leaf column to customize its calculated footer cell; `#default` continues to render body cells. The table-level `#footer` slot is a bottom toolbar or note and can coexist with column-aligned footer rows.

<template #example><table-footer-declarations /></template>

<template #template>

@[code{23-55}](../../.vuepress/components/table/footer-declarations.vue)

</template>

<template #script>

@[code{1-21}](../../.vuepress/components/table/footer-declarations.vue)

</template>

</card>

<card>

### Virtual columns and footers

With horizontal virtualization enabled, footers stay synchronized with the body's visible columns, fixed columns, widths and scroll position, and adapt automatically when column layout, container size or footer data changes.

`virtual-source` may represent rows that do not exist in local memory, so this example supplies two explicit `footer-data` records identified by `id: 'total'` and `id: 'average'`. These IDs are ordinary row keys, independent of aggregate method names. Each generated leaf column uses its `footer` renderer to calculate or display that column's value without enumerating the source. Jump to the end, resize columns or switch to an empty body to try footer scrolling. Applications can pass server-generated records through the same path.

<template #example><table-footer-source /></template>

<template #template>

@[code{46-70}](../../.vuepress/components/table/footer-source.vue)

</template>

<template #script>

@[code{1-44}](../../.vuepress/components/table/footer-source.vue)

</template>

<template #style>

@[code{72-76}](../../.vuepress/components/table/footer-source.vue)

</template>

</card>
