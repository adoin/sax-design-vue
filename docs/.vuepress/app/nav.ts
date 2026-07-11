import { newComponentNavItems } from './new-components'
import type { NavbarConfig } from '~/shared/client/nav'

export const enNavbar: NavbarConfig = [
  {
    text: 'Guide',
    link: `/guide/`,
    children: [
      { text: `Introduction`, link: `/guide/` },
      { text: `Getting Started`, link: `/guide/getting-started` },
      { text: `Playground`, link: `/guide/playground` },
      { text: `Usage with Nuxt`, link: `/guide/nuxt` },
      { text: `Tribute to Vuesax`, link: `/guide/tribute` },
    ],
  },
  {
    text: `Documentation`,
    link: `/`,
    children: [
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
      {
        text: `Layout`,
        children: [
          {
            text: `Grid`,
            link: `/layout/`,
          },
        ],
      },
      {
        text: `Components`,
        children: [
          { text: `Button`, link: `/components/` },
          { text: `Alert`, link: `/components/alert` },
          { text: `Loading`, link: `/components/loading` },
          { text: `Input`, link: `/components/input` },
          { text: 'Checkbox', link: `/components/checkbox` },
          { text: 'Switch', link: `/components/switch` },
          { text: 'Select', link: `/components/select` },
          { text: 'Avatar', link: `/components/avatar` },
          {
            text: 'Notification',
            link: `/components/notification`,
          },
          { text: 'Radio', link: `/components/radio` },
          { text: 'Tooltip', link: `/components/tooltip` },
          { text: 'Dialog', link: `/components/dialog` },
          { text: 'Pagination', link: `/components/pagination` },
          { text: 'Table', link: `/components/table` },
          { text: 'Navbar', link: `/components/navbar` },
          { text: 'Sidebar', link: `/components/sidebar` },
          { text: 'Card', link: `/components/card` },
          { text: 'Time select', link: `/components/time-select` },
          { text: 'Scrollbar', link: `/components/scrollbar` },
          { text: 'Rate', link: `/components/rate` },
          { text: 'Badge', link: `/components/badge` },
          ...newComponentNavItems,
        ],
      },
    ],
  },
  {
    text: `Ecosystem`,
    children: [
      {
        text: `Github`,
        children: [
          {
            text: `Vuesax`,
            link: `https://github.com/lusaxweb/vuesax`,
          },
          {
            text: `Sax Design Vue`,
            link: `https://github.com/adoin/sax-design-vue`,
          },
          {
            text: `Vuesax Alpha`,
            link: `https://github.com/vuesax-alpha/vuesax-alpha`,
          },
        ],
      },
      {
        text: `Help`,
        children: [
          {
            text: `Tribute to Vuesax`,
            link: `/guide/tribute`,
          },
          {
            text: `Original Vuesax (Vue 2)`,
            link: `https://github.com/lusaxweb/vuesax`,
          },
          {
            text: `Vuesax Website`,
            link: `https://vuesax.com/`,
          },
          {
            text: `Issues`,
            link: `https://github.com/adoin/sax-design-vue/issues`,
          },
          {
            text: `Edit Page`,
            link: `https://github.com/adoin/sax-design-vue`,
          },
          {
            text: `Latest Releases`,
            link: `https://github.com/adoin/sax-design-vue/releases`,
          },
        ],
      },
      {
        text: `Contact`,
        children: [
          {
            text: `Pull Request`,
            link: `https://github.com/vuesax-alpha/vuesax-alpha/pulls`,
          },
        ],
      },
    ],
  },
]
