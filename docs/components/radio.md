---
description: 'Choose exactly one option from a related group.'
API_TITLES:
  GROUP_PROPS: "RadioGroup props"
  GROUP_TABS_PROPS: "RadioGroupTabs props"
  BUTTON_PROPS: "RadioButton props"
PROPS:
  - name: v-model
    type: String | Number | Boolean
    values: 'selected radio value'
    description: Bind the selected value for the radio or radio group.
    default: null
    link: null
    usage: '#default'
    code: null
  - name: model-value
    type: String | Number | Boolean
    values: 'selected radio value'
    description: Bind the selected value for the radio or radio group.
    default: null
    link: null
    usage: '#default'
    code: null
  - name: color
    type: String
    values: 'Theme colors, RGB, HEX'
    description: Change the color of the radio.
    default: primary
    link: null
    usage: '#color'
    code: null

  - name: disabled
    type: Boolean
    values: 'true,false'
    description: Disable radio interaction while preserving the selected state.
    default: false
    link: null
    usage: '#disabled'
    code: null

  - name: loading
    type: Boolean
    values: 'true,false'
    description: Determine if the component has a loading animation and is disabled.
    default: false
    link: null
    usage: '#loading'
    code: null

  - name: icon-animation
    type: String
    values: 'auto, draw, pop, none'
    description: Animate a custom center icon. Stroke SVGs draw their paths and filled icons use a pop reveal.
    default: auto
    link: null
    usage: '#icon'
    code: null

  - name: value
    type: String | Number | Boolean
    values: 'option value'
    description: Value represented by this radio option.
    default: "''"
    link: null
    usage: '#default'
    code: null

GROUP_PROPS:
  - name: "v-model"
    type: RadioValue
    description: "The group's single selected value."
    default: "''"
    usage: "#default"
  - name: "options"
    type: "RadioOption[]"
    description: "Data-driven options supporting `label`, `value`, `description`, and `disabled`."
    default: "[]"
    usage: "#default"
  - name: "type"
    type: "default | button"
    description: "Primitive Radio or borderless RadioButton presentation."
    default: "default"
    usage: "#default"
  - name: "columns"
    type: "number"
    description: "Column count for the standard data-driven layout; collapses to one column on small screens."
    default: "1"
    usage: "#default"
  - name: "gap"
    type: "number | string"
    description: "Option spacing. Numbers are treated as pixels."
    default: "8"
    usage: "#default"
  - name: "disabled-values"
    type: "RadioValue[]"
    description: "Disable specific option values."
    default: "[]"
    usage: "#default"
  - name: "disabled"
    type: "boolean"
    description: "Disable the whole group."
    default: "false"
    usage: "#default"
  - name: "name"
    type: "string"
    description: "Shared native radio name for arrow-key navigation."
    default: "generated"
    usage: "#default"
GROUP_TABS_PROPS:
  - name: "v-model"
    type: RadioGroupTabsModelValue
    description: "Stores one selected value under each tab key."
    default: "{}"
    usage: "#default"
  - name: "tabs"
    type: "RadioGroupTab[]"
    description: "Tabs and their `options`; each tab may define `disabled`, `columns`, and disabled option values."
    default: "[]"
    usage: "#default"
  - name: "active-key"
    type: "string | number"
    description: "Current panel; supports `v-model:active-key`."
    default: "first enabled tab"
    usage: "#default"
  - name: "v-model:active-key"
    type: RadioGroupTabValue
    description: Two-way binding for the active tab key.
    default: null
    usage: '#default'
  - name: "columns"
    type: "number"
    description: "Panel column count when a tab does not override it."
    default: "2"
    usage: "#default"
  - name: "gap"
    type: "number | string"
    description: "Spacing between panel options."
    default: "12"
    usage: "#default"
  - name: "disabled"
    type: "boolean"
    description: "Disable the whole tabbed group."
    default: "false"
    usage: "#default"
BUTTON_PROPS:
  - name: v-model
    type: RadioButtonValue
    description: Two-way selected value when using RadioButton directly.
    default: null
    usage: '#default'
  - name: model-value
    type: RadioButtonValue
    description: Selected value without v-model syntax.
    default: null
    usage: '#default'
  - name: value
    type: RadioButtonValue
    description: Value represented by this button.
    default: "''"
    usage: '#default'
  - name: label
    type: 'String | Number | Boolean'
    description: Visible option label.
    default: "''"
    usage: '#default'
  - name: description
    type: String
    description: Supporting text shown beneath the label.
    default: "''"
    usage: '#default'
  - name: disabled
    type: Boolean
    description: Disable this button without losing its selected state.
    default: false
    usage: '#default'
  - name: name
    type: String
    description: Shared native radio name when composing buttons directly.
    default: "''"
    usage: '#default'
EVENTS:
  - name: update:modelValue
    type: RadioValue
    description: Fire when a Radio, RadioGroup, or RadioButton value changes.
  - name: change
    type: RadioValue
    description: Fire when a Radio, RadioGroup, or RadioButton value changes.
  - name: update:activeKey
    type: String | Number
    description: Fire when RadioGroupTabs activates another tab.
  - name: tabChange
    type: String | Number
    description: Fire when RadioGroupTabs activates another tab.
  - name: RadioGroupTabs change
    type: '(value: RadioGroupTabsModelValue, activeKey: String | Number)'
    description: Fires with the complete grouped value and active tab after a tabbed selection changes.
SLOTS:
  - name: RadioGroup.default
    type: slot
    description: Compose Radio or RadioButton children manually when options is omitted.
    default: null
    usage: '#default'
  - name: RadioGroup.option
    type: Slot
    scope: "{ option: RadioOption; checked: boolean }"
    description: Customize a data-driven radio option.
    default: null
    usage: '#default'
  - name: RadioGroup.empty
    type: slot
    description: Render content when no options or manual children are available.
    default: null
    usage: '#default'
  - name: RadioGroupTabs.tab
    type: Slot
    scope: "{ tab: RadioGroupTab; active: boolean; selected: boolean; selectedOption?: RadioOption }"
    description: Customize a tab trigger using its active and selection state.
    default: null
    usage: '#default'
  - name: RadioGroupTabs.option
    type: Slot
    scope: "{ option: RadioOption; checked: boolean }"
    description: Customize an option in the active tab.
    default: null
    usage: '#default'
  - name: RadioGroupTabs.empty
    type: slot
    description: Render content when no active tab is available.
    default: null
    usage: '#default'
  - name: default
    type: slot
    values: 'null'
    description: Add a label to the component.
    default: null
    link: null
    usage: '#label'
    code: null

  - name: icon
    type: Slot
    scope: "{ checked: boolean }"
    description: Replace the selected center SVG and receive the current checked state.
    default: null
    link: null
    usage: '#icon'
    code: null
---

# Radio

<card>

## Default

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

## Disabled

Set `disabled` to prevent interaction while preserving the selected state. Enabled controls use a tinted surface and soft shadow; only the circle lifts on hover. Disabled controls use a neutral fill and inset shadow with a visible selection dot. Labels and rows remain stationary.

<template #example>
<radio-disabled />
</template>

<template #template>

@[code{7-20}](../.vuepress/components/radio/disabled.vue)

</template>

<template #script>

@[code{1-5}](../.vuepress/components/radio/disabled.vue)

</template>

<template #style>

@[code{22-29}](../.vuepress/components/radio/disabled.vue)

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

## Label

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

## Loading

Loading replaces the radio control with the shared Sax logo loader while keeping the label in place. Interaction is disabled until loading finishes.

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

## Icon

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
