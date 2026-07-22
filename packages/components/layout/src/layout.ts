import { buildProps } from '@vuesax-alpha/utils'
import type { ExtractPropTypes, PropType } from 'vue'

export const layoutContainerProps = buildProps({
  direction: {
    type: String,
    values: ['horizontal', 'vertical'] as const,
    default: 'horizontal',
  },
} as const)
export const layoutSectionProps = buildProps({
  size: { type: [String, Number] as unknown as PropType<string | number> },
} as const)
export type LayoutContainerProps = ExtractPropTypes<typeof layoutContainerProps>
export type LayoutSectionProps = ExtractPropTypes<typeof layoutSectionProps>
