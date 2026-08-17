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
import type {
  OffsetOptions,
  Placement,
} from '@vuesax-alpha/hooks/use-floating/vue'
import type { SelectOptionValue, SelectValue } from './tokens'

import type { CSSProperties, ExtractPropTypes } from 'vue'
import type Select from './select.vue'

export type SelectDataOption = Record<string, unknown>

export type SelectSelectionTool = 'all' | 'invert' | 'clear'

export interface SelectFilterConfig {
  /** Clear the search text after the panel closes. */
  clearOnClose?: boolean
  /** Alias of `filterMethod`. */
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
  placement?: Placement
  transfer?: boolean
  appendTo?: string | HTMLElement
  offset?: OffsetOptions
  /** Explicit popup width. `full` matches the trigger width. */
  width?: number | string
  /** Match the popup width to the Select trigger. */
  full?: boolean
  /** PSelect-compatible width matching switch. */
  matchTriggerWidth?: boolean
  minWidth?: number | string
  maxWidth?: number | string
  height?: number | string
  maxHeight?: number | string
  zIndex?: number
  className?: string
  style?: CSSProperties
}

export interface SelectVirtualConfig {
  /** Enable virtual rendering once the option count reaches this value. */
  threshold?: number
  /** Initial option-row height used before the virtualizer measures it. */
  estimateSize?: number
  /** Extra rows rendered above and below the visible window. */
  overscan?: number
  /** Measure rendered option rows so wrapped/custom content can use dynamic heights. */
  dynamic?: boolean
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
  /** Alias of `filter`. */
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
  /** Options retained only for resolving labels of selected values. */
  cachedOptions: {
    type: definePropType<SelectDataOption[]>(Array),
    default: () => [],
  },
  /** Highlight the matching part of data-driven option labels. */
  highlightSearch: { type: Boolean, default: false },
  /** Decide whether an option matches the current search text. */
  filterOption: {
    type: definePropType<
      (searchValue: string, option: SelectDataOption) => boolean
    >(Function),
  },
  /** Apply an additional visibility rule after search filtering. */
  optionVisibleMethod: {
    type: definePropType<(option: SelectDataOption) => boolean>(Function),
  },
  /** Local-storage namespace used to persist pinned option values. */
  pinKey: { type: String },
  /** Load pinned values from a remote persistence layer. */
  getPinOptions: {
    type: definePropType<
      () => SelectOptionValue[] | Promise<SelectOptionValue[]>
    >(Function),
  },
  /** Persist a newly pinned option remotely. */
  pinMethod: {
    type: definePropType<(value: SelectOptionValue) => void | Promise<void>>(
      Function,
    ),
  },
  /** Remove a pinned option from remote persistence. */
  unpinMethod: {
    type: definePropType<(value: SelectOptionValue) => void | Promise<void>>(
      Function,
    ),
  },
  /** Select the first pinned option, or the first enabled option, when empty. */
  autoUseOption: { type: Boolean },
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
  collapseChips: { type: Boolean, default: true },
  maxCollapseChips: {
    type: Number,
    default: 0,
    validator: (value: number) => isNumber(value) && value >= 0,
  },
  multipleDisplayMode: {
    type: String,
    values: ['tags', 'text'] as const,
    default: 'tags',
  },
  getTagLabel: {
    type: definePropType<
      (params: {
        value: SelectOptionValue
        label: string
        option?: SelectDataOption
      }) => string
    >(Function),
  },
  getDisplayValue: {
    type: definePropType<
      (params: {
        value: SelectValue
        labels: string[]
        options: Array<SelectDataOption | undefined>
      }) => string
    >(Function),
  },
  /** Optional built-in tools shown above a multiple-select list. */
  selectionTools: {
    type: definePropType<SelectSelectionTool[]>(Array),
    default: () => [],
  },
  selectionToolLabels: {
    type: definePropType<Partial<Record<SelectSelectionTool, string>>>(Object),
    default: () => ({}),
  },
  /** Show a check mark beside selected options. */
  showSelectedMark: { type: Boolean, default: false },
  /** Placeholder used by the editable search field. */
  searchPlaceholder: { type: String, default: '' },
  /**
   * @description set default select is firt option
   */
  defaultFirstOption: { type: Boolean },

  /**
   * @description Add a loading animation to the input.
   */
  loading: { type: Boolean },
  /**
   * @description Select color - Accept Sax Design color tokens, Hex, rgb
   */
  color: { ...useColorProp, default: 'primary' },
  /**
   * @description State color - Accept Sax Design color tokens, Hex, rgb
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
  'pin-fetch': (values: SelectOptionValue[], loaded: boolean) =>
    isArray(values) && isBoolean(loaded),
  'pin-change': (payload: {
    value: SelectOptionValue
    pinned: boolean
    values: SelectOptionValue[]
  }) => isBoolean(payload.pinned) && isArray(payload.values),
}

export type SelectEmits = typeof selectEmits

export type SelectEmitsFn = EmitFn<SelectEmits>

export type SelectInstance = InstanceType<typeof Select>

export interface SelectExpose {
  /** focus to select */
  readonly focus: () => void
  /** blur select */
  readonly blur: () => void
  /** Return the pinned values in their current display order. */
  readonly getPinnedItems: () => SelectOptionValue[]
  /** Reload pinned values from the configured persistence source. */
  readonly refreshPinnedItems: () => Promise<SelectOptionValue[]>
  /** Toggle one value between pinned and unpinned. */
  readonly togglePin: (value: SelectOptionValue) => Promise<void>
}
