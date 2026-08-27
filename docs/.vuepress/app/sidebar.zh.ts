import { zhComponentCategories } from './component-categories'
import type { SidebarConfig } from '~/shared/client/nav'

const zh = (path: string) => `/zh${path}`
export const zhSidebar: SidebarConfig = [
  {
    text: '指南',
    children: [
      { text: '介绍', link: zh('/guide/') },
      { text: '快速开始', link: zh('/guide/getting-started.html') },
      { text: '使用组件', link: zh('/guide/using-components') },
      { text: '配置', link: zh('/guide/configuration') },
      { text: 'Playground', link: zh('/guide/playground') },
      { text: 'Nuxt 集成', link: zh('/guide/nuxt.html') },
    ],
  },
  {
    text: '基础',
    children: [
      { text: '颜色', link: zh('/theme/') },
      { text: '图标', link: zh('/icons/') },
    ],
  },
  ...zhComponentCategories,
]
