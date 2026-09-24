---
description: 'Choose one or more boolean options.'
API_TITLES:
  GROUP_PROPS: "CheckboxGroup props"
  GROUP_TABS_PROPS: "CheckboxGroupTabs props"
PROPS:
  - name: size
    type: ComponentSize
    values: 'small | default | large'
    description: Set or inherit the checkbox and label size.
    default: null
  - name: disabled
    type: Boolean
    values: "true | false"
    description: Disable checkbox interaction while preserving its checked or indeterminate state.
    default: 'false'
    usage: '#disabled'
  - name: max
    type: Number
    values: "selected value limit"
    description: Disable selection, cap grouped selections, or customize the unchecked value.
    default: null
  - name: not-value
    type: String | Number | Boolean
    values: "unchecked value"
    description: Disable selection, cap grouped selections, or customize the unchecked value.
    default: 'false'
  - name: v-model
    type: Boolean, String, Array
    values: "boolean, string, array"
    description: determine the value of the checkbox and data anchor.
    default: false
    link: null
    usage: '#default'

  - name: color
    type: String
    values: "Sax Design colors, RGB, HEX"
    description: Change the color of the component.
    default: false
    link: null
    usage: '#color'

  - name: value
    type: String, Object
    values: "String, Object"
    description: Determine the value of the input when being checked.
    default: true
    link: null
    usage: '#string-value'

  - name: loading
    type: Boolean
    values: "true, false"
    description: Add a loading animation and disable the input.
    default: false
    link: null
    usage: '#loading'
    code: >
      <template>
        <s-checkbox loading v-model="option">
          Loading checked
        </s-checkbox>
        <s-checkbox loading v-model="option2">
          Loading unchecked
        </s-checkbox>
      </template>

  - name: line-through
    type: Boolean
    values: "true, false"
    description: Add a line in the center of the label when checked.
    default: false
    link: null
    usage: '#line-through'
    code: >
      <template>
        <s-checkbox line-through v-model="option">
          Option
        </s-checkbox>
      </template>

  - name: icon-animation
    type: String
    values: "auto, draw, pop, none"
    description: Animate a custom icon. Auto draws stroke SVG paths and uses a pop reveal for filled icons.
    default: auto
    link: null
    usage: '#icon'

  - name: indeterminate
    type: Boolean
    values: "true, false"
    description: Change the default checkbox icon to a line that represents undetermined data.
    default: false
    link: null
    usage: '#indeterminate'
    code: >
      <template>
        <s-checkbox indeterminate v-model="option">
          Option
        </s-checkbox>
      </template>

  - name: label-before
    type: Boolean
    values: "true, false"
    description: Change the position of the label.
    default: false
    link: null
    usage: '#label'
    code: >
      <template>
        <s-checkbox label-before v-model="option2">
          Label Before
        </s-checkbox>
      </template>

  - name: checked
    type: Boolean
    values: "true, false"
    description: Determine if the component is initially in check (this changes the property computed in v-model to true).
    default: false
    link: null
    usage: null
    code: >
      <template>
        <s-checkbox label-before v-model="option2">
          Checked state
        </s-checkbox>
      </template>

  - name: checked-force
    type: Boolean
    values: "true, false"
    description: Force checkbox state is checked
    default: false
    link: null
    usage: null
    code: >
      <template>
        <s-checkbox checkbox-force v-model="value">
          Force checked state
        </s-checkbox>
      </template>

  - name: checkbox-group
    type: Array<String | Number | Object>
    values: "null"
    description: Bind multiple checkboxes as one group.
    default: null
    link: null
    usage: '#checkbox-group'

  - name: id
    type: string
    values: "null"
    description: Checkbox id
    default: undefined
    link: null
    usage: null
    code: >
      <template>
        <s-checkbox v-model="value" id="framework">
          Sax Design
        </s-checkbox>
      </template>

  - name: name
    type: string
    values: "null"
    description: Checkbox name
    default: null
    link: null
    usage: null
    code: >
      <template>
        <s-checkbox v-model="value" name="checkbox-name">
          Sax Design
        </s-checkbox>
      </template>

GROUP_PROPS:
  - name: size
    type: ComponentSize
    description: Set or inherit the size of CheckboxGroup and its options.
    default: null
    usage: '#size'
  - name: "v-model"
    type: CheckboxGroupValueType
    description: "Flat array containing every selected child value."
    default: "[]"
    usage: "#checkbox-group"
  - name: "options"
    type: "(CheckboxGroupOption | CheckboxGroupSection)[]"
    description: "Data-driven options; an item with `options` becomes a selectable section. Keep child values unique within a group or tab."
    default: "[]"
    usage: "#checkbox-group"
  - name: "columns"
    type: "number"
    description: "Default column count. A section can override it with its own `columns`."
    default: "1"
    usage: "#checkbox-group"
  - name: "gap"
    type: "number | string"
    description: "Row and column gap. Numbers are treated as pixels."
    default: "12"
    usage: "#checkbox-group"
  - name: "disabled-values"
    type: CheckboxGroupValueType
    description: "Disable child values and preserve them during section select/clear actions."
    default: "[]"
    usage: "#checkbox-group"
  - name: "disabled-group-values"
    type: CheckboxGroupValueType
    description: "Disable select-all for the specified sections."
    default: "[]"
    usage: "#checkbox-group"
  - name: "disabled"
    type: "boolean"
    description: "Disable the whole group."
    default: "false"
    usage: "#checkbox-group"
  - name: "min"
    type: "number"
    description: "Minimum selected value count."
    default: null
    usage: "#checkbox-group"
  - name: "max"
    type: "number"
    description: "Maximum selected value count."
    default: null
    usage: "#checkbox-group"
GROUP_TABS_PROPS:
  - name: "v-model"
    type: CheckboxGroupTabsModelValue
    description: "Selected values stored independently by tab value."
    default: "{}"
    usage: "#checkbox-group-tabs"
  - name: "tabs"
    type: "CheckboxGroupTab[]"
    description: "Tabs containing `label`, `value`, and grouped `options`."
    default: "[]"
    usage: "#checkbox-group-tabs"
  - name: "active-key"
    type: "string | number"
    description: "Active tab."
    default: "First enabled tab"
    usage: "#checkbox-group-tabs"
  - name: "v-model:active-key"
    type: "string | number"
    description: "Active tab."
    default: "First enabled tab"
    usage: "#checkbox-group-tabs"
  - name: "columns"
    type: "number"
    description: "Default content column count."
    default: "2"
    usage: "#checkbox-group-tabs"
  - name: "gap"
    type: "number | string"
    description: "Content row and column gap."
    default: "12"
    usage: "#checkbox-group-tabs"
  - name: "disabled"
    type: "boolean"
    description: "Disable every tab and option."
    default: "false"
    usage: "#checkbox-group-tabs"
EVENTS:
  - name: update:modelValue
    type: CheckboxModelType | CheckboxGroupValueType
    description: Fire when a Checkbox or CheckboxGroup value changes.
  - name: change
    type: CheckboxModelType | CheckboxGroupValueType
    description: Fire when a Checkbox or CheckboxGroup value changes.
  - name: update:activeKey
    type: String | Number
    description: Fire when CheckboxGroupTabs activates another tab.
  - name: tabChange
    type: String | Number
    description: Fire when CheckboxGroupTabs activates another tab.
  - name: CheckboxGroupTabs change
    type: '(value: CheckboxGroupTabsModelValue, activeKey: String | Number)'
    description: Fires with the complete grouped value and active tab after a tabbed selection changes.
SLOTS:
  - name: CheckboxGroup.default
    type: slot
    description: Compose Checkbox children manually when options is omitted.
    default: null
    usage: '#checkbox-group'
  - name: CheckboxGroup.option
    type: Slot
    scope: "{ option: CheckboxGroupOption; checked: boolean }"
    description: Customize a data-driven option.
    default: null
    usage: '#data-driven-groups'
  - name: CheckboxGroup.group-label
    type: Slot
    scope: "{ group: CheckboxGroupSection; checked: boolean; indeterminate: boolean }"
    description: Customize a section select-all label.
    default: null
    usage: '#data-driven-groups'
  - name: CheckboxGroup.empty
    type: slot
    description: Render content when no options or manual children are available.
    default: null
    usage: '#data-driven-groups'
  - name: CheckboxGroupTabs.tab
    type: Slot
    scope: "{ tab: CheckboxGroupTab; active: boolean; checked: boolean; indeterminate: boolean; selectedCount: number }"
    description: Customize a tab trigger while keeping its selection state.
    default: null
    usage: '#checkbox-group-tabs'
  - name: CheckboxGroupTabs.option
    type: Slot
    scope: "{ option: CheckboxGroupOption; checked: boolean }"
    description: Customize an option in the active tab.
    default: null
    usage: '#checkbox-group-tabs'
  - name: CheckboxGroupTabs.group-label
    type: Slot
    scope: "{ group: CheckboxGroupSection; checked: boolean; indeterminate: boolean }"
    description: Customize a section label in the active tab.
    default: null
    usage: '#checkbox-group-tabs'
  - name: CheckboxGroupTabs.empty
    type: slot
    description: Render content when no active tab is available.
    default: null
    usage: '#checkbox-group-tabs'
  - name: icon
    type: Slot
    scope: "{ checked: boolean; indeterminate: boolean }"
    description: Change the component icon and receive its current checked and indeterminate states.
    default: null
    link: null
    usage: '#icon'
    code: >
      <template>
        <s-checkbox v-model="option1">
          <template #icon>
            <s-icon   name="bx:check" />
          </template>
        </s-checkbox>
        <s-checkbox success v-model="option2">
          <template #icon>
            <s-icon   name="bx:check-double" />
          </template>
        </s-checkbox>
        <s-checkbox danger v-model="option3">
          <template #icon>
            <s-icon   name="bx:x" />
          </template>
        </s-checkbox>
        <s-checkbox warn v-model="option4">
          <template #icon>
            <s-icon   name="bxs:shield" />
          </template>
        </s-checkbox>
        <s-checkbox dark v-model="option5">
          <template #icon>
            <s-icon   name="bxs:heart" />
          </template>
        </s-checkbox>
        <s-checkbox color="#7d33ff" v-model="option6">
          <template #icon>
            <s-icon   name="bx:brightness" />
          </template>
        </s-checkbox>
        <s-checkbox color="rgb(59,222,200)" v-model="option7">
          <template #icon>
            <s-icon   name="bxs:paint" />
          </template>
        </s-checkbox>
      </template>

  - name: default
    type: slot
    values: "null"
    description: Add a label to the component.
    default: null
    link: null
    usage: '#default'
    code: >
      <template>
        <s-checkbox v-model="option">
          Option
        </s-checkbox>
      </template>
---

# Checkbox

<card>

## Default

<docs-warn />

Add a checkbox type input easily and with a beautiful animation

<template #example>
<checkbox-default />
</template>

<template #template>

@[code{1-5}](../.vuepress/components/checkbox/default.vue)

</template>

<template #script>

@[code{6-10}](../.vuepress/components/checkbox/default.vue)

</template>

</card>

<card>

## Size

Compare the inherited `small`, `default`, and `large` component sizes.

<template #example><checkbox-size /></template>

<template #template>

@[code{7-13}](../.vuepress/components/checkbox/size.vue)

</template>

<template #script>

@[code{1-5}](../.vuepress/components/checkbox/size.vue)

</template>

<template #style>

@[code{15-22}](../.vuepress/components/checkbox/size.vue)

</template>

</card>

<card>

## Disabled

Set `disabled` to prevent interaction. Disabled checkboxes use a neutral fill and inset shadow, preserve checked or indeterminate marks, and remain still on hover. Compare them with enabled controls below.

<template #example>
<checkbox-disabled />
</template>

<template #template>

@[code{8-18}](../.vuepress/components/checkbox/disabled.vue)

</template>

<template #script>

@[code{1-6}](../.vuepress/components/checkbox/disabled.vue)

</template>

<template #style>

@[code{20-27}](../.vuepress/components/checkbox/disabled.vue)

</template>

</card>

<card>

## Color

Change the color of the component with the `color` property, the allowed values ​​are (main colors of Sax Design, RGB, HEX)

<template #example>
<checkbox-color />
</template>

<template #template>

@[code{1-11}](../.vuepress/components/checkbox/color.vue)

</template>

<template #script>

@[code{12-22}](../.vuepress/components/checkbox/color.vue)

</template>

</card>

<card>

## Boolean value

By default the component is used with a boolean value that when being checked returns `true` and when not being checked returns `false`

<template #example>
<checkbox-boolean />
</template>

<template #template>

@[code{1-10}](../.vuepress/components/checkbox/boolean.vue)

</template>

<template #script>

@[code{11-16}](../.vuepress/components/checkbox/boolean.vue)

</template>

<template #style>

@[code{18-24}](../.vuepress/components/checkbox/boolean.vue)

</template>

</card>

<card>

## String value

You may need to return a string when the component is checked for it use the `value` property with the `string` you want to return

<template #example>
<checkbox-string />
</template>

<template #template>

@[code{1-11}](../.vuepress/components/checkbox/string.vue)

</template>

<template #script>

@[code{13-17}](../.vuepress/components/checkbox/string.vue)

</template>

<template #style>

@[code{19-31}](../.vuepress/components/checkbox/string.vue)

</template>

</card>

<card>

## Checkbox group

It is used for multiple checkboxes which are bound in one group, and indicates whether one option is selected by checking if it is checked.

checkbox-group element can manage multiple checkboxes in one group by using v-model which is bound as an Array. Inside the el-checkbox element, label is the value of the checkbox. If no content is nested in that tag, label will be rendered as the description following the button of the checkbox. label also corresponds with the element values in the array. It is selected if the specified value exists in the array, and vice versa.

<template #example>
<checkbox-array />
</template>

<template #template>

@[code{1-15}](../.vuepress/components/checkbox/array.vue)

</template>

<template #script>

@[code{17-21}](../.vuepress/components/checkbox/array.vue)

</template>

<template #style>

@[code{23-37}](../.vuepress/components/checkbox/array.vue)

</template>

</card>

<card>

## Data-driven groups

Pass `options` to let `CheckboxGroup` render flat or sectioned choices. A section heading selects all enabled children and automatically becomes indeterminate when only part of the section is selected. `columns` controls the grid and collapses to one column on small screens.

<template #example>
<checkbox-advanced-group />
</template>

<template #template>

@[code{31-36}](../.vuepress/components/checkbox/advanced-group.vue)

</template>

<template #script>

@[code{1-29}](../.vuepress/components/checkbox/advanced-group.vue)

</template>

<template #style>

@[code{38-47}](../.vuepress/components/checkbox/advanced-group.vue)

</template>

</card>

<card>

## Checkbox group tabs

`CheckboxGroupTabs` combines a platform switcher with grouped choices. The checkbox before a tab selects or clears the whole platform, while clicking its label only switches the visible content. Active tabs use color, surface and shadow instead of borders.

<template #example>
<checkbox-platform-tabs />
</template>

<template #template>

@[code{95-99}](../.vuepress/components/checkbox/platform-tabs.vue)

</template>

<template #script>

@[code{1-93}](../.vuepress/components/checkbox/platform-tabs.vue)

</template>

<template #style>

@[code{101-105}](../.vuepress/components/checkbox/platform-tabs.vue)

</template>

</card>

<card>

## Object values

CheckboxGroup can bind objects as option values. The current selected objects are shown below the controls.

<template #example>
<checkbox-object />
</template>

<template #template>

@[code{1-34}](../.vuepress/components/checkbox/object.vue)

</template>

<template #script>

@[code{35-44}](../.vuepress/components/checkbox/object.vue)

</template>

<template #style>

@[code{45-66}](../.vuepress/components/checkbox/object.vue)

</template>

</card>

<card>

## Icon

Change the icon inside the checkbox with the `icon` slot. Custom icons use a
white foreground while checked. Stroke SVG paths are drawn automatically;
filled icons use a scale and clip reveal. Set `icon-animation` to `draw`, `pop`,
or `none` to override the automatic choice. The slot exposes `checked` and
`indeterminate` for fully custom motion.

<utils-icon />

<template #example>
<checkbox-icon />
</template>

<template #template>

@[code{1-52}](../.vuepress/components/checkbox/icon.vue)

</template>

<template #script>

@[code{54-64}](../.vuepress/components/checkbox/icon.vue)

</template>

<template #style>

@[code{65-76}](../.vuepress/components/checkbox/icon.vue)

</template>

</card>

<card>

## Label

Add a label to the checkbox with the default slot of the component

<template #example>
<checkbox-label />
</template>

<template #template>

@[code{1-6}](../.vuepress/components/checkbox/label.vue)

</template>

<template #script>

@[code{7-12}](../.vuepress/components/checkbox/label.vue)

</template>

<template #style>

@[code{13-18}](../.vuepress/components/checkbox/label.vue)

</template>

</card>

<card>

## Loading

Add a loading status to the component with the property `loading`

<template #example>
<checkbox-loading />
</template>

<template #template>

@[code{1-6}](../.vuepress/components/checkbox/loading.vue)

</template>

<template #script>

@[code{8-13}](../.vuepress/components/checkbox/loading.vue)

</template>

<template #style>

@[code{15-20}](../.vuepress/components/checkbox/loading.vue)

</template>

</card>

<card>

## Line through

Add a line in the middle of the label when the checkbox is checked with the property `line-through`

<template #example>
<checkbox-line-through />
</template>

<template #template>

@[code{1-5}](../.vuepress/components/checkbox/line-through.vue)

</template>

<template #script>

@[code{7-11}](../.vuepress/components/checkbox/line-through.vue)

</template>

</card>

<card>

## Indeterminate

There are some cases where you have several checkboxes and you need one that manages all the others for this you can do it with the indeterminate property that adds a different style to the checkbox

<template #example>
<checkbox-indeterminate />
</template>

<template #template>

@[code{1-5}](../.vuepress/components/checkbox/indeterminate.vue)

</template>

<template #script>

@[code{6-10}](../.vuepress/components/checkbox/indeterminate.vue)

</template>

</card>
