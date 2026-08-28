---
description: 'Choose exactly one option from a related group.'
PROPS:
  - name: v-model / model-value
    type: String | Number | Boolean
    values: selected radio value
    description: Bind the selected value for the radio or radio group.
    default: '-'
    link: null
    usage: '#default'
    code: null
  - name: color
    type: String
    values: Theme colors, RGB, HEX
    description: Change the color of the radio.
    default: primary
    link: null
    usage: '#color'
    code: null

  - name: disabled
    type: Boolean
    values: true,false
    description: Determine if the component is in the disabled state.
    default: false
    link: null
    usage: '#default'
    code: null

  - name: loading
    type: Boolean
    values: true,false
    description: Determine if the component has a loading animation and is disabled.
    default: false
    link: null
    usage: '#loading'
    code: null

  - name: icon-animation
    type: String
    values: auto, draw, pop, none
    description: Animate a custom center icon. Stroke SVGs draw their paths and filled icons use a pop reveal.
    default: auto
    link: null
    usage: '#icon'
    code: null

  - name: value
    type: String | Number | Boolean
    values: option value
    description: Value represented by this radio option.
    default: "''"
    link: null
    usage: '#default'
    code: null

EVENTS:
  - name: update:modelValue / change
    type: RadioValue
    description: Fire when a Radio, RadioGroup, or RadioButton value changes.
  - name: update:activeKey / tabChange
    type: String | Number
    description: Fire when RadioGroupTabs activates another tab.
  - name: RadioGroupTabs change
    type: '(value: RadioGroupTabsModelValue, activeKey: String | Number)'
    description: Fires with the complete grouped value and active tab after a tabbed selection changes.
SLOTS:
  - name: default
    type: slot
    values: null
    description: Add a label to the component.
    default: null
    link: null
    usage: '#label'
    code: null

  - name: icon
    type: slot
    values: checked
    description: Replace the selected center SVG and receive the current checked state.
    default: null
    link: null
    usage: '#icon'
    code: null
---

# Radio

<card>

## Radio, group, tabs, and button

<docs-warn />

`Radio` is the primitive option. `RadioGroup` owns one selected value, `RadioGroupTabs` preserves one selection per tab, and `type="button"` provides the borderless `RadioButton` segmented presentation. All four forms keep an explicit `v-model` data flow.

<template #example>
<radio-patterns />
</template>

<template #template>

@[code{56-94}](../.vuepress/components/radio/patterns.vue)

</template>

<template #script>

@[code{1-54}](../.vuepress/components/radio/patterns.vue)

</template>

<template #style>

@[code{96-142}](../.vuepress/components/radio/patterns.vue)

</template>

</card>

<card>

## Color

<coloren />

<template #example>
<radio-color />
</template>

<template #template>

@[code{1-11}](../.vuepress/components/radio/color.vue)

</template>

<template #script>

@[code{13-17}](../.vuepress/components/radio/color.vue)

</template>

<template #style>

@[code{18-26}](../.vuepress/components/radio/color.vue)

</template>

</card>

<card>

## Label <Badge text="New"/>

Add a label to the radio with the `default` slot, if you need the label to be before the radio you can use the `label-before` property

<template #example>
<radio-label />
</template>

<template #template>

@[code{1-6}](../.vuepress/components/radio/label.vue)

</template>

<template #script>

@[code{8-12}](../.vuepress/components/radio/label.vue)

</template>

<template #style>

@[code{13-21}](../.vuepress/components/radio/label.vue)

</template>

</card>

<card>

## Loading <Badge text="New"/>

Loading reuses Button's pulse rail: a glowing segment travels from left to right along the full radio surface. Interaction is disabled until loading finishes.

<template #example>
<radio-loading />
</template>

<template #template>

@[code{7-12}](../.vuepress/components/radio/loading.vue)

</template>

<template #script>

@[code{1-5}](../.vuepress/components/radio/loading.vue)

</template>

<template #style>

@[code{14-20}](../.vuepress/components/radio/loading.vue)

</template>

</card>

<card>

## Icon <Badge text="New"/>

The outer disc and default center dot share one SVG coordinate system, independent from the native input and positional layout. Replace the selected center SVG with the `icon` slot, which exposes `checked`. `icon-animation="auto"` draws stroked SVG geometry and gives filled icons a pop reveal; set `draw`, `pop`, or `none` explicitly when needed.

<template #example>
<radio-icons />
</template>

<template #template>

@[code{1-60}](../.vuepress/components/radio/icons.vue)

</template>

<template #script>

@[code{62-66}](../.vuepress/components/radio/icons.vue)

</template>

<template #style>

@[code{67-80}](../.vuepress/components/radio/icons.vue)

</template>

</card>

<card>

### RadioGroup

| Property          | Type                          | Default   | Description                                                                                 |
| ----------------- | ----------------------------- | --------- | ------------------------------------------------------------------------------------------- |
| `v-model`         | `string \| number \| boolean` | `''`      | The group's single selected value.                                                          |
| `options`         | `RadioOption[]`               | `[]`      | Data-driven options supporting `label`, `value`, `description`, and `disabled`.             |
| `type`            | `default \| button`           | `default` | Primitive Radio or borderless RadioButton presentation.                                     |
| `columns`         | `number`                      | `1`       | Column count for the standard data-driven layout; collapses to one column on small screens. |
| `gap`             | `number \| string`            | `8`       | Option spacing. Numbers are treated as pixels.                                              |
| `disabled-values` | `RadioValue[]`                | `[]`      | Disable specific option values.                                                             |
| `disabled`        | `boolean`                     | `false`   | Disable the whole group.                                                                    |
| `name`            | `string`                      | generated | Shared native radio name for arrow-key navigation.                                          |

Events: `update:modelValue(value)` and `change(value)`. Slots: `option` and `empty`. Without `options`, Radio or RadioButton children in the default slot automatically join the group model.

### RadioGroupTabs

| Property     | Type                         | Default           | Description                                                                                      |
| ------------ | ---------------------------- | ----------------- | ------------------------------------------------------------------------------------------------ |
| `v-model`    | `Record<string, RadioValue>` | `{}`              | Stores one selected value under each tab key.                                                    |
| `tabs`       | `RadioGroupTab[]`            | `[]`              | Tabs and their `options`; each tab may define `disabled`, `columns`, and disabled option values. |
| `active-key` | `string \| number`           | first enabled tab | Current panel; supports `v-model:active-key`.                                                    |
| `columns`    | `number`                     | `2`               | Panel column count when a tab does not override it.                                              |
| `gap`        | `number \| string`           | `12`              | Spacing between panel options.                                                                   |
| `disabled`   | `boolean`                    | `false`           | Disable the whole tabbed group.                                                                  |

Events: `update:modelValue(value)`, `change(value, activeKey)`, `update:activeKey(key)`, and `tabChange(key)`. Slots: `tab`, `option`, and `empty`. Tabs support arrow keys, `Home`, and `End` navigation.

### RadioButton

Prefer `RadioButton` through `<s-radio-group type="button" />`. Direct composition still supports `v-model`, `value`, `label`, `description`, `disabled`, and `name`. Its active state combines a familiar radio indicator with color, surface, and shadow instead of borders.

</card>
