---
description: "Compose a query form, toolbar, pagination and data table."
PROPS:
  - name: "query-config"
    type: "Boolean | TableGridQueryConfig"
    description: "Query form configuration, including SForm model, items, rules and layout."
    default: false
    usage: "#query-and-toolbar"
  - name: "toolbar-config"
    type: "Boolean | TableGridToolbarConfig"
    description: "Toolbar title, refresh action and business buttons identified by code."
    default: false
    usage: "#query-and-toolbar"
EVENTS:
  - name: "query"
    type: "(context: TableGridQueryContext) => void"
    description: "Emits an independent form, pagination, sort and filter snapshot on search, reset or refresh."
    default: null
    usage: "#query-and-toolbar"
  - name: "queryError"
    type: "(error: unknown) => void"
    description: "Query orchestration error; ordinary field validation failures are displayed by the form."
    default: null
    usage: "#query-and-toolbar"
  - name: "toolbarClick"
    type: "(code: string, context: TableGridQueryContext, event: MouseEvent) => void"
    description: "A configured business button was clicked."
    default: null
    usage: "#query-and-toolbar"
SLOTS:
  - name: "query"
    type: "Slot"
    description: "Additional SFormItem controls inside the same form; receives model and Grid methods."
    default: null
    usage: "#slots-and-declarative-columns"
  - name: "query-[name]"
    type: "Scoped slot"
    description: "Named query form slot; use the name without query- in the item configuration."
    default: null
    usage: "#slots-and-declarative-columns"
  - name: "query-actions"
    type: "Slot"
    description: "Replace query actions; receives query, resetQuery, refresh, busy and other Grid methods."
    default: null
    usage: "#slots-and-declarative-columns"
  - name: "toolbar"
    type: "Slot"
    description: "Replace toolbar actions; receives Grid methods and busy."
    default: null
    usage: "#slots-and-declarative-columns"
  - name: "toolbar-title"
    type: "Slot"
    description: "Replace the toolbar title."
    default: null
    usage: "#slots-and-declarative-columns"
EXPOSES:
  - name: "query"
    type: "() => Promise<boolean>"
    description: "Validate the form, request page one and emit query on acceptance."
    default: null
    usage: "#query-and-toolbar"
  - name: "resetQuery"
    type: "() => Promise<boolean>"
    description: "Restore initial form field values, request page one and emit query."
    default: null
    usage: "#query-and-toolbar"
  - name: "refresh"
    type: "() => Promise<boolean>"
    description: "Emit query with the current page and conditions, without validating the form."
    default: null
    usage: "#query-and-toolbar"
  - name: "getQueryContext"
    type: "() => TableGridQueryContext"
    description: "Read a condition snapshot; reason defaults to submit."
    default: null
    usage: "#query-and-toolbar"
  - name: "getTable"
    type: "() => TableExposes | undefined"
    description: "Access the original STable public methods; unavailable before mounting."
    default: null
    usage: "#generated-data"
  - name: "getForm"
    type: "() => FormInstance | undefined"
    description: "Access the query form; unavailable before mounting or when disabled."
    default: null
    usage: "#query-and-toolbar"
---

# Table Grid

<card>

## Query and toolbar

`s-table-grid` accepts [Table](./table.md) props, events and slots, sharing its pagination, sorting, filtering and selection behavior. Add a [Form](./form.md) with `query-config` and business actions with `toolbar-config`.

Provide a reactive `queryConfig.model`; field changes and reset follow the SForm model contract. Configure `items`, `rules`, `labelPosition` and other form options as usual. Search or native form submission validates fields, requests page one, then emits `query`. Reset restores initial field values and requests page one. Refresh keeps the current page and conditions without validating fields.

The `query` event provides a `{ reason, form, pager, sortBy, filters }` snapshot; `reason` is `submit`, `reset` or `refresh`. This example filters local data in the handler. Grid does not automatically map form fields into table filters or send network requests. For remote data, handle the event and update `data`, `loading` and the pagination total yourself.

Explicit `pagerConfig.currentPage` and `pageSize` fields are controlled; accept updates with `v-model:pager-config`. Query methods return `false` when page-one acceptance is rejected, validation fails, conditions change during asynchronous validation, the grid is loading, or the component is unmounted. A `true` result means the event was emitted, not that a business request succeeded.

Configure business `buttons` with a `code` for the `toolbarClick` event and optional `visible`, `disabled`, `loading` and button `props`. Set `refresh: false` to hide the default refresh action. Enable Table's column settings with `column-manager-config`.

<template #example>
  <table-grid-basic />
</template>

<template #template>

@[code{85-108}](../.vuepress/components/table-grid/basic.vue)

</template>

<template #script>

@[code{1-83}](../.vuepress/components/table-grid/basic.vue)

</template>

<template #style>

@[code{110-114}](../.vuepress/components/table-grid/basic.vue)

</template>

</card>

<card>

## Slots and declarative columns

Use `query-[name]` for custom query fields; reference the name without `query-` in `items[].slots.default`. Replace query buttons through `query-actions`, toolbar actions through `toolbar`, and its title through `toolbar-title`. The `query` slot can add `s-form-item` controls to the same form.

Other slots pass through to Table, including `header`, `footer`, cells, editors and default `s-table-column` declarations. This example combines declarative columns, tree expansion, fixed columns and virtual scrolling. Applying conditions displays the submitted keyword while preserving the tree data.

<template #example>
  <table-grid-slots />
</template>

<template #template>

@[code{32-93}](../.vuepress/components/table-grid/slots.vue)

</template>

<template #script>

@[code{1-30}](../.vuepress/components/table-grid/slots.vue)

</template>

<template #style>

@[code{95-99}](../.vuepress/components/table-grid/slots.vue)

</template>

</card>

<card>

## Generated data

Use `getTable()` to access original Table methods such as `scrollToRow`, `scrollToColumn`, editing, validation and data mutations. `virtualSource` and `virtualConfig` retain their Table contracts.

This example supplies one million rows and one hundred thousand columns on demand, reading only rendered fields. Query snapshots contain conditions without copying row or column data. The buttons navigate to the first and last records. The application still owns ordinary arrays and any remote loading or persistence for generated data.

<template #example>
  <table-grid-virtual />
</template>

<template #template>

@[code{40-53}](../.vuepress/components/table-grid/virtual.vue)

</template>

<template #script>

@[code{1-38}](../.vuepress/components/table-grid/virtual.vue)

</template>

</card>
