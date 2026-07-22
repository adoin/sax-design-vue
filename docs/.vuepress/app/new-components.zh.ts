import type { SidebarItem } from '~/shared/client/nav'

const zh = (path: string) => `/zh${path}`

/** 迁移自 Vuesax 的新组件 — 在侧栏显示 isNew 徽章 */
export const newComponentNavItemsZh: SidebarItem[] = [
  { text: '回到顶部', link: zh('/components/backtop'), isNew: true },
  { text: 'Spacer', link: zh('/components/spacer'), isNew: true },
  { text: 'Divider', link: zh('/components/divider'), isNew: true },
  { text: '抽屉', link: zh('/components/drawer'), isNew: true },
  { text: '空状态', link: zh('/components/empty'), isNew: true },
  { text: 'Progress', link: zh('/components/progress'), isNew: true },
  { text: 'Chip', link: zh('/components/chip'), isNew: true },
  { text: 'Breadcrumb', link: zh('/components/breadcrumb'), isNew: true },
  { text: 'Textarea', link: zh('/components/textarea'), isNew: true },
  { text: 'Collapse', link: zh('/components/collapse'), isNew: true },
  { text: '倒计时', link: zh('/components/countdown'), isNew: true },
  { text: 'List', link: zh('/components/list'), isNew: true },
  { text: 'Images', link: zh('/components/images'), isNew: true },
  { text: '链接', link: zh('/components/link'), isNew: true },
  { text: '布局', link: zh('/components/layout'), isNew: true },
  { text: '公告栏', link: zh('/components/notice-bar'), isNew: true },
  { text: '分段控制', link: zh('/components/segmented'), isNew: true },
  { text: 'Prompt', link: zh('/components/prompt'), isNew: true },
  { text: '结果', link: zh('/components/result'), isNew: true },
  { text: 'Tabs', link: zh('/components/tabs'), isNew: true },
  { text: '标签', link: zh('/components/tag'), isNew: true },
  { text: '文本', link: zh('/components/text'), isNew: true },
  { text: 'Slider', link: zh('/components/slider'), isNew: true },
  { text: 'Upload', link: zh('/components/upload'), isNew: true },
  { text: '虚拟列表', link: zh('/components/virtual-list'), isNew: true },
  { text: '水印', link: zh('/components/watermark'), isNew: true },
]
