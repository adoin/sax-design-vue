---
PROPS:
  - name: checked-strategy
    type: TableSelectCheckedStrategy
    values: "leaf | all | parent"
    default: leaf
    description: "Project linked tree selection into model keys and tags: leaf retains selectable leaves, all retains all checked nodes, parent compresses fully checked branches. Ignored for strict or flat selection."
    usage: '#tree-multiple-selection'
  - name: multiple
    type: Boolean
    default: false
    description: Enable multiple selection with an array of row keys.
    usage: '#tree-multiple-selection'
  - name: check-strictly
    type: Boolean
    default: false
    description: Select tree nodes independently. By default loaded selectable descendants are linked with indeterminate feedback.
    usage: '#tree-multiple-selection'
  - name: max-collapse-tags
    type: Number
    default: 2
    description: Maximum visible selected tags; remaining values appear as +N.
    usage: '#tree-multiple-selection'
  - name: size
    type: ComponentSize
    values: "small | default | large"
    description: Size inherited by the trigger, popup Table, and registered renderers.
    default: null
  - name: "empty-text"
    type: "String"
    description: "Text displayed when the table has no rows; falls back to the current locale."
    default: null
    usage: "#tree-single-selection"
  - name: "placeholder"
    type: "String"
    description: "Trigger placeholder when no row is selected; falls back to the current locale."
    default: null
    usage: "#tree-single-selection"
  - name: "disabled"
    type: "Boolean"
    description: "Disable trigger actions and close an open popup."
    default: false
    values: "true | false"
    usage: "#tree-single-selection"
  - name: model-value
    type: TableSelectValue
    values: "row key"
    description: Selected row key resolved through row-key; an array of keys in multiple mode.
    default: null
  - name: v-model
    type: TableSelectValue
    values: "row key"
    description: Selected row key resolved through row-key; an array of keys in multiple mode.
    default: null
  - name: data
    type: "TableRow[]"
    values: ""
    description: "Rows passed to STable; children follow tree-config."
    default: "[]"
    usage: "#tree-single-selection"
  - name: columns
    type: "TableColumn[]"
    values: ""
    description: "Column configuration forwarded to STable."
    default: "[]"
    usage: "#tree-single-selection"
  - name: row-key
    type: "TableRowKeyGetter"
    values: ""
    description: "Stable row key field or resolver; the selected key is the model value."
    default: "id"
    usage: "#tree-single-selection"
  - name: label-key
    type: "String"
    values: ""
    description: "Field path used for the trigger label; falls back to the selected key."
    default: "label"
    usage: "#tree-single-selection"
  - name: label-formatter
    type: "TableSelectLabelFormatter"
    values: ""
    description: "Format the selected row label; takes precedence over label-key."
    default: null
    usage: "#custom-rendering"
  - name: tree-config
    type: "TableTreeConfig"
    values: ""
    description: "Configure child rows, indentation, expansion and lazy loading through STable."
    default: null
    usage: "#tree-single-selection"
  - name: expanded-keys
    type: "TableRowKey[]"
    values: ""
    description: "Controlled tree expansion keys; bind with v-model:expanded-keys."
    default: null
    usage: "#tree-single-selection"
  - name: virtual-config
    type: Boolean | TableVirtualConfig
    values: "true / false / '{ height, estimateSize, overscan, dynamic }'"
    description: Enable STable row virtualization for large flat or tree data.
    default: 'false'
  - name: renderers
    type: "Record<string, TableRenderer | TableCellRenderer>"
    values: ""
    description: "Named cell and header renderers forwarded to STable."
    default: "{}"
    usage: "#custom-rendering"
  - name: row-class
    type: "TableRowClass"
    values: ""
    description: "Custom row classes; a function receives the flattened row context."
    default: ""
    usage: "#tree-single-selection"
  - name: selectable
    type: "TableSelectSelectable"
    values: ""
    description: "Return false to prevent selecting a row. Rows with disabled set remain unselectable."
    default: null
    usage: "#tree-single-selection"
  - name: show-header
    type: "Boolean"
    values: "true | false"
    description: "Show the table column headers."
    default: true
    usage: "#tree-single-selection"
  - name: striped
    type: "Boolean"
    values: "true | false"
    description: "Use alternating row backgrounds."
    default: false
    usage: "#tree-single-selection"
  - name: table-loading
    type: "Boolean"
    values: "true | false"
    description: "Show the internal table loading state."
    default: false
    usage: "#tree-single-selection"
  - name: close-on-select
    type: "Boolean"
    values: "true | false"
    description: "Whether to close after selection. Defaults to true for single selection and false for multiple selection."
    default: null
    usage: "#tree-single-selection"
  - name: clearable
    type: "Boolean"
    values: "true | false"
    description: "Show a clear action for the selected value."
    default: false
    usage: "#tree-single-selection"
  - name: loading
    type: "Boolean"
    values: "true | false"
    description: Show the shared trailing loader, preserve the value, and block editing, clearing, and popup interaction.
    default: false
    usage: '#loading'
  - name: block
    type: "Boolean"
    values: "true | false"
    description: "Make the trigger fill the available width."
    default: false
    usage: "#tree-single-selection"
  - name: shape
    type: String
    values: "rounded | square"
    description: Apply rounded or square geometry to the selector trigger and popup surface.
    default: rounded
    usage: '#shape'
  - name: color
    type: "Color"
    values: ""
    description: "Primary visual color of the trigger and popup."
    default: "primary"
    usage: "#tree-single-selection"
  - name: state
    type: "Color"
    values: ""
    description: "State color; when provided, takes precedence over color."
    default: null
    usage: "#tree-single-selection"
  - name: prefix-icon
    type: "String"
    values: ""
    description: "Leading icon name; takes precedence over prefix-config.icon."
    default: null
    usage: "#custom-rendering"
  - name: suffix-icon
    type: "String"
    values: ""
    description: "Trailing decorative icon; the dropdown arrow remains available."
    default: null
    usage: "#custom-rendering"
  - name: prefix-config
    type: "TableSelectAffixConfig"
    values: ""
    description: "Leading icon and text; the prefix slot takes precedence."
    default: null
    usage: "#custom-rendering"
  - name: suffix-config
    type: "TableSelectAffixConfig"
    values: ""
    description: "Trailing icon and text; the suffix slot takes precedence."
    default: null
    usage: "#custom-rendering"
  - name: open
    type: "Boolean"
    values: "true | false"
    description: "Controlled popup visibility; bind with v-model:open."
    default: null
    usage: "#tree-single-selection"
  - name: default-open
    type: "Boolean"
    values: "true | false"
    description: "Initial popup visibility when open is not controlled."
    default: false
    usage: "#tree-single-selection"
  - name: popup-config
    type: "TableSelectPopupConfig"
    values: ""
    description: "Popup size, position and mount target; configured fields override their corresponding top-level props."
    default: "{}"
    usage: "#tree-single-selection"
  - name: placement
    type: "String"
    values: ""
    description: "Preferred popup placement relative to the trigger."
    default: "bottom-start"
    usage: "#tree-single-selection"
  - name: teleported
    type: "Boolean"
    values: "true | false"
    description: "Teleport the popup outside ancestor clipping containers."
    default: true
    usage: "#tree-single-selection"
  - name: flip
    type: "Boolean"
    values: "true | false"
    description: "Flip the popup placement when viewport space is insufficient."
    default: true
    usage: "#tree-single-selection"
  - name: strategy
    type: "String"
    values: "absolute | fixed"
    description: "Positioning strategy passed to the shared Popper."
    default: "absolute"
    usage: "#tree-single-selection"
EVENTS:
  - name: "update:modelValue"
    type: "(value: TableSelectValue) => void"
    description: "Selected key update; clearing emits undefined in single mode or [] in multiple mode."
    default: null
    usage: "#tree-single-selection"
  - name: "update:open"
    type: "(value: boolean) => void"
    description: "Request a popup visibility update."
    default: null
    usage: "#tree-single-selection"
  - name: "update:expanded-keys"
    type: "(keys: TableRowKey[]) => void"
    description: "Tree expansion keys updated by STable."
    default: null
    usage: "#tree-single-selection"
  - name: "visible-change"
    type: "(value: boolean) => void"
    description: "An accepted open or close request; controlled visibility still depends on open."
    default: null
    usage: "#tree-single-selection"
  - name: "change"
    type: "(value: TableRowKey | TableRowKey[], row: TableRow | TableRow[]) => void"
    description: "A selectable row was chosen; clearing uses clear instead."
    default: null
    usage: "#tree-single-selection"
  - name: "clear"
    type: "() => void"
    description: "The clear action was activated."
    default: null
    usage: "#tree-single-selection"
  - name: "row-click"
    type: "(row: TableRow, event: MouseEvent) => void"
    description: "Table row click, including clicks on unselectable rows."
    default: null
    usage: "#tree-single-selection"
  - name: "cell-click"
    type: "(params: TableCellRenderParams, event: MouseEvent) => void"
    description: "Table data cell click with its render context."
    default: null
    usage: "#tree-single-selection"
  - name: "tree-expand"
    type: "(row: TableRow, expanded: boolean) => void"
    description: "A tree row expanded or collapsed."
    default: null
    usage: "#tree-single-selection"
  - name: "lazy-load"
    type: "(row: TableRow, children: TableRow[]) => void"
    description: "Lazy child rows finished loading."
    default: null
    usage: "#tree-single-selection"
  - name: "scroll"
    type: "(event: Event) => void"
    description: "Internal table viewport scroll event."
    default: null
    usage: "#tree-single-selection"
  - name: "focus"
    type: "(event: FocusEvent) => void"
    description: "The trigger received focus."
    default: null
    usage: "#tree-single-selection"
  - name: "blur"
    type: "(event: FocusEvent) => void"
    description: "The trigger lost focus."
    default: null
    usage: "#tree-single-selection"
  - name: "prefix-click"
    type: "(event: MouseEvent) => void"
    description: "Leading affix click."
    default: null
    usage: "#tree-single-selection"
  - name: "suffix-click"
    type: "(event: MouseEvent) => void"
    description: "Trailing affix click."
    default: null
    usage: "#tree-single-selection"
SLOTS:
  - name: "selected"
    type: Slot
    scope: "{ row: TableRow; label: string }"
    description: "Selected row label in the trigger."
    default: null
    usage: "#custom-rendering"
  - name: "prefix"
    type: "Slot"
    description: "Leading trigger content."
    default: null
    usage: "#custom-rendering"
  - name: "suffix"
    type: Slot
    scope: "{ open: boolean; selectedRow: TableRow | null }"
    description: "Trailing decoration; does not replace reserved trigger actions."
    default: null
    usage: "#custom-rendering"
  - name: "clear-icon"
    type: "Slot"
    description: "Icon inside the clear action."
    default: null
    usage: "#custom-rendering"
  - name: "cell"
    type: Slot
    scope: "TableCellRenderParams"
    description: "Generic data cell slot forwarded to STable."
    default: null
    usage: "#custom-rendering"
  - name: "cell-[key]"
    type: Slot
    scope: "TableCellRenderParams"
    description: "Column-specific data cell slot."
    default: null
    usage: "#custom-rendering"
  - name: "header-cell"
    type: Slot
    scope: "TableHeaderRenderParams"
    description: "Generic header slot forwarded to STable."
    default: null
    usage: "#custom-rendering"
  - name: "header-[key]"
    type: Slot
    scope: "TableHeaderRenderParams"
    description: "Column-specific header slot."
    default: null
    usage: "#custom-rendering"
  - name: "popup-header"
    type: "Slot"
    description: "Content above the popup table."
    default: null
    usage: "#custom-rendering"
  - name: "popup-footer"
    type: Slot
    scope: "{ selectedRow: TableRow | null; close: () => void }"
    description: "Content below the popup table, with a close action."
    default: null
    usage: "#custom-rendering"
  - name: "empty"
    type: "Slot"
    description: "Replace the table empty state."
    default: null
    usage: "#custom-rendering"
EXPOSES:
  - name: "open"
    type: "() => void"
    description: "Request opening the popup; disabled or loading prevents opening."
    default: null
    usage: "#tree-single-selection"
  - name: "close"
    type: "() => void"
    description: "Request closing the popup; controlled mode emits update:open."
    default: null
    usage: "#tree-single-selection"
  - name: "toggleRowExpand"
    type: "(row: TableRow, expanded?: boolean) => Promise<void> | undefined"
    description: "Toggle or set tree expansion through the mounted internal table."
    default: null
    usage: "#tree-single-selection"
  - name: "setExpandedKeys"
    type: "(keys: TableRowKey[]) => void"
    description: "Set expanded tree keys through the internal table."
    default: null
    usage: "#tree-single-selection"
  - name: "scrollToRow"
    type: "(rowOrIndex: TableRow | TableRowKey, align?: 'auto' | 'start' | 'center' | 'end') => void"
    description: "Scroll the mounted table to a row object or key; a number is used as a visible-row index only if no visible key matches."
    default: null
    usage: "#tree-single-selection"
  - name: "measure"
    type: "() => Promise<void> | undefined"
    description: "Remeasure the mounted internal table layout and virtual rows."
    default: null
    usage: "#tree-single-selection"
description: 'Select one or multiple rows from a flat, virtualized, or tree-structured Table.'
---

# Table Select


<card>

## Flat single selection

Bind one row key. Selecting an enabled row closes the popup by default; disabled rows cannot be selected.

<template #example>
<table-select-flat-single />
</template>

<template #template>

@[code{16-33}](../.vuepress/components/table-select/flat-single.vue)

</template>

<template #script>

@[code{1-14}](../.vuepress/components/table-select/flat-single.vue)

</template>

<template #style>

@[code{35-53}](../.vuepress/components/table-select/flat-single.vue)

</template>

</card>

<card>

## Flat multiple selection

Enable `multiple` and bind an array of keys. Toggle rows with clicks or checkboxes; the popup stays open by default. Remove selected tags or clear the selection.

<template #example>
<table-select-flat-multiple />
</template>

<template #template>

@[code{16-34}](../.vuepress/components/table-select/flat-multiple.vue)

</template>

<template #script>

@[code{1-14}](../.vuepress/components/table-select/flat-multiple.vue)

</template>

<template #style>

@[code{36-54}](../.vuepress/components/table-select/flat-multiple.vue)

</template>

</card>

<card>

## Tree single selection

Use `tree-config` for hierarchical data. This example uses `selectable` to allow leaf selection; parent nodes expand and collapse.

<template #example>
<table-select-tree-single />
</template>

<template #template>

@[code{22-44}](../.vuepress/components/table-select/tree-single.vue)

</template>

<template #script>

@[code{1-20}](../.vuepress/components/table-select/tree-single.vue)

</template>

<template #style>

@[code{46-64}](../.vuepress/components/table-select/tree-single.vue)

</template>

</card>

<card>

## Tree multiple selection

`multiple` works with flat and tree data. Bind an array of row keys; the popup stays open by default. Selected tags can be removed and collapse beyond `max-collapse-tags`. Tree selection links loaded selectable descendants and derives parent check states independently of the checked-strategy output; disabled branches are excluded. Set `check-strictly` for independent selection. The default `checked-strategy="leaf"` outputs selectable leaves; `all` outputs all checked nodes and `parent` compresses fully checked branches. The strategy controls both model keys and tags while parent check states remain derived. Unloaded nodes are not automatically selected.

<template #example>
<table-select-multiple />
</template>

<template #template>

@[code{32-72}](../.vuepress/components/table-select/multiple.vue)

</template>

<template #script>

@[code{1-30}](../.vuepress/components/table-select/multiple.vue)

</template>

<template #style>

@[code{74-104}](../.vuepress/components/table-select/multiple.vue)

</template>

</card>

<card>

## Size

Compare the inherited `small`, `default`, and `large` component sizes.

<template #example><table-select-size /></template>

<template #template>

@[code{13-39}](../.vuepress/components/table-select/size.vue)

</template>

<template #script>

@[code{1-11}](../.vuepress/components/table-select/size.vue)

</template>

<template #style>

@[code{41-48}](../.vuepress/components/table-select/size.vue)

</template>

</card>

<card>

## Shape

Use `shape="square"` to apply square geometry to the selector trigger and the shared Table popup surface.

<template #example><table-select-shape /></template>

<template #template>

@[code{19-45}](../.vuepress/components/table-select/shape.vue)

</template>

<template #script>

@[code{1-17}](../.vuepress/components/table-select/shape.vue)

</template>

<template #style>

@[code{47-59}](../.vuepress/components/table-select/shape.vue)

</template>

</card>

<card>

## Large tree data

The expanded tree contains 10,000 leaf nodes. `virtual-config` keeps the popup bounded and mounts only the visible row window.

<template #example><table-select-large-tree /></template>

<template #template>

@[code{49-68}](../.vuepress/components/table-select/large-tree.vue)

</template>

<template #script>

@[code{1-47}](../.vuepress/components/table-select/large-tree.vue)

</template>

<template #style>

@[code{70-80}](../.vuepress/components/table-select/large-tree.vue)

</template>

</card>

<card>

## Large table data

A regular three-column Table can use the same virtualized selector shell. This example contains 10,000 flat rows with dynamic measurement.

<template #example><table-select-large-table /></template>

<template #template>

@[code{44-59}](../.vuepress/components/table-select/large-table.vue)

</template>

<template #script>

@[code{1-42}](../.vuepress/components/table-select/large-table.vue)

</template>

<template #style>

@[code{61-71}](../.vuepress/components/table-select/large-table.vue)

</template>

</card>

<card>

## Custom rendering

Customize table cells with column slots and named renderers, and use `selected` to render the trigger value. Advanced table rendering rules remain part of Table.

Use `columns.slots.default` or `columns.slots.header` to assign custom column slot names. Column slots and trigger affixes may be added or removed conditionally after mounting. The selector reserves `prefix`, `suffix`, `clear-icon`, `selected`, `empty`, `popup-header` and `popup-footer`; use other names for table content. The selected-value slot receives `{ row, label }`, while data and header slots retain their Table render parameters.

<template #example><table-select-custom-render /></template>

<template #template>

@[code{48-88}](../.vuepress/components/table-select/custom-render.vue)

</template>

<template #script>

@[code{1-46}](../.vuepress/components/table-select/custom-render.vue)

</template>

<template #style>

@[code{90-129}](../.vuepress/components/table-select/custom-render.vue)

</template>

</card>

<card>

## Loading

Set `loading` while options or values are being loaded. The trailing indicator matches Input and Select; current values stay visible and interaction resumes when loading ends.

<template #example>
<table-select-loading />
</template>

<template #template>

@[code{1-26}](../.vuepress/components/table-select/loading.vue)

</template>

<template #script>

@[code{28-43}](../.vuepress/components/table-select/loading.vue)

</template>

<template #style>

@[code{45-58}](../.vuepress/components/table-select/loading.vue)

</template>

</card>
