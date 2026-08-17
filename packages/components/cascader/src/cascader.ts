import {
  buildProps,
  definePropType,
  isArray,
  isBoolean,
} from '@vuesax-alpha/utils'
import type {
  OffsetOptions,
  Placement,
} from '@vuesax-alpha/hooks/use-floating/vue'
import type { CSSProperties, ExtractPropTypes } from 'vue'
import type Cascader from './cascader.vue'

export type CascaderValue = string | number
export type CascaderPathValue = CascaderValue[]
export type CascaderModelValue = CascaderPathValue | CascaderPathValue[]
export type CascaderExpandTrigger = 'click' | 'hover'
export type CascaderCheckedStrategy = 'SHOW_PARENT' | 'SHOW_CHILD'

export const SHOW_PARENT: CascaderCheckedStrategy = 'SHOW_PARENT'
export const SHOW_CHILD: CascaderCheckedStrategy = 'SHOW_CHILD'

export interface CascaderOption {
  value?: CascaderValue
  label?: string | number
  children?: CascaderOption[]
  disabled?: boolean
  isLeaf?: boolean
  loading?: boolean
  [key: string]: unknown
}

export interface CascaderFieldNames {
  value?: string
  label?: string
  children?: string
  disabled?: string
  isLeaf?: string
}

export interface CascaderShowSearchConfig {
  filter?: (inputValue: string, path: CascaderOption[]) => boolean
  sort?: (
    a: CascaderOption[],
    b: CascaderOption[],
    inputValue: string,
  ) => number
  limit?: number | false
  matchInputWidth?: boolean
}

export interface CascaderPopupConfig {
  placement?: Placement
  transfer?: boolean
  appendTo?: string | HTMLElement
  offset?: OffsetOptions
  width?: number | string | 'full'
  full?: boolean
  matchTriggerWidth?: boolean
  minWidth?: number | string
  maxWidth?: number | string
  maxHeight?: number | string
  zIndex?: number
  className?: string
  style?: CSSProperties
}

export const cascaderProps = buildProps({
  modelValue: {
    type: definePropType<CascaderModelValue>(Array),
    default: () => [],
  },
  options: {
    type: definePropType<CascaderOption[]>(Array),
    default: () => [],
  },
  fieldNames: {
    type: definePropType<CascaderFieldNames>(Object),
    default: () => ({}),
  },
  placeholder: String,
  separator: { type: String, default: ' / ' },
  disabled: Boolean,
  clearable: Boolean,
  allowClear: { type: Boolean, default: true },
  multiple: Boolean,
  changeOnSelect: Boolean,
  /** @deprecated Use `changeOnSelect` instead. */
  checkStrictly: Boolean,
  expandTrigger: {
    type: String,
    values: ['click', 'hover'] as const,
    default: 'click',
  },
  showSearch: {
    type: definePropType<boolean | CascaderShowSearchConfig>([Boolean, Object]),
    default: false,
  },
  searchValue: String,
  loadData: {
    type: definePropType<
      (selectedOptions: CascaderOption[]) => void | Promise<void>
    >(Function),
  },
  displayRender: {
    type: definePropType<
      (labels: string[], selectedOptions: CascaderOption[]) => string
    >(Function),
  },
  showCheckedStrategy: {
    type: String,
    values: [SHOW_PARENT, SHOW_CHILD] as const,
    default: SHOW_PARENT,
  },
  maxTagCount: {
    type: definePropType<number | 'responsive'>([Number, String]),
    default: 'responsive',
  },
  maxTagPlaceholder: {
    type: definePropType<(omittedValues: CascaderPathValue[]) => string>(
      Function,
    ),
  },
  open: { type: Boolean, default: undefined },
  defaultOpen: Boolean,
  placement: {
    type: definePropType<Placement>(String),
    default: 'bottom-start',
  },
  teleported: { type: Boolean, default: true },
  popupClassName: String,
  dropdownStyle: {
    type: definePropType<CSSProperties>(Object),
    default: () => ({}),
  },
  popupConfig: {
    type: definePropType<CascaderPopupConfig>(Object),
    default: () => ({}),
  },
  notFoundContent: String,
  loading: Boolean,
  block: Boolean,
} as const)

const isModelValue = (value: CascaderModelValue) => isArray(value)

export const cascaderEmits = {
  'update:modelValue': isModelValue,
  'update:open': (value: boolean) => isBoolean(value),
  'update:searchValue': (value: string) => typeof value === 'string',
  change: (
    value: CascaderModelValue,
    selectedOptions: CascaderOption[] | CascaderOption[][],
  ) => isModelValue(value) && isArray(selectedOptions),
  search: (value: string) => typeof value === 'string',
  dropdownVisibleChange: (value: boolean) => isBoolean(value),
  clear: () => true,
  removeTag: (value: CascaderPathValue) => isArray(value),
  load: (selectedOptions: CascaderOption[]) => isArray(selectedOptions),
  focus: (event: FocusEvent) => event instanceof FocusEvent,
  blur: (event: FocusEvent) => event instanceof FocusEvent,
}

export type CascaderProps = ExtractPropTypes<typeof cascaderProps>
export type CascaderInstance = InstanceType<typeof Cascader>
