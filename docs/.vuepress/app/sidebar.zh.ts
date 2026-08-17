import { additionalComponentNavItemsZh } from './new-components.zh'
import type { SidebarConfig } from '~/shared/client/nav'

const zh = (path: string) => `/zh${path}`
const component = (name: string, meaning: string, path: string) => ({
  text: `${name}（${meaning}）`,
  link: zh(path),
})

export const zhSidebar: SidebarConfig = [
  {
    text: '指南',
    children: [
      { text: '介绍', link: zh('/guide/') },
      { text: '快速开始', link: zh('/guide/getting-started/') },
      { text: '使用组件', link: zh('/guide/using-components') },
      { text: '配置', link: zh('/guide/configuration') },
      { text: 'Playground', link: zh('/guide/playground') },
      { text: 'Nuxt 集成', link: zh('/guide/nuxt/') },
    ],
  },
  {
    text: '基础',
    children: [
      { text: '颜色', link: zh('/theme/') },
      { text: '图标', link: zh('/icons/') },
    ],
  },
  {
    text: '组件',
    children: [
      component('Button', '按钮', '/components/'),
      component('Alert', '警告提示', '/components/alert'),
      component('Loading', '加载', '/components/loading'),
      component('Input', '输入框', '/components/input'),
      component('Checkbox', '复选框', '/components/checkbox'),
      component('Switch', '开关', '/components/switch'),
      component('Select', '选择器', '/components/select'),
      component('Avatar', '头像', '/components/avatar'),
      component('Notification', '通知', '/components/notification'),
      component('Radio', '单选框', '/components/radio'),
      component('Tooltip', '文字提示', '/components/tooltip'),
      component('Dialog', '对话框', '/components/dialog'),
      component('Pagination', '分页', '/components/pagination'),
      component('Table', '表格', '/components/table'),
      component('Navbar', '导航栏', '/components/navbar'),
      component('Sidebar', '侧边栏', '/components/sidebar'),
      component('Card', '卡片', '/components/card'),
      component('Time select', '时间选择', '/components/time-select'),
      component('Date picker', '日期选择器', '/components/date-picker'),
      component('Time picker', '时间选择器', '/components/time-picker'),
      component('Scrollbar', '滚动条', '/components/scrollbar'),
      component('Rate', '评分', '/components/rate'),
      component('Badge', '徽标', '/components/badge'),
      ...additionalComponentNavItemsZh,
    ].sort((a, b) => a.text.localeCompare(b.text, 'en')),
  },
  {
    text: '布局',
    collapsible: false,
    children: [{ text: '栅格', link: zh('/layout/') }],
  },
]
