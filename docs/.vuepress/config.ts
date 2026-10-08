import path from 'node:path'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'
import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { saxIcons } from 'sax-design-vue-iconify/vite'
import saxIconConfig from '../../sax-icons.config'
import { collectDocumentationIconNames } from './node/documentationIcons'
import {
  collectFocusedExamples,
  filterFocusedNavigation,
  readDevScope,
} from './node/devScope'
import {
  documentationCache,
  flushDocumentationCaches,
} from './node/persistentCache'
import { documentationStylesPlugin } from './node/devStyles'
import {
  enNavbar,
  enSearchData,
  enSidebar,
  zhNavbar,
  zhSearchData,
  zhSidebar,
} from './app'
import { createLocalizedHeadingSlugify } from './node/localizedHeadingSlugs'
import { saxDesignVueTheme } from './theme/index'
import type { UserConfig } from 'vuepress'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const configurationStarted = Date.now()
const projRoot = path.resolve(__dirname, '../..')
const pkgRoot = path.resolve(projRoot, 'packages')
const vsRoot = path.resolve(pkgRoot, 'sax-design-vue')
const docsRoot = path.resolve(projRoot, 'docs')
const devScope = readDevScope(docsRoot)
const getFocusedExamples = () =>
  collectFocusedExamples(
    path.resolve(__dirname, 'components'),
    fg
      .sync(devScope.pagePatterns!, { cwd: docsRoot, absolute: true })
      .map((file) => readFileSync(file, 'utf8')),
  )
const focusedExamples = devScope.focused ? getFocusedExamples() : undefined
let reloadFocusedExamples: (() => void) | undefined
const iconCache = documentationCache('icons', [
  path.resolve(__dirname, 'node/documentationIcons.ts'),
])
const vuepressBase = process.env.VUEPRESS_BASE || '/'
const localizedHeadingSlugify = createLocalizedHeadingSlugify(
  path.resolve(projRoot, 'docs'),
)

export default defineUserConfig({
  pagePatterns: devScope.pagePatterns,
  ...(devScope.focused
    ? {
        temp: path.resolve(
          __dirname,
          '.temp/scopes',
          `${devScope.component || 'all'}-${devScope.locale}`,
        ),
        cache: path.resolve(
          __dirname,
          '.cache/scopes',
          `${devScope.component || 'all'}-${devScope.locale}`,
        ),
      }
    : {}),
  plugins: [
    {
      name: 'sax-docs-development-data',
      onInitialized(app) {
        if (devScope.focused && !app.env.isDev)
          throw new Error(
            'Focused documentation is only available in development',
          )
        if (app.env.isDev)
          // eslint-disable-next-line no-console
          console.info(
            `[docs-dev] ${app.pages.length} pages${focusedExamples ? ` / ${Object.keys(focusedExamples).length} examples` : ''}; Git timestamps disabled`,
          )
      },
      onPrepared() {
        flushDocumentationCaches()
      },
    },
  ],
  bundler: viteBundler({
    viteOptions: {
      server: {
        watch: {
          ignored: [
            '**/.vuepress/dist/**',
            '**/.vuepress/.cache/**',
            '**/.codex/**',
          ],
        },
      },
      define: {
        'import.meta.env.SAX_DOCS_DEV_LOCALE': JSON.stringify(devScope.locale),
      },
      optimizeDeps: {
        include: [
          '@vue/compiler-sfc',
          'postcss-nested',
          'postcss',
          'typescript',
          'dayjs',
          '@vue/shared',
          '@vueuse/core',
          'decimal.js',
          'lodash-unified',
          'normalize-wheel-es',
          ...[
            'advancedFormat',
            'customParseFormat',
            'isoWeek',
            'timezone',
            'utc',
            'weekOfYear',
            'weekYear',
          ].map((name) => `dayjs/plugin/${name}.js`),
          'prismjs',
          ...[
            'clike',
            'css',
            'javascript',
            'jsx',
            'markup',
            'scss',
            'tsx',
            'typescript',
          ].map((name) => `prismjs/components/prism-${name}.js`),
        ],
      },
      // client.ts imports the registry already; avoid a duplicate HTML entry.
      plugins: [
        documentationStylesPlugin(projRoot),
        {
          name: 'sax-docs-startup-timing',
          apply: 'serve',
          configureServer(server) {
            reloadFocusedExamples = () =>
              server.ws.send({ type: 'full-reload' })
            server.httpServer?.once('listening', () => {
              const started =
                Number(process.env.SAX_DOCS_DEV_STARTED) || configurationStarted
              // eslint-disable-next-line no-console
              console.info(
                `[docs-dev] ready in ${((Date.now() - started) / 1000).toFixed(2)}s`,
              )
              delete process.env.SAX_DOCS_DEV_STARTED
            })
          },
        },
        saxIcons({
          ...saxIconConfig,
          autoRegister: false,
          safelist: collectDocumentationIconNames(
            [
              ...(focusedExamples
                ? Object.values(focusedExamples)
                : [path.resolve(__dirname, 'components')]),
              path.resolve(__dirname, 'theme'),
              path.resolve(pkgRoot, 'components'),
            ],
            Object.keys(saxIconConfig.collections),
            saxIconConfig.safelist,
            iconCache,
          ),
        }),
      ],
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
  theme: saxDesignVueTheme(
    {
      linkSite: 'https://adoin.github.io/sax-design-vue/',
      repo: 'adoin/sax-design-vue',
      docsBranch: 'main',
      docsDir: 'docs',
      docsRepo: 'https://github.com/adoin/sax-design-vue',
      editLink: true,
      editLinkPattern:
        'https://github.com/adoin/sax-design-vue/edit/main/docs/',
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
          navbar: filterFocusedNavigation(enNavbar, devScope),
          sidebar: filterFocusedNavigation(enSidebar, devScope),
          lastUpdatedText: 'Last Updated',
          searchPlaceholder: 'Search components…',
        },
        '/zh/': {
          home: '/zh/',
          selectLanguageText: '语言',
          selectLanguageName: '简体中文',
          navbar: filterFocusedNavigation(zhNavbar, devScope),
          sidebar: filterFocusedNavigation(zhSidebar, devScope),
          lastUpdatedText: '最后更新',
          searchPlaceholder: '搜索组件…',
        },
      },
      search: true,
      searchMaxSuggestions: 5,
      searchData: {
        '/': filterFocusedNavigation(enSearchData, devScope),
        '/zh/': filterFocusedNavigation(zhSearchData, devScope),
      },
      lastUpdated: true,
      contributors: true,
      lastUpdatedText: 'Last Updated',
    },
    {
      examples: focusedExamples,
      getExamples: devScope.focused ? getFocusedExamples : undefined,
      onExamplesChanged: () => reloadFocusedExamples?.(),
    },
  ),
  markdown: {
    anchor: {
      slugifyWithState: localizedHeadingSlugify,
    },
    html: true,
    typographer: true,
  },
}) as UserConfig
