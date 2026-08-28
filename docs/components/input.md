---
description: 'Capture a single line of text with validation and state feedback.'
PROPS:
  - name: block / shape / text-white
    type: Boolean / String / Boolean
    values: true | false / square / true | false
    description: Control input width, visual shape and text contrast.
    default: 'false / - / false'
    link: null
    usage: '#border-shadow'
  - name: allow-clear / clearable / disabled
    type: Boolean / Boolean / Boolean
    values: true | false
    description: Enable the trailing clear action (`clearable` is retained as an alias) or disable interaction.
    default: 'false / false / false'
    link: null
    usage: '#clearable'
  - name: wrap-classes / wrap-styles
    type: String | Object | Array
    values: CSS class or style values
    description: Customize the outer input wrapper.
    default: '-'
    link: null
    usage: '#border-shadow'
  - name: v-model
    type: String, Number
    values: String, Number
    description: binding value
    default: null
    link: null
    usage: '#default'

  - name: placeholder
    type: String
    values: String
    description: placeholder of Input
    default: null
    link: null
    usage: '#default'

  - name: label
    type: String
    values: String
    description: a label above the component.
    default: null
    link: null
    usage: '#label'
    code: >
      <template>
        <s-input
          label="Name"
          placeholder="Evan You"
        />
      </template>
  - name: label-float
    type: String
    values: String
    description: Add a placeholder converts to focus on a label.
    default: null
    link: null
    usage: '#label-float'
    code: >
      <template>
        <s-input
          label="Country"
          label-float
          v-model="value"
        />
      </template>
  - name: color
    type: String
    values: Sax Design colors, RGB, HEX
    description: Change component color.
    default: null
    link: null
    usage: '#color'
    code: >
      <template>
        <s-input
          color="primary"
          placeholder="Primary"
        />

        <s-input
          color="success"
          placeholder="Success"
        />

        <s-input
          color="danger"
          placeholder="Danger"
        />

        <s-input
          color="warn"
          placeholder="Warn"
        />

        <s-input
          color="dark"
          placeholder="Dark"
        />

        <s-input
          color="#7d33ff"
          placeholder="HEX"
        />

        <s-input
          color="rgb(59,222,200)"
          placeholder="HEX"
        />
      </template>

  - name: state
    type: String
    values: Sax Design colors,RGB,HEX
    description: Change the background color of the component by changing its status.
    default: null
    link: null
    usage: '#state'

  - name: progress
    type: Number
    values: 0 - 100
    description: progress bar starting in red and ending in green.
    default: null
    link: null
    usage: '#progress'
    code: null
  - name: loading
    type: Boolean
    values: Boolean
    description: Add a loading animation to the input.
    default: null
    link: null
    usage: '#loading'
    code: >
      <template>
        <div class="center content-inputs">
          <s-input loading v-model="value" placeholder="Name" />
        </div>
      </template>

  - name: type
    type: InputType
    values: text | password | search | number | email | tel | url
    description: Set a text-oriented input type. Use DatePicker or TimePicker for date and time values.
    default: text
    link: null
    usage: '#input-types'
    code: null

  - name: border
    type: Boolean
    values: Boolean
    description: Change the style of the component.
    default: false
    link: null
    usage: '#border'

  - name: shadow
    type: Boolean
    values: Boolean
    description: Change the style of the component.
    default: false
    link: null
    usage: '#shadow'

  - name: icon-after
    type: Boolean
    values: Boolean
    description: suffix icon component
    default: false
    link: null
    usage: '#icon'

  - name: show-password
    type: boolean
    values: boolean
    description: If the input is of the password type, it is modified to show the password.
    default: false
    link: null
    usage: '#progress'

  - name: max-length / show-word-count / trim
    type: Number, Boolean
    values: Number, true | false
    description: Limit input, show the counter in the suffix area, and trim committed values.
    default: null, false, false
    link: null
    usage: '#character-count'

  - name: count-method
    type: '({ value: string }) => number'
    values: A monotonic non-negative counter
    description: Customize both the displayed count and max-length enforcement for bytes or another encoding.
    default: value.length
    link: null
    usage: '#character-count'

  - name: size
    type: String
    values: small | default | large
    description: Set the input size.
    default: default
    link: null
    usage: '#sizes'

  - name: immediate
    type: Boolean
    values: true | false
    description: Update while typing or commit the value on change and blur.
    default: true
    link: null
    usage: '#deferred-commit'

  - name: controls
    type: Boolean
    values: true | false
    description: Show the built-in search or password action.
    default: false
    link: null
    usage: '#search'

  - name: prefix-icon / suffix-icon / prefix-config / suffix-config
    type: String / Object
    values: Icon name / '{ icon, content, status }'
    description: Render lightweight prefix and suffix icons or content; slots have the highest priority.
    default: '-'
    link: null
    usage: '#affixes'

  - name: min-length / min / max / step / input-mode / pattern / required / multiple
    type: Number | String / Boolean
    values: Native input constraints
    description: Forward common native constraints and clamp number values to the configured min–max range.
    default: '-'
    link: null
    usage: '#native-constraints'

  - name: readonly / editable / auto-focus / align
    type: Boolean, String
    values: true | false, left | center | right
    description: Control editing state, focus and text alignment.
    default: false, true, false, left
    link: null
    usage: '#default'

EVENTS:
  - name: update:modelValue / input
    type: String | Number
    description: Fire while the bound input value changes.
  - name: change / lazy-change
    type: String
    description: Fire when the native change is committed or the configured lazy update is committed.
  - name: focus / blur
    type: FocusEvent
    description: Fire when the input gains or loses focus.
  - name: clear
    description: Fires after the clear action resets the value.
  - name: click / clickIcon / prefix-click / suffix-click
    type: MouseEvent | Event
    description: Fire for the input surface and its icon actions.
  - name: keydown / keyup / wheel
    type: KeyboardEvent | WheelEvent
    description: Forward keyboard and wheel interaction events.
  - name: mouseenter / mouseleave
    type: MouseEvent
    description: Fire when the pointer enters or leaves the input wrapper.
  - name: search-click
    type: '(value: String, event: KeyboardEvent | MouseEvent)'
    description: Fires when search is submitted from the icon or keyboard.
  - name: toggle-visible
    type: Boolean
    description: Fires when password visibility changes.
SLOTS:
  - name: icon
    type: Slot
    values: null
    description: Add an icon to the input.
    default: null
    link: null
    usage: '#icon'

  - name: message
    type: Slot
    values: message-success, message-danger, message-warn
    description: Add an informative text below the input.
    default: null
    link: null
    usage: '#message'
  - name: prefix / suffix
    type: Slot
    values: 'suffix: { count, limit }'
    description: Customize either affix. The suffix slot replaces the default counter and receives its current count and limit.
    default: null
    link: null
    usage: '#affixes'
---

# Input

<card>

## Default

<docs-warn />

Add an elements input facilitate with the component `input`

<template #example>
<input-default />
</template>

<template #template>

@[code{1-5}](../.vuepress/components/input/default.vue)

</template>

<template #script>

@[code{7-11}](../.vuepress/components/input/default.vue)

</template>

</card>

<card>

## Clearable

Set `allow-clear` to show a clear button at the end while the input is hovered or focused. Pressing Escape also clears the current value.

<template #example>
<input-clearable />
</template>

<template #template>

@[code{7-15}](../.vuepress/components/input/clearable.vue)

</template>

<template #script>

@[code{1-5}](../.vuepress/components/input/clearable.vue)

</template>

</card>

<card>

## Label

Add a label to the input with the property `label`

<template #example>
<input-label />
</template>

<template #template>

@[code{1-5}](../.vuepress/components/input/label.vue)

</template>

<template #script>

@[code{6-10}](../.vuepress/components/input/label.vue)

</template>

</card>

<card>

## Label Float

You can have a placeholder with a great animation when being or in focus or with a value becoming a label above the input with the property `label-float`

<template #example>
<input-label-float />
</template>

<template #template>

@[code{1-5}](../.vuepress/components/input/label-float.vue)

</template>

<template #script>

@[code{7-11}](../.vuepress/components/input/label-float.vue)

</template>

</card>

<card>

## Color

Change the color of the component and add a border below with the `color` property, the allowed values ​​are the main colors of Sax Design and the colors (**RGB** y **HEX**)

<template #example>
<input-color />
</template>

<template #template>

@[code{1-39}](../.vuepress/components/input/color.vue)

</template>

<template #script>

@[code{40-50}](../.vuepress/components/input/color.vue)

</template>

<template #style>

@[code{52-61}](../.vuepress/components/input/color.vue)

</template>

</card>

<card>

## Icon

Add an icon to the input easily with the slot icon if you want the icon to be before the input you can do it with the property `icon-before`

<utils-icon />

<template #example>
<input-icon />
</template>

<template #template>

@[code{1-15}](../.vuepress/components/input/icon.vue)

</template>

<template #script>

@[code{16-21}](../.vuepress/components/input/icon.vue)

</template>

<template #style>

@[code{23-32}](../.vuepress/components/input/icon.vue)

</template>

</card>

<card>

## Message

You can add a message below the input with the `#message-{Sax Design color}` to report that a field is missing or the value is wrong

<template #example>
<input-message />
</template>

<template #template>

@[code{1-26}](../.vuepress/components/input/message.vue)

</template>

<template #script>

@[code{28-39}](../.vuepress/components/input/message.vue)

</template>

<template #style>

@[code{41-50}](../.vuepress/components/input/message.vue)

</template>

</card>

<card>

## State

Change the color of the input for some state, the allowed states are (primary, success, danger, warn, dark)

<template #example>
<input-state />
</template>

<template #template>

@[code{1-31}](../.vuepress/components/input/state.vue)

</template>

<template #script>

@[code{33-41}](../.vuepress/components/input/state.vue)

</template>

<template #style>

@[code{43-52}](../.vuepress/components/input/state.vue)

</template>

</card>

<card>

## Progress

Add a validation progress bar, the most common is its use to validate passwords and correct data within the input, its value is (0 - 100).

:::tip
The example validates that the password has at least

- A special character
- More than 6 digits
- One lower case letter
- An uppercase letter
- A number
  :::

<template #example>
<input-progress />
</template>

<template #template>

@[code{1-22}](../.vuepress/components/input/progress.vue)

</template>

<template #script>

@[code{23-57}](../.vuepress/components/input/progress.vue)

</template>

</card>

<card>

## Loading

Add a loading animation to the input with the `loading` property, the property is a `Boolean`, so you can add it without any value.

<template #example>
<input-loading />
</template>

<template #template>

@[code{1-5}](../.vuepress/components/input/loading.vue)

</template>

<template #script>

@[code{7-11}](../.vuepress/components/input/loading.vue)

</template>

</card>

<card>

## Input types

Use `type` for text-oriented inputs: `text`, `password`, `search`, `number`,
`email`, `tel`, or `url`. Date and time values use `SDatePicker` and
`STimePicker` so formatting, themes, and popup behavior remain consistent.

<template #example>
<input-types />
</template>

<template #template>

@[code{1-19}](../.vuepress/components/input/types.vue)

</template>

<template #script>

@[code{20-35}](../.vuepress/components/input/types.vue)

</template>

<template #style>

@[code{37-57}](../.vuepress/components/input/types.vue)

</template>

</card>

<card>

## Border - Shadow

Change everything is style of the component with the `input-style` property, the property is a `String` with values `border` . `shadow` . `transparent`

<template #example>
<input-style />
</template>

<template #template>

@[code{1-31}](../.vuepress/components/input/style.vue)

</template>

<template #script>

@[code{33-39}](../.vuepress/components/input/style.vue)

</template>

<template #style>

@[code{41-52}](../.vuepress/components/input/style.vue)

</template>

</card>

<card>

## Affixes

Add prefix and suffix icons with `prefix-icon` and `suffix-icon`. Use the matching slots when the affix needs fully custom content.

<template #example>
<input-affix />
</template>

<template #template>

@[code{8-21}](../.vuepress/components/input/affix.vue)

</template>

<template #script>

@[code{1-6}](../.vuepress/components/input/affix.vue)

</template>

<template #style>

@[code{23-29}](../.vuepress/components/input/affix.vue)

</template>

</card>

<card>

## Sizes

Use `size` to render a small, default, or large input.

<template #example>
<input-size />
</template>

<template #template>

@[code{1-7}](../.vuepress/components/input/size.vue)

</template>

<template #style>

@[code{9-16}](../.vuepress/components/input/size.vue)

</template>

</card>

<card>

## Search

Set `type="search"` with `controls` to show the search action. Pressing Enter or clicking the action emits `search-click`.

<template #example>
<input-search />
</template>

<template #template>

@[code{12-25}](../.vuepress/components/input/search.vue)

</template>

<template #script>

@[code{1-10}](../.vuepress/components/input/search.vue)

</template>

<template #style>

@[code{27-39}](../.vuepress/components/input/search.vue)

</template>

</card>

<card>

## Deferred commit

Set `immediate="false"` to synchronize `v-model` on change or blur. Type a value and click outside the field to see the committed value update.

<template #example>
<input-deferred />
</template>

<template #template>

@[code{7-19}](../.vuepress/components/input/deferred.vue)

</template>

<template #script>

@[code{1-5}](../.vuepress/components/input/deferred.vue)

</template>

<template #style>

@[code{21-33}](../.vuepress/components/input/deferred.vue)

</template>

</card>

<card>

## Character count

Use `max-length` with `show-word-count` to limit and display the count. `count-method` customizes both behaviors; the second field counts UTF-8 bytes.

<template #example>
<input-count />
</template>

<template #template>

@[code{11-27}](../.vuepress/components/input/count.vue)

</template>

<template #script>

@[code{1-9}](../.vuepress/components/input/count.vue)

</template>

<template #style>

@[code{29-35}](../.vuepress/components/input/count.vue)

</template>

</card>

<card>

## Native constraints

Common native constraints such as `min`, `max`, `step`, `input-mode`, `pattern`, and `required` are forwarded to the inner input. Number inputs also clamp typed and pasted values to the configured `min`–`max` range.

<template #example>
<input-constraints />
</template>

<template #template>

@[code{7-19}](../.vuepress/components/input/constraints.vue)

</template>

<template #script>

@[code{1-5}](../.vuepress/components/input/constraints.vue)

</template>

</card>
