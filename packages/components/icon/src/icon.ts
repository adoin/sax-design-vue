import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { CSSProperties, ExtractPropTypes } from 'vue'
import type Icon from './icon.vue'

export interface SaxIconData {
  body: string
  attributes: Record<string, string>
}

export type IconFlip = 'horizontal' | 'vertical' | 'both'

export const iconProps = buildProps({
  /** Iconify name, for example `cb:add` or `bx:book`. */
  name: { type: String, default: '' },
  /** Build-time injected Iconify SVG data. */
  iconData: {
    type: definePropType<SaxIconData>(Object),
  },
  /** Width and height. Numbers use px; strings accept any CSS unit. */
  size: {
    type: definePropType<number | string>([Number, String]),
  },
  /** CSS color. Defaults to currentColor. */
  color: { type: String, default: 'currentColor' },
  /** CSS angle. Numbers use degrees. */
  rotate: {
    type: definePropType<number | string>([Number, String]),
    default: 0,
  },
  flip: {
    type: String as () => IconFlip,
    values: ['horizontal', 'vertical', 'both'],
  },
  /** Continuously rotate the icon. A number sets seconds per revolution. */
  rolling: {
    type: definePropType<boolean | number>([Boolean, Number]),
    default: false,
    validator: (value: boolean | number) =>
      typeof value === 'boolean' || (Number.isFinite(value) && value > 0),
  },
  /** Accessible label. Decorative icons omit it. */
  label: String,
} as const)

export interface IconRenderStyles {
  root: CSSProperties
  svg: CSSProperties
}

export type IconProps = ExtractPropTypes<typeof iconProps>
export type IconInstance = InstanceType<typeof Icon>
