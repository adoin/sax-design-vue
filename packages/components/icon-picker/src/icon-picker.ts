import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type IconPicker from './icon-picker.vue'

export const DEFAULT_ICON_LIST = [
  'home',
  'search',
  'settings',
  'favorite',
  'star',
  'person',
  'group',
  'mail',
  'notifications',
  'calendar_today',
  'schedule',
  'edit',
  'delete',
  'add',
  'check',
  'close',
  'visibility',
  'download',
  'upload',
  'content_copy',
  'link',
  'folder',
  'image',
  'info',
  'warning',
  'error',
  'help',
  'menu',
  'more_horiz',
  'arrow_forward',
] as const

export const iconPickerProps = buildProps({
  modelValue: { type: String, default: '' },
  iconList: {
    type: definePropType<string[]>(Array),
    default: () => [...DEFAULT_ICON_LIST],
  },
  iconPack: { type: String, default: 'material-icons' },
  placeholder: { type: String, default: 'Select icon' },
  clearable: Boolean,
  disabled: Boolean,
  searchable: { type: Boolean, default: true },
} as const)

export const iconPickerEmits = {
  'update:modelValue': (value: string) => typeof value === 'string',
  change: (value: string) => typeof value === 'string',
  clear: () => true,
}

export type IconPickerProps = ExtractPropTypes<typeof iconPickerProps>
export type IconPickerInstance = InstanceType<typeof IconPicker>
