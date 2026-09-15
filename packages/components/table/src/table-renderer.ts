import { h } from 'vue'
import {
  type FormModel,
  type FormRendererDefinition,
  type FormRendererParams,
  type RendererOptions,
  type RendererToolbarParams,
  formRenderer,
} from '@vuesax-alpha/components/form'
import { SButton } from '@vuesax-alpha/components/button'
import TableColumnConfig from './table-column-config.vue'
import TableToolbarButton from './table-toolbar-button.vue'
import type {
  TableCellRenderParams,
  TableEditSlotParams,
  TableFilterSlotParams,
  TableRendererEvent,
  TableRendererOptions,
  TableRow,
} from './table'
import type {
  TableToolbarRendererOptions,
  TableToolbarRendererParams,
} from './table-business'
import type { VNodeChild } from 'vue'

export type TableDefaultRendererParams<Row extends object = TableRow> =
  FormRendererParams<Row> &
    TableCellRenderParams<Row> & { source: TableCellRenderParams<Row> }

export type TableGlobalEditRendererParams<Row extends object = TableRow> =
  FormRendererParams<Row> &
    TableEditSlotParams<Row> & { source: TableEditSlotParams<Row> }

export type TableGlobalFilterRendererParams<Row extends object = TableRow> =
  FormRendererParams<FormModel> &
    TableFilterSlotParams<Row> & { source: TableFilterSlotParams<Row> }

export type TableGlobalToolbarRendererParams<
  Row extends object = TableRow,
  QueryForm extends object = FormModel,
> = RendererToolbarParams & {
  source: TableToolbarRendererParams<Row, QueryForm>
}

export type TableGlobalRendererDefinition<
  Row extends object = TableRow,
  QueryForm extends object = FormModel,
> = Omit<
  FormRendererDefinition,
  | 'renderItem'
  | 'renderDefault'
  | 'renderEdit'
  | 'renderFormItem'
  | 'renderFilter'
  | 'renderToolbar'
> & {
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

/** Preserve Row and QueryForm inference while registering one shared renderer. */
export const defineTableRenderer = <
  Row extends object = TableRow,
  QueryForm extends object = FormModel,
>(
  definition: TableGlobalRendererDefinition<Row, QueryForm>,
) => definition as unknown as FormRendererDefinition

/** VXE-style global registry shared with SForm. */
export const tableRenderer: typeof formRenderer = formRenderer

const arrayRenderers = new Set(['$checkboxGroup', '$dateRange'])
const squareEditRenderers = new Set([
  '$input',
  '$textarea',
  '$date',
  '$dateRange',
  '$time',
  '$timePicker',
  '$select',
  '$treeSelect',
  '$cascader',
  '$verCode',
])
const rendererUsesArray = (options: TableRendererOptions) =>
  arrayRenderers.has(options.name) || options.props?.multiple === true

const formOptions = (
  options: TableRendererOptions,
  source: Parameters<TableRendererEvent>[0],
): RendererOptions => ({
  name: options.name,
  props: options.props,
  attrs: options.attrs,
  options: options.options,
  events: Object.entries(options.events ?? {}).reduce<
    NonNullable<RendererOptions['events']>
  >((result, [name, handler]) => {
    result[name] = (_params: FormRendererParams, ...args: unknown[]) =>
      handler(source, ...args)
    return result
  }, {}),
})

const baseParams = (
  source: Parameters<TableRendererEvent>[0],
  value: unknown,
): Omit<FormRendererParams, 'model' | 'item' | 'setValue'> => ({
  field: source.column.field,
  prop: source.column.field,
  value,
  disabled: 'disabled' in source ? source.disabled : false,
  readonly: false,
  validate: async () => true,
  submit: async () => true,
  reset: () => undefined,
  source,
})

export const resolveGlobalDefaultRenderer = (
  params: TableCellRenderParams,
  options: TableRendererOptions,
) => {
  const definition = formRenderer.get(options.name)
  if (!definition?.renderDefault) return
  return definition.renderDefault(formOptions(options, params), {
    ...params,
    ...baseParams(params, params.value),
    model: params.row,
    item: { field: params.column.field },
    setValue: () => undefined,
  })
}

export const resolveGlobalEditRenderer = (
  params: TableEditSlotParams,
  options: TableRendererOptions,
) => {
  const definition = formRenderer.get(options.name)
  if (!definition?.renderEdit) return
  const editOptions = squareEditRenderers.has(options.name)
    ? {
        ...options,
        props: { shape: 'square', ...(options.props ?? {}) },
      }
    : options
  return definition.renderEdit(formOptions(editOptions, params), {
    ...params,
    ...baseParams(params, params.value),
    model: params.draftRow,
    item: { field: params.column.field },
    setValue: params.setValue,
    submit: params.commit,
    reset: params.cancel,
  })
}

export const resolveGlobalFilterRenderer = (
  params: TableFilterSlotParams,
  options: TableRendererOptions,
) => {
  const definition = formRenderer.get(options.name)
  if (!definition?.renderFilter) return
  const multiple = rendererUsesArray(options)
  const value = multiple ? params.values : params.values[0]
  return definition.renderFilter(formOptions(options, params), {
    ...params,
    ...baseParams(params, value),
    model: { value },
    item: { field: 'value' },
    setValue: (next) => {
      if (multiple) {
        params.setValues(Array.isArray(next) ? next : [])
        return
      }
      params.setValues(next == null || next === '' ? [] : [next as never])
    },
    submit: async () => {
      params.apply()
      return true
    },
    reset: params.reset,
  })
}

const toolbarOptions = (
  options: TableToolbarRendererOptions,
  params: TableToolbarRendererParams,
): RendererOptions => {
  const content = options.content
  return {
    name: options.itemRender,
    props: options.props,
    attrs: options.attrs,
    options: options.options,
    content: typeof content === 'function' ? () => content(params) : content,
    events: Object.entries(options.events ?? {}).reduce<
      NonNullable<RendererOptions['events']>
    >((result, [name, handler]) => {
      result[name] = (_source, ...args) => handler(params, ...args)
      return result
    }, {}),
  }
}

export const resolveGlobalToolbarRenderer = (
  options: TableToolbarRendererOptions,
  params: TableToolbarRendererParams,
  action: (code: string, event: MouseEvent) => unknown,
) => {
  const definition = formRenderer.get(options.itemRender)
  if (!definition?.renderToolbar || options.visible === false) return
  return definition.renderToolbar(toolbarOptions(options, params), {
    source: {
      ...params,
    },
    placement: params.placement,
    disabled: params.busy || options.disabled === true,
    action: (code, event) => {
      const handler = options.events?.[code]
      return handler ? handler(params, event) : action(code, event)
    },
  })
}

formRenderer.mixin({
  button: {
    renderToolbar: (options, params) => {
      const source = params.source as TableToolbarRendererParams
      const content =
        typeof options.content === 'function'
          ? options.content(source as never)
          : options.content
      const configuredContent = options.props?.content
      return h(TableToolbarButton, {
        options: {
          ...(options.props ?? {}),
          content:
            typeof configuredContent === 'string'
              ? configuredContent
              : typeof content === 'string'
                ? content
                : undefined,
        },
        disabled: params.disabled,
        onAction: params.action,
      })
    },
  },
  $refresh: {
    renderToolbar: (options, params) => {
      const source = params.source as TableToolbarRendererParams
      const content =
        typeof options.content === 'function'
          ? options.content(source as never)
          : options.content
      return h(
        SButton,
        {
          flat: true,
          ...(options.props ?? {}),
          ...(options.attrs ?? {}),
          disabled: params.disabled || Boolean(options.props?.disabled),
          loading: Boolean(options.props?.loading),
          onClick: (event: MouseEvent) => {
            const handler = options.events?.click
            if (handler) handler(source as unknown as FormRendererParams, event)
            else source.table.refresh()
          },
        },
        { default: () => content },
      )
    },
  },
  $columnConfig: {
    renderToolbar: (options, params) =>
      h(TableColumnConfig, {
        ...(options.props ?? {}),
        ...(options.attrs ?? {}),
        disabled: params.disabled || Boolean(options.props?.disabled),
      }),
  },
})
