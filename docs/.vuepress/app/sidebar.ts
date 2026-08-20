import { enComponentCategories } from './component-categories'
import type { SidebarConfig } from '~/shared/client/nav'

export const enSidebar: SidebarConfig = [
  {
    text: 'Guide',
    children: [
      {
        text: 'Introduction',
        link: '/guide/',
      },
      {
        text: 'Getting Started',
        link: '/guide/getting-started/',
      },
      {
        text: 'Using Components',
        link: '/guide/using-components',
      },
      {
        text: 'Configuration',
        link: '/guide/configuration',
      },
      {
        text: 'Playground',
        link: '/guide/playground',
      },
      {
        text: 'Usage with Nuxt',
        link: '/guide/nuxt/',
      },
    ],
  },
  {
    text: 'Basic',
    children: [
      {
        text: 'Colors',
        link: '/theme/',
      },
      {
        text: 'Icons',
        link: '/icons/',
      },
    ],
  },
  ...enComponentCategories,
]
