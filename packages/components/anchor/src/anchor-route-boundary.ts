import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type AnchorRouteBoundary from './anchor-route-boundary.vue'

export type AnchorRouteBoundaryTrigger = 'click' | 'wheel'
export type AnchorRouteBoundaryDirection = 'previous' | 'next'

export interface AnchorRouteBoundaryItem {
  href: string
  title: string
  disabled?: boolean
}

export interface AnchorRouteBoundaryNavigateParams extends AnchorRouteBoundaryItem {
  direction: AnchorRouteBoundaryDirection
  trigger: AnchorRouteBoundaryTrigger
  event: MouseEvent | WheelEvent
}

export interface AnchorRouteBoundarySlotParams {
  item: AnchorRouteBoundaryItem
  direction: AnchorRouteBoundaryDirection
  visible: boolean
  navigating: boolean
  progress: number
}

export const anchorRouteBoundaryProps = buildProps({
  previous: {
    type: definePropType<AnchorRouteBoundaryItem>(Object),
    default: undefined,
  },
  next: {
    type: definePropType<AnchorRouteBoundaryItem>(Object),
    default: undefined,
  },
  threshold: { type: Number, default: 160 },
  armDelay: { type: Number, default: 320 },
  routeCooldown: { type: Number, default: 1500 },
  getContainer: {
    type: definePropType<() => HTMLElement | Window>(Function),
    default: undefined,
  },
} as const)

export const anchorRouteBoundaryEmits = {
  navigate: (params: AnchorRouteBoundaryNavigateParams) =>
    typeof params.href === 'string' &&
    typeof params.title === 'string' &&
    ['previous', 'next'].includes(params.direction) &&
    ['click', 'wheel'].includes(params.trigger) &&
    params.event instanceof Event,
}

export type AnchorRouteBoundaryProps = ExtractPropTypes<
  typeof anchorRouteBoundaryProps
>
export type AnchorRouteBoundaryInstance = InstanceType<
  typeof AnchorRouteBoundary
>
