import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Tag from './src/tag.vue'
import TagGroup from './src/tag-group.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const STag: SFCWithInstall<typeof Tag, { TagGroup: typeof TagGroup }> =
  withInstall(Tag, { TagGroup })
export const STagGroup: SFCWithInstall<typeof TagGroup> =
  withNoopInstall(TagGroup)
export default STag

export * from './src/tag'
export * from './src/tag-group'
