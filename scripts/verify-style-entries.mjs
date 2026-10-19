import assert from 'node:assert/strict'
import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(process.argv[2] || 'dist/sax-design-vue')
const { name } = JSON.parse(
  await readFile(path.join(root, 'package.json'), 'utf8'),
)
const missing = []
let entries = 0
let references = 0

for (const [format, extension] of [
  ['es', 'mjs'],
  ['lib', 'js'],
]) {
  const components = path.join(root, format, 'components')
  let formatEntries = 0
  for (const component of await readdir(components, { withFileTypes: true })) {
    if (!component.isDirectory()) continue
    const entry = path.join(
      components,
      component.name,
      'style',
      `css.${extension}`,
    )
    let code
    try {
      code = await readFile(entry, 'utf8')
    } catch (error) {
      if (error.code === 'ENOENT') continue
      throw error
    }
    formatEntries++
    entries++
    for (const match of code.matchAll(
      /(?:\bimport\s*(?:[^'";]*?\bfrom\s*)?|\brequire\s*\(\s*)['"]([^'"]+)['"]/g,
    )) {
      const specifier = match[1]
      const target = specifier.startsWith(`${name}/`)
        ? path.resolve(root, specifier.slice(name.length + 1))
        : specifier.startsWith('.')
          ? path.resolve(path.dirname(entry), specifier)
          : undefined
      if (!target) continue
      references++
      try {
        assert.ok((await stat(target)).isFile())
      } catch {
        missing.push(`${path.relative(root, entry)} -> ${specifier}`)
      }
    }
  }
  assert.ok(formatEntries > 0, `No ${format} on-demand CSS entries found`)
}

assert.equal(
  missing.length,
  0,
  `Unresolved on-demand style imports:\n${missing.join('\n')}`,
)
assert.ok(references > 0, 'No on-demand style references found')
console.log(
  `Verified ${entries} ESM/CJS style entries and ${references} file references`,
)
