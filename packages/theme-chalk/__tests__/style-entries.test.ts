import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import glob from 'fast-glob'
import { afterEach, describe, expect, it } from 'vitest'

const script = path.resolve('scripts/verify-style-entries.mjs')
const prefix = path.join(tmpdir(), 'sax-style-entries-')
const fixtures: string[] = []

afterEach(async () => {
  for (const fixture of fixtures.splice(0)) {
    assert.ok(path.resolve(fixture).startsWith(path.resolve(prefix)))
    await rm(fixture, { recursive: true, force: true })
  }
})

async function fixture() {
  const root = await mkdtemp(prefix)
  fixtures.push(root)
  const put = async (file: string, content: string) => {
    const target = path.join(root, file)
    await mkdir(path.dirname(target), { recursive: true })
    await writeFile(target, content)
  }
  await put('package.json', JSON.stringify({ name: 'sax-design-vue' }))
  await put('theme-chalk/base.css', ':root{color:white}')
  await put('theme-chalk/vs-drawer.css', '.s-drawer{display:flex}')
  await put(
    'es/components/base/style/css.mjs',
    'import "sax-design-vue/theme-chalk/base.css";',
  )
  await put(
    'lib/components/base/style/css.js',
    'require("sax-design-vue/theme-chalk/base.css");',
  )
  await put(
    'es/components/drawer/style/css.mjs',
    'import "../../base/style/css.mjs"; import "sax-design-vue/theme-chalk/vs-drawer.css";',
  )
  await put(
    'lib/components/drawer/style/css.js',
    'require("../../base/style/css.js"); require("sax-design-vue/theme-chalk/vs-drawer.css");',
  )
  return { root, put }
}

const verify = (root: string) =>
  spawnSync(process.execPath, [script, root], { encoding: 'utf8' })

describe('on-demand style publication', () => {
  it('keeps source CSS entries free of the unpublished legacy directory', async () => {
    const entries = await glob('packages/components/*/style/css.ts')
    expect(entries.length).toBeGreaterThan(0)
    for (const entry of entries) {
      const code = await readFile(entry, 'utf8')
      for (const match of code.matchAll(
        /@vuesax-alpha\/theme-chalk\/([^'"]+)/g,
      )) {
        expect(match[1], entry).toMatch(
          /^(?:vs-[\w-]+|base|index|display)\.css$/,
        )
      }
    }
  })

  it('accepts complete ESM and CommonJS style dependency graphs', async () => {
    const { root } = await fixture()
    const result = verify(root)
    expect(result.status, result.stderr).toBe(0)
    expect(result.stdout).toContain(
      'Verified 4 ESM/CJS style entries and 6 file references',
    )
  })

  it.each([
    ['es', 'mjs', 'import'],
    ['lib', 'js', 'require'],
  ] as const)(
    'rejects unpublished CSS paths in %s entries',
    async (format, extension, syntax) => {
      const { root, put } = await fixture()
      const specifier = 'sax-design-vue/theme-chalk/css/drawer.css'
      await put(
        `${format}/components/drawer/style/css.${extension}`,
        syntax === 'import'
          ? `import "${specifier}";`
          : `require("${specifier}");`,
      )
      const result = verify(root)
      expect(result.status).not.toBe(0)
      expect(result.stderr).toContain(specifier)
    },
  )

  it('rejects missing relative component style dependencies', async () => {
    const { root, put } = await fixture()
    await put(
      'es/components/drawer/style/css.mjs',
      'import "../../missing/style/css.mjs";',
    )
    const result = verify(root)
    expect(result.status).not.toBe(0)
    expect(result.stderr).toContain('../../missing/style/css.mjs')
  })
})
