import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import { useColorProp } from '@vuesax-alpha/hooks'
import { buildProps, definePropType, isArray } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type TagGroup from './tag-group.vue'

export type TagGroupItem = string | number | Record<string, unknown>
export type TagGroupCreateItem = (label: string) => TagGroupItem

export const tagGroupProps = buildProps({
  modelValue: {
    type: definePropType<TagGroupItem[]>(Array),
    default: () => [],
  },
  color: { ...useColorProp, default: 'primary' },
  placeholder: { type: String, default: '' },
  removeIcon: { type: String, default: 'cb:close' },
  addIcon: { type: String, default: 'cb:add' },
  addAriaLabel: { type: String, default: 'Add tag' },
  addable: { type: Boolean, default: true },
  closable: { type: Boolean, default: true },
  labelKey: { type: String, default: 'label' },
  valueKey: { type: String, default: 'value' },
  createItem: {
    type: definePropType<TagGroupCreateItem>(Function),
    default: undefined,
  },
} as const)

export const tagGroupEmits: {
  [UPDATE_MODEL_EVENT]: (value: TagGroupItem[]) => boolean
  add: (item: TagGroupItem) => boolean
  remove: (item: TagGroupItem, index: number) => boolean
} = {
  [UPDATE_MODEL_EVENT]: (value: TagGroupItem[]) => isArray(value),
  add: () => true,
  remove: () => true,
}

export type TagGroupProps = ExtractPropTypes<typeof tagGroupProps>
export type TagGroupInstance = InstanceType<typeof TagGroup>
