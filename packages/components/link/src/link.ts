import { buildProps } from '@vuesax-alpha/utils'
import type { ExtractPropTypes, PropType } from 'vue'
import type Link from './link.vue'

export const linkTypes = [
  'primary',
  'success',
  'warning',
  'danger',
  'info',
] as const
export type LinkType = (typeof linkTypes)[number]

export const linkUnderlineEffects = [
  'default',
  'slide',
  'center',
  'double',
  'highlight',
] as const
export type LinkUnderlineEffect = (typeof linkUnderlineEffects)[number]

export const linkProps = buildProps({
  href: String,
  target: String,
  type: {
    type: String as PropType<LinkType>,
    values: linkTypes,
    default: 'primary',
  },
  status: { type: String as PropType<LinkType> },
  underline: {
    type: Boolean,
    default: true,
  },
  underlineEffect: {
    type: String as PropType<LinkUnderlineEffect>,
    values: linkUnderlineEffects,
    default: 'default',
  },
  disabled: Boolean,
} as const)

export const linkEmits = {
  click: (event: MouseEvent) => event instanceof MouseEvent,
}
export type LinkProps = ExtractPropTypes<typeof linkProps>
export type LinkInstance = InstanceType<typeof Link>
