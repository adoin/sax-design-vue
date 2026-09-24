import { defineComponent, onBeforeUnmount, renderSlot, watch } from 'vue'
import {
  applyThemeConfig,
  buildProps,
  definePropType,
  isValidTimeZone,
} from '@vuesax-alpha/utils'
import { defaultNamespace, provideGlobalConfig } from '@vuesax-alpha/hooks'
import { componentShapes, componentSizes } from '@vuesax-alpha/constants'

import type { ExtractPropTypes } from 'vue'
import type { Language } from '@vuesax-alpha/locale'
import type { ColorProviderContext, ThemeConfig } from '@vuesax-alpha/constants'
import type {
  AnchorRouteBoundaryOptions,
  AnchorRouterAdapter,
} from '../../types'
import type { TableGlobalConfig } from '../../table/src/table-global-config'
import type {
  FlipOptions,
  OffsetOptions,
  Placement,
  ShiftOptions,
  Strategy,
} from '@vuesax-alpha/hooks/use-floating/vue'

export interface ButtonGlobalConfig {
  debounce?: number | false
  throttle?: number | false
  loadingType?: 'default' | 'pulse' | 'ripple' | 'shimmer'
  ripple?: 'cut' | 'reverse'
}
export interface DialogGlobalConfig {
  overlayBlur?: boolean
  showHeader?: boolean
  showClose?: boolean
  showFooter?: boolean
  cancelClosable?: boolean
  confirmClosable?: boolean
  mask?: boolean
  maskClosable?: boolean
  preventClose?: boolean
  lockScroll?: boolean
}
export interface DrawerGlobalConfig {
  placement?: 'left' | 'right' | 'top' | 'bottom'
  size?: string | number
  showClose?: boolean
  maskClosable?: boolean
  teleported?: boolean
}
export interface NotificationGlobalConfig {
  duration?: number
  position?:
    | 'top-right'
    | 'top-center'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-center'
    | 'bottom-left'
  progressAuto?: boolean
  showClose?: boolean
  sticky?: boolean
}
export type PaginationLayoutItem =
  'prev' | 'pager' | 'next' | 'jumper' | '->' | 'total' | 'slot' | 'sizes'
export interface PaginationGlobalConfig {
  pagerCount?: number
  layout?: PaginationLayoutItem | PaginationLayoutItem[]
  pageSizes?: number[]
  hideOnSinglePage?: boolean
  infinite?: boolean
  progress?: boolean
  notMargin?: boolean
  buttonsDotted?: boolean
}
export interface PopperGlobalConfig {
  showAfter?: number
  hideAfter?: number
  autoClose?: number
  teleported?: boolean
  strategy?: Strategy
  placement?: Placement
  interactivity?: boolean
  flip?: FlipOptions | boolean
  shift?: ShiftOptions | boolean
  windowResize?: boolean
  windowScroll?: boolean
  showArrow?: boolean
  offset?: OffsetOptions
  persistent?: boolean
}

export interface AnchorGlobalConfig {
  /** Icon name used by the active marker. Omit it to use Anchor's inline SVG. */
  activeIcon?: string
  /** Default active-item calculation; local Anchor props take precedence. */
  activeStrategy?: 'heading' | 'visible-section'
  /** Heading activation line in pixels; defaults to Anchor's offset. */
  activeOffset?: number
  /** Router used by every Anchor for non-local same-origin hrefs unless locally overridden. */
  router?: AnchorRouterAdapter
  /** Prefetch adjacent route modules through router.prefetch. Disabled by default. */
  routePrefetch?: boolean
  /** Defaults for automatically generated route boundaries. */
  routeBoundary?: false | AnchorRouteBoundaryOptions
}

export const configProviderProps = buildProps({
  /**
   * @description global Initial zIndex
   */
  zIndex: {
    type: Number,
  },
  /**
   * @description global component className prefix (cooperated with [$namespace](https://github.com/vuesax-alphax/vuesax-alpha/blob/main/packages/theme-chalk/src/mixins/config.scss#L1)) | ^[string]
   */
  namespace: {
    type: String,
    default: defaultNamespace,
  },
  color: {
    type: definePropType<ColorProviderContext>(Object),
  },
  theme: {
    type: definePropType<ThemeConfig>(Object),
  },
  /**
   * @description Locale Object
   */
  locale: {
    type: definePropType<Language>(Object),
  },
  /** Default IANA time zone used by date and time components. */
  timezone: {
    type: String,
    validator: (value: string) => isValidTimeZone(value),
  },
  /** Whether the "Now" action immediately commits and closes date/time pickers. */
  autoApplyNow: {
    type: Boolean,
    default: undefined,
  },
  /** Default shape inherited by compatible components. */
  shape: {
    type: String,
    values: componentShapes,
  },
  /** Default density inherited by components with the shared size scale. */
  size: {
    type: String,
    values: componentSizes,
  },
  /** Component-level defaults for Anchor. */
  anchor: {
    type: definePropType<AnchorGlobalConfig>(Object),
  },
  /** Reusable interaction and presentation defaults for every descendant Table. */
  table: {
    type: definePropType<TableGlobalConfig>(Object),
  },
  /** Defaults for Button interaction timing and loading feedback. */
  button: {
    type: definePropType<ButtonGlobalConfig>(Object),
  },
  /** Defaults for Dialog dismissal and scroll-lock behavior. */
  dialog: {
    type: definePropType<DialogGlobalConfig>(Object),
  },
  /** Defaults for Drawer placement and dismissal behavior. */
  drawer: {
    type: definePropType<DrawerGlobalConfig>(Object),
  },
  /** Defaults for programmatic and declarative Notification instances. */
  notification: {
    type: definePropType<NotificationGlobalConfig>(Object),
  },
  /** Reusable Pagination layout and navigation defaults. */
  pagination: {
    type: definePropType<PaginationGlobalConfig>(Object),
  },
  /** Defaults for direct SPopper usage; composed components keep their own contract. */
  popper: {
    type: definePropType<PopperGlobalConfig>(Object),
  },
} as const)

export type ConfigProviderProps = ExtractPropTypes<typeof configProviderProps>

const ConfigProvider = defineComponent({
  name: 'SConfigProvider',
  props: configProviderProps,

  setup(props, { slots }) {
    const config = provideGlobalConfig(props)
    let restoreTheme: (() => void) | undefined

    if (typeof document !== 'undefined') {
      watch(
        () => props.theme,
        (theme) => {
          restoreTheme?.()
          restoreTheme = theme ? applyThemeConfig(theme) : undefined
        },
        { deep: true, immediate: true },
      )
    }

    onBeforeUnmount(() => restoreTheme?.())

    return () => renderSlot(slots, 'default', { config: config?.value })
  },
})

export type ConfigProviderInstance = InstanceType<typeof ConfigProvider>

export default ConfigProvider
