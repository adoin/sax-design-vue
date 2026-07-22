import {
  buildProps,
  definePropType,
  isBoolean,
  isString,
} from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type Textarea from './textarea.vue'

export const textareaProps = buildProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: null,
  },
  color: {
    type: String,
    default: 'primary',
  },
  counter: {
    type: [Number, String],
    default: null,
  },
  counterDanger: Boolean,
  readonly: Boolean,
  editable: {
    type: Boolean,
    default: true,
  },
  disabled: Boolean,
  placeholder: String,
  name: String,
  form: String,
  maxLength: {
    type: [Number, String],
  },
  /** @deprecated use maxLength */
  maxlength: {
    type: [Number, String],
  },
  trim: Boolean,
  rows: {
    type: [Number, String],
  },
  cols: {
    type: [Number, String],
  },
  showWordCount: Boolean,
  countMethod: {
    type: definePropType<(params: { value: string }) => number>(Function),
  },
  autoSize: {
    type: definePropType<{ minRows?: number | null; maxRows?: number | null }>(
      Object,
    ),
  },
  /** @deprecated use autoSize */
  autosize: {
    type: definePropType<{ minRows?: number | null; maxRows?: number | null }>(
      Object,
    ),
  },
  resize: String,
  immediate: {
    type: Boolean,
    default: true,
  },
  height: {
    type: String,
    default: null,
  },
  width: {
    type: String,
    default: null,
  },
} as const)

export const textareaEmits = {
  'update:modelValue': (val: string) => isString(val),
  'update:counterDanger': (val: boolean) => isBoolean(val),
  input: (val: string) => isString(val),
  change: (val: string) => isString(val),
  'lazy-change': (val: string) => isString(val),
  keydown: (evt: KeyboardEvent) => evt instanceof KeyboardEvent,
  keyup: (evt: KeyboardEvent) => evt instanceof KeyboardEvent,
  click: (evt: MouseEvent) => evt instanceof MouseEvent,
  focus: (evt: FocusEvent) => evt instanceof FocusEvent,
  blur: (evt: FocusEvent) => evt instanceof FocusEvent,
}

export type TextareaProps = ExtractPropTypes<typeof textareaProps>
export type TextareaInstance = InstanceType<typeof Textarea>
