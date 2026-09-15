import { readFile } from 'node:fs/promises'
import path from 'node:path'
import glob from 'fast-glob'
import { describe, expect, it } from 'vitest'
import { builtinCarbonIcons } from '../src/builtin-carbon-icons'

describe('built-in component icon fallbacks', () => {
  it('covers every hard-coded Carbon icon used by component source', async () => {
    const files = (
      await glob('packages/components/*/src/**/*.{ts,vue}', {
        cwd: process.cwd(),
      })
    ).filter(
      (file) =>
        !file.endsWith('icon-picker/src/icon-picker.ts') &&
        !file.endsWith('icon/src/builtin-carbon-icons.ts') &&
        !file.endsWith('icon-picker/src/default-carbon-icons.ts'),
    )
    const expected = new Set<string>()
    for (const file of files) {
      const source = await readFile(path.resolve(process.cwd(), file), 'utf8')
      for (const match of source.matchAll(/cb:([a-z0-9-]+)/gi))
        expected.add(match[1])
    }

    expect(Object.keys(builtinCarbonIcons).sort()).toEqual([...expected].sort())
  }, 15_000)
})
