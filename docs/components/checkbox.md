---
description: 'Choose one or more boolean options.'
PROPS:
  - name: disabled / max / not-value
    type: Boolean / Number / String | Number | Boolean
    values: true | false / selected value limit / unchecked value
    description: Disable selection, cap grouped selections, or customize the unchecked value.
    default: 'false / - / false'
  - name: v-model
    type: Boolean, String, Array
    values: boolean, string, array
    description: determine the value of the checkbox and data anchor.
    default: false
    link: null
    usage: '#default'

  - name: color
    type: String
    values: Sax Design colors, RGB, HEX
    description: Change the color of the component.
    default: false
    link: null
    usage: '#color'

  - name: value
    type: String, Object
    values: String, Object
    description: Determine the value of the input when being checked.
    default: true
    link: null
    usage: '#string-value'

  - name: loading
    type: Boolean
    values: true, false
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
    values: true, false
    description: Add a line in the center of the label when checked.
    default: false
    link: null
    usage: '#linethrough'
    code: >
      <template>
        <s-checkbox line-through v-model="option">
          Option
        </s-checkbox>
      </template>

  - name: icon-animation
    type: String
    values: auto, draw, pop, none
    description: Animate a custom icon. Auto draws stroke SVG paths and uses a pop reveal for filled icons.
    default: auto
    link: null
    usage: '#icon'

  - name: indeterminate
    type: Boolean
    values: true, false
    description: Change the default checkbox icon to a line that represents undetermined data.
    default: false
    link: null
    usage: '#Indeterminate'
    code: >
      <template>
        <s-checkbox indeterminate v-model="option">
          Option
        </s-checkbox>
      </template>

  - name: label-before
    type: Boolean
    values: true, false
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
    values: true, false
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
    values: true, false
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

  - name: Checkbox Group
    type: Array<String | Number | Object>
    values: null
    description: It is used for multiple checkboxes which are bound in one group.
    default: null
    link: null
    usage: '#checkbox-group'

  - name: id
    type: string
    values: null
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
    values: null
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

EVENTS:
  - name: update:modelValue / change
    type: CheckboxModelType | CheckboxGroupValueType
    description: Fire when a Checkbox or CheckboxGroup value changes.
  - name: update:activeKey / tabChange
    type: String | Number
    description: Fire when CheckboxGroupTabs activates another tab.
  - name: CheckboxGroupTabs change
    type: '(value: CheckboxGroupTabsModelValue, activeKey: String | Number)'
    description: Fires with the complete grouped value and active tab after a tabbed selection changes.
SLOTS:
  - name: icon
    type: slot
    values: checked, indeterminate
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
    values: null
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

## color

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

## Boolean Value

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

## String Value

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

## Loading <Badge text="New"/>

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

## Line Through <Badge text="New"/>

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

## Indeterminate <Badge text="New"/>

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

<card>

### CheckboxGroup

| Property                | Type                                              | Default | Description                                                                 |
| ----------------------- | ------------------------------------------------- | ------- | --------------------------------------------------------------------------- |
| `v-model`               | `CheckboxValue[]`                                 | `[]`    | Flat array containing every selected child value.                           |
| `options`               | `(CheckboxGroupOption \| CheckboxGroupSection)[]` | `[]`    | Data-driven options; an item with `options` becomes a selectable section.   |
| `columns`               | `number`                                          | `1`     | Default column count. A section can override it with its own `columns`.     |
| `gap`                   | `number \| string`                                | `12`    | Row and column gap. Numbers are treated as pixels.                          |
| `disabled-values`       | `CheckboxValue[]`                                 | `[]`    | Disable child values and preserve them during section select/clear actions. |
| `disabled-group-values` | `CheckboxValue[]`                                 | `[]`    | Disable select-all for the specified sections.                              |
| `disabled`              | `boolean`                                         | `false` | Disable the whole group.                                                    |
| `min` / `max`           | `number`                                          | `-`     | Minimum and maximum selected value counts.                                  |

`CheckboxGroupOption` supports `label`, `value`, `disabled`, and `description`. `CheckboxGroupSection` supports `label`, `value`, `options`, `disabled`, and `columns`.
Child `value` entries must remain unique within a CheckboxGroup or tab.

Events: `update:modelValue(value)` and `change(value)`. Slots: `option`, `group-label`, and `empty`. The default slot remains compatible with manually composed Checkbox children when `options` is omitted.

### CheckboxGroupTabs

| Property                            | Type                              | Default           | Description                                              |
| ----------------------------------- | --------------------------------- | ----------------- | -------------------------------------------------------- |
| `v-model`                           | `Record<string, CheckboxValue[]>` | `{}`              | Selected values stored independently by tab value.       |
| `tabs`                              | `CheckboxGroupTab[]`              | `[]`              | Tabs containing `label`, `value`, and grouped `options`. |
| `active-key` / `v-model:active-key` | `string \| number`                | First enabled tab | Active tab.                                              |
| `columns`                           | `number`                          | `2`               | Default content column count.                            |
| `gap`                               | `number \| string`                | `12`              | Content row and column gap.                              |
| `disabled`                          | `boolean`                         | `false`           | Disable every tab and option.                            |

Events: `update:modelValue(value)`, `change(value, activeKey)`, `update:activeKey(activeKey)`, and `tabChange(activeKey)`. Slots: `tab`, `option`, `group-label`, and `empty`.

</card>
