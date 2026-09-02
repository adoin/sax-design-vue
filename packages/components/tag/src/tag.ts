import {
  buildProps,
  definePropType,
  isBoolean,
  isString,
} from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type Tag from './tag.vue'

export const tagVariantList = [
  'default',
  'outline',
  'dashed',
  'mark',
  'arrow',
  'flag',
] as const

export const tagStatusList = [
  'primary',
  'success',
  'warning',
  'warn',
  'danger',
  'info',
  'dark',
] as const

export type TagVariant = (typeof tagVariantList)[number]
export type TagStatus = (typeof tagStatusList)[number]
export type TagShape = 'rounded' | 'square' | 'pill'
export type TagSize = 'small' | 'default' | 'large'

export const tagProps = buildProps({
  modelValue: { type: Boolean, default: true },
  text: { type: String, default: null },
  /** Render an inline, borderless editor inside the tag. */
  editable: Boolean,
  editPlaceholder: { type: String, default: '' },
  editAutofocus: Boolean,
  closable: { type: [Boolean, String], default: false },
  color: { type: String, default: null },
  /** Semantic color. Takes priority over `type` and is overridden by `color`. */
  status: {
    type: definePropType<TagStatus>(String),
    values: tagStatusList,
  },
  /** Compatibility semantic-color alias. Prefer `status`. */
  type: {
    type: definePropType<TagStatus>(String),
    values: tagStatusList,
  },
  icon: { type: String, default: null },
  closeIcon: { type: String, default: 'cb:close' },
  disabled: Boolean,
  transparent: Boolean,
  /** Compatibility alias for `variant="outline"`. */
  border: Boolean,
  /** Visual treatment independent from geometry. */
  variant: {
    type: definePropType<TagVariant>(String),
    default: 'default',
  },
  /** @deprecated use `variant` instead. */
  tagStyle: {
    type: definePropType<TagVariant>(String),
    default: 'default',
  },
  /** Rounded, square, or pill geometry. */
  shape: {
    type: definePropType<TagShape>(String),
    default: 'rounded',
  },
  /** @deprecated use `shape="pill"` instead. */
  round: Boolean,
  size: {
    type: definePropType<TagSize>(String),
    default: 'default',
  },
  /** Marks an item rendered inside `STagGroup`. */
  item: Boolean,
} as const)

export const tagEmits = {
  'update:modelValue': (value: boolean) => isBoolean(value),
  'update:text': (value: string) => isString(value),
  'edit-confirm': (value: string) => isString(value),
  'edit-cancel': () => true,
  click: (event: MouseEvent) => event instanceof MouseEvent,
  close: (event: MouseEvent) => event instanceof MouseEvent,
  's-remove': (value: boolean) => isBoolean(value),
}

export type TagProps = ExtractPropTypes<typeof tagProps>
export type TagInstance = InstanceType<typeof Tag>
