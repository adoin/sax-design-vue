---
description: 'Register reusable renderers once and use them across Form, Table, filters, editors, and toolbars.'
---

# Renderer

The global `renderer` registry lets an application give a reusable UI behavior a stable name. Form and Table resolve the same registry, so one definition can format a Table cell, edit it, render a Form item, provide a filter control, or create a toolbar item.

Register application renderers from an entry module or a dedicated startup module. Do not register them inside a component's setup function: remounting that component would repeat a global side effect. Use a slot when the rendering is unique to one component instance.

<card>

## Register renderers

Use `renderer.add(name, definition)` for one renderer. Prefer TSX in a dedicated `.tsx` startup module; switch to the equivalent `h()` version when the project does not enable JSX. Every stage below explicitly annotates its `options`, `params`, and return type, so the available context is visible without relying on editor hover information.

<code-variants>
<template #tsx>

@[code](../.vuepress/example-sources/renderer/status-tsx.tsx)

</template>
<template #h>

@[code](../.vuepress/example-sources/renderer/status-h.ts)

</template>
</code-variants>

Import that module once from the application entry. `renderer.mixin()` registers several definitions together. The registry also provides `get`, `has`, `entries`, and `delete`; adding an existing name replaces that global definition.

`defineTableRenderer<Row, QueryForm>()` carries the business row and query-form types through all five stages. Display and edit receive `row` and `draftRow`, Form rendering receives the query model, filtering receives the column, and toolbar rendering receives the fully typed Table and query context through `params.source`.

```ts
// main.ts
import { createApp } from 'vue'
import SaxDesignVue from 'sax-design-vue'
import App from './App.vue'
import './app/renderers'

createApp(App).use(SaxDesignVue).mount('#app')
```

</card>

<card>

## Use registered renderers

Form references a renderer with `itemRender.name`. A Table column uses `renderer.name` for body display and editing, `filterRender.name` for its filter panel, and `toolbarConfig.left` or `toolbarConfig.right` uses `itemRender` for toolbar content.

```ts
import type {
  FormItemConfig,
  TableColumn,
  TableToolbarConfig,
} from 'sax-design-vue'

type ProjectRow = {
  id: number
  status: string
}

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Paused', value: 'paused' },
]

const formItems: FormItemConfig[] = [
  {
    field: 'status',
    title: 'Status',
    itemRender: { name: '$status', options: statusOptions },
  },
]

const columns: TableColumn<ProjectRow>[] = [
  {
    field: 'status',
    title: 'Status',
    editor: true,
    renderer: { name: '$status', options: statusOptions },
    filterRender: { name: '$status', options: statusOptions },
    filterMethod: ({ value, values }) => value === values[0],
  },
]

const toolbarConfig: TableToolbarConfig = {
  left: [
    {
      itemRender: '$buttons',
      props: { maxVisible: 1, trigger: 'click' },
      options: [
        { code: 'create', text: 'Create' },
        { code: 'delete', text: 'Delete' },
      ],
    },
  ],
  right: [{ itemRender: '$refresh' }, { itemRender: '$columnConfig' }],
}
```

`props` and `attrs` are forwarded to the rendered component. `options` supplies choices or actions. Handlers in `events` receive the renderer context first, followed by the component event arguments. An explicit slot or component-local Table renderer keeps precedence over the global entry.

</card>

<card>

## Renderer contract

`RendererOptions<Model>` is the shared renderer configuration for Form, Table body cells, editors, filters, and toolbars. `Model` is `Row` during display and editing, and `QueryForm` during Form rendering. The old `FormItemRenderOptions` name remains only as a deprecated compatibility alias.

A definition implements only the methods it needs. All five methods return `VNodeChild`; their complete signatures are:

```ts
interface RendererMethods<Row extends object, QueryForm extends object> {
  renderDefault?: (
    options: RendererOptions<Row>,
    params: TableDefaultRendererParams<Row>,
  ) => VNodeChild
  renderEdit?: (
    options: RendererOptions<Row>,
    params: TableGlobalEditRendererParams<Row>,
  ) => VNodeChild
  renderFormItem?: (
    options: RendererOptions<QueryForm>,
    params: FormRendererParams<QueryForm>,
  ) => VNodeChild
  renderFilter?: (
    options: RendererOptions,
    params: TableGlobalFilterRendererParams<Row>,
  ) => VNodeChild
  renderToolbar?: (
    options: RendererOptions,
    params: TableGlobalToolbarRendererParams<Row, QueryForm>,
  ) => VNodeChild
}
```

The following fields are the main values available directly on each `params` object:

| Method           | Available `params` fields                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| `renderDefault`  | `row`, `column`, `value`, `index`, `rowIndex`, `columnIndex`, `depth`, `expanded`, `loading`, `toggleExpand` |
| `renderEdit`     | `row`, `draftRow`, `column`, `value`, `setValue`, `commit`, `cancel`, validation state                       |
| `renderFormItem` | `model`, `field`, `value`, `setValue`, `validate`, `submit`, `reset`                                         |
| `renderFilter`   | `column`, `values`, `setValues`, `apply`, `reset`, `close`; `value` is the current control draft             |
| `renderToolbar`  | `placement`, `disabled`, `action`, `source.table`, `source.context`, `source.busy`                           |

Body, edit, and filter parameters also contain the common `FormRendererParams` fields. `params.source` points to the original Table context before it enters the shared renderer. An `events` callback receives the matching stage `params` first, followed by the component event arguments.

**Complete `RendererOptions` type:**

```ts
interface RendererOptions<Model extends object = FormModel> {
  name: string
  component?: Component | string
  props?: Record<string, unknown>
  attrs?: Record<string, unknown>
  events?: Record<
    string,
    (params: FormRendererParams<Model>, ...args: unknown[]) => unknown
  >
  modelProp?: string
  modelEvent?: string
  changeEvent?: string
  content?: string | ((params: FormRendererParams<Model>) => VNodeChild)
  options?: unknown[]
  optionProps?: Record<string, string>
  children?: RendererOptions<Model>[]
}
```

Form and Table column configurations select a registry entry through `name`. Toolbar entries use `itemRender`, which is normalized to `RendererOptions` before invocation, so callback code still reads the name from `options.name`. `props`, `attrs`, and `options` are passed to the target component; a business renderer can narrow `unknown[]` to its own option type.

</card>

<card>

## Built-in renderers

The input renderers show plain text through `renderDefault` and use the corresponding component for `renderEdit`, `renderFormItem`, and `renderFilter`.

| Renderer         | Component or behavior                                               |
| ---------------- | ------------------------------------------------------------------- |
| `$input`         | `SInput`                                                            |
| `$textarea`      | `STextarea`                                                         |
| `$date`          | `SDatePicker`                                                       |
| `$dateRange`     | `SDatePicker` with `type="daterange"`                               |
| `$time`          | `STimeSelect`                                                       |
| `$timePicker`    | `STimePicker`                                                       |
| `$select`        | `SSelect`                                                           |
| `$radio`         | `SRadioGroup`                                                       |
| `$checkbox`      | `SCheckbox`                                                         |
| `$checkboxGroup` | `SCheckboxGroup`                                                    |
| `$treeSelect`    | `STableSelect` with tree mode                                       |
| `$cascader`      | `SCascader`                                                         |
| `$rate`          | `SRate`                                                             |
| `$slider`        | `SSlider`                                                           |
| `$switch`        | `SSwitch`                                                           |
| `$verCode`       | `SVerificationCode`                                                 |
| `$buttons`       | Reusable action group for display, Form actions, and Table toolbars |

`$buttons.options` contains action records with `code`, `text`, `icon`, `visible`, `disabled`, `loading`, `props`, and optional `onClick`. `props.maxVisible` keeps a chosen number inline and moves the rest into `SPopper`; `props.trigger` accepts `click` or `hover`. In Form, unhandled `submit` and `reset` codes call the current Form methods.

Table also registers these toolbar-only renderers:

| Renderer        | Behavior                                                                    |
| --------------- | --------------------------------------------------------------------------- |
| `button`        | One `SButton`, or an `SPopper` action menu when `props.children` is present |
| `$refresh`      | Refresh the current Table query or proxy request                            |
| `$columnConfig` | Open `STableColumnConfig` for the current Table                             |
| `$find`         | Mount the current Table's find-and-replace trigger and panel                |

Input-surface renderers receive `shape: 'square'` by default during Table editing so their outline meets the cell edges. An explicit `props.shape` value overrides that default. Form fields and Table filters retain normal shape resolution.

</card>
