import { createRequire } from 'node:module'
import { readFile } from 'node:fs/promises'
import fg from 'fast-glob'
import { getIconData } from '@iconify/utils'
import iconConfig from '../sax-icons.config'

import type { IconifyJSON } from '@iconify/types'

async function main() {
  const require = createRequire(import.meta.url)
  const sources = await fg(
    ['{docs,packages,play}/**/*.{vue,ts,tsx,js,jsx,md}', 'sax-icons.config.ts'],
    {
      ignore: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.temp/**',
        'packages/iconify/__tests__/**',
      ],
    },
  )

  const configuredPrefixes = Object.keys(iconConfig.collections)
  const iconPattern = new RegExp(
    `(?:${configuredPrefixes.join('|')}):[a-z0-9-]+`,
    'gi',
  )
  const namesByFile = new Map<string, Set<string>>()

  for (const file of sources) {
    const code = await readFile(file, 'utf8')
    const names = new Set(code.match(iconPattern) || [])
    if (names.size) namesByFile.set(file, names)
  }

  const collectionCache = new Map<string, IconifyJSON>()
  const failures: string[] = []

  for (const [file, names] of namesByFile) {
    for (const name of names) {
      const separator = name.indexOf(':')
      const publicPrefix = name.slice(0, separator)
      const iconName = name.slice(separator + 1)
      const collectionConfig = iconConfig.collections[publicPrefix]
      const sourcePrefix =
        typeof collectionConfig === 'string'
          ? collectionConfig
          : collectionConfig?.source

      if (!sourcePrefix) {
        failures.push(`${file}: unregistered collection in ${name}`)
        continue
      }

      let iconSet = collectionCache.get(sourcePrefix)
      if (!iconSet) {
        const filename = require.resolve(
          `@iconify-json/${sourcePrefix}/icons.json`,
        )
        iconSet = JSON.parse(await readFile(filename, 'utf8')) as IconifyJSON
        collectionCache.set(sourcePrefix, iconSet)
      }

      if (!getIconData(iconSet, iconName)) {
        failures.push(`${file}: ${name} does not exist`)
      }
    }
  }

  if (failures.length) {
    console.error(failures.join('\n'))
    process.exitCode = 1
  } else {
    const iconCount = new Set(
      Array.from(namesByFile.values()).flatMap((names) => Array.from(names)),
    ).size
    console.log(
      `Validated ${iconCount} Iconify names in ${namesByFile.size} files.`,
    )
  }
}

void main()
