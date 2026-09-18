---
description: 'Table query forms and request proxy behavior, configuration, and runnable examples.'
---

# Query forms and request proxy guide

<card class="table-doc-section-start">

## Query forms and request proxy

Query forms, toolbars, and request proxies are enabled through STable configuration. The examples progress from query interactions to generated data, remote requests, save, and delete.

### Query and toolbar

Continue using `s-table` when a table needs a query area, toolbar or request proxy. Enable or combine `query-config`, `toolbar-config` and `proxy-config` independently; when none is supplied, no business configuration area is rendered. The examples below cover manual queries, slots with nested columns, generated data, remote requests, and save and delete operations.

`s-table` accepts [Table](./table.md) props, events and slots, sharing its pagination, sorting, filtering and selection behavior. Add a [Form](./form.md) with `query-config` and business actions with `toolbar-config`.

Provide a reactive `queryConfig.model`; field changes and reset follow the SForm model contract. Configure `items`, `rules`, `labelPosition` and other form options as usual, and use built-in renderer names such as `$input` and `$select` in `itemRender`. Search or native form submission validates fields, requests page one, then emits `query`. Reset restores initial field values and requests page one. Refresh keeps the current page and conditions without validating fields.

The `query` event provides a `{ reason, form, pager, sortBy, filters }` snapshot; `reason` is `submit`, `reset` or `refresh`. This example filters local data in the handler. Table does not automatically map form fields into table filters or send network requests. For remote data, handle the event and update `data`, `loading` and the pagination total yourself.

Explicit `pagerConfig.currentPage` and `pageSize` fields are controlled; accept updates with `v-model:pager-config`. Query methods return `false` when page-one acceptance is rejected, validation fails, conditions change during asynchronous validation, the grid is loading, or the component is unmounted. Without a proxy, `true` only means the event was emitted. With a proxy, it means the query response was accepted.

Configure `toolbarConfig.left` and `toolbarConfig.right` as ordered global renderer lists using `itemRender`. The built-in `button` emits its own or a child action's `code` through `toolbarClick`; child actions open through `SPopper`. `$refresh` calls the current query or proxy refresh, `$columnConfig` opens column settings, and `$find` supplies the find-and-replace trigger and panel for this Table. A custom renderer can implement `renderToolbar(options, params)`, where `params.source` contains the Table API, query context, side and busy state.

<template #example>
<table-business />
</template>

<template #template>

@[code{88-126}](../../.vuepress/components/table/business.vue)

</template>

<template #script>

@[code{1-86}](../../.vuepress/components/table/business.vue)

</template>

<template #style>

@[code{128-132}](../../.vuepress/components/table/business.vue)

</template>

</card>

<card>

### Slots and nested columns

Map a query item's `default`, `label`, or `error` entry in `queryConfig.items[].slots` directly to an identically named application slot. Names are used as written; Table does not add a `query-` prefix. Replace query buttons through `query-actions`, the two toolbar regions through `toolbar_left` and `toolbar_right`, and its title through `toolbar-title`. The `query` slot can add `s-form-item` controls to the same form.

Other slots pass through to Table, including `header`, `footer`, cells, editors and default `s-table-column` declarations. This example combines nested columns, tree expansion, fixed columns and virtual scrolling. Applying conditions displays the submitted keyword while preserving the tree data.

`query`, `query-actions`, `toolbar_left`, `toolbar_right`, `toolbar-title`, and `proxy-error` are fixed Table slots. Query items and configured columns should explicitly map application-owned unique names; multiple configurations may deliberately reuse the same business slot. Conditional slots can be added or removed after mounting; removing one restores the corresponding fallback.

<template #example>
<table-business-slots />
</template>

<template #template>

@[code{32-97}](../../.vuepress/components/table/business-slots.vue)

</template>

<template #script>

@[code{1-30}](../../.vuepress/components/table/business-slots.vue)

</template>

<template #style>

@[code{99-103}](../../.vuepress/components/table/business-slots.vue)

</template>

</card>

<card>

### Generated data

Call Table methods such as `scrollToRow`, `scrollToColumn`, editing, validation and data mutations. `virtualSource` and `virtualConfig` retain their Table contracts.

This example supplies one million rows and one hundred thousand columns on demand, reading only rendered fields. Query snapshots contain conditions without copying row or column data. The buttons navigate to the first and last records. The application still owns ordinary arrays and any remote loading or persistence for generated data.

<template #example>
<table-business-virtual />
</template>

<template #template>

@[code{40-53}](../../.vuepress/components/table/business-virtual.vue)

</template>

<template #script>

@[code{1-38}](../../.vuepress/components/table/business-virtual.vue)

</template>

</card>

<card>

### Request proxy

Provide `proxy-config.query` to receive `{ action, reason, form, pager, sortBy, filters, signal }` and return `{ data, total }`. Pagination requires a non-negative integer `total`, counting root records for trees. The proxy enables remote pagination, sorting and filtering so a returned page is not sliced or sorted again locally.

This example uses `computed<SaxGridSetting<ProjectRow, ProjectQueryForm>>()`. The query adapter therefore receives `ProjectQueryForm` in `form`, must return `ProjectRow[]`, and keeps the same types in toolbar slots, events, and `TableExposes<ProjectRow, ProjectQueryForm>` methods.

Queries run after mounting unless `autoLoad: false`. Accepted page, page-size, sort and filter changes trigger a query unless `autoQuery: false`; sort and filter changes request page one. Typing in the form does not trigger requests by itself. `query()` validates the form and requests page one; `resetQuery()` resets the form and requests page one; `refresh()` keeps the current page. `commitProxy('query')` and `commitProxy('refresh')` dispatch the current conditions directly, without additional form validation or page reset.

Without `data`, Table stores accepted responses. When `data` is supplied, the parent must accept the proposed array through `v-model:data` or `update:data`; otherwise the operation returns `rejected`. Failed requests retain previous data. Disable the proxy to keep managing requests through the existing `query` event yourself.

A newer query cancels the previous one, and late responses cannot overwrite current data. Explicit cancellation, disabling the proxy, replacing adapters, changing `dataKey` and unmounting abort pending requests. Pass `signal` to clients such as `fetch` and check it before delayed writes. Client cancellation does not guarantee rollback of a server write.

This example simulates a service with delays and supports pagination, sorting, team filters, retry and cancellation, together with fixed columns, dynamic heights and virtualization. Query adapters return a bounded array page. Generated `virtualSource` loading remains application-owned; direct proxy queries return `unsupported` for that mode.

<template #example>
<table-proxy-query />
</template>

<template #template>

@[code{118-142}](../../.vuepress/components/table/proxy-query.vue)

</template>

<template #script>

@[code{1-116}](../../.vuepress/components/table/proxy-query.vue)

</template>

</card>

<card>

### Save and delete

Enable `change-config` and call `commitProxy('save')` to pass existing change records to `proxyConfig.save`. Apply drafts with Table's `commitEdit()` before persisting; an active draft returns `editing`. Inserted and updated rows are validated before saving; invalid data returns `invalid`, and no changes returns `empty`.

The save adapter receives inserted, updated and removed records with a version. Successful saves only accept the same data baseline and version. If external data or the record version changes while waiting, the operation returns `stale` and preserves current data. Row references are read-only and changed field values are snapshots; the application decides which fields to serialize. `validationColumns` can limit save validation. Generated sources require explicit numeric `validationColumns` and `changeConfig.indexOf` so only affected rows and specified columns are accessed; disable automatic reload and refresh the generated source in your adapter.

`commitProxy('delete', rows)` passes explicit rows to the delete adapter. Omit rows to use Table's current selection; an empty array returns `empty`. Queries and deletes return `dirty` when unsaved changes exist. Save first or call `revertChanges()`. The adapter owns server deletion; Table does not silently remove local rows.

Writes are mutually exclusive and other proxy operations return `busy` while a write is pending. Returning `false` rejects a write; exceptions emit `proxyError`. Both preserve data and change records. Successful writes reload by default; disable this with `reloadAfterMutation: false`. A successful write stays `success` if its reload fails: inspect `result.reload` instead of submitting the successful write again.

`getProxyState()` and `proxyStateChange` provide loading, action, error and the latest result. Cancellation returns `cancelled`. This example uses simulated service data to demonstrate applying drafts, saving, inserting, deleting and reverting changes.

<template #example>
<table-proxy-edit />
</template>

<template #template>

@[code{101-158}](../../.vuepress/components/table/proxy-edit.vue)

</template>

<template #script>

@[code{1-99}](../../.vuepress/components/table/proxy-edit.vue)

</template>

</card>
