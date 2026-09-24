import type { ButtonProps } from './button'
import type { Placement } from '@vuesax-alpha/hooks/use-floating/vue'
import type { ComponentSize } from '@vuesax-alpha/constants'

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
  size?: ComponentSize
  /** Explicit number of actions kept inline. Omit it to keep every visible action inline. */
  maxVisible?: number
  trigger?: 'click' | 'hover'
  placement?: Placement
  moreText?: string
  moreIcon?: string
}
