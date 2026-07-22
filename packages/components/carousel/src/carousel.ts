import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type Carousel from './carousel.vue'

export interface CarouselItem {
  src?: string
  alt?: string
  title?: string
  description?: string
  disabled?: boolean
}

export const carouselProps = buildProps({
  modelValue: { type: Number, default: 0 },
  items: { type: definePropType<CarouselItem[]>(Array), default: () => [] },
  height: {
    type: definePropType<string | number>([String, Number]),
    default: 260,
  },
  autoplay: { type: Boolean, default: true },
  interval: { type: Number, default: 4000 },
  loop: { type: Boolean, default: true },
  pauseOnHover: { type: Boolean, default: true },
  arrow: {
    type: String,
    values: ['always', 'hover', 'never'],
    default: 'hover',
  },
  indicatorPosition: {
    type: String,
    values: ['inside', 'outside', 'none'],
    default: 'inside',
  },
} as const)

export const carouselEmits = {
  'update:modelValue': (index: number) => Number.isInteger(index),
  change: (index: number, previous: number) =>
    Number.isInteger(index) && Number.isInteger(previous),
}

export type CarouselProps = ExtractPropTypes<typeof carouselProps>
export type CarouselInstance = InstanceType<typeof Carousel>
