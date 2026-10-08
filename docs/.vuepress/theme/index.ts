import { path } from '@vuepress/utils'

import { activeHeaderLinksPlugin } from '@vuepress/plugin-active-header-links'
import {
  prepareClientConfigFile,
  registerComponentsPlugin,
} from '@vuepress/plugin-register-components'
import { themeDataPlugin } from '@vuepress/plugin-theme-data'
import { containerPlugin } from '@vuepress/plugin-container'
import { gitPlugin } from '@vuepress/plugin-git'
import { prismjsPlugin } from '@vuepress/plugin-prismjs'
import { contentKey, documentationCache } from '../node/persistentCache'
import { createApiTypeDetailsResolver } from './node/apiTypeDetails'
import {
  highlightTypeScriptHtml,
  highlightVueSfcHtml,
} from './util/highlightVueSource'

import type { SaxDesignVueThemeOptions } from './saxDesignVueTheme'
import type { Page, Plugin, Theme } from '@vuepress/core'

const apiTableKeys = [
  'PROPS',
  'CHILD_PROPS',
  'GROUP_PROPS',
  'GROUP_TABS_PROPS',
  'BUTTON_PROPS',
  'PICKER_API',
  'ITEMS',
  'RULES',
  'RENDERERS',
  'EVENTS',
  'SLOTS',
  'EXPOSES',
]
const resolveApiTypeDetails = createApiTypeDetailsResolver(
  path.resolve(__dirname, '../../../packages/components'),
  [path.resolve(__dirname, '../../../packages/constants')],
  documentationCache('api-declarations', [
    path.resolve(__dirname, 'node/apiTypeDetails.ts'),
  ]),
)
const highlightCache = documentationCache('source-highlighting', [
  path.resolve(__dirname, 'util/highlightVueSource.ts'),
])

const escapeInlineScriptEnd = (page: Page) => {
  const component = page.path.match(/\/components\/([^/.]+)\.html$/)?.[1]
  const typeExpressions: string[] = []

  for (const key of apiTableKeys) {
    const rows = page.frontmatter[key]
    if (!Array.isArray(rows)) continue

    for (const row of rows) {
      if (
        typeof row === 'object' &&
        row !== null &&
        'type' in row &&
        typeof row.type === 'string'
      ) {
        typeExpressions.push(row.type)
      }
      if (
        typeof row === 'object' &&
        row !== null &&
        'scope' in row &&
        typeof row.scope === 'string'
      ) {
        typeExpressions.push(row.scope)
      }
      if (
        typeof row === 'object' &&
        row !== null &&
        'code' in row &&
        typeof row.code === 'string'
      ) {
        row.code = row.code.replaceAll('</script>', '<\\/script>')
      }
    }
  }

  if (component && typeExpressions.length) {
    page.frontmatter.API_TYPE_DETAILS = resolveApiTypeDetails(
      component,
      typeExpressions,
    )
  }
}

const safeInlinePageDataPlugin: Plugin = {
  name: 'vuepress-safe-inline-page-data',
  extendsPage: escapeInlineScriptEnd,
}

const vueSfcHighlightPlugin: Plugin = {
  name: 'vuepress-vue-sfc-highlight',
  extendsMarkdown(md) {
    const fallback = md.options.highlight
    md.options.highlight = (source, language, attrs) => {
      if (language === 'vue')
        return highlightCache.get(contentKey(`vue:${source}`), () =>
          highlightVueSfcHtml(source),
        )
      if (language === 'tsx')
        return highlightCache.get(contentKey(`tsx:${source}`), () =>
          highlightTypeScriptHtml(source, 'tsx'),
        )
      if (language === 'ts' || language === 'typescript')
        return highlightCache.get(contentKey(`typescript:${source}`), () =>
          highlightTypeScriptHtml(source, 'typescript'),
        )
      return fallback?.(source, language, attrs) ?? ''
    }
  },
}

export const saxDesignVueTheme = (
  options: SaxDesignVueThemeOptions = {},
  development: {
    examples?: Record<string, string>
    getExamples?: () => Record<string, string>
    onExamplesChanged?: () => void
  } = {},
): Theme => {
  return {
    name: 'vuepress-theme-sax-design-vue',
    clientConfigFile: path.resolve(__dirname, 'client.ts'),
    plugins: [
      activeHeaderLinksPlugin({
        headerLinkSelector: '.sidebar-sub-headers a.sidebar-link',
        headerAnchorSelector: '.header-anchor',
        offset: 96,
      }),
      containerPlugin({
        type: 'tip',
        before: (info: string): string =>
          `<div class="custom-container tip">${info}\n`,
        after: (): string => '</div>\n',
      }),
      containerPlugin({
        type: 'warning',
        before: (info: string): string =>
          `<div class="custom-container warning">${info}\n`,
        after: (): string => '</div>\n',
      }),
      containerPlugin({
        type: 'danger',
        before: (info: string): string =>
          `<div class="custom-container danger">${info}\n`,
        after: (): string => '</div>\n',
      }),
      themeDataPlugin({
        themeData: options,
      }),
      prismjsPlugin(),
      vueSfcHighlightPlugin,
      registerComponentsPlugin({
        componentsDir: path.resolve(__dirname, 'global-components'),
      }),
      development.examples
        ? {
            name: 'sax-focused-example-registration',
            clientConfigFile: (app) =>
              prepareClientConfigFile(
                app,
                {
                  components: development.examples!,
                  componentsDir: null,
                  componentsPatterns: [],
                  getComponentName: (name) => name,
                },
                'focused-examples',
              ),
            async onPageUpdated(app) {
              if (!development.getExamples) return
              const next = development.getExamples()
              if (JSON.stringify(next) === JSON.stringify(development.examples))
                return
              development.examples = next
              await prepareClientConfigFile(
                app,
                {
                  components: next,
                  componentsDir: null,
                  componentsPatterns: [],
                  getComponentName: (name) => name,
                },
                'focused-examples',
              )
              development.onExamplesChanged?.()
            },
          }
        : registerComponentsPlugin({
            componentsDir: path.resolve(__dirname, '../components'),
          }),
      safeInlinePageDataPlugin,
      // The theme only renders `pageData.git.updatedTime`. Disabling unused
      // metadata avoids hundreds of concurrent Git subprocesses during page
      // initialization, which can fail intermittently on Windows.
      (app) =>
        app.env.isDev
          ? {
              name: 'sax-development-git-disabled',
              extendsPage: (page) => {
                page.data.git = {}
              },
            }
          : gitPlugin({
              createdTime: false,
              contributors: false,
            })(app),
    ],
  }
}
