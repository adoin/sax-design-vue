---
PROPS:
  - name: v-model
    type: FormGroupItem[]
    values: Form data array
    description: Each item owns one tab and one SForm; missing __index values are assigned automatically.
    default: '[]'
  - name: get-form-setting
    type: (data, index) => FormGroupFormSetting
    values: Function
    description: Returns the inner SForm configuration for an item.
  - name: tab-label
    type: String
    values: Text
    description: Default tab label prefix.
    default: Item
  - name: get-tab-label
    type: (data, index) => string
    values: Function
    description: Returns the complete label for an item.
  - name: get-context-menu-items
    type: ({ item, index, key, list }) => ContextMenuItem[]
    values: Function
    description: Returns right-click menu items for a tab. index is the current array position; key is the stable __index.
  - name: tabs-type
    type: String
    values: line / pill / card / connected-card / editable-card
    description: Visual style passed to the inner STabs. Add and remove controls remain independent from this setting.
    default: connected-card
  - name: editable / show-add
    type: Boolean
    values: true / false
    description: Control the remove and add controls respectively.
    default: 'false'
  - name: create-item
    type: ({ list }) => object | Promise<object>
    values: Function
    description: Creates a new form item synchronously or asynchronously.
  - name: max
    type: Number
    values: Positive number
    description: Maximum number of form items.
    default: Infinity
  - name: lazy-error-mark
    type: Boolean
    values: true / false
    description: Mark invalid tabs without moving to the first invalid tab.
    default: 'false'
  - name: render-threshold
    type: Number
    values: Non-negative integer
    description: Enables lazy tab content above this item count; force-render disables the optimization.
    default: '5'
description: 'Dynamic form groups built from STabs and SForm.'
EVENTS:
  - name: add / remove
    type: (item, index)
    description: Fires after a form item is added or removed.
  - name: change
    type: (activeKey, index, item)
    description: Fires when the active tab changes.
  - name: tab-contextmenu
    type: (context, mouseEvent)
    description: Fires when a tab is right-clicked. context contains item, index, key, and list.
  - name: context-menu-select
    type: (menuItem, context)
    description: Fires after selecting a built-in tab context-menu item.
  - name: validate
    type: (index, valid)
    description: Fires when one form finishes validation.
---

# Form group

<card>

`SFormGroup` wraps every array item in a tab and an independent `SForm`. Its tabs use the connected-card appearance by default; set `tabs-type` to use another `STabs` style without changing add or remove behavior. Above `render-threshold`, forms mount on first tab activation; unmounted items still participate in `validateAll` and `validateFields` through the headless rule engine. Context-menu actions can update the bound array directly; the group then prunes removed tabs, form instances, and validation state. The instance also exposes `clearValidate`, `resetFields`, and `getErrors`.

For validation outside the component, use the exported `createFormValidator(model, { rules, items })`. Its `validate` and `validateField` methods do not require a Vue component or DOM.

</card>

<card>

## Basic usage

<template #example><form-group-default /></template><template #template>

@[code](../.vuepress/components/form-group/default.vue)

</template></card>

<card>

## Large-data validation

This example starts with 25 items. Every value is valid by default except item 20. Only the active form mounts initially, but **Validate all** still checks every item and activates the first invalid tab. Add items or right-click a tab to compare its current zero-based array index with its stable `__index`.

<template #example><form-group-large-data /></template><template #template>

@[code](../.vuepress/components/form-group/large-data.vue)

</template></card>
