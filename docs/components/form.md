---
API_TITLES:
  PROPS: SForm props
  CHILD_PROPS: SFormItem props
  EVENTS: SForm events
  EXPOSES: SForm exposed methods
PROPS:
  - name: model
    type: Object
    values: reactive form data
    description: Required. The single data source read and written by field paths.
    default: —
  - name: rules
    type: FormRules
    values: '{ [field]: FormRule | FormRule[] }'
    description: Required, custom validator, and blur / change trigger rules.
    default: '{}'
  - name: items
    type: FormItemConfig[]
    values: tree configuration with children
    description: Render schema-driven items and recursively compose complex layouts.
    default: '[]'
  - name: label-width
    type: String | Number
    values: CSS width
    description: Default label width for horizontal items; fits four CJK characters plus the required marker.
    default: 'calc(4em + 24px)'
  - name: label-position
    type: String
    values: left / right / top
    description: Default label placement for child Form Items.
    default: right
  - name: label-align
    type: String
    values: left / right
    description: Default text alignment inside horizontal labels.
    default: right
  - name: inline
    type: Boolean
    values: true / false
    description: Use the inline Form layout.
    default: 'false'
  - name: disabled
    type: Boolean
    values: true / false
    description: Disable all declarative and schema-rendered fields.
    default: 'false'
  - name: readonly
    type: Boolean
    values: true / false
    description: Make all declarative and schema-rendered fields readonly.
    default: 'false'
  - name: show-message
    type: Boolean
    values: true / false
    description: Display validation errors and field descriptions.
    default: 'true'
  - name: reserve-error-space
    type: Boolean
    values: true / false
    description: Reserve stable space for errors or helper text to prevent layout shift.
    default: 'true'
  - name: scroll-to-error
    type: Boolean
    values: true / false
    description: Focus and scroll to the first invalid field.
    default: 'true'
  - name: column-gap
    type: String | Number
    values: CSS size
    description: Horizontal gap in the 24-column Form grid.
    default: 16
  - name: row-gap
    type: String | Number
    values: CSS size
    description: Vertical gap in the 24-column Form grid.
    default: 4
CHILD_PROPS:
  - name: label
    type: String
    description: Field label. Takes precedence over title.
    default: —
  - name: title
    type: String
    description: Compatibility alias used when label is absent.
    default: —
  - name: prop
    type: String
    values: deep model path
    description: Field path such as profile.name. Takes precedence over field.
    default: —
  - name: field
    type: String
    values: deep model path
    description: Compatibility alias used when prop is absent.
    default: —
  - name: id
    type: String
    description: Control id used by the generated label association.
    default: generated
  - name: description
    type: String
    description: Helper text shown when the field has no validation error.
    default: —
  - name: rules
    type: FormRule | FormRule[]
    description: Item-level rules; override SForm rules for this field.
    default: —
  - name: required
    type: Boolean
    values: true / false
    description: Display the required state independently of validation rules.
    default: 'false'
  - name: label-width
    type: String | Number
    values: CSS width
    description: Override SForm label-width for this Item.
    default: inherited
  - name: label-position
    type: String
    values: left / right / top
    description: Override SForm label-position for this Item.
    default: inherited
  - name: span
    type: Number | FormItemSpan
    values: 1–24 / responsive object
    description: Width occupied by this Item in the 24-column grid.
    default: 24
  - name: vertical
    type: Boolean
    values: true / false
    description: Place this Item label above its control.
    default: 'false'
  - name: nested
    type: Boolean
    values: true / false
    description: Treat the default slot as a nested Form Item grid.
    default: 'false'
  - name: align
    type: String
    values: left / center / right
    description: Align the Item content within its grid cell.
    default: left
  - name: reserve-error-space
    type: Boolean
    values: true / false
    description: Override SForm reserve-error-space for this Item.
    default: inherited
  - name: disabled
    type: Boolean
    values: true / false
    description: Override the disabled state passed to itemRender.
    default: inherited
  - name: readonly
    type: Boolean
    values: true / false
    description: Override the readonly state passed to itemRender.
    default: inherited
  - name: item-render
    type: FormItemRenderOptions
    description: Render a registered or custom control when no default slot is supplied.
    default: —
EVENTS:
  - name: validate
    description: Fired after a field validates with field, valid, and message.
  - name: submit
    description: Fired with model and native event after submission passes validation.
  - name: invalid-submit
    description: Fired with errors, model, and native event after submission fails validation.
  - name: reset
    description: Fired after native reset restores initial values.
EXPOSES:
  - name: validate
    type: () => Promise<boolean>
    description: Validate every registered field.
  - name: validateField
    type: '(prop: string, trigger?) => Promise<boolean>'
    description: Validate one field path.
  - name: clearValidate
    type: '(props?: string | string[]) => void'
    description: Clear validation state for selected or all fields.
  - name: resetFields
    type: '(event?: Event) => void'
    description: Restore initial model values and clear errors.
  - name: submit
    type: '(event?: Event) => Promise<boolean>'
    description: Validate and emit submit or invalid-submit.
  - name: getErrors
    type: () => Record<string, string>
    description: Return the current field error map.
description: 'Form container with renderers, nested items, a 24-column grid, and stable error space.'
---

# Form

<card>

## Overview

Form supports both declarative slots and schema-driven `items`. The configuration API follows the useful VxeUI `children + itemRender` pattern: Form owns model and validation orchestration while renderers connect values, component props, and events.

</card>

<card>

## Validation and triggers

Validation is implemented inside Form without an external validation runtime. Rules support `required` and synchronous or asynchronous `validator(value, model)` functions.

- When `trigger` is omitted, interaction validation defaults to `blur`.
- `blur` runs when focus leaves the complete Form Item, rather than while moving between controls inside it.
- `change` watches the actual field model value, so declarative Items and schema renderers share the same behavior.
- `validate()`, `validateField()`, and form submission run applicable rules directly; submission ignores the interaction trigger and validates all rules.

</card>

<card>

## Headless validation

`createFormValidator(model, { rules, items })` runs the same rule format without mounting `SForm` or creating DOM. Use it for lazy content, pre-submit checks, and data that is not currently rendered. `validate()` returns `{ valid, errors }`; `validateField(field)` returns one field result.

<template #example><form-headless-validation /></template>

<template #template>

@[code{40-71}](../.vuepress/components/form/headless-validation.vue)

</template>

<template #script>

@[code{1-38}](../.vuepress/components/form/headless-validation.vue)

</template>

<template #style>

@[code{73-103}](../.vuepress/components/form/headless-validation.vue)

</template>

</card>

<card>

## Schema renderers and nested layout

`children` can recurse to any depth and every level uses the 24-column grid. A numeric `span` collapses to a full row on phones; pass `{ xs, sm, md, lg, xl }` for precise responsive sizing.

<template #example><form-default /></template>

<template #template>

@[code{99-108}](../.vuepress/components/form/default.vue)

</template>

<template #script>

@[code{1-97}](../.vuepress/components/form/default.vue)

</template>

<template #style>

@[code{110-116}](../.vuepress/components/form/default.vue)

</template>

</card>

<card>

## Custom renderer

Register project renderers with `formRenderer.add(name, definition)`. `renderItem` receives the model, field path, value, disabled state, `setValue`, and `validate` helpers.

<template #example><form-renderer /></template>

<template #template>

@[code{32-34}](../.vuepress/components/form/renderer.vue)

</template>

<template #script>

@[code{1-30}](../.vuepress/components/form/renderer.vue)

</template>

</card>

<card>

## Declarative nested items

The existing `<s-form-item>` API remains compatible. Add `nested` to a parent Item, place child Items directly inside it, and use `span` for layout.

<template #example><form-nested /></template>

<template #template>

@[code{13-33}](../.vuepress/components/form/nested.vue)

</template>

<template #script>

@[code{1-11}](../.vuepress/components/form/nested.vue)

</template>

</card>

<card>

## API ownership

Form has three related public inputs. Their fields intentionally overlap, but they are not interchangeable:

| Passed to                      | Public type             | Reference below            |
| ------------------------------ | ----------------------- | -------------------------- |
| `<s-form>`                     | `FormProps`             | **SForm props**            |
| `<s-form-item>`                | `FormItemProps`         | **SFormItem props**        |
| each node in `<s-form :items>` | `FormItemConfig`        | **items[] configuration**  |
| each entry in `rules`          | `FormRule`              | **Validation rule**        |
| `itemRender` on an Item/config | `FormItemRenderOptions` | **Renderer configuration** |

### `items[]` configuration (`FormItemConfig`)

Each `items` node accepts the same fields as `SFormItem` using camelCase names, such as `labelWidth`, `labelPosition`, `reserveErrorSpace`, and `itemRender`. It additionally supports these schema-only fields:

| Property        | Type                                            | Description                                                         |
| --------------- | ----------------------------------------------- | ------------------------------------------------------------------- |
| `key`           | `string \| number`                              | Stable Vue key; falls back to `prop`, `field`, then the item index. |
| `children`      | `FormItemConfig[]`                              | Recursively creates a nested Form Item grid.                        |
| `visible`       | `boolean`                                       | Statically include or omit this node.                               |
| `visibleMethod` | `({ model, item }) => boolean`                  | Compute visibility from the current model and config node.          |
| `disabled`      | `boolean \| (model) => boolean`                 | Static or model-driven disabled state.                              |
| `readonly`      | `boolean \| (model) => boolean`                 | Static or model-driven readonly state.                              |
| `class`         | `string \| string[] \| Record<string, boolean>` | Class forwarded to the generated Form Item.                         |
| `style`         | `CSSProperties`                                 | Inline style forwarded to the generated Form Item.                  |
| `slots`         | `{ label?, default?, error? }`                  | Names of scoped slots declared on `SForm`.                          |

### Validation rule (`FormRule`)

| Property    | Type                                                | Description                                                                  |
| ----------- | --------------------------------------------------- | ---------------------------------------------------------------------------- |
| `required`  | `boolean`                                           | Reject `undefined`, `null`, empty strings, and empty arrays.                 |
| `message`   | `string`                                            | Error text used by required or custom validation.                            |
| `validator` | `(value, model) => boolean \| string \| Promise<…>` | Return `true` when valid, or `false` / an error string when invalid.         |
| `trigger`   | `'blur' \| 'change' \| Array<'blur' \| 'change'>`   | Interaction that runs the rule; omitted interaction rules default to `blur`. |

### Renderer configuration (`FormItemRenderOptions`)

| Property      | Type                                           | Description                                                          |
| ------------- | ---------------------------------------------- | -------------------------------------------------------------------- |
| `name`        | `string`                                       | Required renderer registration name.                                 |
| `component`   | `Component \| string`                          | Override the component registered for `name`.                        |
| `props`       | `Record<string, unknown>`                      | Component props.                                                     |
| `attrs`       | `Record<string, unknown>`                      | Additional component attributes.                                     |
| `events`      | `Record<string, (params, ...args) => unknown>` | Event handlers receiving renderer context first.                     |
| `modelProp`   | `string`                                       | Model prop name; defaults to `modelValue`.                           |
| `modelEvent`  | `string`                                       | Model update event; defaults to `update:modelValue`.                 |
| `content`     | `string \| (params) => VNodeChild`             | Default slot content or a content renderer.                          |
| `options`     | `unknown[]`                                    | Data options forwarded to components such as Select and Radio Group. |
| `optionProps` | `Record<string, string>`                       | Option-field mapping available to custom renderers.                  |
| `children`    | `FormItemRenderOptions[]`                      | Nested renderer nodes for composite controls.                        |

Built-in renderer names match repository component names, including `SInput`, `SSelect`, `SSwitch`, `SCheckboxGroup`, `SRadioGroup`, `SDatePicker`, `STextarea`, and `SButton`.

The generated tables below are separated by owner: `SForm props` only apply to the Form container, while `SFormItem props` apply to a declarative Item and to same-named `items[]` fields.

</card>
