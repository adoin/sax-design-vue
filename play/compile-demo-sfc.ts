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
import { ModuleKind, ScriptTarget, transpileModule } from 'typescript'

import type { Component } from 'vue'
import type { BindingMetadata } from '@vue/compiler-sfc'

const STYLE_TAG_ID = 'playground-embed-styles'

export type DemoRuntimeModules = Record<string, Record<string, unknown>>

export interface CompileDemoResult {
  component: Component | null
  error: string | null
}

function hasErrors(
  errors?: readonly (string | { message: string })[],
): errors is readonly (string | { message: string })[] {
  return Array.isArray(errors) && errors.length > 0
}

function formatErrors(
  errors: readonly (string | { message: string })[],
): string {
  return errors
    .map((item) => (typeof item === 'string' ? item : item.message))
    .join('\n')
}

function preprocessStyle(content: string, lang?: string): string {
  if (lang === 'scss' || lang === 'sass') {
    return postcss([nested]).process(content, { from: undefined }).css
  }
  return content
}

function transformRuntimeImports(code: string): string {
  const declarations: string[] = []

  const withoutImports = code
    .replace(
      /import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]\s*;?/g,
      (_, specifiers: string, moduleId: string) => {
        for (const entry of specifiers.split(',')) {
          const parts = entry.trim().split(/\s+as\s+/)
          const imported = parts[0]?.trim()
          const local = (parts[1] || parts[0])?.trim()
          if (imported && local) {
            declarations.push(
              `const ${local} = RuntimeModules[${JSON.stringify(moduleId)}].${imported}`,
            )
          }
        }
        return ''
      },
    )
    .replace(
      /import\s+\*\s+as\s+(\w+)\s+from\s*['"]([^'"]+)['"]\s*;?/g,
      (_, local: string, moduleId: string) => {
        declarations.push(
          `const ${local} = RuntimeModules[${JSON.stringify(moduleId)}]`,
        )
        return ''
      },
    )
    .replace(
      /import\s+(\w+)\s+from\s*['"]([^'"]+)['"]\s*;?/g,
      (_, local: string, moduleId: string) => {
        declarations.push(
          `const ${local} = RuntimeModules[${JSON.stringify(moduleId)}].default`,
        )
        return ''
      },
    )

  return `${declarations.join('\n')}\n${withoutImports}`
}

function transpileTypeScript(code: string, enabled: boolean): string {
  if (!enabled) return code

  return transpileModule(code, {
    compilerOptions: {
      module: ModuleKind.ESNext,
      target: ScriptTarget.ES2020,
    },
    fileName: 'Demo.ts',
  }).outputText
}

function rewriteComponentDefault(code: string, isTypeScript: boolean): string {
  return rewriteDefault(
    code,
    '__sfc__',
    isTypeScript ? ['typescript'] : undefined,
  )
}

function cssFromStyleResult(code: string): string {
  const trimmed = code.trim()
  if (trimmed.startsWith('export default')) {
    return new Function(
      `${trimmed.replace(/^export default /, 'return ')}`,
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

type ScopedComponent = Component & { __scopeId?: string }

function executeCompiled(
  code: string,
  runtimeModules: DemoRuntimeModules,
  scopeId?: string,
): Component {
  const fn = new Function('RuntimeModules', `${code}; return __sfc__`) as (
    modules: DemoRuntimeModules,
  ) => ScopedComponent
  const component = fn(runtimeModules)

  if (scopeId) component.__scopeId = `data-v-${scopeId}`

  return component
}

export function compileDemoSfc(
  source: string,
  scopeKey: string,
  modules: DemoRuntimeModules = {},
): CompileDemoResult {
  try {
    const runtimeModules: DemoRuntimeModules = { vue: Vue, ...modules }
    const { descriptor, errors } = parse(source, { filename: 'Demo.vue' })

    if (hasErrors(errors)) {
      return {
        component: null,
        error: formatErrors(errors),
      }
    }

    const scopeId = `pe-${scopeKey.replace(/[^a-z0-9-]/gi, '-')}`
    const hasScopedStyles = descriptor.styles.some((block) => block.scoped)
    const isTypeScript = [descriptor.script?.lang, descriptor.scriptSetup?.lang]
      .filter(Boolean)
      .some((lang) => lang === 'ts' || lang === 'tsx')
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
          error: formatErrors(compiledStyle.errors),
        }
      }

      cssText += `${cssFromStyleResult(compiledStyle.code)}\n`
    }

    injectStyles(cssText, scopeKey)

    let scriptCode = 'export default {}'
    let bindingMetadata: BindingMetadata | undefined

    if (descriptor.scriptSetup || descriptor.script) {
      const compiledScript = compileScript(descriptor, {
        id: scopeId,
        inlineTemplate: false,
      })

      scriptCode = compiledScript.content
      bindingMetadata = compiledScript.bindings
    }

    if (!descriptor.template) {
      const code = transformRuntimeImports(
        transpileTypeScript(
          rewriteComponentDefault(scriptCode, isTypeScript),
          isTypeScript,
        ),
      )
      return {
        component: executeCompiled(
          code,
          runtimeModules,
          hasScopedStyles ? scopeId : undefined,
        ),
        error: null,
      }
    }

    const compiledTemplate = compileTemplate({
      source: descriptor.template.content,
      filename: 'Demo.vue',
      id: scopeId,
      scoped: hasScopedStyles,
      slotted: descriptor.slotted,
      isProd: false,
      ssr: false,
      compilerOptions: {
        bindingMetadata,
        expressionPlugins: isTypeScript ? ['typescript'] : undefined,
      },
    })

    if (hasErrors(compiledTemplate.errors)) {
      return {
        component: null,
        error: formatErrors(compiledTemplate.errors),
      }
    }

    let code = rewriteComponentDefault(scriptCode, isTypeScript)
    if (compiledTemplate.preamble) {
      code = `${compiledTemplate.preamble}\n${code}`
    }
    code += `;\n${compiledTemplate.code.replace(
      /\nexport function render/g,
      '\nfunction render',
    )}\n__sfc__.render = render`
    code = transpileTypeScript(code, isTypeScript)
    code = transformRuntimeImports(code)

    return {
      component: executeCompiled(
        code,
        runtimeModules,
        hasScopedStyles ? scopeId : undefined,
      ),
      error: null,
    }
  } catch (error) {
    return {
      component: null,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
