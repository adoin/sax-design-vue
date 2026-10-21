import path from 'node:path'
import process from 'node:process'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import glob from 'fast-glob'
import ts from 'typescript'

const root = path.resolve(import.meta.dirname, '..')
const declarationRoot = path.join(root, 'dist/sax-design-vue/es')
const files = await glob('**/*.d.ts', { cwd: declarationRoot, onlyFiles: true })
if (!files.length)
  throw new Error('Build the library before checking declarations')
let bytes = 0
let largest = 0
for (const name of files) {
  const source = await readFile(path.join(declarationRoot, name), 'utf8')
  const commonjs = await readFile(
    path.join(root, 'dist/sax-design-vue/lib', name),
    'utf8',
  )
  if (commonjs !== source)
    throw new Error(`${name}: ESM and CJS declarations disagree`)
  bytes += Buffer.byteLength(source)
  largest = Math.max(largest, Buffer.byteLength(source))
  const file = ts.createSourceFile(name, source, ts.ScriptTarget.Latest, true)
  const visit = (node: ts.Node) => {
    if (ts.isStringLiteral(node)) {
      const parent = node.parent
      const moduleName =
        ((ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent)) &&
          parent.moduleSpecifier === node) ||
        (ts.isLiteralTypeNode(parent) && ts.isImportTypeNode(parent.parent))
      if (
        moduleName &&
        (node.text.startsWith('@vuesax-alpha/') ||
          /sax-design-vue\/es\/sax-design-vue\//.test(node.text) ||
          /^sax-design-vue\/.*\.ts$/.test(node.text))
      )
        throw new Error(`${name}: leaked source import ${node.text}`)
    }
    ts.forEachChild(node, visit)
  }
  visit(file)
}
if (bytes > 5_000_000 || largest > 250_000)
  throw new Error(
    `Declaration size budget exceeded: total=${bytes}, largest=${largest}`,
  )
const require = createRequire(import.meta.url)
const cli = require.resolve('vue-tsc/bin/vue-tsc.js')
const result = spawnSync(
  process.execPath,
  [cli, '--project', path.join(root, 'tsconfig.declaration-consumer.json')],
  { cwd: root, stdio: 'inherit', windowsHide: true },
)
if (result.error) throw result.error
if (result.status !== 0) process.exit(result.status ?? 1)
console.log(
  `Verified ${files.length} ESM declarations (${bytes} bytes; largest ${largest} bytes), public APIs and Table generics`,
)
