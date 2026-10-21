// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadIconData } from '../src/api'
import { addIconData, getIconData } from '../src'

afterEach(() => vi.unstubAllGlobals())

describe('explicit runtime icon loading', () => {
  it('batches aliases by source collection and renders transformed aliases correctly', async () => {
    const fetch = vi.fn(async (input: URL) => {
      expect(input.pathname).toBe('/sample.json')
      expect(input.searchParams.get('icons')).toBe('one,turned')
      return new Response(
        JSON.stringify({
          prefix: 'sample',
          width: 32,
          height: 16,
          icons: { one: { body: '<path fill="red" d="M1 1h8v8z"/>' } },
          aliases: { turned: { parent: 'one', rotate: 1 } },
        }),
      )
    })
    vi.stubGlobal('fetch', fetch)
    await loadIconData(
      ['apifixture:one', 'apialias:one', 'apifixture:turned'],
      {
        baseUrl: 'https://icons.example/',
        collections: { apifixture: 'sample', apialias: 'sample' },
      },
    )
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(getIconData('apifixture:one')?.body).toContain('fill="red"')
    expect(getIconData('apifixture:turned')?.attributes.viewBox).toBe(
      '0 0 16 32',
    )
    await loadIconData(['apifixture:one'])
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('keeps large selections in bounded batches', async () => {
    const fetch = vi.fn(async (input: URL) => {
      const names = input.searchParams.get('icons')!.split(',')
      expect(names.length).toBeLessThanOrEqual(50)
      return new Response(
        JSON.stringify({
          prefix: 'apibatch',
          width: 24,
          height: 24,
          icons: Object.fromEntries(
            names.map((name) => [name, { body: '<circle r="4"/>' }]),
          ),
        }),
      )
    })
    vi.stubGlobal('fetch', fetch)
    await loadIconData(
      Array.from({ length: 121 }, (_, index) => `apibatch:icon-${index}`),
    )
    expect(fetch).toHaveBeenCalledTimes(3)
    expect(getIconData('apibatch:icon-120')).toBeDefined()
  })

  it('does not fetch registered data or unresolved local names', async () => {
    addIconData('api-cache-local', {
      body: '<path/>',
      attributes: { viewBox: '0 0 24 24' },
    })
    const fetch = vi.fn()
    vi.stubGlobal('fetch', fetch)
    await loadIconData(['api-cache-local', 'unregistered-local'])
    expect(fetch).not.toHaveBeenCalled()
  })

  it('allows failed requests to retry instead of caching failures', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response('', { status: 503 }))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            prefix: 'apiretry',
            icons: { retry: { body: '<path/>', width: 24, height: 24 } },
          }),
        ),
      )
    vi.stubGlobal('fetch', fetch)
    await expect(loadIconData(['apiretry:retry'])).rejects.toThrow('503')
    await loadIconData(['apiretry:retry'])
    expect(getIconData('apiretry:retry')).toBeDefined()
  })

  it('aborts pending fetches through the caller signal', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_input, options) =>
          new Promise((_resolve, reject) => {
            options.signal.addEventListener(
              'abort',
              () => reject(new Error('aborted')),
              { once: true },
            )
          }),
      ),
    )
    const controller = new AbortController()
    const pending = loadIconData(['apiabort:pending'], {
      signal: controller.signal,
    })
    controller.abort()
    await expect(pending).rejects.toThrow('aborted')
    expect(getIconData('apiabort:pending')).toBeUndefined()
  })
})
