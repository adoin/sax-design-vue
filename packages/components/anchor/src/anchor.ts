import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type Anchor from './anchor.vue'
import type {
  AnchorRouteBoundaryOptions,
  AnchorRouterAdapter,
} from '../../types'

export interface AnchorItem {
  href: string
  title: string
  disabled?: boolean
  collapsible?: boolean
  defaultCollapsed?: boolean
  children?: AnchorItem[]
}

export type AnchorActiveStrategy = 'heading' | 'visible-section'

export const anchorProps = buildProps({
  mode: {
    type: String,
    values: ['anchor', 'router'] as const,
    default: 'anchor',
  },
  modelValue: { type: String, default: '' },
  items: { type: definePropType<AnchorItem[]>(Array), default: () => [] },
  offset: { type: Number, default: 88 },
  activeOffset: { type: Number, default: undefined },
  activeStrategy: {
    type: definePropType<AnchorActiveStrategy>(String),
    values: ['heading', 'visible-section'] as const,
    default: undefined,
  },
  targetOffset: { type: Number, default: undefined },
  bounds: { type: Number, default: 5 },
  affix: { type: Boolean, default: false },
  getContainer: {
    type: definePropType<() => HTMLElement | Window>(Function),
    default: undefined,
  },
  getCurrentAnchor: {
    type: definePropType<(activeHref: string) => string>(Function),
    default: undefined,
  },
  router: {
    type: definePropType<AnchorRouterAdapter>(Object),
    default: undefined,
  },
  routeBoundary: {
    type: definePropType<boolean | AnchorRouteBoundaryOptions>([
      Boolean,
      Object,
    ]),
    default: undefined,
  },
  replace: { type: Boolean, default: false },
  direction: {
    type: String,
    values: ['vertical', 'horizontal'],
    default: 'vertical',
  },
  scrollBehavior: {
    type: String,
    values: ['auto', 'smooth'],
    default: 'smooth',
  },
} as const)

export const anchorEmits = {
  'update:modelValue': (value: string) => typeof value === 'string',
  change: (value: string) => typeof value === 'string',
  click: (item: AnchorItem, event: MouseEvent) =>
    typeof item.href === 'string' && event instanceof MouseEvent,
  collapseChange: (item: AnchorItem, collapsed: boolean) =>
    typeof item.href === 'string' && typeof collapsed === 'boolean',
}

export type AnchorProps = ExtractPropTypes<typeof anchorProps>
export type AnchorInstance = InstanceType<typeof Anchor>
export type {
  AnchorRouteBoundaryItem,
  AnchorRouteBoundarySlotParams,
} from './anchor-route-boundary'
export type {
  AnchorRouteBoundaryOptions,
  AnchorRouterAdapter,
} from '../../types'
