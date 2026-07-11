import { newComponentNavItemsZh } from './new-components.zh'
import type { NavbarConfig } from '~/shared/client/nav'

const zh = (path: string) => `/zh${path}`

export const zhNavbar: NavbarConfig = [
  {
    text: '指南',
    link: zh('/guide/'),
    children: [
      { text: '介绍', link: zh('/guide/') },
      { text: '快速开始', link: zh('/guide/getting-started') },
      { text: '使用组件', link: zh('/guide/using-components') },
      { text: '配置', link: zh('/guide/configuration') },
      { text: 'Playground', link: zh('/guide/playground') },
      { text: 'Nuxt 集成', link: zh('/guide/nuxt') },
      { text: '致敬 Vuesax', link: zh('/guide/tribute') },
    ],
  },
  {
    text: '文档',
    link: zh('/'),
    children: [
      {
        text: '基础',
        children: [
          { text: '颜色', link: zh('/theme/') },
          { text: '图标', link: zh('/icons/') },
        ],
      },
      {
        text: '布局',
        children: [{ text: '栅格', link: zh('/layout/') }],
      },
      {
        text: '组件',
        children: [
          { text: 'Button', link: zh('/components/') },
          { text: 'Alert', link: zh('/components/alert') },
          { text: 'Loading', link: zh('/components/loading') },
          { text: 'Input', link: zh('/components/input') },
          { text: 'Checkbox', link: zh('/components/checkbox') },
          { text: 'Switch', link: zh('/components/switch') },
          { text: 'Select', link: zh('/components/select') },
          { text: 'Avatar', link: zh('/components/avatar') },
          { text: 'Notification', link: zh('/components/notification') },
          { text: 'Radio', link: zh('/components/radio') },
          { text: 'Tooltip', link: zh('/components/tooltip') },
          { text: 'Dialog', link: zh('/components/dialog') },
          { text: 'Pagination', link: zh('/components/pagination') },
          { text: 'Table', link: zh('/components/table') },
          { text: 'Navbar', link: zh('/components/navbar') },
          { text: 'Sidebar', link: zh('/components/sidebar') },
          { text: 'Card', link: zh('/components/card') },
          { text: 'Time select', link: zh('/components/time-select') },
          { text: 'Scrollbar', link: zh('/components/scrollbar') },
          { text: 'Rate', link: zh('/components/rate') },
          { text: 'Badge', link: zh('/components/badge') },
          ...newComponentNavItemsZh,
        ],
      },
    ],
  },
  {
    text: '生态',
    children: [
      {
        text: 'Github',
        children: [
          { text: 'Vuesax', link: 'https://github.com/lusaxweb/vuesax' },
          {
            text: 'Sax Design Vue',
            link: 'https://github.com/adoin/sax-design-vue',
          },
          {
            text: 'Vuesax Alpha',
            link: 'https://github.com/vuesax-alpha/vuesax-alpha',
          },
        ],
      },
      {
        text: '帮助',
        children: [
          { text: '致敬 Vuesax', link: zh('/guide/tribute') },
          {
            text: '原版 Vuesax (Vue 2)',
            link: 'https://github.com/lusaxweb/vuesax',
          },
          { text: 'Vuesax 官网', link: 'https://vuesax.com/' },
          {
            text: 'Issues',
            link: 'https://github.com/adoin/sax-design-vue/issues',
          },
          { text: '编辑页面', link: 'https://github.com/adoin/sax-design-vue' },
          {
            text: '最新发布',
            link: 'https://github.com/adoin/sax-design-vue/releases',
          },
        ],
      },
      {
        text: '联系',
        children: [
          {
            text: 'Pull Request',
            link: 'https://github.com/vuesax-alpha/vuesax-alpha/pulls',
          },
        ],
      },
    ],
  },
]
