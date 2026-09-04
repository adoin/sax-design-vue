---
PROPS:
  - name: "empty-text"
    type: "String"
    description: "Text displayed when the table has no rows; falls back to the current locale."
    default: null
    usage: "#tree-data"
  - name: "placeholder"
    type: "String"
    description: "Trigger placeholder when no row is selected; falls back to the current locale."
    default: null
    usage: "#tree-data"
  - name: "disabled"
    type: "Boolean"
    description: "Disable trigger actions and close an open popup."
    default: false
    values: "true | false"
    usage: "#tree-data"
  - name: model-value
    type: String | Number
    values: "row key"
    description: Key of the selected row, resolved through row-key.
    default: null
  - name: v-model
    type: String | Number
    values: "row key"
    description: Key of the selected row, resolved through row-key.
    default: null
  - name: data
    type: "TableRow[]"
    values: ""
    description: "Rows passed to STable; children follow tree-config."
    default: "[]"
    usage: "#tree-data"
  - name: columns
    type: "TableColumn[]"
    values: ""
    description: "Column configuration forwarded to STable."
    default: "[]"
    usage: "#tree-data"
  - name: row-key
    type: "TableRowKeyGetter"
    values: ""
    description: "Stable row key field or resolver; the selected key is the model value."
    default: "id"
    usage: "#tree-data"
  - name: label-key
    type: "String"
    values: ""
    description: "Field path used for the trigger label; falls back to the selected key."
    default: "label"
    usage: "#tree-data"
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
    usage: "#tree-data"
  - name: expanded-keys
    type: "TableRowKey[]"
    values: ""
    description: "Controlled tree expansion keys; bind with v-model:expanded-keys."
    default: null
    usage: "#tree-data"
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
    usage: "#tree-data"
  - name: selectable
    type: "TableSelectSelectable"
    values: ""
    description: "Return false to prevent selecting a row. Rows with disabled set remain unselectable."
    default: null
    usage: "#tree-data"
  - name: show-header
    type: "Boolean"
    values: "true | false"
    description: "Show the table column headers."
    default: true
    usage: "#tree-data"
  - name: striped
    type: "Boolean"
    values: "true | false"
    description: "Use alternating row backgrounds."
    default: false
    usage: "#tree-data"
  - name: table-loading
    type: "Boolean"
    values: "true | false"
    description: "Show the internal table loading state."
    default: false
    usage: "#tree-data"
  - name: close-on-select
    type: "Boolean"
    values: "true | false"
    description: "Close the popup after accepting a row selection."
    default: true
    usage: "#tree-data"
  - name: clearable
    type: "Boolean"
    values: "true | false"
    description: "Show a clear action for the selected value."
    default: false
    usage: "#tree-data"
  - name: loading
    type: "Boolean"
    values: "true | false"
    description: "Show trigger loading feedback, block interaction and close the popup."
    default: false
    usage: "#tree-data"
  - name: block
    type: "Boolean"
    values: "true | false"
    description: "Make the trigger fill the available width."
    default: false
    usage: "#tree-data"
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
    usage: "#tree-data"
  - name: state
    type: "Color"
    values: ""
    description: "State color; when provided, takes precedence over color."
    default: null
    usage: "#tree-data"
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
    usage: "#tree-data"
  - name: default-open
    type: "Boolean"
    values: "true | false"
    description: "Initial popup visibility when open is not controlled."
    default: false
    usage: "#tree-data"
  - name: popup-config
    type: "TableSelectPopupConfig"
    values: ""
    description: "Popup size, position and mount target; configured fields override their corresponding top-level props."
    default: "{}"
    usage: "#tree-data"
  - name: placement
    type: "String"
    values: ""
    description: "Preferred popup placement relative to the trigger."
    default: "bottom-start"
    usage: "#tree-data"
  - name: teleported
    type: "Boolean"
    values: "true | false"
    description: "Teleport the popup outside ancestor clipping containers."
    default: true
    usage: "#tree-data"
  - name: flip
    type: "Boolean"
    values: "true | false"
    description: "Flip the popup placement when viewport space is insufficient."
    default: true
    usage: "#tree-data"
  - name: strategy
    type: "String"
    values: "absolute | fixed"
    description: "Positioning strategy passed to the shared Popper."
    default: "absolute"
    usage: "#tree-data"
EVENTS:
  - name: "update:modelValue"
    type: "(value: TableRowKey | undefined) => void"
    description: "Selected key update; clearing emits undefined."
    default: null
    usage: "#tree-data"
  - name: "update:open"
    type: "(value: boolean) => void"
    description: "Request a popup visibility update."
    default: null
    usage: "#tree-data"
  - name: "update:expanded-keys"
    type: "(keys: TableRowKey[]) => void"
    description: "Tree expansion keys updated by STable."
    default: null
    usage: "#tree-data"
  - name: "visible-change"
    type: "(value: boolean) => void"
    description: "An accepted open or close request; controlled visibility still depends on open."
    default: null
    usage: "#tree-data"
  - name: "change"
    type: "(value: TableRowKey, row: TableRow) => void"
    description: "A selectable row was chosen; clearing uses clear instead."
    default: null
    usage: "#tree-data"
  - name: "clear"
    type: "() => void"
    description: "The clear action was activated."
    default: null
    usage: "#tree-data"
  - name: "row-click"
    type: "(row: TableRow, event: MouseEvent) => void"
    description: "Table row click, including clicks on unselectable rows."
    default: null
    usage: "#tree-data"
  - name: "cell-click"
    type: "(params: TableCellRenderParams, event: MouseEvent) => void"
    description: "Table data cell click with its render context."
    default: null
    usage: "#tree-data"
  - name: "tree-expand"
    type: "(row: TableRow, expanded: boolean) => void"
    description: "A tree row expanded or collapsed."
    default: null
    usage: "#tree-data"
  - name: "lazy-load"
    type: "(row: TableRow, children: TableRow[]) => void"
    description: "Lazy child rows finished loading."
    default: null
    usage: "#tree-data"
  - name: "scroll"
    type: "(event: Event) => void"
    description: "Internal table viewport scroll event."
    default: null
    usage: "#tree-data"
  - name: "focus"
    type: "(event: FocusEvent) => void"
    description: "The trigger received focus."
    default: null
    usage: "#tree-data"
  - name: "blur"
    type: "(event: FocusEvent) => void"
    description: "The trigger lost focus."
    default: null
    usage: "#tree-data"
  - name: "prefix-click"
    type: "(event: MouseEvent) => void"
    description: "Leading affix click."
    default: null
    usage: "#tree-data"
  - name: "suffix-click"
    type: "(event: MouseEvent) => void"
    description: "Trailing affix click."
    default: null
    usage: "#tree-data"
SLOTS:
  - name: "selected"
    type: "{ row: TableRow; label: string }"
    description: "Selected row label in the trigger."
    default: null
    usage: "#custom-rendering"
  - name: "prefix"
    type: "Slot"
    description: "Leading trigger content."
    default: null
    usage: "#custom-rendering"
  - name: "suffix"
    type: "{ open: boolean; selectedRow: TableRow | null }"
    description: "Trailing decoration; does not replace reserved trigger actions."
    default: null
    usage: "#custom-rendering"
  - name: "clear-icon"
    type: "Slot"
    description: "Icon inside the clear action."
    default: null
    usage: "#custom-rendering"
  - name: "cell"
    type: "TableCellRenderParams"
    description: "Generic data cell slot forwarded to STable."
    default: null
    usage: "#custom-rendering"
  - name: "cell-[key]"
    type: "TableCellRenderParams"
    description: "Column-specific data cell slot."
    default: null
    usage: "#custom-rendering"
  - name: "header-cell"
    type: "TableHeaderRenderParams"
    description: "Generic header slot forwarded to STable."
    default: null
    usage: "#custom-rendering"
  - name: "header-[key]"
    type: "TableHeaderRenderParams"
    description: "Column-specific header slot."
    default: null
    usage: "#custom-rendering"
  - name: "popup-header"
    type: "Slot"
    description: "Content above the popup table."
    default: null
    usage: "#custom-rendering"
  - name: "popup-footer"
    type: "{ selectedRow: TableRow | null; close: () => void }"
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
    usage: "#tree-data"
  - name: "close"
    type: "() => void"
    description: "Request closing the popup; controlled mode emits update:open."
    default: null
    usage: "#tree-data"
  - name: "toggleRowExpand"
    type: "(row: TableRow, expanded?: boolean) => Promise<void> | undefined"
    description: "Toggle or set tree expansion through the mounted internal table."
    default: null
    usage: "#tree-data"
  - name: "setExpandedKeys"
    type: "(keys: TableRowKey[]) => void"
    description: "Set expanded tree keys through the internal table."
    default: null
    usage: "#tree-data"
  - name: "scrollToRow"
    type: "(rowOrIndex: TableRow | TableRowKey, align?: 'auto' | 'start' | 'center' | 'end') => void"
    description: "Scroll the mounted table to a row object or key; a number is used as a visible-row index only if no visible key matches."
    default: null
    usage: "#tree-data"
  - name: "measure"
    type: "() => Promise<void> | undefined"
    description: "Remeasure the mounted internal table layout and virtual rows."
    default: null
    usage: "#tree-data"
description: 'Select a row from a flat, virtualized, or tree-structured Table.'
---

# Table select

<card>

## Tree data

Tree selection is one Table data mode. Parent rows expand in place while selectable leaf rows update the bound key.

<template #example><table-select-tree /></template>

<template #template>

@[code{36-55}](../.vuepress/components/table-select/tree.vue)

</template>

<template #script>

@[code{1-34}](../.vuepress/components/table-select/tree.vue)

</template>

<template #style>

@[code{57-67}](../.vuepress/components/table-select/tree.vue)

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

Column slots, named renderers, and the selected-value slot are forwarded through TableSelect. Advanced rendering rules remain part of Table.

<template #example><table-select-custom-render /></template>

<template #template>

@[code{61-89}](../.vuepress/components/table-select/custom-render.vue)

</template>

<template #script>

@[code{1-59}](../.vuepress/components/table-select/custom-render.vue)

</template>

<template #style>

@[code{91-130}](../.vuepress/components/table-select/custom-render.vue)

</template>

</card>
