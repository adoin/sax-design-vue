import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type IconPicker from './icon-picker.vue'

export const DEFAULT_ICON_LIST = [
  'cb:home',
  'cb:search',
  'cb:settings',
  'cb:favorite',
  'cb:star',
  'cb:user',
  'cb:group',
  'cb:email',
  'cb:notification',
  'cb:calendar',
  'cb:time',
  'cb:edit',
  'cb:trash-can',
  'cb:add',
  'cb:checkmark',
  'cb:close',
  'cb:view',
  'cb:download',
  'cb:upload',
  'cb:copy',
  'cb:link',
  'cb:folder',
  'cb:image',
  'cb:information',
  'cb:warning',
  'cb:error',
  'cb:help',
  'cb:menu',
  'cb:overflow-menu-horizontal',
  'cb:arrow-right',
] as const

export const iconPickerProps = buildProps({
  modelValue: { type: String, default: '' },
  iconList: {
    type: definePropType<string[]>(Array),
    default: () => [...DEFAULT_ICON_LIST],
  },
  placeholder: String,
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
