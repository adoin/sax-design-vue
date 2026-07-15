import * as Vue from 'vue'
import {
  compileScript,
  compileStyle,
  compileTemplate,
  parse,
  rewriteDefault,
} from '@vue/compiler-sfc'
import nested from 'postcss-nested'
import postcss from 'postcss'

import type { Component } from 'vue'

const STYLE_TAG_ID = 'playground-embed-styles'

export interface CompileDemoResult {
  component: Component | null
  error: string | null
}

function normalizeSource(source: string): string {
  let result = source.replace(/<script(\s+setup)?\s+lang="ts"/gi, '<script$1')

  result = result.replace(
    /<script([^>]*)>([\s\S]*?)<\/script>/gi,
    (_match, attrs: string, body: string) => {
      const stripped = body
        .replace(/\(([^)]*)\)/g, (params) => params.replace(/:\s*[^,)]+/g, ''))
        .replace(/:\s*[A-Za-z_$][\w$[\].<>,\s|]*/g, '')
      return `<script${attrs}>${stripped}</script>`
    }
  )

  return result
}

function hasErrors(
  errors?: Array<{ message: string }>
): errors is Array<{ message: string }> {
  return Array.isArray(errors) && errors.length > 0
}

function preprocessStyle(content: string, lang?: string): string {
  if (lang === 'scss' || lang === 'sass') {
    return postcss([nested]).process(content, { from: undefined }).css
  }
  return content
}

function transformVueImports(code: string): string {
  const vueImports: string[] = []

  const withoutImports = code
    .replace(
      /import\s*\{([^}]+)\}\s*from\s*['"]vue['"]\s*;?/g,
      (_, specifiers: string) => {
        for (const entry of specifiers.split(',')) {
          const parts = entry.trim().split(/\s+as\s+/)
          const imported = parts[0]?.trim()
          const local = (parts[1] || parts[0])?.trim()
          if (imported && local) {
            vueImports.push(`const ${local} = Vue.${imported}`)
          }
        }
        return ''
      }
    )
    .replace(
      /import\s+\*\s+as\s+(\w+)\s+from\s*['"]vue['"]\s*;?/g,
      'const $1 = Vue'
    )
    .replace(/import\s+(\w+)\s+from\s*['"]vue['"]\s*;?/g, 'const $1 = Vue')

  return `${vueImports.join('\n')}\n${withoutImports}`
}

function cssFromStyleResult(code: string): string {
  const trimmed = code.trim()
  if (trimmed.startsWith('export default')) {
    return new Function(
      `${trimmed.replace(/^export default /, 'return ')}`
    )() as string
  }
  return trimmed
}

function injectStyles(css: string, scopeKey: string) {
  if (typeof document === 'undefined') return

  let styleEl = document.querySelector<HTMLStyleElement>(`#${STYLE_TAG_ID}`)
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = STYLE_TAG_ID
    document.head.appendChild(styleEl)
  }

  styleEl.dataset.scope = scopeKey
  styleEl.textContent = css
}

export function compileDemoSfc(
  source: string,
  scopeKey: string
): CompileDemoResult {
  try {
    const normalized = normalizeSource(source)
    const { descriptor, errors } = parse(normalized, { filename: 'Demo.vue' })

    if (hasErrors(errors)) {
      return {
        component: null,
        error: errors.map((item) => item.message).join('\n'),
      }
    }

    const scopeId = `pe-${scopeKey.replace(/[^a-z0-9-]/gi, '-')}`
    let cssText = ''

    for (const block of descriptor.styles) {
      const preprocessed = preprocessStyle(block.content, block.lang)
      const compiledStyle = compileStyle({
        source: preprocessed,
        filename: 'Demo.vue',
        id: scopeId,
        scoped: block.scoped ?? false,
      })

      if (hasErrors(compiledStyle.errors)) {
        return {
          component: null,
          error: compiledStyle.errors.map((item) => item.message).join('\n'),
        }
      }

      cssText += `${cssFromStyleResult(compiledStyle.code)}\n`
    }

    injectStyles(cssText, scopeKey)

    let scriptCode = 'export default {}'
    let bindingMetadata: Record<string, unknown> | undefined

    if (descriptor.scriptSetup || descriptor.script) {
      const compiledScript = compileScript(descriptor, {
        id: scopeId,
        inlineTemplate: false,
      })

      if (hasErrors(compiledScript.errors)) {
        return {
          component: null,
          error: compiledScript.errors.map((item) => item.message).join('\n'),
        }
      }

      scriptCode = compiledScript.content
      bindingMetadata = compiledScript.bindings
    }

    if (!descriptor.template) {
      const code = transformVueImports(rewriteDefault(scriptCode, '__sfc__'))
      const run = new Function('Vue', `${code}; return __sfc__`) as (
        vue: typeof Vue
      ) => Component
      return { component: run(Vue), error: null }
    }

    const compiledTemplate = compileTemplate({
      source: descriptor.template.content,
      filename: 'Demo.vue',
      id: scopeId,
      scoped: descriptor.styles.some((block) => block.scoped),
      slotted: descriptor.slotted,
      isProd: false,
      ssr: false,
      compilerOptions: {
        bindingMetadata,
      },
    })

    if (hasErrors(compiledTemplate.errors)) {
      return {
        component: null,
        error: compiledTemplate.errors.map((item) => item.message).join('\n'),
      }
    }

    let code = rewriteDefault(scriptCode, '__sfc__')
    code += `;\n${compiledTemplate.code.replace(
      /\nexport function render/g,
      '\nfunction render'
    )}\n__sfc__.render = render`
    code = transformVueImports(code)

    const run = new Function('Vue', `${code}; return __sfc__`) as (
      vue: typeof Vue
    ) => Component

    return { component: run(Vue), error: null }
  } catch (error) {
    return {
      component: null,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
