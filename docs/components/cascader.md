---
description: 'Select associated data level by level in one popup.'
PROPS:
  - name: v-model / model-value
    type: CascaderPathValue | CascaderPathValue[]
    values: single path or multiple paths
    description: Bind the current selection. Single mode uses one path; multiple mode uses an array of paths.
    default: '[]'
  - name: options / field-names
    type: CascaderOption[] / Object
    values: value | label | children | disabled | isLeaf
    description: Configure hierarchical data and map custom field names.
    default: '[] / {}'
  - name: multiple / show-checked-strategy
    type: Boolean / SHOW_PARENT | SHOW_CHILD
    values: true | false / SHOW_PARENT | SHOW_CHILD
    description: Enable associated multiple selection and choose parent or leaf path output.
    default: false / SHOW_PARENT
    usage: '#multiple-and-display-strategy'
  - name: max-tag-count / max-tag-placeholder
    type: Number | responsive / Function
    values: number | responsive
    description: Limit multiple tags; responsive mode collapses overflow into +N based on available width.
    default: responsive / -
    usage: '#multiple-and-display-strategy'
  - name: show-search / search-value
    type: Boolean | Object / String
    values: filter | sort | limit | matchInputWidth
    description: Enable highlighted path search with custom filtering, sorting, limits, and a controlled search value.
    default: false / -
    usage: '#search-and-field-mapping'
  - name: change-on-select / check-strictly
    type: Boolean
    values: true | false
    description: Allow selecting intermediate levels in single mode; check-strictly remains as a compatibility alias.
    default: false
  - name: expand-trigger / load-data
    type: click | hover / Function
    values: click | hover
    description: Configure expansion or lazily load children from selectedOptions. load-data and show-search are mutually exclusive.
    default: click / -
  - name: allow-clear / clearable / disabled / loading / block
    type: Boolean
    values: true | false
    description: Control clearing, disabled/loading states, and full-width layout. clearable remains an alias.
    default: true / false / false / false / false
  - name: placeholder / separator / display-render / not-found-content
    type: String / String / Function / String
    values: display content
    description: Configure the placeholder, path separator, selected-value formatting, and empty state.
    default: locale / ' / ' / - / locale
  - name: open / default-open / placement / teleported
    type: Boolean / Boolean / Placement / Boolean
    values: Popper placement
    description: Control popup visibility, initial visibility, placement, and teleporting.
    default: '- / false / bottom-start / true'
  - name: popup-config / popup-class-name / dropdown-style
    type: Object / String / CSSProperties
    values: full | width | minWidth | maxWidth | maxHeight | placement | transfer | appendTo | offset | zIndex | className | style
    description: Configure popup dimensions, mount target, offset, stacking, and custom styles.
    default: '{} / - / {}'
EVENTS:
  - name: change
    description: Fires with value and selectedOptions when selection changes.
  - name: search
    description: Fires when the search value changes.
  - name: dropdown-visible-change
    description: Fires when popup visibility changes.
  - name: clear / remove-tag / load
    description: Fire when clearing, removing a multiple tag, or finishing lazy loading.
  - name: focus / blur
    description: Fire when the control gains or loses focus.
SLOTS:
  - name: option / searchResult
    type: scoped slot
    values: option | path | selected | active
    description: Customize normal options or search results.
  - name: tag-render / max-tag-placeholder / display-render
    type: scoped slot
    values: label | option | path | omittedValues | labels | selectedOptions
    description: Customize multiple tags, overflow count, and single selected content.
  - name: suffix-icon / clear-icon / expand-icon / empty
    type: slot
    values: '-'
    description: Customize suffix, clear and expand icons, or empty state.
  - name: header / footer
    type: slot
    values: '-'
    description: Append content above or below the option area.
---

# Cascader

<card>

## Basic selection

Selection commits on a leaf by default. Use `change-on-select` to commit at any level. The legacy `clearable` and `check-strictly` properties remain compatible.

<template #example><cascader-default /></template>

<template #template>

@[code](../.vuepress/components/cascader/default.vue)

</template>

</card>

<card>

## Search and field mapping

`show-search` searches complete paths and highlights matches. Its object form accepts `filter`, `sort`, and `limit`; `field-names` maps non-standard option data.

<template #example><cascader-search /></template>

<template #template>

@[code](../.vuepress/components/cascader/search.vue)

</template>

</card>

<card>

## Multiple and display strategy

`multiple` enables associated parent-child selection. `SHOW_PARENT` compresses fully selected branches; `SHOW_CHILD` keeps leaf paths. Tags collapse into `+N` according to available width by default.

<template #example><cascader-multiple /></template>

<template #template>

@[code](../.vuepress/components/cascader/multiple.vue)

</template>

</card>

<card>

## Hover expansion and lazy loading

Use `expand-trigger="hover"` to expand on hover. For lazy nodes, set `isLeaf` to `false` and assign `children` in `load-data`; lazy loading and local path search are mutually exclusive.

<template #example><cascader-lazy /></template>

<template #template>

@[code](../.vuepress/components/cascader/lazy.vue)

</template>

</card>

<card>

## Popup and content customization

`popup-config` matches Select and supports trigger width matching, size constraints, mount targets, offsets, and styles. Use `header`, `footer`, and `option` slots to customize content.

<template #example><cascader-popup /></template>

<template #template>

@[code](../.vuepress/components/cascader/popup.vue)

</template>

</card>

## API
