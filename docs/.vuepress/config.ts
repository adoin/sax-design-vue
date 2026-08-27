import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { saxIcons } from 'sax-design-vue-iconify/vite'
import saxIconConfig from '../../sax-icons.config'
import {
  enNavbar,
  enSearchData,
  enSidebar,
  zhNavbar,
  zhSearchData,
  zhSidebar,
} from './app'
import { saxDesignVueTheme } from './theme/index'
import type { UserConfig } from 'vuepress'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projRoot = path.resolve(__dirname, '../..')
const pkgRoot = path.resolve(projRoot, 'packages')
const vsRoot = path.resolve(pkgRoot, 'sax-design-vue')
const vuepressBase = process.env.VUEPRESS_BASE || '/'

export default defineUserConfig({
  bundler: viteBundler({
    viteOptions: {
      plugins: [saxIcons(saxIconConfig)],
      css: {
        preprocessorOptions: {
          scss: {
            // VuePress and legacy demo snippets still invoke Sass through
            // compatibility APIs. Project styles use the module API; keep
            // dependency-level migration noise out of routine docs builds.
            silenceDeprecations: [
              'legacy-js-api',
              'global-builtin',
              'color-functions',
              'if-function',
              'import',
              'new-global',
            ],
          },
        },
      },
      build: {
        // Documentation output intentionally bundles the interactive component
        // catalog. Keep the threshold aligned with this application bundle.
        chunkSizeWarningLimit: 1500,
      },
      resolve: {
        // pnpm can expose multiple virtual vue-router instances when their
        // optional peer sets differ. They carry different injection symbols,
        // so the production bundle must resolve Vue and Vue Router from one
        // canonical module instance.
        dedupe: ['vue', 'vue-router'],
        alias: [
          {
            find: /^sax-design-vue-iconify$/,
            replacement: path.resolve(
              projRoot,
              'packages/iconify/src/index.ts',
            ),
          },
          {
            find: '@vuesax-alpha/theme-chalk',
            replacement: path.resolve(pkgRoot, 'theme-chalk'),
          },
          {
            find: /^sax-design-vue\/theme-chalk\/(.*)$/,
            replacement: `${path.resolve(pkgRoot, 'theme-chalk')}/$1`,
          },
          {
            find: /^sax-design-vue(\/(es|lib))?$/,
            replacement: path.resolve(vsRoot, 'index.ts'),
          },
          {
            find: /^sax-design-vue\/(es|lib)\/(.*)$/,
            replacement: `${pkgRoot}/$2`,
          },
        ],
      },
    },
  }),
  open: false,
  shouldPrefetch: false,
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Sax Design Vue — Vue 3 component library',
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'Sax Design Vue — Vue 3 组件库',
    },
  },
  lang: 'en-US',
  title: 'Sax Design Vue',
  base: vuepressBase,
  head: [
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    ],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    ],
    [
      'link',
      {
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        rel: 'stylesheet',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        href: `${vuepressBase}sax-logo-mark.svg`,
        media: '(prefers-color-scheme:dark)',
        type: 'image/svg+xml',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        href: `${vuepressBase}sax-logo-mark.svg`,
        media: '(prefers-color-scheme:light)',
        type: 'image/svg+xml',
      },
    ],
    [
      'meta',
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, user-scalable=no, maximum-scale=1, shrink-to-fit=no',
      },
    ],
    ['meta', { name: 'author', content: 'Sax Design Vue' }],
    ['meta', { name: 'google', content: 'nositelinkssearchbox' }],
    [
      'meta',
      {
        hid: 'description',
        name: 'description',
        content:
          'Modern Vue 3 component library with usage guides, configuration docs, dark mode, and an online playground.',
      },
    ],
    [
      'meta',
      {
        property: 'og:description',
        content:
          'Modern Vue 3 component library with usage guides, configuration docs, dark mode, and an online playground.',
      },
    ],
    ['meta', { property: 'og:title', content: 'Sax Design Vue' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],
  theme: saxDesignVueTheme({
    linkSite: 'https://adoin.github.io/sax-design-vue/',
    repo: 'adoin/sax-design-vue',
    docsBranch: 'main',
    docsDir: 'docs',
    docsRepo: 'https://github.com/adoin/sax-design-vue',
    editLink: true,
    editLinkPattern: 'https://github.com/adoin/sax-design-vue/edit/main/docs/',
    logo: '/sax-logo-mark.svg',
    logoDark: '/sax-logo-mark.svg',
    prevVersion: 'Vuesax 4',
    linkPrevVersion: 'https://vuesax.com/',
    searchPlaceholder: 'Search components…',
    home: '/',
    locales: {
      '/': {
        home: '/',
        selectLanguageText: 'Languages',
        selectLanguageName: 'English',
        navbar: enNavbar,
        sidebar: enSidebar,
        lastUpdatedText: 'Last Updated',
        searchPlaceholder: 'Search components…',
      },
      '/zh/': {
        home: '/zh/',
        selectLanguageText: '语言',
        selectLanguageName: '简体中文',
        navbar: zhNavbar,
        sidebar: zhSidebar,
        lastUpdatedText: '最后更新',
        searchPlaceholder: '搜索组件…',
      },
    },
    search: true,
    searchMaxSuggestions: 5,
    searchData: {
      '/': enSearchData,
      '/zh/': zhSearchData,
    },
    lastUpdated: true,
    contributors: true,
    lastUpdatedText: 'Last Updated',
  }),
  markdown: {
    html: true,
    typographer: true,
  },
}) as UserConfig
