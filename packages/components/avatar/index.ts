import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'

import Avatar from './src/avatar.vue'
import AvatarGroup from './src/avatar-group.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SAvatar: SFCWithInstall<
  typeof Avatar,
  { AvatarGroup: typeof AvatarGroup }
> = withInstall(Avatar, {
  AvatarGroup,
})
export default SAvatar

export const SAvatarGroup: SFCWithInstall<typeof AvatarGroup> =
  withNoopInstall(AvatarGroup)

export * from './src/avatar-group'
export * from './src/avatar'
