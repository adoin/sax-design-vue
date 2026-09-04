---
description: "Compose a query form, toolbar, pagination and data table."
PROPS:
  - name: "data"
    type: "TableRow[]"
    description: "Externally owned rows. When omitted, the request proxy stores query results internally; an explicit array takes precedence over proxy data."
    default: null
    usage: "#request-proxy"
  - name: "proxy-config"
    type: "Boolean | TableGridProxyConfig"
    description: "Configure query, save and delete adapters; disabled by default."
    default: false
    usage: "#request-proxy"
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
  - name: "proxyStateChange"
    type: "(state: TableGridProxyState) => void"
    description: "Request loading state and latest result changed."
    default: null
    usage: "#request-proxy"
  - name: "proxySuccess"
    type: "(result: TableGridProxyResult) => void"
    description: "Query data was accepted or a write succeeded."
    default: null
    usage: "#request-proxy"
  - name: "proxyError"
    type: "(result: TableGridProxyResult) => void"
    description: "Adapter exception or invalid query response; cancellation does not emit this event."
    default: null
    usage: "#request-proxy"
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
  - name: "proxy-error"
    type: "TableGridExposes & { state: TableGridProxyState }"
    description: "Customize request error content; receives state and Grid methods."
    default: null
    usage: "#request-proxy"
  - name: "query"
    type: "TableGridExposes & { model: FormModel }"
    description: "Additional SFormItem controls inside the same form; receives model and Grid methods."
    default: null
    usage: "#slots-and-declarative-columns"
  - name: "query-[name]"
    type: "Scoped slot"
    description: "Named query field slot with model, item, field, prop, value, disabled, readonly and setValue(value). Use the name without query- in the item configuration."
    default: null
    usage: "#slots-and-declarative-columns"
  - name: "query-actions"
    type: "TableGridExposes & { busy: boolean }"
    description: "Replace query actions; receives query, resetQuery, refresh, busy and other Grid methods."
    default: null
    usage: "#slots-and-declarative-columns"
  - name: "toolbar"
    type: "TableGridExposes & { busy: boolean }"
    description: "Replace toolbar actions; receives Grid methods and busy."
    default: null
    usage: "#slots-and-declarative-columns"
  - name: "toolbar-title"
    type: "Slot"
    description: "Replace the toolbar title."
    default: null
    usage: "#slots-and-declarative-columns"
EXPOSES:
  - name: "commitProxy"
    type: "(action: TableGridProxyAction, rows?: TableRow[]) => Promise<TableGridProxyResult>"
    description: "Dispatch query, refresh, save or delete with current conditions. rows applies only to delete: omit it for the current selection, or pass [] to delete nothing. save uses the tracked change set."
    default: null
    usage: "#request-proxy"
  - name: "cancelProxy"
    type: "() => void"
    description: "Abort the active request and ignore late results; does not guarantee rollback of server writes."
    default: null
    usage: "#request-proxy"
  - name: "getProxyState"
    type: "() => TableGridProxyState"
    description: "Read current request state."
    default: null
    usage: "#request-proxy"
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

Explicit `pagerConfig.currentPage` and `pageSize` fields are controlled; accept updates with `v-model:pager-config`. Query methods return `false` when page-one acceptance is rejected, validation fails, conditions change during asynchronous validation, the grid is loading, or the component is unmounted. Without a proxy, `true` only means the event was emitted. With a proxy, it means the query response was accepted.

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

The `query-*` prefix is reserved for query form slots; `query`, `toolbar`, `toolbar-title` and `proxy-error` belong to Grid itself. Choose other names for custom Table column slots. Conditional slots can be added or removed after mounting; removing one restores the corresponding fallback.

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

<card>

## Request proxy

Provide `proxy-config.query` to receive `{ action, reason, form, pager, sortBy, filters, signal }` and return `{ data, total }`. Pagination requires a non-negative integer `total`, counting root records for trees. The proxy enables remote pagination, sorting and filtering so a returned page is not sliced or sorted again locally.

Queries run after mounting unless `autoLoad: false`. Accepted page, page-size, sort and filter changes trigger a query unless `autoQuery: false`; sort and filter changes request page one. Typing in the form does not trigger requests by itself. `query()` validates the form and requests page one; `resetQuery()` resets the form and requests page one; `refresh()` keeps the current page. `commitProxy('query')` and `commitProxy('refresh')` dispatch the current conditions directly, without additional form validation or page reset.

Without `data`, Grid stores accepted responses. When `data` is supplied, the parent must accept the proposed array through `v-model:data` or `update:data`; otherwise the operation returns `rejected`. Failed requests retain previous data. Disable the proxy to keep managing requests through the existing `query` event yourself.

A newer query cancels the previous one, and late responses cannot overwrite current data. Explicit cancellation, disabling the proxy, replacing adapters, changing `dataKey` and unmounting abort pending requests. Pass `signal` to clients such as `fetch` and check it before delayed writes. Client cancellation does not guarantee rollback of a server write.

This example simulates a service with delays and supports pagination, sorting, team filters, retry and cancellation, together with fixed columns, dynamic heights and virtualization. Query adapters return a bounded array page. Generated `virtualSource` loading remains application-owned; direct proxy queries return `unsupported` for that mode.

<template #example>
  <table-grid-proxy-query />
</template>

<template #template>

@[code{82-131}](../.vuepress/components/table-grid/proxy-query.vue)

</template>

<template #script>

@[code{1-80}](../.vuepress/components/table-grid/proxy-query.vue)

</template>

</card>

<card>

## Save and delete

Enable `change-config` and call `commitProxy('save')` to pass existing change records to `proxyConfig.save`. Apply drafts with Table's `commitEdit()` before persisting; an active draft returns `editing`. Inserted and updated rows are validated before saving; invalid data returns `invalid`, and no changes returns `empty`.

The save adapter receives inserted, updated and removed records with a version. Successful saves only accept the same data baseline and version. If external data or the record version changes while waiting, the operation returns `stale` and preserves current data. Row references are read-only and changed field values are snapshots; the application decides which fields to serialize. `validationColumns` can limit save validation. Generated sources require explicit numeric `validationColumns` and `changeConfig.indexOf` so only affected rows and specified columns are accessed; disable automatic reload and refresh the generated source in your adapter.

`commitProxy('delete', rows)` passes explicit rows to the delete adapter. Omit rows to use Table's current selection; an empty array returns `empty`. Queries and deletes return `dirty` when unsaved changes exist. Save first or call `getTable()?.revertChanges()`. The adapter owns server deletion; Grid does not silently remove local rows.

Writes are mutually exclusive and other proxy operations return `busy` while a write is pending. Returning `false` rejects a write; exceptions emit `proxyError`. Both preserve data and change records. Successful writes reload by default; disable this with `reloadAfterMutation: false`. A successful write stays `success` if its reload fails: inspect `result.reload` instead of submitting the successful write again.

`getProxyState()` and `proxyStateChange` provide loading, action, error and the latest result. Cancellation returns `cancelled`. This example uses simulated service data to demonstrate applying drafts, saving, inserting, deleting and reverting changes.

<template #example>
  <table-grid-proxy-edit />
</template>

<template #template>

@[code{101-157}](../.vuepress/components/table-grid/proxy-edit.vue)

</template>

<template #script>

@[code{1-99}](../.vuepress/components/table-grid/proxy-edit.vue)

</template>

</card>
