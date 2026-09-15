import { Fragment, h, resolveDynamicComponent } from 'vue'
import { RendererButtons } from '@vuesax-alpha/components/button'
import type {
  RendererButtonAction,
  RendererButtonsOptions,
} from '@vuesax-alpha/components/button'
import type { Component, VNodeChild } from 'vue'
import type { FormItemConfig, FormModel, FormRuleTrigger } from './form'
import type { FieldPath } from '../../types'

export interface FormRendererParams<Model extends object = FormModel> {
  model: Model
  field?: FieldPath<Model>
  prop?: FieldPath<Model>
  value: unknown
  item: FormItemConfig<Model>
  disabled: boolean
  readonly: boolean
  controlId?: string
  setValue: (value: unknown) => void
  validate: (trigger?: FormRuleTrigger | 'submit') => Promise<boolean>
  submit: (event?: Event) => Promise<boolean>
  reset: (event?: Event) => void
  /** Original Table/Form context supplied by an adapter. */
  source?: unknown
}

export interface RendererToolbarParams {
  source?: unknown
  placement: 'left' | 'right'
  disabled: boolean
  action: (code: string, event: MouseEvent) => unknown
}

export type FormRendererEvent<Model extends object = FormModel> = (
  params: FormRendererParams<Model>,
  ...args: unknown[]
) => unknown

export interface RendererOptions<Model extends object = FormModel> {
  name: string
  component?: Component | string
  props?: Record<string, unknown>
  attrs?: Record<string, unknown>
  events?: Record<string, FormRendererEvent<Model>>
  modelProp?: string
  modelEvent?: string
  changeEvent?: string
  content?: string | ((params: FormRendererParams<Model>) => VNodeChild)
  options?: unknown[]
  optionProps?: Record<string, string>
  children?: RendererOptions<Model>[]
}

/** @deprecated Use `RendererOptions` instead. */
export type FormItemRenderOptions<Model extends object = FormModel> =
  RendererOptions<Model>

export interface FormRendererDefinition {
  component?: Component | string
  defaultProps?: Record<string, unknown>
  modelProp?: string
  modelEvent?: string
  changeEvent?: string
  renderItem?: (
    options: RendererOptions,
    params: FormRendererParams,
  ) => VNodeChild
  renderDefault?: (
    options: RendererOptions,
    params: FormRendererParams,
  ) => VNodeChild
  renderEdit?: (
    options: RendererOptions,
    params: FormRendererParams,
  ) => VNodeChild
  renderFormItem?: (
    options: RendererOptions,
    params: FormRendererParams,
  ) => VNodeChild
  renderFilter?: (
    options: RendererOptions,
    params: FormRendererParams,
  ) => VNodeChild
  renderToolbar?: (
    options: RendererOptions,
    params: RendererToolbarParams,
  ) => VNodeChild
}

export type RendererDefinition = FormRendererDefinition

class FormRendererStore {
  private readonly store = new Map<string, FormRendererDefinition>()

  add(name: string, definition: FormRendererDefinition) {
    this.store.set(name, definition)
    return this
  }

  mixin(definitions: Record<string, FormRendererDefinition>) {
    Object.entries(definitions).forEach(([name, definition]) =>
      this.add(name, definition),
    )
    return this
  }

  get(name: string) {
    return this.store.get(name)
  }

  has(name: string) {
    return this.store.has(name)
  }

  delete(name: string) {
    return this.store.delete(name)
  }

  entries() {
    return [...this.store.entries()]
  }
}

export const formRenderer = new FormRendererStore()
/** VXE-style global renderer registry shared by Form and Table. */
export const renderer = formRenderer

formRenderer.mixin({
  SInput: { component: 'SInput' },
  SInputNumber: { component: 'SInputNumber' },
  STextarea: { component: 'STextarea' },
  SSelect: { component: 'SSelect' },
  SSwitch: { component: 'SSwitch' },
  SCheckbox: { component: 'SCheckbox' },
  SCheckboxGroup: { component: 'SCheckboxGroup' },
  SRadioGroup: { component: 'SRadioGroup' },
  SDatePicker: { component: 'SDatePicker' },
  STimePicker: { component: 'STimePicker' },
  STimeSelect: { component: 'STimeSelect' },
  SColorPicker: { component: 'SColorPicker' },
  SRate: { component: 'SRate' },
  SSlider: { component: 'SSlider' },
  SButton: {
    component: 'SButton',
    modelProp: '',
    modelEvent: '',
  },
})

const capitalize = (value: string) =>
  value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value

const toListenerKey = (event: string) => {
  const [name, ...suffix] = event.split(':')
  const camelized = name.replace(/[-_](\w)/g, (_, char: string) =>
    char.toUpperCase(),
  )
  return `on${capitalize(camelized)}${suffix.length ? `:${suffix.join(':')}` : ''}`
}

const renderDefaultItem = (
  options: RendererOptions,
  params: FormRendererParams,
  definition: FormRendererDefinition,
): VNodeChild => {
  const component = resolveDynamicComponent(
    options.component ?? definition.component ?? options.name,
  ) as Component | string
  const modelProp = options.modelProp ?? definition.modelProp ?? 'modelValue'
  const modelEvent =
    options.modelEvent ?? definition.modelEvent ?? 'update:modelValue'
  const componentProps: Record<string, unknown> = {
    disabled: params.disabled,
    readonly: params.readonly,
    ...(definition.defaultProps || {}),
    ...(options.props || {}),
    ...(options.attrs || {}),
  }

  if (params.controlId && componentProps.id == null)
    componentProps.id = params.controlId
  if (options.options) componentProps.options = options.options

  const eventHandlers = options.events || {}
  Object.entries(eventHandlers).forEach(([event, handler]) => {
    componentProps[toListenerKey(event)] = (...args: unknown[]) =>
      handler(params, ...args)
  })

  if (params.field && modelProp) {
    componentProps[modelProp] = params.value
    componentProps[toListenerKey(modelEvent)] = (value: unknown) => {
      params.setValue(value)
      eventHandlers[modelEvent]?.(params, value)
    }
  }

  const renderContent = () => {
    if (options.children?.length) {
      return options.children.map((child, index) =>
        h(Fragment, { key: `${child.name}-${index}` }, [
          renderFormItemRenderer(child, params),
        ]),
      )
    }
    return typeof options.content === 'function'
      ? options.content(params)
      : options.content
  }

  return h(component, componentProps, { default: renderContent })
}

const renderControl = (options: RendererOptions, params: FormRendererParams) =>
  renderDefaultItem(options, params, formRenderer.get(options.name) || {})

const controlDefinition = (
  component: Component | string,
  defaultProps?: Record<string, unknown>,
): FormRendererDefinition => ({
  component,
  defaultProps,
  renderDefault: (_options, params) => String(params.value ?? ''),
  renderEdit: renderControl,
  renderFormItem: renderControl,
  renderFilter: renderControl,
})

formRenderer.mixin({
  $input: controlDefinition('SInput', { block: true }),
  $textarea: controlDefinition('STextarea', { block: true }),
  $date: controlDefinition('SDatePicker', { block: true }),
  $dateRange: controlDefinition('SDatePicker', {
    block: true,
    type: 'daterange',
  }),
  $time: controlDefinition('STimeSelect', { block: true }),
  $timePicker: controlDefinition('STimePicker', { block: true }),
  $select: controlDefinition('SSelect', { block: true }),
  $radio: controlDefinition('SRadioGroup'),
  $checkbox: controlDefinition('SCheckbox'),
  $checkboxGroup: controlDefinition('SCheckboxGroup'),
  $treeSelect: controlDefinition('STableSelect', {
    block: true,
    treeConfig: { line: true },
  }),
  $cascader: controlDefinition('SCascader', { block: true }),
  $rate: controlDefinition('SRate'),
  $slider: controlDefinition('SSlider'),
  $switch: controlDefinition('SSwitch'),
  $verCode: controlDefinition('SVerificationCode'),
  $buttons: {
    modelProp: '',
    modelEvent: '',
    renderDefault: (options, params) => {
      const rendererOptions = options.props as Partial<
        RendererButtonsOptions<unknown>
      >
      const context = params.source ?? params
      return h(RendererButtons, {
        context,
        disabled: params.disabled,
        options: {
          ...rendererOptions,
          actions: (options.options ?? []) as RendererButtonAction[],
        },
        onAction: (action: RendererButtonAction, event: MouseEvent) => {
          const handler = options.events?.[action.code]
          if (handler) handler(params, event)
          else if (action.code === 'submit') params.submit(event)
          else if (action.code === 'reset') params.reset(event)
        },
      })
    },
    renderFormItem: (options, params) =>
      formRenderer.get('$buttons')?.renderDefault?.(options, params),
    renderToolbar: (options, params) => {
      const rendererOptions = options.props as Partial<
        RendererButtonsOptions<unknown>
      >
      return h(RendererButtons, {
        context: params.source,
        disabled: params.disabled,
        options: {
          ...rendererOptions,
          actions: (options.options ?? []) as RendererButtonAction[],
        },
        onAction: (action: RendererButtonAction, event: MouseEvent) => {
          const handler = options.events?.[action.code]
          if (handler) handler(params.source as FormRendererParams, event)
          else params.action(action.code, event)
        },
      })
    },
  },
})

export const renderFormItemRenderer = (
  options: RendererOptions,
  params: FormRendererParams,
): VNodeChild => {
  const definition = formRenderer.get(options.name) || {}
  const render = definition.renderFormItem ?? definition.renderItem
  return render
    ? render(options, params)
    : renderDefaultItem(options, params, definition)
}
