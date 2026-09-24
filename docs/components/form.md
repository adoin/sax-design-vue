---
API_TITLES:
  PROPS: SForm props
  CHILD_PROPS: SFormItem props
  ITEMS: items[] configuration (FormItemConfig)
  RULES: Validation rules (FormRule)
  RENDERERS: Renderer options (RendererOptions)
  EVENTS: SForm events
  EXPOSES: SForm exposed methods
PROPS:
  - name: model
    type: Object
    values: 'reactive form data'
    description: Required. The single data source read and written by field paths.
    default: null
  - name: size
    type: ComponentSize
    values: 'default / small / large'
    description: Default size inherited by schema renderers and slotted controls unless they declare their own size.
    default: null
  - name: rules
    type: FormRules
    values: '{ [field]: FormRule | FormRule[] }'
    description: Required, custom validator, and blur / change trigger rules.
    default: '{}'
  - name: items
    type: FormItemConfig[]
    values: 'tree configuration with children'
    description: Render schema-driven items; each node accepts SFormItem fields plus the items[] options below.
    default: '[]'
  - name: label-width
    type: String | Number
    values: 'CSS width'
    description: Default label width for horizontal items; fits four CJK characters plus the required marker.
    default: 'calc(4em + 24px)'
  - name: label-position
    type: String
    values: 'left / right / top'
    description: Default label placement for child Form Items.
    default: right
  - name: label-align
    type: String
    values: 'left / right'
    description: Default text alignment inside horizontal labels.
    default: right
  - name: inline
    type: Boolean
    values: 'true / false'
    description: Use the inline Form layout.
    default: 'false'
  - name: disabled
    type: Boolean
    values: 'true / false'
    description: Disable all declarative and schema-rendered fields.
    default: 'false'
  - name: readonly
    type: Boolean
    values: 'true / false'
    description: Make all declarative and schema-rendered fields readonly.
    default: 'false'
  - name: show-message
    type: Boolean
    values: 'true / false'
    description: Display validation errors and field descriptions.
    default: 'true'
  - name: reserve-error-space
    type: Boolean
    values: 'true / false'
    description: Reserve stable space for errors or helper text to prevent layout shift.
    default: 'true'
  - name: scroll-to-error
    type: Boolean
    values: 'true / false'
    description: Focus and scroll to the first invalid field.
    default: 'true'
  - name: column-gap
    type: String | Number
    values: 'CSS size'
    description: Horizontal gap in the 24-column Form grid.
    default: 16
  - name: row-gap
    type: String | Number
    values: 'CSS size'
    description: Vertical gap in the 24-column Form grid.
    default: 4
CHILD_PROPS:
  - name: label
    type: String
    description: Field label. Takes precedence over title.
    default: null
  - name: title
    type: String
    description: Compatibility alias used when label is absent.
    default: null
  - name: prop
    type: String
    values: 'deep model path'
    description: Field path such as profile.name. Takes precedence over field.
    default: null
  - name: field
    type: String
    values: 'deep model path'
    description: Compatibility alias used when prop is absent.
    default: null
  - name: id
    type: String
    description: Control id used by the generated label association.
    default: generated
  - name: description
    type: String
    description: Helper text shown when the field has no validation error.
    default: null
  - name: rules
    type: FormRule | FormRule[]
    description: Item-level rules; override SForm rules for this field.
    default: null
  - name: required
    type: Boolean
    values: 'true / false'
    description: Display the required state independently of validation rules.
    default: 'false'
  - name: label-width
    type: String | Number
    values: 'CSS width'
    description: Override SForm label-width for this Item.
    default: inherited
  - name: label-position
    type: String
    values: 'left / right / top'
    description: Override SForm label-position for this Item.
    default: inherited
  - name: span
    type: Number | FormItemSpan
    values: '1–24 / responsive object'
    description: Width occupied by this Item in the 24-column grid.
    default: 24
  - name: vertical
    type: Boolean
    values: 'true / false'
    description: Place this Item label above its control.
    default: 'false'
  - name: nested
    type: Boolean
    values: 'true / false'
    description: Treat the default slot as a nested Form Item grid.
    default: 'false'
  - name: align
    type: String
    values: 'left / center / right'
    description: Align the Item content within its grid cell.
    default: left
  - name: reserve-error-space
    type: Boolean
    values: 'true / false'
    description: Override SForm reserve-error-space for this Item.
    default: inherited
  - name: disabled
    type: Boolean
    values: 'true / false'
    description: Override the disabled state passed to itemRender.
    default: inherited
  - name: readonly
    type: Boolean
    values: 'true / false'
    description: Override the readonly state passed to itemRender.
    default: inherited
  - name: item-render
    type: RendererOptions
    description: Render a registered or custom control when no default slot is supplied.
    default: null
ITEMS:
  - name: key
    type: 'string | number'
    description: Stable Vue key for an items node; prop, field, then index are the fallbacks.
    default: null
    usage: '#schema-renderers-and-nested-layout'
  - name: children
    type: 'FormItemConfig[]'
    description: Recursively creates nested Form Item grids.
    default: null
    usage: '#schema-renderers-and-nested-layout'
  - name: visible
    type: boolean
    description: Statically controls whether this configuration node renders.
    default: true
    usage: '#schema-renderers-and-nested-layout'
  - name: visibleMethod
    type: '({ model, item }) => boolean'
    description: Dynamically decides whether the node renders from its model and configuration.
    default: null
    usage: '#schema-renderers-and-nested-layout'
  - name: disabled
    type: 'boolean | (model) => boolean'
    description: Overrides or derives the disabled state for this configuration node.
    default: inherited
    usage: '#schema-renderers-and-nested-layout'
  - name: readonly
    type: 'boolean | (model) => boolean'
    description: Overrides or derives the readonly state for this configuration node.
    default: inherited
    usage: '#schema-renderers-and-nested-layout'
  - name: class
    type: 'string | string[] | Record<string, boolean>'
    description: Class forwarded to the generated Form Item.
    default: null
    usage: '#schema-renderers-and-nested-layout'
  - name: style
    type: CSSProperties
    description: Inline style forwarded to the generated Form Item.
    default: null
    usage: '#schema-renderers-and-nested-layout'
  - name: slots
    type: '{ label?: string; default?: string; error?: string }'
    description: Names scoped slots declared on SForm for this configuration node.
    default: null
    usage: '#schema-renderers-and-nested-layout'
RULES:
  - name: required
    type: boolean
    description: Rejects undefined, null, an empty string, or an empty array.
    default: false
    usage: '#validation-and-triggers'
  - name: message
    type: string
    description: Fallback for required failure or a validator returning false; a returned error string takes precedence.
    default: null
    usage: '#validation-and-triggers'
  - name: validator
    type: '(value, model) => boolean | string | Promise<boolean | string>'
    description: Returns true when valid, false for the fallback message, or an error string to display.
    default: null
    usage: '#validation-and-triggers'
  - name: trigger
    type: "'blur' | 'change' | Array<'blur' | 'change'>"
    description: Interaction trigger; omitted rules run on blur and all rules run on submit.
    default: null
    usage: '#validation-and-triggers'
RENDERERS:
  - name: name
    type: string
    description: Required name of a registered renderer.
    default: null
    usage: '#custom-renderer'
  - name: component
    type: 'Component | string'
    description: Overrides the component registered under name.
    default: null
    usage: '#custom-renderer'
  - name: props
    type: 'Record<string, unknown>'
    description: Component props forwarded to the rendered control.
    default: null
    usage: '#custom-renderer'
  - name: attrs
    type: 'Record<string, unknown>'
    description: Additional HTML or component attributes.
    default: null
    usage: '#custom-renderer'
  - name: events
    type: 'Record<string, (params, ...args) => unknown>'
    description: Event handlers receiving the renderer context before component event arguments.
    default: null
    usage: '#custom-renderer'
  - name: modelProp
    type: string
    description: Model prop for a custom control; the Form field value overrides a same-named prop.
    default: modelValue
    usage: '#custom-renderer'
  - name: modelEvent
    type: string
    description: Model update event; its first argument is written directly to the Form field.
    default: 'update:modelValue'
    usage: '#custom-renderer'
  - name: content
    type: 'string | (params) => VNodeChild'
    description: Default slot text or a content rendering function.
    default: null
    usage: '#custom-renderer'
  - name: options
    type: 'unknown[]'
    description: Options forwarded to data-driven controls such as Select and Radio Group.
    default: null
    usage: '#custom-renderer'
  - name: optionProps
    type: 'Record<string, string>'
    description: Option field mapping available to custom renderers.
    default: null
    usage: '#custom-renderer'
  - name: children
    type: 'RendererOptions[]'
    description: Nested rendering nodes for composite controls.
    default: null
    usage: '#custom-renderer'
EVENTS:
  - name: validate
    description: Fired after a field validates with field, valid, and message.
  - name: submit
    description: Fired with model and native event after submission passes validation.
  - name: invalid-submit
    description: Fired with errors, model, and native event after submission fails validation.
  - name: reset
    description: Fired after native reset restores initial values.
SLOTS:
  - name: SForm.default
    type: Slot
    description: Compose Form Item controls or nested schema content.
  - name: SFormItem.default
    type: Slot
    scope: "{ id: string; error: string; validate: (trigger?: FormRuleTrigger | 'submit') => Promise<boolean> }"
    description: Render the field control using its generated id, validation message, and validation action.
  - name: SFormItem.label
    type: Slot
    scope: "{ id: string; label: string; required: boolean }"
    description: Customize the field label and required state.
  - name: SFormItem.error
    type: Slot
    scope: "{ error: string; description: string | undefined }"
    description: Customize validation and helper content.
  - name: 'items[].slots.default'
    type: Slot
    scope: "{ model: FormModel; size: string; item: FormItemConfig; field: string | undefined; prop: string | undefined; value: unknown; disabled: boolean; readonly: boolean; setValue: (value: unknown) => void; id: string }"
    description: Render a configured field using the current model and value setter.
  - name: 'items[].slots.label'
    type: Slot
    scope: "{ model: FormModel; size: string; item: FormItemConfig; field: string | undefined; prop: string | undefined; value: unknown; disabled: boolean; readonly: boolean; setValue: (value: unknown) => void; id: string; label: string; required: boolean }"
    description: Render a configured field label with its model context.
  - name: 'items[].slots.error'
    type: Slot
    scope: "{ model: FormModel; size: string; item: FormItemConfig; field: string | undefined; prop: string | undefined; value: unknown; disabled: boolean; readonly: boolean; setValue: (value: unknown) => void; error: string; description: string | undefined }"
    description: Render a configured field's error or helper content.
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

## Size

Compare the inherited `small`, `default`, and `large` component sizes.

<template #example><form-size /></template>

<template #template>

@[code{7-20}](../.vuepress/components/form/size.vue)

</template>

<template #script>

@[code{1-5}](../.vuepress/components/form/size.vue)

</template>

<template #style>

@[code{22-27}](../.vuepress/components/form/size.vue)

</template>

</card>

<card>

## Schema renderers and nested layout

`children` can recurse to any depth and every level uses the 24-column grid. A numeric `span` collapses to a full row on phones; pass `{ xs, sm, md, lg, xl }` for precise responsive sizing. Use the built-in `$input`, `$select`, `$switch`, and `$textarea` names directly in `itemRender`; `$buttons` can provide Form `submit` and `reset` actions without rebuilding an action slot.

<template #example><form-default /></template>

<template #template>

@[code{104-106}](../.vuepress/components/form/default.vue)

</template>

<template #script>

@[code{1-102}](../.vuepress/components/form/default.vue)

</template>

</card>

<card>

## Custom renderer

Reusable project renderers are registered once from the application entry. The example below only references `$uppercaseInput`, which this documentation site registered globally outside the component. See [Renderer](./renderer.md) for registration, callback contracts, usage in Form and Table, and built-in mappings.

<template #example><form-renderer /></template>

<template #template>

@[code{19-21}](../.vuepress/components/form/renderer.vue)

</template>

<template #script>

@[code{1-17}](../.vuepress/components/form/renderer.vue)

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
