import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { parse } from '@vue/compiler-sfc'
import ts from 'typescript'
import type { Plugin } from 'vite'

const installerId = 'virtual:sax-docs-installer'
const resolvedInstaller = `\0${installerId}`
const services = new Set([
  'SLoading',
  'SInfiniteScroll',
  'SNotification',
  'SDialogBox',
  'SIconPicker',
])

export function documentationComponentModules(projectRoot: string) {
  const root = path.join(projectRoot, 'packages/components')
  const modules = new Map<string, string>()
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('_')) continue
    const filename = path.join(root, entry.name, 'index.ts')
    let source: string
    try {
      source = readFileSync(filename, 'utf8')
    } catch {
      continue
    }
    for (const match of source.matchAll(/export\s+const\s+(S[A-Z]\w*)\b/g))
      modules.set(match[1], filename.replaceAll('\\', '/'))
  }
  return modules
}

/** Mirror the full installer's component and static-child registration surface. */
export function documentationGlobalComponents(
  projectRoot: string,
  modules: ReadonlyMap<string, string>,
) {
  const file = path.join(projectRoot, 'packages/sax-design-vue/component.ts')
  const source = ts.createSourceFile(
    file,
    readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
  )
  const assignment = source.statements.find(ts.isExportAssignment)
  let expression = assignment?.expression
  while (
    expression &&
    (ts.isAsExpression(expression) || ts.isParenthesizedExpression(expression))
  )
    expression = expression.expression
  if (!expression || !ts.isArrayLiteralExpression(expression))
    throw new Error('Cannot read documentation component installer')
  const names = new Set(
    expression.elements.filter(ts.isIdentifier).map((element) => element.text),
  )
  for (const module of new Set(
    [...names]
      .map((name) => modules.get(name))
      .filter((file): file is string => !!file),
  )) {
    const syntax = ts.createSourceFile(
      module,
      readFileSync(module, 'utf8'),
      ts.ScriptTarget.Latest,
      true,
    )
    const visit = (node: ts.Node) => {
      if (
        ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.text === 'withInstall' &&
        node.arguments[1] &&
        ts.isObjectLiteralExpression(node.arguments[1])
      ) {
        for (const property of node.arguments[1].properties) {
          const value = ts.isShorthandPropertyAssignment(property)
            ? property.name
            : ts.isPropertyAssignment(property) &&
                ts.isIdentifier(property.initializer)
              ? property.initializer
              : undefined
          if (value) {
            const name = /^S[A-Z]/.test(value.text)
              ? value.text
              : `S${value.text}`
            if (modules.has(name)) names.add(name)
          }
        }
      }
      ts.forEachChild(node, visit)
    }
    visit(syntax)
  }
  return names
}

/** Rewrite executable imports only. Public Code/Playground source stays untouched. */
export function rewriteDocumentationImports(
  code: string,
  id: string,
  modules: ReadonlyMap<string, string>,
) {
  if (id.includes('?') || !code.includes('sax-design-vue')) return
  const blocks = id.endsWith('.vue')
    ? (() => {
        const { descriptor } = parse(code, { filename: id })
        return [descriptor.script, descriptor.scriptSetup]
          .filter((block) => block !== null)
          .map((block) => ({
            code: block.content,
            offset: block.loc.start.offset,
          }))
      })()
    : /\.[cm]?[jt]sx?$/.test(id)
      ? [{ code, offset: 0 }]
      : []
  const edits: { start: number; end: number; code: string }[] = []
  for (const block of blocks) {
    const source = ts.createSourceFile(
      id.endsWith('.tsx') ? 'source.tsx' : 'source.ts',
      block.code,
      ts.ScriptTarget.Latest,
      true,
    )
    for (const statement of source.statements) {
      if (
        !ts.isImportDeclaration(statement) ||
        !ts.isStringLiteral(statement.moduleSpecifier) ||
        statement.moduleSpecifier.text !== 'sax-design-vue'
      )
        continue
      const clause = statement.importClause
      if (
        !clause ||
        clause.isTypeOnly ||
        !clause.namedBindings ||
        !ts.isNamedImports(clause.namedBindings) ||
        statement.attributes
      )
        continue
      const remaining: string[] = [],
        direct = new Map<string, string[]>()
      for (const specifier of clause.namedBindings.elements) {
        const name = (specifier.propertyName ?? specifier.name).text
        const target = !specifier.isTypeOnly && modules.get(name)
        if (!target) remaining.push(specifier.getText(source))
        else
          direct.set(target, [
            ...(direct.get(target) ?? []),
            specifier.getText(source),
          ])
      }
      if (!direct.size) continue
      const replacements = [...direct].map(
        ([target, names]) =>
          `import { ${names.join(', ')} } from ${JSON.stringify(target)}`,
      )
      const retained = [
        clause.name?.text,
        remaining.length ? `{ ${remaining.join(', ')} }` : undefined,
      ]
        .filter(Boolean)
        .join(', ')
      if (retained)
        replacements.push(`import ${retained} from 'sax-design-vue'`)
      edits.push({
        start: block.offset + statement.getStart(source),
        end: block.offset + statement.end,
        code: `${replacements.join('\n')};`,
      })
    }
  }
  if (!edits.length) return
  let output = code
  for (const edit of edits.sort((a, b) => b.start - a.start))
    output = output.slice(0, edit.start) + edit.code + output.slice(edit.end)
  return { code: output, map: null }
}

export function documentationImportsPlugin(projectRoot: string): Plugin {
  let modules = documentationComponentModules(projectRoot)
  const docsRoot = `${path.resolve(projectRoot, 'docs').replaceAll('\\', '/')}/`
  let development = false
  return {
    name: 'sax-documentation-import-boundaries',
    enforce: 'pre',
    configResolved(config) {
      development = config.command === 'serve'
    },
    resolveId(id) {
      if (id === installerId) return resolvedInstaller
    },
    load(id) {
      if (id !== resolvedInstaller) return
      if (!development)
        return `import SaxDesignVue from 'sax-design-vue'\nexport default app => app.use(SaxDesignVue)`
      const globalNames = documentationGlobalComponents(projectRoot, modules)
      const registrations = [...modules]
        .filter(([name]) => !services.has(name) && globalNames.has(name))
        .map(
          ([name, file]) =>
            `app.component(${JSON.stringify(name)}, defineAsyncComponent(() => import(${JSON.stringify(file)}).then(module => module.${name})))`,
        )
      return `import { defineAsyncComponent } from 'vue'\nimport services from ${JSON.stringify(path.join(projectRoot, 'packages/sax-design-vue/plugin.ts').replaceAll('\\', '/'))}\nexport default app => {\nservices.forEach(service => app.use(service))\n${registrations.join('\n')}\n}`
    },
    configureServer(server) {
      const componentsRoot = path
        .join(projectRoot, 'packages/components')
        .replaceAll('\\', '/')
      const changed = (file: string) => {
        const normalized = file.replaceAll('\\', '/')
        if (
          !normalized.startsWith(`${componentsRoot}/`) ||
          !normalized.endsWith('/index.ts')
        )
          return
        const next = documentationComponentModules(projectRoot)
        if (JSON.stringify([...next]) === JSON.stringify([...modules])) return
        modules = next
        server.moduleGraph.invalidateAll()
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.add(componentsRoot)
      server.watcher
        .on('add', changed)
        .on('unlink', changed)
        .on('change', changed)
      server.httpServer?.once('close', () => {
        server.watcher
          .off('add', changed)
          .off('unlink', changed)
          .off('change', changed)
      })
    },
    transform(code, id) {
      if (!development || !id.replaceAll('\\', '/').startsWith(docsRoot)) return
      return rewriteDocumentationImports(code, id, modules)
    },
  }
}
