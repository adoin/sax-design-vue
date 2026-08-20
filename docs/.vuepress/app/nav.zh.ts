import { zhComponentCategories } from './component-categories'
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
      ...zhComponentCategories,
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
            text: '上游参考',
            link: 'https://github.com/vuesax-alpha/vuesax-alpha',
          },
        ],
      },
      {
        text: '帮助',
        children: [
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
            link: 'https://github.com/adoin/sax-design-vue/pulls',
          },
        ],
      },
    ],
  },
]
