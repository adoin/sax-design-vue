import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes, Ref } from 'vue'
import type Carousel from './carousel.vue'

export type CarouselEffect = 'slide' | 'fade' | 'deck' | 'orbit' | 'prism'
export type CarouselDirection = 'horizontal' | 'vertical'
export type CarouselArrow = 'always' | 'hover' | 'never'
export type CarouselIndicatorPosition =
  'inside' | 'outside' | 'top' | 'bottom' | 'left' | 'right' | 'none'
export type CarouselIndicatorType = 'dot' | 'line' | 'number'
export type CarouselTrigger = 'click' | 'hover'

export interface CarouselItem {
  [key: string]: unknown
  name?: string | number
  label?: string
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
  radius: {
    type: definePropType<boolean | string | number>([Boolean, String, Number]),
    default: true,
  },
  autoplay: { type: Boolean, default: true },
  interval: { type: Number, default: 4000 },
  loop: { type: Boolean, default: true },
  pauseOnHover: { type: Boolean, default: true },
  arrow: {
    type: definePropType<CarouselArrow>(String),
    values: ['always', 'hover', 'never'],
    default: 'hover',
  },
  indicatorPosition: {
    type: definePropType<CarouselIndicatorPosition>(String),
    values: ['inside', 'outside', 'top', 'bottom', 'left', 'right', 'none'],
    default: 'inside',
  },
  indicatorType: {
    type: definePropType<CarouselIndicatorType>(String),
    values: ['dot', 'line', 'number'],
    default: 'line',
  },
  trigger: {
    type: definePropType<CarouselTrigger>(String),
    values: ['click', 'hover'],
    default: 'click',
  },
  effect: {
    type: definePropType<CarouselEffect>(String),
    values: ['slide', 'fade', 'deck', 'orbit', 'prism'],
    default: 'slide',
  },
  direction: {
    type: definePropType<CarouselDirection>(String),
    values: ['horizontal', 'vertical'],
    default: 'horizontal',
  },
  transitionDuration: { type: Number, default: 480 },
  easing: {
    type: String,
    default: 'cubic-bezier(.22, .72, 0, 1)',
  },
  deckScale: { type: Number, default: 0.86 },
  deckVisible: { type: Number, default: 2 },
  deckBlur: { type: Boolean, default: false },
  perspective: { type: Number, default: 1200 },
  depth: { type: Number, default: 150 },
  orbitAngle: { type: Number, default: 0 },
  orbitMaxVisible: { type: Number, default: 10 },
  motionBlur: { type: Boolean, default: false },
  draggable: { type: Boolean, default: false },
  touchable: { type: Boolean, default: true },
  keyboard: { type: Boolean, default: true },
} as const)

export const carouselEmits = {
  'update:modelValue': (index: number) => Number.isInteger(index),
  'before-change': (index: number, previous: number) =>
    Number.isInteger(index) && Number.isInteger(previous),
  'after-change': (index: number, previous: number) =>
    Number.isInteger(index) && Number.isInteger(previous),
  change: (index: number, previous: number) =>
    Number.isInteger(index) && Number.isInteger(previous),
}

export type CarouselProps = ExtractPropTypes<typeof carouselProps>
export interface CarouselExposes {
  activeIndex: Readonly<Ref<number>>
  setActiveItem: (index: number | string) => void
  prev: () => void
  next: () => void
  play: () => void
  pause: () => void
}
export type CarouselInstance = InstanceType<typeof Carousel> & CarouselExposes
