import { isNil } from 'lodash-unified'
import { useColorProp } from '@vuesax-alpha/hooks'
import {
  buildProps,
  definePropType,
  isArray,
  isBoolean,
  isNumber,
  isObject,
  isString,
} from '@vuesax-alpha/utils'
import { popperProps } from '@vuesax-alpha/components/popper'
import type { EmitFn } from '@vuesax-alpha/utils'
import type { SelectOptionValue, SelectValue } from './tokens'

import type { ExtractPropTypes } from 'vue'
import type Select from './select.vue'

export type SelectDataOption = Record<string, unknown>

export interface SelectFilterConfig {
  /** Clear the search text after the panel closes. */
  clearOnClose?: boolean
  /** Same callback as `filterMethod`, kept close to VXE UI's API. */
  filterMethod?: (searchValue: string) => void
}

export interface SelectRemoteConfig {
  enabled?: boolean
  autoLoad?: boolean
  clearOnClose?: boolean
  queryMethod?: (params: {
    searchValue: string
    value: SelectValue
  }) => void | Promise<void>
}

export interface SelectPopupConfig {
  placement?: 'top' | 'bottom'
  transfer?: boolean
  width?: number | string
  height?: number | string
  zIndex?: number
  className?: string
}

export interface SelectVirtualConfig {
  /** Enable virtual rendering once the option count reaches this value. */
  threshold?: number
  /** Initial option-row height used before the virtualizer measures it. */
  estimateSize?: number
  /** Extra rows rendered above and below the visible window. */
  overscan?: number
}

export const selectProps = buildProps({
  showAfter: {
    type: Number,
    default: 0,
    validator: (val: number) => isNumber(val) && val >= 0,
  },
  hideAfter: {
    type: Number,
    default: 0,
    validator: (val: number) => isNumber(val) && val >= 0,
  },
  flip: {
    ...popperProps.flip,
    default: true,
  },
  fit: {
    ...popperProps.fit,
    default: true,
  },
  disabled: popperProps.disabled,
  onClick: popperProps.onClick,
  onBlur: popperProps.onBlur,
  onFocus: popperProps.onFocus,
  onMouseenter: popperProps.onMouseenter,
  onMouseleave: popperProps.onMouseleave,
  onContextmenu: popperProps.onContextmenu,
  onKeydown: popperProps.onKeydown,
  strategy: { ...popperProps.strategy, default: 'absolute' },
  teleported: popperProps.teleported,
  /**
   * @description binding value
   */
  modelValue: {
    type: definePropType<SelectValue>([Array, String, Number, Object]),
    default: '',
  },
  notValue: {
    type: definePropType<SelectOptionValue>([String, Number, Object]),
    default: '',
  },
  loadingText: { type: String },
  noMatchText: { type: String },
  noDataText: { type: String },
  allowCreate: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  multipleLimit: {
    type: Number,
    default: 0,
  },
  filter: { type: Boolean },
  /** VXE-compatible alias of `filter`. */
  filterable: { type: Boolean },
  filterMethod: {
    type: definePropType<(val: string) => void>(Function),
  },
  filterConfig: {
    type: definePropType<SelectFilterConfig>(Object),
    default: () => ({}),
  },
  remote: { type: Boolean },
  remoteMethod: {
    type: definePropType<
      (params: { searchValue: string }) => void | Promise<void>
    >(Function),
  },
  remoteConfig: {
    type: definePropType<SelectRemoteConfig>(Object),
    default: () => ({}),
  },
  /** Data driven options, equivalent to rendering `s-option` children. */
  options: {
    type: definePropType<SelectDataOption[]>(Array),
    default: () => [],
  },
  /** Virtualize flat data-driven options. Slots and option groups keep normal rendering. */
  virtual: { type: Boolean, default: false },
  virtualConfig: {
    type: definePropType<SelectVirtualConfig>(Object),
    default: () => ({}),
  },
  optionProps: {
    type: definePropType<{ value?: string; label?: string; disabled?: string }>(
      Object,
    ),
    default: () => ({}),
  },
  optionGroups: {
    type: definePropType<SelectDataOption[]>(Array),
    default: () => [],
  },
  optionGroupProps: {
    type: definePropType<{ options?: string; label?: string }>(Object),
    default: () => ({}),
  },
  popupConfig: {
    type: definePropType<SelectPopupConfig>(Object),
    default: () => ({}),
  },
  collapseChips: { type: Boolean },
  maxCollapseChips: {
    type: Number,
    default: 1,
    validator: (value: number) => isNumber(value) && value >= 0,
  },
  /**
   * @description set default select is firt option
   */
  defaultFirstOption: { type: Boolean },

  /**
   * @description Add a loading animation to the input.
   */
  loading: { type: Boolean },
  /**
   * @description Select color - Accept Vuesax's color, Hex, rgb
   */
  color: { ...useColorProp, default: 'primary' },
  /**
   * @description State color - Accept Vuesax's color, Hex, rgb
   */
  state: useColorProp,
  /**
   * @description make select width full
   */
  block: { type: Boolean },
  /**
   * @description hide scrollbar
   */
  hideScrollbar: { type: Boolean },

  /**
   * @description label is placeholder when input empty
   */
  labelFloat: { type: Boolean },

  /**
   * @description a label above the component.
   */
  label: {
    type: String,
    default: null,
  },

  /**
   * @description input placeholder
   */
  placeholder: {
    type: String,
    default: null,
  },
  shape: {
    type: String,
    values: ['square'] as const,
    default: '',
  },
  id: {
    type: String,
  },
  /**
   * @description show native scrollbar
   */
  nativeScrollbar: { type: Boolean },
  /**
   * @description native input readonly
   */
  clearable: { type: Boolean },
} as const)

export type SelectProps = ExtractPropTypes<typeof selectProps>

export const selectEmits = {
  'update:modelValue': (val: SelectValue) =>
    isArray(val) ||
    isString(val) ||
    isNumber(val) ||
    isBoolean(val) ||
    isObject(val) ||
    isNil(val),
  'visible-change': (val: boolean) => isBoolean(val),
  'remove-tag': (val: SelectOptionValue) => val,
  focus: (event: FocusEvent | Event) => event instanceof Event,
  blur: (event: FocusEvent | Event) => event instanceof Event,
  change: (val: SelectValue) =>
    isArray(val) ||
    isString(val) ||
    isNumber(val) ||
    isBoolean(val) ||
    isObject(val) ||
    isNil(val),
  clear: () => true,
}

export type SelectEmits = typeof selectEmits

export type SelectEmitsFn = EmitFn<SelectEmits>

export type SelectInstance = InstanceType<typeof Select>

export interface SelectExpose {
  /** focus to select */
  readonly focus: () => void
  /** blur select */
  readonly blur: () => void
}
