import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type ImagePreview from './image-preview.vue'
import type { ImagePreviewTransform } from './use-image-transform'

export type {
  ImagePreviewScaleMode,
  ImagePreviewTransform,
} from './use-image-transform'

export const imagePreviewProps = buildProps({
  modelValue: Boolean,
  urlList: { type: definePropType<string[]>(Array), default: () => [] },
  altList: { type: definePropType<string[]>(Array), default: () => [] },
  initialIndex: { type: Number, default: 0 },
  infinite: { type: Boolean, default: true },
  hideOnClickModal: { type: Boolean, default: true },
  closeOnPressEscape: { type: Boolean, default: true },
  showToolbar: { type: Boolean, default: true },
  wheelZoom: { type: Boolean, default: true },
  draggable: { type: Boolean, default: true },
  zoomRate: {
    type: Number,
    default: 1.2,
    validator: (value: number) => Number.isFinite(value) && value > 1,
  },
  minScale: {
    type: Number,
    default: 0.2,
    validator: (value: number) => Number.isFinite(value) && value > 0,
  },
  maxScale: {
    type: Number,
    default: 7,
    validator: (value: number) => Number.isFinite(value) && value > 0,
  },
  zIndex: { type: Number, default: 3000 },
} as const)

export const imagePreviewEmits = {
  'update:modelValue': (value: boolean) => typeof value === 'boolean',
  close: () => true,
  switch: (index: number) => index >= 0,
  transform: (value: ImagePreviewTransform) =>
    Number.isFinite(value.scale) && Number.isFinite(value.rotation),
}

export type ImagePreviewProps = ExtractPropTypes<typeof imagePreviewProps>
export type ImagePreviewInstance = InstanceType<typeof ImagePreview>
