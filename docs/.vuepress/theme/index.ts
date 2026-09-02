import { path } from '@vuepress/utils'

import { activeHeaderLinksPlugin } from '@vuepress/plugin-active-header-links'
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'
import { themeDataPlugin } from '@vuepress/plugin-theme-data'
import { containerPlugin } from '@vuepress/plugin-container'
import { gitPlugin } from '@vuepress/plugin-git'
import { prismjsPlugin } from '@vuepress/plugin-prismjs'
import { createApiTypeDetailsResolver } from './node/apiTypeDetails'

import type { SaxDesignVueThemeOptions } from './saxDesignVueTheme'
import type { Page, Plugin, Theme } from '@vuepress/core'

const apiTableKeys = ['PROPS', 'CHILD_PROPS', 'SLOTS', 'EVENTS', 'EXPOSES']
const resolveApiTypeDetails = createApiTypeDetailsResolver(
  path.resolve(__dirname, '../../../packages/components'),
)

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

export const saxDesignVueTheme = (
  options: SaxDesignVueThemeOptions = {},
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
      registerComponentsPlugin({
        componentsDir: path.resolve(__dirname, 'global-components'),
      }),
      registerComponentsPlugin({
        componentsDir: path.resolve(__dirname, '../components'),
      }),
      safeInlinePageDataPlugin,
      // The theme only renders `pageData.git.updatedTime`. Disabling unused
      // metadata avoids hundreds of concurrent Git subprocesses during page
      // initialization, which can fail intermittently on Windows.
      gitPlugin({
        createdTime: false,
        contributors: false,
      }),
    ],
  }
}
