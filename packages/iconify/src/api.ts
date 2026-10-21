import { getIconData as readIcon } from '@iconify/utils/lib/icon-set/get-icon'
import { iconToSVG } from '@iconify/utils/lib/svg/build'
import { DEFAULT_API_ENDPOINTS, addIconDataRecord, getIconData } from './index'
import type { IconifyJSON } from '@iconify/types'
import type { SaxIconData } from './index'

export interface SaxIconLoadOptions {
  /** Trusted Iconify-compatible API endpoint. */
  baseUrl?: string
  /** Public prefixes mapped to Iconify collection names. */
  collections?: Record<string, string>
  timeout?: number
  signal?: AbortSignal
}

/** Load missing icons explicitly. SIcon itself never initiates a request. */
export async function loadIconData(
  names: readonly string[],
  options: SaxIconLoadOptions = {},
) {
  const collections: Record<string, string> = {
    cb: 'carbon',
    ...options.collections,
  }
  const groups = new Map<string, Map<string, string[]>>()
  for (const name of new Set(names)) {
    if (getIconData(name)) continue
    const match = /^([a-z0-9-]+):([a-z0-9-]+)$/i.exec(name)
    if (!match) continue
    const prefix = collections[match[1]] || match[1]
    const group = groups.get(prefix) || new Map<string, string[]>()
    group.set(match[2], [...(group.get(match[2]) || []), name])
    groups.set(prefix, group)
  }
  const requests: Promise<void>[] = []
  for (const [prefix, icons] of groups) {
    const keys = [...icons.keys()]
    for (let offset = 0; offset < keys.length; offset += 50) {
      requests.push(
        (async () => {
          const selected = keys.slice(offset, offset + 50)
          const controller = new AbortController()
          const abort = () => controller.abort()
          if (options.signal?.aborted) abort()
          options.signal?.addEventListener('abort', abort, { once: true })
          const timeout = setTimeout(abort, options.timeout ?? 10000)
          try {
            const url = new URL(
              `${prefix}.json`,
              `${(options.baseUrl || DEFAULT_API_ENDPOINTS[0]).replace(/\/+$/, '')}/`,
            )
            url.searchParams.set('icons', selected.join(','))
            const response = await fetch(url, { signal: controller.signal })
            if (!response.ok)
              throw new Error(
                `[sax-icons] ${response.status} loading ${prefix}`,
              )
            const collection = (await response.json()) as IconifyJSON
            if (controller.signal.aborted)
              throw new Error('[sax-icons] Request aborted')
            const records: Record<string, SaxIconData> = {}
            let missing = false
            for (const name of selected) {
              const icon = readIcon(collection, name)
              if (!icon) {
                missing = true
                continue
              }
              const rendered = iconToSVG(icon, { width: '1em', height: '1em' })
              for (const publicName of icons.get(name)!)
                records[publicName] = rendered
            }
            addIconDataRecord(records)
            if (missing)
              throw new Error(
                `[sax-icons] API did not return every requested icon in ${prefix}`,
              )
          } finally {
            clearTimeout(timeout)
            options.signal?.removeEventListener('abort', abort)
          }
        })(),
      )
    }
  }
  const results = await Promise.allSettled(requests)
  const failed = results.find((result) => result.status === 'rejected')
  if (failed?.status === 'rejected') throw failed.reason
}
