---
PROPS:
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
    type: TableRow[]
    values: "Table data-mode configuration"
    description: Data and columns passed directly to the internal STable.
    default: '[]'
  - name: columns
    type: TableColumn[]
    values: "Table data-mode configuration"
    description: Data and columns passed directly to the internal STable.
    default: '[]'
  - name: row-key
    type: String | Function
    values: "stable row key and trigger label resolver"
    description: Resolve the bound key and the selected text shown in the trigger.
    default: 'id'
  - name: label-key
    type: String
    values: "stable row key and trigger label resolver"
    description: Resolve the bound key and the selected text shown in the trigger.
    default: 'label'
  - name: label-formatter
    type: Function
    values: "stable row key and trigger label resolver"
    description: Resolve the bound key and the selected text shown in the trigger.
    default: null
  - name: tree-config
    type: TableTreeConfig
    values: "children | indent | expandAll | defaultExpandedKeys | expandOnClickRow | hasChildren | load"
    description: Enable Table tree-data mode and control expanded rows.
    default: null
  - name: expanded-keys
    type: Array
    values: "children | indent | expandAll | defaultExpandedKeys | expandOnClickRow | hasChildren | load"
    description: Enable Table tree-data mode and control expanded rows.
    default: null
  - name: virtual-config
    type: Boolean | TableVirtualConfig
    values: "true / false / '{ height, estimateSize, overscan, dynamic }'"
    description: Enable STable row virtualization for large flat or tree data.
    default: 'false'
  - name: renderers
    type: Object
    values: "Table renderer map and row callbacks"
    description: Configure Table rendering, row classes, and whether a row can be selected.
    default: '{}'
  - name: row-class
    type: String | Function
    values: "Table renderer map and row callbacks"
    description: Configure Table rendering, row classes, and whether a row can be selected.
    default: null
  - name: selectable
    type: Function
    values: "Table renderer map and row callbacks"
    description: Configure Table rendering, row classes, and whether a row can be selected.
    default: null
  - name: show-header
    type: Boolean
    values: "true / false"
    description: Configure the internal Table header, stripes, loading state, and selection closing behavior.
    default: 'true'
  - name: striped
    type: Boolean
    values: "true / false"
    description: Configure the internal Table header, stripes, loading state, and selection closing behavior.
    default: 'false'
  - name: table-loading
    type: Boolean
    values: "true / false"
    description: Configure the internal Table header, stripes, loading state, and selection closing behavior.
    default: 'false'
  - name: close-on-select
    type: Boolean
    values: "true / false"
    description: Configure the internal Table header, stripes, loading state, and selection closing behavior.
    default: 'true'
  - name: clearable
    type: Boolean
    values: "true | false / square / theme or custom color"
    description: Configure the selector trigger, feedback, width, shape and validation state.
    default: 'false'
  - name: loading
    type: Boolean
    values: "true | false / square / theme or custom color"
    description: Configure the selector trigger, feedback, width, shape and validation state.
    default: 'false'
  - name: block
    type: Boolean
    values: "true | false / square / theme or custom color"
    description: Configure the selector trigger, feedback, width, shape and validation state.
    default: 'false'
  - name: shape
    type: String
    values: "rounded | square"
    description: Apply rounded or square geometry to the selector trigger and popup surface.
    default: rounded
    usage: '#shape'
  - name: color
    type: Color
    values: "true | false / square / theme or custom color"
    description: Configure the selector trigger, feedback, width, shape and validation state.
    default: 'primary'
  - name: state
    type: Color
    values: "true | false / square / theme or custom color"
    description: Configure the selector trigger, feedback, width, shape and validation state.
    default: null
  - name: prefix-icon
    type: String
    values: "icon name or '{ icon, content }'"
    description: Add leading and trailing trigger content. Slots take precedence.
    default: null
  - name: suffix-icon
    type: String
    values: "icon name or '{ icon, content }'"
    description: Add leading and trailing trigger content. Slots take precedence.
    default: null
  - name: prefix-config
    type: Object
    values: "icon name or '{ icon, content }'"
    description: Add leading and trailing trigger content. Slots take precedence.
    default: null
  - name: suffix-config
    type: Object
    values: "icon name or '{ icon, content }'"
    description: Add leading and trailing trigger content. Slots take precedence.
    default: null
  - name: open
    type: Boolean
    values: "true"
    description: Control the popup or provide its initial visibility.
    default: null
  - name: default-open
    type: Boolean
    values: "false"
    description: Control the popup or provide its initial visibility.
    default: 'false'
  - name: popup-config
    type: Object
    values: "width | full | matchTriggerWidth | minWidth | maxWidth | height | maxHeight | placement | transfer | appendTo | offset | zIndex | className | style"
    description: Configure the shared Popper sizing, placement and transfer target.
    default: '{}'
  - name: placement
    type: String
    values: "width | full | matchTriggerWidth | minWidth | maxWidth | height | maxHeight | placement | transfer | appendTo | offset | zIndex | className | style"
    description: Configure the shared Popper sizing, placement and transfer target.
    default: 'bottom-start'
  - name: teleported
    type: Boolean
    values: "width | full | matchTriggerWidth | minWidth | maxWidth | height | maxHeight | placement | transfer | appendTo | offset | zIndex | className | style"
    description: Configure the shared Popper sizing, placement and transfer target.
    default: 'true'
  - name: flip
    type: Boolean
    values: "width | full | matchTriggerWidth | minWidth | maxWidth | height | maxHeight | placement | transfer | appendTo | offset | zIndex | className | style"
    description: Configure the shared Popper sizing, placement and transfer target.
    default: 'true'
  - name: strategy
    type: String
    values: "width | full | matchTriggerWidth | minWidth | maxWidth | height | maxHeight | placement | transfer | appendTo | offset | zIndex | className | style"
    description: Configure the shared Popper sizing, placement and transfer target.
    default: 'absolute'
EVENTS:
  - name: change
    description: Selection, clearing, and Table row or cell interaction events.
  - name: clear
    description: Selection, clearing, and Table row or cell interaction events.
  - name: row-click
    description: Selection, clearing, and Table row or cell interaction events.
  - name: cell-click
    description: Selection, clearing, and Table row or cell interaction events.
  - name: update:expanded-keys
    description: Events forwarded from the internal STable.
  - name: tree-expand
    description: Events forwarded from the internal STable.
  - name: lazy-load
    description: Events forwarded from the internal STable.
  - name: scroll
    description: Events forwarded from the internal STable.
  - name: visible-change
    description: Trigger and popup visibility events.
  - name: update:open
    description: Trigger and popup visibility events.
  - name: focus
    description: Trigger and popup visibility events.
  - name: blur
    description: Trigger and popup visibility events.
SLOTS:
  - name: selected
    type: scoped slot
    description: Customize the selected value and trigger affixes.
  - name: prefix
    type: scoped slot
    description: Customize the selected value and trigger affixes.
  - name: suffix
    type: scoped slot
    description: Customize the selected value and trigger affixes.
  - name: clear-icon
    type: scoped slot
    description: Customize the selected value and trigger affixes.
  - name: cell
    type: scoped slot
    description: STable cell and header slots forwarded without changing their scope.
  - name: cell-[key]
    type: scoped slot
    description: STable cell and header slots forwarded without changing their scope.
  - name: header-cell
    type: scoped slot
    description: STable cell and header slots forwarded without changing their scope.
  - name: header-[key]
    type: scoped slot
    description: STable cell and header slots forwarded without changing their scope.
  - name: popup-header
    type: scoped slot
    description: Customize popup framing and the empty state.
  - name: popup-footer
    type: scoped slot
    description: Customize popup framing and the empty state.
  - name: empty
    type: scoped slot
    description: Customize popup framing and the empty state.
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
