---
description: 'Table column layout and management behavior, configuration, and runnable examples.'
---

# Column layout and management guide

<card class="table-doc-section-start">

## Column layout and management

Fixed columns, resizing, and column settings control the table layout. Persist settings when users need their choices restored.

### Fixed columns and scroll positioning

Fixed left and right columns also work without virtualization. The center scrolls horizontally while fixed columns keep an opaque continuous surface. These controls demonstrate `scrollToColumn` and `scrollToRow`.

<template #example><table-fixed-columns /></template>

<template #template>

@[code{24-54}](../../.vuepress/components/table/fixed-columns.vue)

</template>

<template #script>

@[code{1-22}](../../.vuepress/components/table/fixed-columns.vue)

</template>

<template #style>

@[code{56-69}](../../.vuepress/components/table/fixed-columns.vue)

</template>

</card>

<card>

### Column resizing

Enable `resize-config` to drag header edges. Right-fixed columns resize from the left edge. Numeric or px column `minWidth` and the global minimum constrain resizing; `resizable: false` disables individual columns. Arrow keys resize, Shift accelerates, Home uses the minimum, and Escape cancels dragging.

Use `v-model:column-widths` for controlled state and resets, or omit it to keep widths internally without mutating columns or rows. Changing a declared column `width` clears its internal override. Dragging previews widths; release commits the event. Controlled values revert if the parent does not accept the update.

<template #example>
<table-resize />
</template>

<template #template>

@[code{98-134}](../../.vuepress/components/table/resize.vue)

</template>

<template #script>

@[code{1-96}](../../.vuepress/components/table/resize.vue)

</template>

<template #style>

@[code{136-149}](../../.vuepress/components/table/resize.vue)

</template>

</card>

<card>

### Column settings

Place the built-in `$columnConfig` renderer in either ordered toolbar region to show or hide columns, reorder them with the drag handle, fix them to either edge, and restore defaults. The equivalent slot form is `<template #toolbar_right><s-table-column-config /></template>`. Both forms use the current Table context, so the trigger can sit beside any other toolbar content without a separate Table prop. Group columns appear as always-expanded containers around their descendants; nested groups add another inset surface and show their direct child count. Dragging near a list edge scrolls the panel. Keyboard users can focus a handle, press Space to pick it up, use the arrow keys to choose a position, and press Enter to drop it. Fixed columns stay at their designated edge; ordering controls their position within that region. Hiding a column preserves its sorting, filtering and row-selection behavior.

Use `v-model:column-state` with `TableColumnState[]`, or omit it for internal state. Entries identify leaves or groups by `key`; `placement: { parentKey, index }` overrides the parent and sibling position, with `parentKey: null` representing the root. Give every persisted leaf and group a stable, unique key. `virtualSource` uses stringified source indexes and retains flat column management.

Column settings commit `update:column-state` and `column-state-change`; pointer or keyboard resizing commits `update:column-widths` and `column-resize`. Use the update events for controlled state and the change events to observe user actions. `columns` remains the original structural definition and is not rewritten by these interactions. Clear both state records to restore the declared order, fixed positions and widths.

<template #example><table-column-manager /></template>

<template #template>

@[code{83-119}](../../.vuepress/components/table/column-manager.vue)

</template>

<template #script>

@[code{1-81}](../../.vuepress/components/table/column-manager.vue)

</template>

<template #style>

@[code{121-128}](../../.vuepress/components/table/column-manager.vue)

</template>

</card>

<card>

### Remember column settings

Set a unique `storageKey` in `$columnConfig.props`, or on `<s-table-column-config>`, to save settings in the current browser's localStorage. Storage is untouched when no key is supplied. Use different keys for different tables or users.

Uncontrolled tables restore saved settings on mount. Controlled tables use the parent's `column-state` and only persist accepted state; the application owns initial restoration. Restoring defaults saves an empty state. Listen to `column-storage-error` to handle unavailable storage or quota errors.

<template #example><table-column-persistence /></template>

<template #template>

@[code{8-17}](../../.vuepress/components/table/column-persistence.vue)

</template>

<template #script>

@[code{1-6}](../../.vuepress/components/table/column-persistence.vue)

</template>

</card>
