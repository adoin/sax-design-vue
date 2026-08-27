import { Fragment, h, resolveDynamicComponent } from 'vue'
import type { Component, VNodeChild } from 'vue'
import type { FormItemConfig, FormModel, FormRuleTrigger } from './form'

export interface FormRendererParams {
  model: FormModel
  field?: string
  prop?: string
  value: unknown
  item: FormItemConfig
  disabled: boolean
  readonly: boolean
  controlId?: string
  setValue: (value: unknown) => void
  validate: (trigger?: FormRuleTrigger | 'submit') => Promise<boolean>
}

export type FormRendererEvent = (
  params: FormRendererParams,
  ...args: unknown[]
) => unknown

export interface FormItemRenderOptions {
  name: string
  component?: Component | string
  props?: Record<string, unknown>
  attrs?: Record<string, unknown>
  events?: Record<string, FormRendererEvent>
  modelProp?: string
  modelEvent?: string
  changeEvent?: string
  content?: string | ((params: FormRendererParams) => VNodeChild)
  options?: unknown[]
  optionProps?: Record<string, string>
  children?: FormItemRenderOptions[]
}

export interface FormRendererDefinition {
  component?: Component | string
  defaultProps?: Record<string, unknown>
  modelProp?: string
  modelEvent?: string
  changeEvent?: string
  renderItem?: (
    options: FormItemRenderOptions,
    params: FormRendererParams,
  ) => VNodeChild
}

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
  options: FormItemRenderOptions,
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

export const renderFormItemRenderer = (
  options: FormItemRenderOptions,
  params: FormRendererParams,
): VNodeChild => {
  const definition = formRenderer.get(options.name) || {}
  return definition.renderItem
    ? definition.renderItem(options, params)
    : renderDefaultItem(options, params, definition)
}
