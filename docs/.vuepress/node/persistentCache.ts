import { createHash } from 'node:crypto'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import path from 'node:path'

export const contentKey = (value: string) =>
  createHash('sha256').update(value).digest('hex')
export const fileKey = (file: string) => {
  const stat = statSync(file)
  return `${file}:${stat.size}:${stat.mtimeMs}:${stat.ctimeMs}`
}

/** Content-addressed generated data only; no source or user state is stored. */
export class PersistentCache {
  private entries = new Map<string, unknown>()
  private dirty = false
  hits = 0
  misses = 0

  constructor(
    private file: string,
    private version: string,
  ) {
    try {
      const data = JSON.parse(readFileSync(file, 'utf8'))
      if (
        data.version === version &&
        data.entries &&
        typeof data.entries === 'object'
      )
        this.entries = new Map(Object.entries(data.entries))
    } catch {
      /* A missing or damaged cache is a cold start. */
    }
  }

  get<T>(key: string, compute: () => T): T {
    if (this.entries.has(key)) {
      this.hits++
      return this.entries.get(key) as T
    }
    this.misses++
    const value = compute()
    this.entries.set(key, value)
    this.dirty = true
    if (this.entries.size > 10000)
      this.entries.delete(this.entries.keys().next().value!)
    return value
  }

  flush() {
    if (!this.dirty) return
    mkdirSync(path.dirname(this.file), { recursive: true })
    const temporary = `${this.file}.${process.pid}.tmp`
    writeFileSync(
      temporary,
      JSON.stringify({
        version: this.version,
        entries: Object.fromEntries(this.entries),
      }),
    )
    renameSync(temporary, this.file)
    this.dirty = false
  }
}

const caches = new Map<string, PersistentCache>()
export const documentationCache = (name: string, sources: string[]) => {
  const version = contentKey(
    [...sources, path.resolve(import.meta.dirname, '../../../pnpm-lock.yaml')]
      .filter(existsSync)
      .map((file) => readFileSync(file, 'utf8'))
      .join('\n'),
  )
  const key = `${name}:${version}`
  if (!caches.has(key))
    caches.set(
      key,
      new PersistentCache(
        path.resolve(import.meta.dirname, '../.cache/sax-data', `${name}.json`),
        version,
      ),
    )
  return caches.get(key)!
}
export const flushDocumentationCaches = () => {
  for (const cache of caches.values()) cache.flush()
}
