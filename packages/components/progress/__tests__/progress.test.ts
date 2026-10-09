import { h, nextTick } from 'vue'
import { config, enableAutoUnmount, mount } from '@vue/test-utils'
import { renderToString } from 'vue/server-renderer'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Progress from '../src/progress.vue'
import { progressTextures } from '../src/progress'
import { progressTextureAssets } from '../src/progress-textures'

enableAutoUnmount(afterEach)
const originalStubs = config.global.stubs
beforeEach(() => {
  config.global.stubs = { ...originalStubs, STooltip: { template: '<slot />' } }
  vi.useFakeTimers()
  vi.stubGlobal('IntersectionObserver', undefined)
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
})
afterEach(() => {
  config.global.stubs = originalStubs
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
const settle = async () => {
  await nextTick()
  await vi.advanceTimersByTimeAsync(650)
  await nextTick()
}

describe('Progress fill textures', () => {
  it('scales every texture equally in both axes from the actual rendered height', async () => {
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(8)
    const bubble = mount(Progress, {
      props: { texture: 'bubbles', percent: 60, height: 32 },
    })
    const sea = mount(Progress, {
      props: { texture: 'waves', percent: 60, height: 32 },
    })
    const star = mount(Progress, {
      props: { texture: 'sparkle', percent: 60, height: 32 },
    })
    await settle()
    expect(bubble.get('.s-progress__texture').attributes('style')).toContain(
      '27.5px 16px',
    )
    expect(sea.get('pattern').attributes('patternTransform')).toBe('scale(0.2)')
    expect(star.get('pattern').attributes('patternTransform')).toBe(
      'scale(0.2)',
    )
  })
  it('uses a smooth closed wave cycle with alternating crest and trough phases', async () => {
    const wrapper = mount(Progress, {
      props: { texture: 'waves', percent: 60 },
    })
    await settle()
    const morphs = wrapper.findAll('animate[attributeName="d"]')
    const frames = morphs[1].attributes('values')!.split(';')
    expect(frames).toHaveLength(49)
    expect(frames[0]).toBe(frames.at(-1))
    expect(morphs[1].attributes('calcMode')).toBe('linear')
    const points = frames[12]!.match(/-?\d+(?:\.\d+)?/g)!.map(Number)
    expect(points[7]).toBeLessThan(points[37])
    const landed = frames[36]!
      .match(/-?\d+(?:\.\d+)?/g)!
      .map(Number)
      .slice(2, 32)
    for (let index = 2; index < landed.length; index += 2)
      expect(landed[index]).toBeGreaterThanOrEqual(landed[index - 2])
    await wrapper.setProps({ textureAnimated: false })
    expect(wrapper.find('animate').exists()).toBe(false)
  })
  it('isolates inline sparkle pattern IDs and phase timing between instances', async () => {
    const first = mount(Progress, {
      props: { texture: 'sparkle', percent: 60, textureDuration: 1200 },
    })
    const second = mount(Progress, {
      props: { texture: 'sparkle', percent: 60, textureDuration: 4000 },
    })
    await settle()
    const firstId = first.get('pattern').attributes('id')
    const secondId = second.get('pattern').attributes('id')
    expect(firstId).not.toBe(secondId)
    expect(first.get('rect').attributes('fill')).toBe(`url(#${firstId})`)
    expect(second.get('rect').attributes('fill')).toBe(`url(#${secondId})`)
    expect(first.findAll('.s-progress__sparkle-star')).toHaveLength(5)
    const delay = (element: Element) =>
      Number.parseFloat(
        (element as SVGElement).style.getPropertyValue(
          '--sax-progress-star-delay',
        ),
      )
    expect(
      delay(first.findAll('.s-progress__sparkle-star')[1].element),
    ).toBeCloseTo(-408)
    expect(
      delay(second.findAll('.s-progress__sparkle-star')[1].element),
    ).toBeCloseTo(-1360)
  })
  it('keeps the default fill plain and allocates no motion observers', async () => {
    const observer = vi.fn()
    vi.stubGlobal('IntersectionObserver', observer)
    const wrapper = mount(Progress, { props: { percent: 65 } })
    await settle()
    expect(wrapper.find('.s-progress__texture').exists()).toBe(false)
    expect(
      wrapper.get('.s-progress__foreground').attributes('style'),
    ).toContain('width: 65%')
    expect(observer).not.toHaveBeenCalled()
  })
  it.each(progressTextures.filter((value) => value !== 'default'))(
    'clips the %s texture inside the foreground and keeps it decorative',
    async (texture) => {
      const wrapper = mount(Progress, {
        props: {
          texture,
          percent: 68,
          height: 24,
          textureDuration: 1200,
          textureOpacity: 0.4,
        },
      })
      await settle()
      const overlay = wrapper.get(
        '.s-progress__foreground .s-progress__texture',
      )
      expect(overlay.classes()).toContain(`s-progress__texture--${texture}`)
      expect(overlay.attributes('aria-hidden')).toBe('true')
      if (texture === 'sparkle' || texture === 'waves')
        expect(overlay.find('pattern').exists()).toBe(true)
      else expect(overlay.attributes('style')).toContain('data:image/svg+xml')
      expect(overlay.attributes('style')).toContain('1200ms')
      expect(overlay.attributes('style')).toContain('opacity: 0.4')
      expect(wrapper.findAll('filter')).toHaveLength(0)
      expect(
        wrapper.get('[role="progressbar"]').attributes('aria-valuenow'),
      ).toBe('68')
    },
  )
  it('uses one texture only in the indeterminate moving segment', async () => {
    const wrapper = mount(Progress, {
      props: {
        texture: 'bubbles',
        percent: 80,
        indeterminate: true,
        'aria-label': 'Uploading',
      },
    })
    await settle()
    expect(
      wrapper.find('.s-progress__foreground .s-progress__texture').exists(),
    ).toBe(false)
    expect(
      wrapper.findAll('.s-progress__indeterminate .s-progress__texture'),
    ).toHaveLength(1)
    expect(
      wrapper.get('.s-progress__foreground').attributes('style'),
    ).toContain('width: 0%')
    const root = wrapper.get('[role="progressbar"]')
    expect(root.attributes('aria-valuenow')).toBeUndefined()
    expect(root.attributes('aria-label')).toBe('Uploading')
  })
  it('pauses outside the viewport, on a hidden page and at completion, releasing observers', async () => {
    let update: (entries: Array<{ isIntersecting: boolean }>) => void = () => {}
    const disconnect = vi.fn()
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: typeof update) {
          update = callback
        }
        observe = vi.fn()
        disconnect = disconnect
      },
    )
    const wrapper = mount(Progress, {
      props: { texture: 'waves', percent: 60 },
    })
    await settle()
    const root = wrapper.get('.s-progress')
    expect(root.classes()).toContain('is-motion-paused')
    update([{ isIntersecting: true }])
    await nextTick()
    expect(root.classes()).not.toContain('is-motion-paused')
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    document.dispatchEvent(new Event('visibilitychange'))
    await nextTick()
    expect(root.classes()).toContain('is-motion-paused')
    await wrapper.setProps({ percent: 100 })
    expect(disconnect).toHaveBeenCalledTimes(1)
    expect(root.classes()).toContain('is-motion-paused')
    expect(wrapper.find('.s-progress__texture').exists()).toBe(true)
  })
  it.each([{ textureAnimated: false }, { textureDuration: 0 }])(
    'supports static texture settings %j without observers',
    async (options) => {
      const observer = vi.fn()
      vi.stubGlobal('IntersectionObserver', observer)
      const wrapper = mount(Progress, {
        props: { texture: 'waves', percent: 50, ...options },
      })
      await settle()
      expect(wrapper.get('.s-progress__texture').classes()).not.toContain(
        'is-animated',
      )
      expect(observer).not.toHaveBeenCalled()
    },
  )
  it('honors reduced motion immediately and removes listeners on teardown', async () => {
    const preference = {
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    vi.stubGlobal('matchMedia', () => preference)
    const wrapper = mount(Progress, {
      props: { texture: 'sparkle', percent: 50 },
    })
    await nextTick()
    expect(
      wrapper.get('.s-progress__foreground').attributes('style'),
    ).toContain('width: 50%')
    expect(wrapper.get('.s-progress').classes()).toContain('is-reduced-motion')
    expect(vi.getTimerCount()).toBe(0)
    wrapper.unmount()
    expect(preference.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    )
  })
  it('normalizes values and supports complete CSS colors and height units', async () => {
    const wrapper = mount(Progress, {
      props: {
        texture: 'waves',
        percent: 140,
        height: '1.5rem',
        color: '#ff0000',
      },
    })
    await settle()
    const root = wrapper.get('.s-progress')
    expect(root.attributes('style')).toContain('height: 1.5rem')
    expect(root.attributes('aria-valuenow')).toBe('100')
    expect(
      (wrapper.get('.s-progress__foreground').element as HTMLElement).style
        .background,
    ).toBe('rgb(255, 0, 0)')
    await wrapper.setProps({ percent: -10 })
    expect(root.attributes('aria-valuenow')).toBe('0')
    expect(wrapper.find('.s-progress__texture').exists()).toBe(false)
    await wrapper.setProps({ percent: Number.NaN })
    expect(root.attributes('aria-valuenow')).toBe('0')
  })
  it('renders on the server without browser resources and shares immutable valid SVG tiles', async () => {
    const html = await renderToString(
      h(Progress, { texture: 'bubbles', percent: 70 }),
    )
    expect(html).toContain('role="progressbar"')
    expect(vi.getTimerCount()).toBe(0)
    for (const tile of Object.values(progressTextureAssets)) {
      const svg = decodeURIComponent(tile.image.split(',')[1])
      const xml = new DOMParser().parseFromString(svg, 'image/svg+xml')
      expect(xml.querySelector('parsererror')).toBeNull()
      expect(xml.documentElement.getAttribute('width')).toBe(String(tile.width))
    }
  })
})
