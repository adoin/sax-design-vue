import type { ButtonProps } from './button'
import type { Placement } from '@vuesax-alpha/hooks/use-floating/vue'

export type RendererButtonState<Context> =
  boolean | ((context: Context) => boolean)

export interface RendererButtonAction<Context = unknown> {
  code: string
  text?: string
  icon?: string
  visible?: RendererButtonState<Context>
  disabled?: RendererButtonState<Context>
  loading?: RendererButtonState<Context>
  props?: Partial<ButtonProps>
  onClick?: (context: Context, event: MouseEvent) => unknown
}

export interface RendererButtonsOptions<Context = unknown> {
  actions: RendererButtonAction<Context>[]
  /** Number of actions kept inline. Remaining actions move into the popper. */
  maxVisible?: number
  trigger?: 'click' | 'hover'
  placement?: Placement
  moreText?: string
  moreIcon?: string
}
