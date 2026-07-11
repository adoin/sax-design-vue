import type { SidebarItem } from '~/shared/client/nav'

const zh = (path: string) => `/zh${path}`

/** 迁移自 Vuesax 的新组件 — 在侧栏显示 isNew 徽章 */
export const newComponentNavItemsZh: SidebarItem[] = [
  { text: '间距', link: zh('/components/spacer'), isNew: true },
  { text: '分割线', link: zh('/components/divider'), isNew: true },
  { text: '进度条', link: zh('/components/progress'), isNew: true },
  { text: '标签', link: zh('/components/chip'), isNew: true },
  { text: '面包屑', link: zh('/components/breadcrumb'), isNew: true },
  { text: '多行输入', link: zh('/components/textarea'), isNew: true },
  { text: '折叠面板', link: zh('/components/collapse'), isNew: true },
  { text: '列表', link: zh('/components/list'), isNew: true },
  { text: '图片', link: zh('/components/images'), isNew: true },
  { text: '提示框', link: zh('/components/prompt'), isNew: true },
  { text: '标签页', link: zh('/components/tabs'), isNew: true },
  { text: '滑块', link: zh('/components/slider'), isNew: true },
  { text: '上传', link: zh('/components/upload'), isNew: true },
]
