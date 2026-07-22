import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type ImagePreview from './image-preview.vue'

export const imagePreviewProps = buildProps({
  modelValue: Boolean,
  urlList: { type: definePropType<string[]>(Array), default: () => [] },
  initialIndex: { type: Number, default: 0 },
  infinite: { type: Boolean, default: true },
  hideOnClickModal: { type: Boolean, default: true },
  zIndex: { type: Number, default: 3000 },
} as const)

export const imagePreviewEmits = {
  'update:modelValue': (value: boolean) => typeof value === 'boolean',
  close: () => true,
  switch: (index: number) => index >= 0,
}

export type ImagePreviewProps = ExtractPropTypes<typeof imagePreviewProps>
export type ImagePreviewInstance = InstanceType<typeof ImagePreview>
