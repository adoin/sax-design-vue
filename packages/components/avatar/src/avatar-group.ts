import { buildProps } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type AvatarGroup from './avatar-group.vue'

export const avatarGroupProps = buildProps({
  /** Number of pixels shared by adjacent avatars. */
  overlap: { type: Number, default: 18 },
  /** Default avatar size; individual avatar sizes take precedence. */
  size: { type: [String, Number] },
  /** Place avatars side by side instead of overlapping. */
  float: {
    type: Boolean,
  },
  /**
   * determine how many avatars are visible.
   */
  max: {
    type: [String, Number],
  },
} as const)

export type AvatarGroupProps = ExtractPropTypes<typeof avatarGroupProps>
export type AvatarGroupInstance = InstanceType<typeof AvatarGroup>
