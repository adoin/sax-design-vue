---
description: 'Table data and column definitions behavior, configuration, and runnable examples.'
---

# Data and column definitions guide

<card class="table-doc-section-start">

## Data and column definitions

Start with row data, column definitions, and content rendering. This section covers configured and nested columns together with overflow, loading, and empty states.

### Configuration object

Pass rows through `data` and define each column's field, title and display options through `columns`. You can also collect table props in an object and pass them together with `v-bind`.

Type that object as `SaxGridSetting<Row, QueryForm>`. `Row` flows into column fields, cell and edit callbacks, renderers, tree and group functions, aggregates, slots, events, proxy results, and exposed Table methods. Field names accept valid keys and nested paths through two object levels from `Row`. The optional second generic flows through the query model, Form items, query and toolbar contexts, and proxy requests. Omit either generic to use the open `Recordable` fallback; ordinary generated interfaces do not need an index signature.

`width` sets a fixed column width. Columns without it start from `minWidth` (120px by default) and share the remaining space equally. When the container is too narrow, scroll horizontally to see the remaining columns.

`align` is the shared left/center/right default for a header and its cells. Column `align` still covers both surfaces; `headerAlign` on the column or table overrides the header only. Undeclared values inherit `SConfigProvider.table.align` / `table.headerAlign`, then left.

<template #example><table-default /></template>

<template #template>

@[code{57-59}](../../.vuepress/components/table/default.vue)

</template>

<template #script>

@[code{1-55}](../../.vuepress/components/table/default.vue)

</template>

</card>

<card>

### Nested columns

When template-level column declaration reads better, use `s-table-column`. A column can own its scoped cell slot while rows still come from `data`.

Give columns rendered with `v-for` stable keys. Changing their order updates headers and cells together; removing a custom cell slot restores the column renderer or raw value.

<template #example><table-columns /></template>

<template #template>

@[code{24-48}](../../.vuepress/components/table/columns.vue)

</template>

<template #script>

@[code{1-22}](../../.vuepress/components/table/columns.vue)

</template>

<template #style>

@[code{50-57}](../../.vuepress/components/table/columns.vue)

</template>

</card>

<card>

### Default renderers

Set `columns[].renderer` to a registered name or a `{ name, props, options, events }` configuration. In a body cell, Table calls that renderer's `renderDefault`. This example uses the built-in `$input` display and `$buttons` actions; clicking Inspect reports the row supplied to the action handler. The same registry entry can supply `renderEdit` when the column also enables `editor`.

<template #example><table-default-renderers /></template>

<template #template>

@[code{42-47}](../../.vuepress/components/table/default-renderers.vue)

</template>

<template #script>

@[code{1-40}](../../.vuepress/components/table/default-renderers.vue)

</template>

<template #style>

@[code{49-58}](../../.vuepress/components/table/default-renderers.vue)

</template>

</card>

<card>

### Slots and renderers

In configured columns, `slots.default` accepts either a named slot string or a direct cell render function. Table does not derive implicit `cell-*`, `header-*`, `edit-*`, or `footer-*` names from field values. For a column-specific template, map an application-owned unique name through `columns[].slots`, or use a local slot inside `STableColumn`. Reusable behavior comes from the shared global [`renderer` registry](../renderer.md); the dedicated guide covers registration, callback contracts, and built-in names. See the [edit renderer](./editing-validation-and-changes.md#edit-renderers) and [toolbar renderer](./query-forms-and-request-proxy.md#toolbar-renderers) examples; query items use [Form's renderer configuration](../form.md#schema-renderers-and-nested-layout).

The cell function receives `TableCellRenderParams`, including `row`, `column`, `value`, `index`, and `rowIndex`; switch the code sample to TSX to see the JSX form. Rendering precedence is: an explicitly mapped default slot, the generic cell slot, an inline or local renderer, a global renderer, then the raw field value.

<template #example><table-rendering /></template>

<template #template>

@[code{67-84}](../../.vuepress/components/table/rendering.vue)

</template>

<template #script>

@[code{1-65}](../../.vuepress/components/table/rendering.vue)

</template>

<template #style>

@[code{86-105}](../../.vuepress/components/table/rendering.vue)

</template>

<template #script-tsx>

@[code{1-64}](../../.vuepress/example-sources/table/rendering-tsx.vue)

</template>

</card>

<card>

### Text overflow and tooltips

`show-overflow` supports wrapping (false), ellipsis, native title, or a floating tooltip (tooltip / true). A tooltip appears only for clipped content, on hover or keyboard focus. Headers use `show-header-overflow`; column settings override table settings.

<template #example><table-overflow /></template>

<template #template>

@[code{34-55}](../../.vuepress/components/table/overflow.vue)

</template>

<template #script>

@[code{1-32}](../../.vuepress/components/table/overflow.vue)

</template>

<template #style>

@[code{57-67}](../../.vuepress/components/table/overflow.vue)

</template>

</card>

<card>

### Loading, empty states and table slots

Use the `header`, `footer` and `empty` slots to customize content around the table. `loading` displays a loading state, `show-header` controls header visibility and `row-class` customizes row styling. Column `field` values support nested paths.

<template #example><table-states /></template>

<template #template>

@[code{20-52}](../../.vuepress/components/table/states.vue)

</template>

<template #script>

@[code{1-18}](../../.vuepress/components/table/states.vue)

</template>

<template #style>

@[code{54-82}](../../.vuepress/components/table/states.vue)

</template>

</card>
