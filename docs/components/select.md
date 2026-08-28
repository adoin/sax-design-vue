---
description: 'Choose one or more values from a searchable option list.'
PROPS:
  - name: label-float
    type: Boolean
    values: true | false
    description: Float the label when the field has focus or a selected value.
    default: false
    link: null
    usage: '#label'
  - name: v-model / model-value / not-value
    type: String | Number | Array
    values: option value or values
    description: Bind selected values and optionally configure the value treated as empty.
    default: '-'
    link: null
    usage: '#default'
  - name: block / shape / fit / strategy
    type: Boolean / String / Boolean / String
    values: true | false / square / true | false / absolute | fixed
    description: Control field width, shape and popup positioning strategy.
    default: 'false / - / false / absolute'
    link: null
    usage: '#default'
  - name: clearable / hide-scrollbar / native-scrollbar
    type: Boolean
    values: true | false
    description: Control clear action and dropdown scrollbar rendering.
    default: 'false / false / false'
    link: null
    usage: '#default'
  - name: filter-config / filter-method / remote / remote-config / remote-method
    type: Object / Function / Boolean / Object / Function
    values: filter and remote data configuration
    description: Configure local filtering or asynchronous remote options.
    default: '-'
    link: null
    usage: '#filter'
  - name: popup-config / show-after / hide-after / loading-text / no-data-text / no-match-text
    type: Object / Number / Number / String / String / String
    values: width | full | matchTriggerWidth | minWidth | maxWidth | height | maxHeight | placement | transfer | appendTo | offset | zIndex | className | style
    description: Configure popup sizing, placement, transfer target, class and inline style, plus delay and feedback states.
    default: '-'
    link: null
    usage: '#default'
  - name: color
    type: Color
    values: Main colors of Sax Design, RGB, HEX
    description: Change the color of the component.
    default: primary
    link: null
    usage: '#color'
    code: null
  - name: loading
    type: Boolean
    values: true, false
    description: Determine if the component is in the loading state and add an animation.
    default: false
    link: null
    usage: '#loading'
    code: null
  - name: flip
    state:
      text: New
    type: Boolean
    values: true, false
    description: Changes the placement of the options element to keep it in view.
    default: true
    link: null
    usage: '#default'
    code: null
  - name: teleported
    state:
      text: New
    type: Boolean
    values: true, false
    description: whether select dropdown is teleported to the body
    default: false
    link: null
    usage: null
    code: null
  - name: placeholder
    type: String
    values: String
    description: Add a placeholder to the component.
    default: null
    link: null
    usage: '#default'
    code: null
  - name: label
    type: String
    values: String
    description: Add a label to the composite select.
    default: null
    link: null
    usage: '#label'
    code: null
  - name: label-placeholder
    type: String
    values: String
    description: Add a placeholder that when in focus or with value becomes a label.
    default: null
    link: null
    usage: '#label'
    code: null
  - name: filter
    type: Boolean
    values: true, false
    description: Add the functionality to filter the select options.
    default: false
    link: null
    usage: '#filter'
    code: null
  - name: default-first-option
    state:
      text: New
    type: Boolean
    values: true, false
    description: select first matching option on enter key. Use with `filter`
    default: false
    link: null
    usage: '#filter'
    code: null
  - name: allow-create
    state:
      text: New
    type: Boolean
    values: true, false
    description: Whether creating new items is allowed. To use this, `filter` must be true
    default: false
    link: null
    usage: '#filter'
    code: null
  - name: multiple
    type: Boolean
    values: true, false
    description: Add the functionality of being able to select several options from a select.
    default: false
    link: null
    usage: '#multiple'
    code: null
  - name: multiple-limit
    state:
      text: New
    type: Number
    values: number
    description: Maximum number of options user can select when `multiple` is `true`. No limit when set to 0
    default: 0
    link: null
    usage: '#multiple'
    code: null
  - name: state
    type: String
    values: Theme colors
    description: Change the state of the component to the color provided.
    default: false
    link: null
    usage: '#state'
    code: null
  - name: disabled
    type: Boolean
    values: true, false
    description: Determine if the component is in the disabled state.
    default: false
    link: null
    usage: null
    code: null
  - name: collapse-chips
    type: Boolean
    values: true, false
    description: Adaptively collapse tags that do not fit and show the remaining count as `+N`.
    default: true
    link: null
    usage: '#multiple'
    code: null
  - name: max-collapse-chips
    state:
      text: New
    type: Number
    values: number
    description: Optional upper limit for visible tags when collapse-chips is true. Set to 0 to rely only on available width.
    default: 0
    link: null
    usage: '#multiple'
    code: null
  - name: virtual / virtual-config
    state:
      text: New
    type: Boolean / Object
    values: threshold | estimateSize | overscan | dynamic
    description: Window flat data-driven options with TanStack Virtual and optionally measure dynamic row heights. Option groups and custom Option children retain normal rendering.
    default: false / '{}'
    link: null
    usage: '#virtual-options'
    code: null
  - name: pin-key / get-pin-options / pin-method / unpin-method / auto-use-option
    state:
      text: New
    type: String / Function / Function / Function / Boolean
    values: local or remote option pinning configuration
    description: Pin frequently used flat options to the top, persist them locally or remotely, and optionally select the first available option.
    default: '- / - / - / - / false'
    link: null
    usage: '#pinned-options'
    code: null
  - name: cached-options / highlight-search / filter-option / option-visible-method
    type: Array / Boolean / Function / Function
    values: cached options, search highlighting and visibility predicates
    description: Retain remote selected labels and customize matching and final visibility.
    default: '[] / false / - / -'
    usage: '#cached-option-labels'
  - name: multiple-display-mode / get-tag-label / get-display-value
    type: tags | text / Function / Function
    values: multiple-selection display and formatters
    description: Render multiple values as tags or one-line text and customize their labels.
    default: tags / - / -
    usage: '#multiple-selection-tools'
  - name: selection-tools / selection-tool-labels / show-selected-mark / search-placeholder
    type: Array / Object / Boolean / String
    values: all | invert | clear
    description: Configure bulk selection tools, labels, selected marks and the search placeholder.
    default: "[] / {} / false / ''"
    usage: '#multiple-selection-tools'

  - name: option-group:label
    state:
      text: New
    type: String
    values: String
    description: Set label for select group (required)
    default: null
    link: null
    usage: '#group'
    code: null
EVENTS:
  - name: update:modelValue / change
    type: SelectValue
    description: Fire when the selected value changes.
  - name: visible-change
    type: Boolean
    description: Fires when the dropdown opens or closes.
  - name: focus / blur
    type: FocusEvent | Event
    description: Fire when the control gains or loses focus.
  - name: clear
    description: Fires after clearing the current selection.
  - name: remove-tag
    type: SelectOptionValue
    description: Fires when a selected multiple-value tag is removed.
  - name: pin-change
    type: '{ value, pinned, values }'
    description: Fires after an option is pinned or unpinned.
  - name: pin-fetch
    type: '(values: SelectOptionValue[], loaded: Boolean)'
    description: Fires when persisted pinned values finish loading.
SLOTS:
  - name: header / tools / footer
    type: slot
    values: scoped slot
    description: Customize popup header, bulk tools and footer. The footer exposes state and actions without built-in refresh behavior.
    default: null
    usage: '#multiple-selection-tools'
  - name: message-{color}
    type: slot
    values: warn, danger, success
    description: Add a message below the select.
    default: null
    link: null
    usage: '#message'
    code: >
      <s-select
        placeholder="Success"
        v-model="value"
      >
        <template #message-success>
          Option Valid
        </template>
        <s-option label="Sax Design" value="1">
          Sax Design
        </s-option>
        <s-option label="Vue" value="2">
          Vue
        </s-option>
        <s-option label="Javascript" value="3">
          Javascript
        </s-option>
        <s-option label="Sass" value="4">
          Sass
        </s-option>
        <s-option label="Typescript" value="5">
          Typescript
        </s-option>
        <s-option label="Webpack" value="6">
          Webpack
        </s-option>
        <s-option label="Nodejs" value="7">
          Nodejs
        </s-option>
      </s-select>
---

# Select

<card>

## Default

<docs-warn />

Add a select element with the `s-select` component and the `s-option` sub component

<template #example>
<select-default />
</template>

<template #template>

@[code{1-13}](../.vuepress/components/select/default.vue)

</template>

<template #script>

@[code{15-19}](../.vuepress/components/select/default.vue)

</template>

<template #style>

@[code{21-36}](../.vuepress/components/select/default.vue)

</template>

</card>

<card>

## Color

Change the color of the component with the `color` property, the allowed values ​​are the main colors of Sax Design and the colors (**RGB** and **HEX**)

<template #example>
<select-color />
</template>

<template #template>

@[code{1-23}](../.vuepress/components/select/color.vue)

</template>

<template #script>

@[code{25-29}](../.vuepress/components/select/color.vue)

</template>

</card>

<card>

## Label

Add a label to the select easily with the `label` property, you can also add a `label-placeholder` which as its name says is a placeholder that encourages label, and finally the placeholder with the `placeholder` property

<template #example>
<select-label />
</template>

<template #template>

@[code{9-41}](../.vuepress/components/select/label.vue)

</template>

<template #script>

@[code{1-7}](../.vuepress/components/select/label.vue)

</template>

<template #style>

@[code{43-47}](../.vuepress/components/select/label.vue)

</template>

</card>

<card>

## Group

Group options within the select with the sub-component `s-option-group`, as the required prop is the `title` to add a title to the item group

<template #example>
<select-group />
</template>

<template #template>

@[code{1-52}](../.vuepress/components/select/group.vue)

</template>

<template #script>

@[code{54-60}](../.vuepress/components/select/group.vue)

</template>

<template #style>

@[code{62-77}](../.vuepress/components/select/group.vue)

</template>

</card>

<card>

## Filter

You can add the functionality of filtering options with the `filter` property, this property is a `boolean` so you can add it without any value

<template #example>
<select-filter />
</template>

<template #template>

@[code{1-41}](../.vuepress/components/select/filter.vue)

</template>

<template #script>

@[code{43-49}](../.vuepress/components/select/filter.vue)

</template>

<template #style>

@[code{51-66}](../.vuepress/components/select/filter.vue)

</template>

</card>

<card>

## Multiple

Add the functionality of multiple selection of options with the `multiple` property, this property is a `boolean` so you can add it without any value

Multiple Selects measure their available width by default and automatically replace tags that do not fit with `+N`. Set `collapse-chips` to `false` to allow tags to wrap; `max-collapse-chips` is only an optional upper limit.

::: tip
The value of the select must be an array
:::

<template #example>
<select-multiple />
</template>

<template #template>

@[code{1-54}](../.vuepress/components/select/multiple.vue)

</template>

<template #script>

@[code{56-62}](../.vuepress/components/select/multiple.vue)

</template>

<template #style>

@[code{64-72}](../.vuepress/components/select/multiple.vue)

</template>

</card>

<card>

## Loading

Add a loading animation to the select with the `loading` property, this property is a `boolean` so you can add it without any value

<template #example>
<select-loading />
</template>

<template #template>

@[code{1-23}](../.vuepress/components/select/loading.vue)

</template>

<template #script>

@[code{25-30}](../.vuepress/components/select/loading.vue)

</template>

<template #style>

@[code{32-48}](../.vuepress/components/select/loading.vue)

</template>

</card>

<card>

## State

Change the style of the component to the color passed in the `state` property, the allowed colors are only the main ones of Sax Design

::: tip
This property can be used to indicate a missing field to the user or when something is ready.
:::

<template #example>
<select-state />
</template>

<template #template>

@[code{1-20}](../.vuepress/components/select/state.vue)

</template>

<template #script>

@[code{22-47}](../.vuepress/components/select/state.vue)

</template>

<template #style>

@[code{49-55}](../.vuepress/components/select/state.vue)

</template>

</card>

<card>

## Message

Add an item below the select showing a message to the user

<template #example>
<select-message />
</template>

<template #template>

@[code{1-38}](../.vuepress/components/select/message.vue)

</template>

<template #script>

@[code{39-45}](../.vuepress/components/select/message.vue)

</template>

<template #style>

@[code{47-54}](../.vuepress/components/select/message.vue)

</template>

</card>

<card>

## Data source

Use `options` and `option-groups` when data arrives from an API. `option-props` and `option-group-props` map existing field names; `filterable` is an alias of `filter`.

<template #example>
<select-data />
</template>

<template #template>

@[code{1-14}](../.vuepress/components/select/data.vue)

</template>

<template #script>

@[code{16-33}](../.vuepress/components/select/data.vue)

</template>

<template #style>

@[code{35-39}](../.vuepress/components/select/data.vue)

</template>

</card>

<card>

## Popup configuration

Use `popup-config` to control panel sizing, trigger-width matching, offset, mount target and custom styles. The first Select uses `full` to match its trigger; the second combines width and height limits with `offset`, `appendTo`, `placement`, `className` and `style`. The demo mounts to `body`; inside a dialog, replace `appendTo` with an existing container selector or element.

<template #example>
<select-popup-config />
</template>

<template #template>

@[code{1-29}](../.vuepress/components/select/popup-config.vue)

</template>

<template #script>

@[code{31-63}](../.vuepress/components/select/popup-config.vue)

</template>

<template #style>

@[code{65-80}](../.vuepress/components/select/popup-config.vue)

</template>

</card>

<card>

## Search matching and highlighting

Use `filter-option` for matching, `highlight-search` to mark the matching text and `show-selected-mark` for a selected indicator.

<template #example>
<select-search-highlight />
</template>

<template #template>

@[code{1-12}](../.vuepress/components/select/search-highlight.vue)

</template>

<template #script>

@[code{14-26}](../.vuepress/components/select/search-highlight.vue)

</template>

</card>

<card>

## Multiple selection tools and footer

`selection-tools` selects, inverts or clears the current filtered results. The `footer` slot receives counts and bulk actions, with no refresh behavior built in.

<template #example>
<select-selection-tools />
</template>

<template #template>

@[code{1-22}](../.vuepress/components/select/selection-tools.vue)

</template>

<template #script>

@[code{24-44}](../.vuepress/components/select/selection-tools.vue)

</template>

<template #style>

@[code{46-53}](../.vuepress/components/select/selection-tools.vue)

</template>

</card>

<card>

## Cached option labels

When remote pagination or searching replaces `options`, pass `cached-options` to retain selected labels. Use `header` and `footer` for the two popup regions.

<template #example>
<select-cached-options />
</template>

<template #template>

@[code{1-16}](../.vuepress/components/select/cached-options.vue)

</template>

<template #script>

@[code{18-29}](../.vuepress/components/select/cached-options.vue)

</template>

</card>

<card>

## Pinned options

Set `pin-key` to persist pinned values in local storage. Hover an option to reveal its pin action, or press `Ctrl+P` on the keyboard-highlighted option. For server persistence, provide `get-pin-options`, `pin-method` and `unpin-method` together. `auto-use-option` selects the first pinned enabled option, falling back to the first enabled option.

<template #example>
<select-pinning />
</template>

<template #template>

@[code{1-22}](../.vuepress/components/select/pinning.vue)

</template>

<template #script>

@[code{24-40}](../.vuepress/components/select/pinning.vue)

</template>

<template #style>

@[code{42-51}](../.vuepress/components/select/pinning.vue)

</template>

</card>

<card>

## Virtual options

Enable `virtual` for large flat `options` arrays. Filtering, keyboard navigation and selected-value caching stay available while only visible rows mount. Dynamic measurement is on by default, so wrapped labels and custom option content may use different row heights; set `virtual-config.dynamic` to `false` only for truly fixed rows.

<template #example>
<select-virtual />
</template>

<template #template>

@[code{1-27}](../.vuepress/components/select/virtual.vue)

</template>

<template #script>

@[code{29-42}](../.vuepress/components/select/virtual.vue)

</template>

<template #style>

@[code{44-61}](../.vuepress/components/select/virtual.vue)

</template>

</card>
