import { isNil } from 'lodash-unified'
import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import { useColorProp, useSizeProp } from '@vuesax-alpha/hooks'
import {
  buildProps,
  definePropType,
  isNumber,
  isString,
} from '@vuesax-alpha/utils'

import type { ExtractPropTypes, StyleValue } from 'vue'
import type { ComponentSize } from '@vuesax-alpha/constants'
import type { EmitFn } from '@vuesax-alpha/utils'
import type Input from './input.vue'

export type InputValue = string | number | null | undefined
export interface InputCountParams {
  value: string
}
export type InputCountMethod = (params: InputCountParams) => number

export const inputTypes = [
  'text',
  'password',
  'search',
  'number',
  'email',
  'tel',
  'url',
] as const
export type InputType = (typeof inputTypes)[number]

export interface InputAffixConfig {
  icon?: string
  content?: string
  status?: ComponentSize
}

export const inputProps = buildProps({
  /** @description component size */
  size: useSizeProp,

  /** @description custom wrapper class name */
  className: String,

  /**
   * @description emit model updates while typing; when false, commit on change or blur
   */
  immediate: {
    type: Boolean,
    default: true,
  },

  /**
   * @description native input readonly
   */
  clearable: {
    type: Boolean,
    default: false,
  },
  /** @description show a trailing clear action while the input is active */
  allowClear: {
    type: Boolean,
    default: false,
  },

  /**
   * @description Component color - Accept Sax Design color tokens, Hex, rgb
   */
  color: useColorProp,

  /**
   * @description whether Input is disabled
   */
  disabled: { type: Boolean },
  readonly: { type: Boolean },
  editable: {
    type: Boolean,
    default: true,
  },
  name: String,
  title: String,
  form: String,
  autoComplete: String,
  /** @deprecated use autoComplete */
  autocomplete: String,
  autoFocus: Boolean,
  align: {
    type: String,
    values: ['left', 'center', 'right'] as const,
  },
  maxLength: {
    type: [Number, String],
  },
  minLength: {
    type: [Number, String],
  },
  /** @deprecated use maxLength */
  maxlength: {
    type: [Number, String],
  },
  showWordCount: Boolean,
  countMethod: {
    type: definePropType<InputCountMethod>(Function),
  },
  trim: Boolean,
  multiple: Boolean,
  min: {
    type: [Number, String],
  },
  max: {
    type: [Number, String],
  },
  step: {
    type: [Number, String],
  },
  inputMode: {
    type: String,
    values: [
      'none',
      'text',
      'decimal',
      'numeric',
      'tel',
      'search',
      'email',
      'url',
    ] as const,
  },
  pattern: String,
  spellcheck: {
    type: definePropType<boolean | 'true' | 'false'>([Boolean, String]),
  },
  required: Boolean,

  /**
   * @description put the icon to the back of the input
   */
  iconAfter: { type: Boolean },

  /**
   * @description input id
   */
  id: {
    type: String,
    default: null,
  },

  /**
   * @description input style
   * @enum `border` | `shadow` | `transparent`
   */
  inputStyle: {
    type: String,
    values: ['border', 'shadow', 'transparent'] as const,
    default: null,
  },

  /**
   * @description label is placeholder when input empty
   */
  labelFloat: {
    type: Boolean,
    default: false,
  },

  /**
   * @description a label above the component.
   */
  label: {
    type: String,
    default: null,
  },

  /**
   * @description Add a loading animation to the input.
   */
  loading: { type: Boolean },

  /**
   * @description binding value
   */
  modelValue: {
    type: definePropType<InputValue>([String, Number]),
    default: '',
  },

  /**
   * @description input placeholder
   */
  placeholder: {
    type: String,
    default: null,
  },

  /**
   * @description progress bar starting in red and ending in green.
   */
  progress: { type: Number },

  /**
   * @description input shape
   * @enum `rounded` | `square`
   */
  shape: {
    type: String,
    values: ['rounded', 'square'] as const,
    default: 'rounded',
  },

  /**
   * @description add toggleable password icon
   */
  showPassword: {
    type: Boolean,
    default: false,
  },
  /** @description show the built-in password/search action */
  controls: {
    type: Boolean,
    default: false,
  },
  prefixIcon: String,
  suffixIcon: String,
  prefixConfig: {
    type: definePropType<InputAffixConfig>(Object),
  },
  suffixConfig: {
    type: definePropType<InputAffixConfig>(Object),
  },

  /**
   * @description Change the background color of the component by changing its status.
   */
  state: useColorProp,

  /**
   * @description set text input to white color
   */
  textWhite: { type: Boolean },

  /** @description text-oriented input type; use DatePicker or TimePicker for date/time values */
  type: {
    type: String,
    values: inputTypes,
    default: 'text',
  },
  /** @description input wrapper classes */
  wrapClasses: {
    type: String,
  },
  /** @description input wrapper styles */
  wrapStyles: {
    type: definePropType<StyleValue>([String, Object, Array]),
  },

  /**
   * @description set input width 100%
   */
  block: { type: Boolean },

  /** @deprecated */
  border: Boolean,
  /** @deprecated */
  labelPlaceholder: String,
  /** @deprecated */
  shadow: Boolean,
  /** @deprecated */
  square: Boolean,
  /** @deprecated */
  transparent: Boolean,
} as const)

export const inputEmits = {
  [UPDATE_MODEL_EVENT]: (text: InputValue) =>
    isString(text) || isNumber(text) || isNil(text),
  /**
   * @description triggers when clicking the icon
   */
  clickIcon: (evt: Event) => evt instanceof Event,
  /**
   * @description triggers when the Input is cleared by clicking the clear button
   */
  mouseleave: (evt: MouseEvent) => evt instanceof MouseEvent,
  mouseenter: (evt: MouseEvent) => evt instanceof MouseEvent,
  clear: () => true,
  input: (value: string) => !isNil(value),
  change: (value: string) => isString(value),
  focus: (evt: FocusEvent) => evt instanceof FocusEvent,
  blur: (evt: FocusEvent) => evt instanceof FocusEvent,

  // NOTE: when autofill by browser, the keydown event is instanceof Event, not KeyboardEvent
  keydown: (evt: KeyboardEvent | Event) => evt instanceof Event,
  // Browser autofill and synthetic environments can surface a base Event.
  keyup: (evt: KeyboardEvent | Event) => evt instanceof Event,
  click: (evt: MouseEvent) => evt instanceof MouseEvent,
  wheel: (evt: WheelEvent) => evt instanceof WheelEvent,
  'lazy-change': (value: string) => isString(value),
  'search-click': (value: string, evt: KeyboardEvent | MouseEvent) =>
    isString(value) && evt instanceof Event,
  'toggle-visible': (visible: boolean) => typeof visible === 'boolean',
  'prefix-click': (evt: MouseEvent) => evt instanceof MouseEvent,
  'suffix-click': (evt: MouseEvent) => evt instanceof MouseEvent,
}

export type InputEmits = typeof inputEmits
export type InputEmitsFn = EmitFn<InputEmits>
export type InputProps = ExtractPropTypes<typeof inputProps>
export type InputInstance = InstanceType<typeof Input>
