import { buildProps, definePropType } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type ContentEllipsis from './content-ellipsis.vue'

export const contentEllipsisProps = buildProps({
  /** Maximum visible height before expansion, in pixels or a CSS length. */
  collapsedHeight: {
    type: definePropType<number | string>([Number, String]),
    default: 160,
  },
  /** Fade the lower edge when content is clipped. */
  fade: { type: Boolean, default: true },
  expandText: String,
  collapseText: String,
} as const)

export const contentEllipsisEmits = {
  change: (expanded: boolean) => typeof expanded === 'boolean',
}

export type ContentEllipsisProps = ExtractPropTypes<
  typeof contentEllipsisProps
> & { expanded?: boolean }
export type ContentEllipsisInstance = InstanceType<typeof ContentEllipsis>
