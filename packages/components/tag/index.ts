import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import Tag from './src/tag.vue'
import TagGroup from './src/tag-group.vue'

export const STag = withInstall(Tag, { TagGroup })
export const STagGroup = withNoopInstall(TagGroup)
export default STag

export * from './src/tag'
export * from './src/tag-group'
