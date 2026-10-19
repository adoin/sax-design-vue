import { afterEach, describe, expect, it, vi } from 'vitest'

const names = ['registry-test:esm', 'registry-test:cjs']
afterEach(() => {
  const scope = globalThis as typeof globalThis & {
    [key: symbol]: Map<string, unknown> | undefined
  }
  for (const name of names) {
    scope[Symbol.for('sax-design-vue-iconify.registry.v1')]?.delete(name)
  }
  vi.resetModules()
})

describe('shared icon registry', () => {
  it('keeps registrations visible to independently evaluated module copies', async () => {
    const first = await import('../src/index')
    const data = {
      body: '<path d="M0 0h16v16H0z"/>',
      attributes: { viewBox: '0 0 16 16' },
    }
    first.addIconData(names[0], data)
    vi.resetModules()
    const second = await import('../src/index')
    expect(second.getIconData(names[0])).toBe(data)
    second.addIconDataRecord({ [names[1]]: data })
    expect(first.getIconData(names[1])).toBe(data)
  })
})
