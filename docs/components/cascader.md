---
description: 'Select associated data level by level in one popup.'
PROPS:
  - name: shape
    type: String
    values: "rounded | square"
    description: Apply the selected geometry to the trigger, tags, and popup surface.
    default: rounded
    usage: '#shape'
  - name: v-model
    type: CascaderPathValue | CascaderPathValue[]
    values: "single path or multiple paths"
    description: Bind the current selection. Single mode uses one path; multiple mode uses an array of paths.
    default: '[]'
  - name: model-value
    type: CascaderPathValue | CascaderPathValue[]
    values: "single path or multiple paths"
    description: Bind the current selection. Single mode uses one path; multiple mode uses an array of paths.
    default: '[]'
  - name: options
    type: CascaderOption[]
    values: "value | label | children | disabled | isLeaf"
    description: Configure hierarchical data and map custom field names.
    default: '[]'
  - name: field-names
    type: Object
    values: "value | label | children | disabled | isLeaf"
    description: Configure hierarchical data and map custom field names.
    default: '{}'
  - name: multiple
    type: Boolean
    values: "true | false"
    description: Enable associated multiple selection and choose parent or leaf path output.
    default: false
    usage: '#multiple-and-display-strategy'
  - name: show-checked-strategy
    type: SHOW_PARENT | SHOW_CHILD
    values: "SHOW_PARENT | SHOW_CHILD"
    description: Enable associated multiple selection and choose parent or leaf path output.
    default: SHOW_PARENT
    usage: '#multiple-and-display-strategy'
  - name: max-tag-count
    type: Number | responsive
    values: "number | responsive"
    description: Limit multiple tags; responsive mode collapses overflow into +N based on available width.
    default: responsive
    usage: '#multiple-and-display-strategy'
  - name: max-tag-placeholder
    type: Function
    values: "number | responsive"
    description: Limit multiple tags; responsive mode collapses overflow into +N based on available width.
    default: null
    usage: '#multiple-and-display-strategy'
  - name: show-search
    type: Boolean | Object
    values: "filter | sort | limit | matchInputWidth"
    description: Enable highlighted path search with custom filtering, sorting, limits, and a controlled search value.
    default: false
    usage: '#search-and-field-mapping'
  - name: search-value
    type: String
    values: "filter | sort | limit | matchInputWidth"
    description: Enable highlighted path search with custom filtering, sorting, limits, and a controlled search value.
    default: null
    usage: '#search-and-field-mapping'
  - name: change-on-select
    type: Boolean
    values: "true | false"
    description: Allow selecting intermediate levels in single mode; check-strictly remains as a compatibility alias.
    default: false
  - name: check-strictly
    type: Boolean
    values: "true | false"
    description: Allow selecting intermediate levels in single mode; check-strictly remains as a compatibility alias.
    default: false
  - name: expand-trigger
    type: click | hover
    values: "click | hover"
    description: Configure expansion or lazily load children from selectedOptions. load-data and show-search are mutually exclusive.
    default: click
  - name: load-data
    type: Function
    values: "click | hover"
    description: Configure expansion or lazily load children from selectedOptions. load-data and show-search are mutually exclusive.
    default: null
  - name: allow-clear
    type: Boolean
    values: "true | false"
    description: Control clearing, disabled/loading states, and full-width layout. clearable remains an alias.
    default: true
  - name: clearable
    type: Boolean
    values: "true | false"
    description: Control clearing, disabled/loading states, and full-width layout. clearable remains an alias.
    default: false
  - name: disabled
    type: Boolean
    values: "true | false"
    description: Control clearing, disabled/loading states, and full-width layout. clearable remains an alias.
    default: false
  - name: loading
    type: Boolean
    values: "true | false"
    description: Control clearing, disabled/loading states, and full-width layout. clearable remains an alias.
    default: false
  - name: block
    type: Boolean
    values: "true | false"
    description: Control clearing, disabled/loading states, and full-width layout. clearable remains an alias.
    default: false
  - name: placeholder
    type: String
    values: "display content"
    description: Configure the placeholder, path separator, selected-value formatting, and empty state.
    default: locale
  - name: separator
    type: String
    values: "display content"
    description: Configure the placeholder, path separator, selected-value formatting, and empty state.
    default: "' / '"
  - name: display-render
    type: Function
    values: "display content"
    description: Configure the placeholder, path separator, selected-value formatting, and empty state.
    default: null
  - name: not-found-content
    type: String
    values: "display content"
    description: Configure the placeholder, path separator, selected-value formatting, and empty state.
    default: locale
  - name: open
    type: Boolean
    values: "Popper placement"
    description: Control popup visibility, initial visibility, placement, and teleporting.
    default: null
  - name: default-open
    type: Boolean
    values: "Popper placement"
    description: Control popup visibility, initial visibility, placement, and teleporting.
    default: 'false'
  - name: placement
    type: Placement
    values: "Popper placement"
    description: Control popup visibility, initial visibility, placement, and teleporting.
    default: 'bottom-start'
  - name: teleported
    type: Boolean
    values: "Popper placement"
    description: Control popup visibility, initial visibility, placement, and teleporting.
    default: 'true'
  - name: popup-config
    type: Object
    values: "full | width | minWidth | maxWidth | maxHeight | placement | transfer | appendTo | offset | zIndex | className | style"
    description: Configure popup dimensions, mount target, offset, stacking, and custom styles.
    default: '{}'
  - name: popup-class-name
    type: String
    values: "full | width | minWidth | maxWidth | maxHeight | placement | transfer | appendTo | offset | zIndex | className | style"
    description: Configure popup dimensions, mount target, offset, stacking, and custom styles.
    default: null
  - name: dropdown-style
    type: CSSProperties
    values: "full | width | minWidth | maxWidth | maxHeight | placement | transfer | appendTo | offset | zIndex | className | style"
    description: Configure popup dimensions, mount target, offset, stacking, and custom styles.
    default: '{}'
EVENTS:
  - name: change
    description: Fires with value and selectedOptions when selection changes.
  - name: search
    description: Fires when the search value changes.
  - name: dropdown-visible-change
    description: Fires when popup visibility changes.
  - name: clear
    description: Fire when clearing, removing a multiple tag, or finishing lazy loading.
  - name: remove-tag
    description: Fire when clearing, removing a multiple tag, or finishing lazy loading.
  - name: load
    description: Fire when clearing, removing a multiple tag, or finishing lazy loading.
  - name: focus
    description: Fire when the control gains or loses focus.
  - name: blur
    description: Fire when the control gains or loses focus.
SLOTS:
  - name: option
    type: scoped slot
    values: "option | path | selected | active"
    description: Customize normal options or search results.
  - name: searchResult
    type: scoped slot
    values: "option | path | selected | active"
    description: Customize normal options or search results.
  - name: tag-render
    type: scoped slot
    values: "label | option | path | omittedValues | labels | selectedOptions"
    description: Customize multiple tags, overflow count, and single selected content.
  - name: max-tag-placeholder
    type: scoped slot
    values: "label | option | path | omittedValues | labels | selectedOptions"
    description: Customize multiple tags, overflow count, and single selected content.
  - name: display-render
    type: scoped slot
    values: "label | option | path | omittedValues | labels | selectedOptions"
    description: Customize multiple tags, overflow count, and single selected content.
  - name: suffix-icon
    type: slot
    values: "-"
    description: Customize suffix, clear and expand icons, or empty state.
  - name: clear-icon
    type: slot
    values: "-"
    description: Customize suffix, clear and expand icons, or empty state.
  - name: expand-icon
    type: slot
    values: "-"
    description: Customize suffix, clear and expand icons, or empty state.
  - name: empty
    type: slot
    values: "-"
    description: Customize suffix, clear and expand icons, or empty state.
  - name: header
    type: slot
    values: "-"
    description: Append content above or below the option area.
  - name: footer
    type: slot
    values: "-"
    description: Append content above or below the option area.
---

# Cascader

<card>

## Basic selection

Selection commits on a leaf by default. Use `change-on-select` to commit at any level. The legacy `clearable` and `check-strictly` properties remain compatible.

<template #example><cascader-default /></template>

<template #template>

@[code{1-6}](../.vuepress/components/cascader/default.vue)

</template>

<template #script>

@[code{8-23}](../.vuepress/components/cascader/default.vue)

</template>

<template #style>

@[code{25-37}](../.vuepress/components/cascader/default.vue)

</template>

</card>

<card>

## Shape

Use `shape="square"` to align the trigger, tags, options, actions, and popup surface to square geometry.

<template #example><cascader-shape /></template>

<template #template>

@[code{19-39}](../.vuepress/components/cascader/shape.vue)

</template>

<template #script>

@[code{1-17}](../.vuepress/components/cascader/shape.vue)

</template>

<template #style>

@[code{41-53}](../.vuepress/components/cascader/shape.vue)

</template>

</card>

<card>

## Search and field mapping

`show-search` searches complete paths and highlights matches. Its object form accepts `filter`, `sort`, and `limit`; `field-names` maps non-standard option data.

<template #example><cascader-search /></template>

<template #template>

@[code{35-77}](../.vuepress/components/cascader/search.vue)

</template>

<template #script>

@[code{1-33}](../.vuepress/components/cascader/search.vue)

</template>

<template #style>

@[code{79-105}](../.vuepress/components/cascader/search.vue)

</template>

</card>

<card>

## Multiple and display strategy

`multiple` enables associated parent-child selection. `SHOW_PARENT` compresses fully selected branches; `SHOW_CHILD` keeps leaf paths. Tags collapse into `+N` according to available width by default.

<template #example><cascader-multiple /></template>

<template #template>

@[code{1-20}](../.vuepress/components/cascader/multiple.vue)

</template>

<template #script>

@[code{22-50}](../.vuepress/components/cascader/multiple.vue)

</template>

<template #style>

@[code{52-58}](../.vuepress/components/cascader/multiple.vue)

</template>

</card>

<card>

## Hover expansion and lazy loading

Use `expand-trigger="hover"` to expand on hover. For lazy nodes, set `isLeaf` to `false` and assign `children` in `load-data`; lazy loading and local path search are mutually exclusive.

<template #example><cascader-lazy /></template>

<template #template>

@[code{1-16}](../.vuepress/components/cascader/lazy.vue)

</template>

<template #script>

@[code{18-53}](../.vuepress/components/cascader/lazy.vue)

</template>

<template #style>

@[code{55-61}](../.vuepress/components/cascader/lazy.vue)

</template>

</card>

<card>

## Popup and content customization

`popup-config` matches Select and supports trigger width matching, size constraints, mount targets, offsets, and styles. Use `header`, `footer`, and `option` slots to customize content.

<template #example><cascader-popup /></template>

<template #template>

@[code{1-22}](../.vuepress/components/cascader/popup.vue)

</template>

<template #script>

@[code{24-39}](../.vuepress/components/cascader/popup.vue)

</template>

<template #style>

@[code{41-49}](../.vuepress/components/cascader/popup.vue)

</template>

</card>
