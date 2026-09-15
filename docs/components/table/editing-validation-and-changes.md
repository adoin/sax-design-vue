---
description: 'Table editing, validation, and changes behavior, configuration, and runnable examples.'
---

# Editing, validation, and changes guide

<card class="table-doc-section-start">

## Editing, validation, and changes

This section follows the data-writing workflow: edit values, validate them, then track, revert, undo, or redo accepted changes.

### Cell and row editing

Enable `edit-config` and add `editor` to editable columns. Choose controls through the shared renderer registry; this example uses `$input`, `$select`, `$date`, and `$switch`, with renderer `props` and `options` forwarded to each component. Input-surface editors such as input, textarea, select, cascader, date, and time controls default to `shape="square"` inside table cells so their outline follows the cell geometry; an explicit renderer or editor `props.shape` still takes precedence. Double-click starts cell editing by default. Use `mode: 'row'` for row editing, `trigger: 'click' | 'dblclick' | 'manual'` for activation, and `editableMethod` for eligibility. The archived project in this example is read-only.

Editing updates a draft. Without `change-config`, accept `updatedRow` or `changes` from `editCommit` to update `data` or persist to a server; the table does not mutate business records. Enter commits a text input and Escape cancels; selects and date panels handle their own keys first. Use the Save button or Ctrl/⌘ + Enter for any editor. Tab to an editable cell, then press Enter or F2 to begin.

<template #example><table-editing /></template>

<template #template>

@[code{107-138}](../../.vuepress/components/table/editing.vue)

</template>

<template #script>

@[code{1-105}](../../.vuepress/components/table/editing.vue)

</template>

<template #style>

@[code{140-154}](../../.vuepress/components/table/editing.vue)

</template>

</card>

<card>

### Editing lifecycle

Choose `edit-config.onSwitch` for moving to another cell (`commit` by default), and `onContextChange` for accepted sort, filter, page or column changes (`cancel` by default). Controlled query requests only end editing after the parent accepts the new state. Enter submits the draft; Escape discards it.

With virtual scrolling, `onScroll: 'keep'` preserves the draft when its editor leaves the rendered window. Use `commit` or `cancel` to end it instead. In row mode the policy runs when the last editor for that row leaves the window. Turn off pagination and enable virtual scrolling below to try this behavior.

<template #example><table-editing-lifecycle /></template>

<template #template>

@[code{103-169}](../../.vuepress/components/table/editing-lifecycle.vue)

</template>

<template #script>

@[code{1-101}](../../.vuepress/components/table/editing-lifecycle.vue)

</template>

<template #style>

@[code{171-191}](../../.vuepress/components/table/editing-lifecycle.vue)

</template>

</card>

<card>

### Custom editors

Customize editors with `STableColumn #edit`, a slot explicitly mapped through `columns[].slots.edit`, or the generic `#edit-cell`. Call `setValue` to update the draft. `value` is the field draft and `draftRow` exposes other draft fields; do not mutate slot parameter objects directly.

Editor precedence is column-specific slot, generic editor slot, column `edit` function, named renderer `edit`, then the built-in editor. Display cells retain their existing rendering rules. This example starts row editing from an action button; the task column uses an auto-sizing Textarea so long text wraps and grows the editing row, while the priority column uses Select.

<template #example><table-editing-custom /></template>

<template #template>

@[code{23-80}](../../.vuepress/components/table/editing-custom.vue)

</template>

<template #script>

@[code{1-21}](../../.vuepress/components/table/editing-custom.vue)

</template>

</card>

<card>

### Editing virtual data

Stable row keys and fields identify edits in a generated source. This example generates one million rows and 100,000 columns on demand, saving only changed fields. Send the `changes` patch to a server without constructing the full matrix.

Leaving the virtual viewport retains the current draft by default. Use `onScroll: 'commit'` or `'cancel'` to finish when the editor leaves the window; row mode applies this only after all editors for the row leave. `startEdit` scrolls to the target row and column and focuses the editor. Hidden columns cannot start editing.

<template #example><table-editing-source /></template>

<template #template>

@[code{66-95}](../../.vuepress/components/table/editing-source.vue)

</template>

<template #script>

@[code{1-64}](../../.vuepress/components/table/editing-source.vue)

</template>

<template #style>

@[code{97-108}](../../.vuepress/components/table/editing-source.vue)

</template>

</card>

<card>

### Data validation

Set column `rules` or provide field-based `validation-rules`. Column rules take precedence; `rules: []` disables validation for that column. Rules support required values, types, numeric ranges, string or array lengths, regular expressions and synchronous or asynchronous `validator` functions. Values are not coerced. Optional empty values skip type and range checks but still run custom validators.

Enable `validation-config` explicitly to validate drafts before committing. Cell mode checks the current field; row mode checks every ruled field in that row. A failed check retains the draft without emitting `editCommit`. Manual `validateCell`, `validateRow` and `validate` calls also work without editing enabled. Calling these methods manually first cancels the active editor so an editor and a previous validation state are never shown together. While any validation is pending, Table uses its loading mask and `aria-busy` state and blocks editing and other data-surface interactions until the run completes or is cancelled.

Invalid cells use an inset shadow and error marker that do not change row height. A newly collected, marker-activated or navigated error shows its floating callout for two seconds and then hides it; hover the invalid cell to preview it again. The callout ignores pointer input so it cannot block cell clicks or double-click editing. It teleports into a dedicated clipped overlay inside the Table data view, so it cannot paint beyond that surface when its cell scrolls away. When several errors exist, an overlaid navigator provides previous, next and close actions and reuses the normal error-location pipeline. Starting an editor clears that cell's previous error state. The shadow, marker and callout return only when another commit still fails. Error text remains available to assistive technology through `aria-describedby` and a live region.

<template #example><table-validation /></template>

<template #template>

@[code{109-163}](../../.vuepress/components/table/validation.vue)

</template>

<template #script>

@[code{1-107}](../../.vuepress/components/table/validation.vue)

</template>

<template #style>

@[code{165-179}](../../.vuepress/components/table/validation.vue)

</template>

</card>

<card>

### Error navigation and scope

`validate()` checks all supplied data, including loaded collapsed descendants. `scope: 'view'` checks the filtered, expanded current page, including rows outside the mounted virtual window. Validation does not fetch unloaded children or remote pages.

Use `validate({ rowKeys: [...] })` to select ordinary array or tree records by stable keys, including records returned by change tracking. Generated sources must also provide numeric `rows` indices when using `rowKeys`; specify numeric `columns` to bound the validation scope.

<template #example><table-validation-navigation /></template>

<template #template>

@[code{49-78}](../../.vuepress/components/table/validation-navigation.vue)

</template>

<template #script>

@[code{1-47}](../../.vuepress/components/table/validation-navigation.vue)

</template>

<template #style>

@[code{80-94}](../../.vuepress/components/table/validation-navigation.vue)

</template>

</card>

<card>

### Generated data validation

Generated sources use global numeric row and column indices. `validateCell(999_999, 99_998)` checks one distant position directly. Use `validate({ rows, columns })` to select targets without scanning the entire generated table. This example generates one million rows and 100,000 columns; one field in the last row is empty.

Full validation reads data on demand, runs built-in rules through a synchronous fast path and yields only when its time slice is spent. Custom validators run in ordered bounded stages; set `validationConfig.concurrency` or the per-call `concurrency` option to control the stage size (default 8, range 1–32). Cancel through an `AbortSignal` or `cancelValidation()`. The default `maxErrors` is 100; each stage is capped by the remaining error capacity, and reaching the limit blocks later reads and returns `truncated: true`. A truncated navigator presents a lower bound rather than an exact total: a limit of 100 displays `99+`, beginning at `1 / 99+`. `checked` counts fields with rules that were checked. Cancellation returns `cancelled: true` without publishing partial results or overwriting prior errors. Check `valid` rather than treating an empty error array as success.

<template #example><table-validation-source /></template>

<template #template>

@[code{83-112}](../../.vuepress/components/table/validation-source.vue)

</template>

<template #script>

@[code{1-81}](../../.vuepress/components/table/validation-source.vue)

</template>

<template #style>

@[code{114-128}](../../.vuepress/components/table/validation-source.vue)

</template>

</card>

<card>

### Change tracking

Enable `change-config` and accept ordinary array proposals through `v-model:data`. Use unique, stable string or numeric `row-key` values, independent of row indices. The table never mutates owned rows in place. Sorting, filtering and paging do not change the keys used by mutation APIs.

Editor drafts are separate from tracked changes. Validation must pass and the parent must accept the data before the journal updates and `editCommit` fires. With tracking enabled, do not replace the row again in `editCommit`. `insertRows`, `removeRows` and `updateRow` are data APIs and do not automatically run editor validation; call `validate()` before saving.

<template #example><table-changes /></template>

<template #template>

@[code{112-180}](../../.vuepress/components/table/changes.vue)

</template>

<template #script>

@[code{1-110}](../../.vuepress/components/table/changes.vue)

</template>

<template #style>

@[code{182-193}](../../.vuepress/components/table/changes.vue)

</template>

</card>

<card>

### Tree branch changes

Use `insertRows(rows, { parentKey, index })` to insert children. Removing a parent records its loaded branch. `revertChanges([parentKey])` includes descendants through unchanged intermediate parents and can restore a deleted branch; rows inserted and then removed since the baseline remain absent.

Lazy trees track only loaded records and do not fetch descendants for change tracking. Updating a loaded child copies the affected ancestors into the proposal and supplies their child arrays, leaving original business objects unchanged. Load the example branch, update a descendant, insert a child, remove the branch, then revert it.

<template #example><table-changes-tree /></template>

<template #template>

@[code{76-145}](../../.vuepress/components/table/changes-tree.vue)

</template>

<template #script>

@[code{1-74}](../../.vuepress/components/table/changes-tree.vue)

</template>

<template #style>

@[code{147-158}](../../.vuepress/components/table/changes-tree.vue)

</template>

</card>

<card>

### Generated source changes

Generated sources provide `changeConfig.indexOf(key)` to locate the current global row index and accept mutations through `apply({ operations, signal })`. Apply owned data before returning `true`, or return `false` to reject. Before an asynchronous write, check `signal.aborted` so cancelled or replaced requests cannot write stale data. A new request returns `busy` while another ownership request is pending.

Generated rows may supply fields on demand. Each `row` must represent a read-only data version. Prefer `patches` for updates; do not spread a generated row or scan its whole matrix. For insertion and deletion, the adapter owns row counts, stable-key mappings and restoration positions. This fixed-size example accepts field updates only and stores sparse overrides across one million rows and one hundred thousand columns.

<template #example><table-changes-source /></template>

<template #template>

@[code{105-157}](../../.vuepress/components/table/changes-source.vue)

</template>

<template #script>

@[code{1-103}](../../.vuepress/components/table/changes-source.vue)

</template>

<template #style>

@[code{159-170}](../../.vuepress/components/table/changes-source.vue)

</template>

</card>

<card>

### Undo and redo

Enable both `change-config` and `history-config`, then call `undo()` and `redo()` to replay accepted edits, insertions, removals and reverts. A row commit or batch mutation creates one step. Drafts, failed validation and rejected or cancelled operations create none. Replay returns `editing` while a draft is active; commit or cancel it first.

`history-config.limit` defaults to 100; this example retains 30 steps. History stores touched field values and read-only inserted/removed row references, without copying the whole data set. Removing a large loaded branch still retains that branch, so a step limit is not a fixed memory limit. Use mutation APIs rather than changing historical row references in place.

<template #example><table-history /></template>

<template #template>

@[code{55-129}](../../.vuepress/components/table/history.vue)

</template>

<template #script>

@[code{1-53}](../../.vuepress/components/table/history.vue)

</template>

<template #style>

@[code{131-142}](../../.vuepress/components/table/history.vue)

</template>

</card>
