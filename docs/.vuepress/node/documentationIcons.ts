import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

/** Runtime-compiled examples cannot use Vite's static icon-data transform. */
export const collectDocumentationIconNames = (
  roots: string[],
  collections: readonly string[],
  safelist: readonly string[] = [],
) => {
  const names = new Set(safelist)
  const prefixes = new Set(collections)
  const visit = (directory: string) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name)
      if (entry.isDirectory()) {
        if (
          !entry.name.startsWith('.') &&
          !['node_modules', '__tests__', 'dist'].includes(entry.name)
        )
          visit(path)
      } else if (
        /\.(?:vue|ts|tsx)$/.test(entry.name) &&
        !/\.(?:test|spec)\./.test(entry.name)
      ) {
        const source = readFileSync(path, 'utf8')
        for (const match of source.matchAll(
          /(['"`])([a-z][a-z0-9-]*):([a-z0-9]+(?:-[a-z0-9]+)*)\1/g,
        )) {
          if (prefixes.has(match[2])) names.add(`${match[2]}:${match[3]}`)
        }
      }
    }
  }
  roots.forEach(visit)
  return [...names].sort()
}
