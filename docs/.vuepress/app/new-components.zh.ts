import type { SidebarItem } from '~/shared/client/nav'

const zh = (path: string) => `/zh${path}`

/** 迁移自 Vuesax 的新组件 — 在侧栏显示 isNew 徽章 */
export const newComponentNavItemsZh: SidebarItem[] = [
  { text: 'Spacer', link: zh('/components/spacer'), isNew: true },
  { text: 'Divider', link: zh('/components/divider'), isNew: true },
  { text: 'Progress', link: zh('/components/progress'), isNew: true },
  { text: 'Chip', link: zh('/components/chip'), isNew: true },
  { text: 'Breadcrumb', link: zh('/components/breadcrumb'), isNew: true },
  { text: 'Textarea', link: zh('/components/textarea'), isNew: true },
  { text: 'Collapse', link: zh('/components/collapse'), isNew: true },
  { text: 'List', link: zh('/components/list'), isNew: true },
  { text: 'Images', link: zh('/components/images'), isNew: true },
  { text: 'Prompt', link: zh('/components/prompt'), isNew: true },
  { text: 'Tabs', link: zh('/components/tabs'), isNew: true },
  { text: 'Slider', link: zh('/components/slider'), isNew: true },
  { text: 'Upload', link: zh('/components/upload'), isNew: true },
  { text: '虚拟列表', link: zh('/components/virtual-list'), isNew: true },
]
