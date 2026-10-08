import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileKey } from './persistentCache'
import type { PersistentCache } from './persistentCache'

/** Runtime-compiled examples cannot use Vite's static icon-data transform. */
export const collectDocumentationIconNames = (
  roots: string[],
  collections: readonly string[],
  safelist: readonly string[] = [],
  cache?: PersistentCache,
) => {
  const names = new Set(safelist)
  const prefixes = new Set(collections)
  const collectFile = (file: string) => {
    const scan = () =>
      Array.from(
        readFileSync(file, 'utf8').matchAll(
          /(['"`])([a-z][a-z0-9-]*):([a-z0-9]+(?:-[a-z0-9]+)*)\1/g,
        ),
        (match) => `${match[2]}:${match[3]}`,
      )
    const found = cache ? cache.get(`icons:${fileKey(file)}`, scan) : scan()
    for (const name of found)
      if (prefixes.has(name.split(':')[0])) names.add(name)
  }
  const visit = (directory: string) => {
    if (statSync(directory).isFile()) {
      collectFile(directory)
      return
    }
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
        collectFile(path)
      }
    }
  }
  roots.forEach(visit)
  return [...names].sort()
}
