import path from 'node:path'
import ts from 'typescript'
import { PKG_NAME, PKG_PREFIX } from '@vuesax-alpha/build-constants'
import { buildConfig } from '../build-info'

/** Keep generated references inside the published module tree, not workspace source paths. */
export function declarationSpecifier(specifier: string) {
  const bundle = buildConfig.esm.bundle.path
  const entry = `${PKG_PREFIX}/${PKG_NAME}`
  const theme = `${PKG_PREFIX}/theme-chalk`
  const internal = specifier.startsWith(`${PKG_PREFIX}/`)
  let result = specifier
  if (specifier === theme || specifier.startsWith(`${theme}/`))
    result = `${PKG_NAME}/theme-chalk${specifier.slice(theme.length)}`
  else if (specifier === entry) result = bundle
  else if (specifier.startsWith(`${entry}/`))
    result = `${bundle}/${specifier.slice(entry.length + 1)}`
  else if (internal)
    result = `${bundle}/${specifier.slice(PKG_PREFIX.length + 1)}`
  if (internal || result.startsWith('.'))
    result = result.replace(/(?:\.d)?\.[jt]sx?$/, '')
  return result
}

/** Rewrite only module specifiers; public literal values and comments are preserved. */
export function normalizeDeclaration(source: string) {
  const file = ts.createSourceFile(
    'declaration.d.ts',
    source,
    ts.ScriptTarget.Latest,
    true,
  )
  const edits: { start: number; end: number; value: string }[] = []
  const visit = (node: ts.Node) => {
    if (ts.isStringLiteral(node)) {
      const parent = node.parent
      const moduleName =
        ((ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent)) &&
          parent.moduleSpecifier === node) ||
        (ts.isLiteralTypeNode(parent) && ts.isImportTypeNode(parent.parent)) ||
        (ts.isModuleDeclaration(parent) && parent.name === node) ||
        ts.isExternalModuleReference(parent)
      if (moduleName) {
        const rewritten = declarationSpecifier(node.text)
        if (rewritten !== node.text)
          edits.push({
            start: node.getStart(file),
            end: node.end,
            value: JSON.stringify(rewritten),
          })
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(file)
  for (const edit of edits.sort((a, b) => b.start - a.start))
    source = source.slice(0, edit.start) + edit.value + source.slice(edit.end)
  return source
}

/** The public package entry sources live in their own workspace but publish at the root. */
export function declarationOutputPath(relative: string) {
  const normalized = relative.replaceAll('\\', '/')
  const prefix = `${PKG_NAME}/`
  return path.normalize(
    normalized.startsWith(prefix)
      ? normalized.slice(prefix.length)
      : normalized,
  )
}
