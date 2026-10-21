// @vitest-environment node
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import fg from 'fast-glob'
import { parse } from '@vue/compiler-sfc'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'
import {
  documentationComponentModules,
  documentationImportsPlugin,
  rewriteDocumentationImports,
} from '../../docs/.vuepress/node/devImports'

const root = resolve(__dirname, '../..')
const modules = documentationComponentModules(root)

describe('documentation development import boundaries', () => {
  it('preserves aliases, type-only imports, fallbacks and adjacent statements', () => {
    const source = `<script setup lang="ts">import Sax, { SButton as Button, type ButtonProps, unknownValue } from 'sax-design-vue';const n = 1</script><template><Button /></template>`
    const result = rewriteDocumentationImports(
      source,
      'sample.vue',
      modules,
    )!.code
    expect(result).toContain(
      `import { SButton as Button } from ${JSON.stringify(modules.get('SButton'))}`,
    )
    expect(result).toContain(
      "import Sax, { type ButtonProps, unknownValue } from 'sax-design-vue';const n = 1",
    )
    expect(parse(result).descriptor.template?.content).toBe('<Button />')
    expect(
      rewriteDocumentationImports(source, 'sample.vue?raw', modules),
    ).toBeUndefined()
    expect(
      rewriteDocumentationImports(
        "import type { SButton } from 'sax-design-vue'",
        'sample.ts',
        modules,
      ),
    ).toBeUndefined()
    expect(
      rewriteDocumentationImports(
        "import * as Sax from 'sax-design-vue'",
        'sample.ts',
        modules,
      ),
    ).toBeUndefined()
  })

  it('keeps plugin services and static component exports while using the original production installer', () => {
    const plugin = documentationImportsPlugin(root)
    const configure = plugin.configResolved as (config: {
      command: string
    }) => void
    const resolveId = plugin.resolveId as (id: string) => string
    const load = plugin.load as (id: string) => string
    const id = resolveId('virtual:sax-docs-installer')
    configure({ command: 'serve' })
    const development = load(id)
    expect(development).toContain(
      'services.forEach(service => app.use(service))',
    )
    expect(development).toContain(
      'app.component("SFileManager", defineAsyncComponent(',
    )
    expect(development).toContain(
      'app.component("SFormItem", defineAsyncComponent(',
    )
    expect(development).not.toContain('app.component("SNotification"')
    configure({ command: 'build' })
    expect(load(id)).toContain("import SaxDesignVue from 'sax-design-vue'")
    expect(load(id)).toContain('app.use(SaxDesignVue)')
    expect(load(id)).not.toContain('defineAsyncComponent')
  })

  it('audits executable imports across every documentation Vue example without changing public templates or styles', () => {
    let checked = 0
    for (const file of fg.sync('docs/.vuepress/**/*.vue', {
      cwd: root,
      absolute: true,
      ignore: [
        '**/.temp/**',
        '**/.cache/**',
        '**/dist/**',
        '**/node_modules/**',
      ],
    })) {
      const source = readFileSync(file, 'utf8')
      const result = rewriteDocumentationImports(source, file, modules)
      if (!result) continue
      checked++
      const before = parse(source).descriptor,
        after = parse(result.code).descriptor
      expect(after.template?.content, file).toBe(before.template?.content)
      expect(
        after.styles.map((style) => style.content),
        file,
      ).toEqual(before.styles.map((style) => style.content))
      for (const [previous, next] of [
        [before.script, after.script],
        [before.scriptSetup, after.scriptSetup],
      ]) {
        if (!previous || !next) continue
        const diagnostics = (code: string) =>
          ts.transpileModule(code, {
            fileName: previous.lang === 'tsx' ? 'example.tsx' : 'example.ts',
            reportDiagnostics: true,
            compilerOptions: {
              target: ts.ScriptTarget.ESNext,
              module: ts.ModuleKind.ESNext,
              jsx: ts.JsxEmit.Preserve,
            },
          }).diagnostics?.length ?? 0
        expect(diagnostics(next.content), file).toBe(
          diagnostics(previous.content),
        )
      }
    }
    expect(checked).toBeGreaterThan(20)
  })
})
