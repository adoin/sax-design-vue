import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import LogoLoading from '../src/logo-loading.vue'
import LoadingIcon from '../src/loading.vue'
import { LogoLoadingMotion } from '../src/logo-loading-motion'

describe('LogoLoading', () => {
  it.each(['square', 'rounded'] as const)(
    'clears %s strands at four boundaries and can resume during exit',
    (shape) => {
      const motion = new LogoLoadingMotion()
      motion.start()
      motion.advance(2300)
      motion.advance(137)
      motion.stop(true)
      expect(motion.phase).toBe('stopping')
      const initial = motion.frame(shape)
      motion.advance(275)
      const halfway = motion.frame(shape)
      expect(halfway.top).not.toBe(initial.top)
      expect(halfway.top).not.toBe('')
      motion.start()
      expect(motion.phase).toBe('running')
      motion.stop(true)
      motion.advance(550)
      expect(motion.frame(shape)).toEqual({
        phase: 'idle',
        top: '',
        bottom: '',
        topAccent: '',
        bottomAccent: '',
      })
      motion.reset()
      expect(motion.frame(shape).top).not.toBe('')
    },
  )

  it('preserves the logo and lifecycle while using a square running orbit', async () => {
    const motion = new LogoLoadingMotion()
    const logo = motion.frame()
    expect(motion.frame('square')).toEqual(logo)
    motion.start()
    motion.advance(2300)
    expect(motion.frame('square').topAccent).not.toBe(motion.frame().topAccent)
    motion.stop()
    motion.advance(3400)
    expect(motion.frame('square').top).toBe(logo.top)
    const wrapper = mount(LogoLoading, {
      props: { shape: 'square', reducedMotion: true },
    })
    await wrapper.vm.$nextTick()
    expect(
      wrapper.get('.s-logo-loading__ring').element.tagName.toLowerCase(),
    ).toBe('path')
    expect(wrapper.find('circle').exists()).toBe(false)
    wrapper.unmount()
  })

  let frame = 0

  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', () => ++frame)
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders scalable SVG logo paths with explicit sizing and status semantics', async () => {
    const wrapper = mount(LogoLoading, {
      props: { size: 32, label: 'Loading records' },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.classes()).toContain('s-logo-loading')
    expect(wrapper.attributes('style')).toContain(
      '--sax-logo-loading-size: 32px',
    )
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.attributes('data-phase')).toBe('starting')
    expect(wrapper.get('svg').attributes('viewBox')).toBe('0 0 84 84')
    expect(wrapper.findAll('path')).toHaveLength(4)
    expect(wrapper.find('canvas').exists()).toBe(false)
    wrapper.unmount()
  })

  it('uses a static ring for reduced motion and restores the S when inactive', async () => {
    const wrapper = mount(LogoLoading, {
      props: { active: true, reducedMotion: true },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.attributes('data-phase')).toBe('running')
    expect(wrapper.find('.s-logo-loading__ring').exists()).toBe(true)
    await wrapper.setProps({ active: false })
    expect(wrapper.attributes('data-phase')).toBe('idle')
    expect(wrapper.find('.s-logo-loading__ring').exists()).toBe(false)
    expect(wrapper.emitted('restored')).toHaveLength(1)
    wrapper.unmount()
  })

  it('keeps the internal loading icon on the same brand component', () => {
    const wrapper = mount(LoadingIcon)

    expect(wrapper.classes()).toContain('s-logo-loading')
    expect(wrapper.classes()).toContain('s-icon-loading')
    wrapper.unmount()
  })

  it('runs the complete start, orbit and reverse restoration state machine', () => {
    const changes: Array<[string, boolean]> = []
    const motion = new LogoLoadingMotion((phase, restored) =>
      changes.push([phase, restored]),
    )

    motion.start()
    motion.advance(2300)
    expect(motion.phase).toBe('running')
    const ring = motion.frame()
    expect(ring.top).toBe('')
    expect(ring.topAccent.startsWith('M')).toBe(true)
    motion.stop()
    motion.advance(3400)
    expect(motion.phase).toBe('idle')
    expect(motion.frame().top.startsWith('M')).toBe(true)
    expect(changes).toEqual([
      ['starting', false],
      ['running', false],
      ['stopping', false],
      ['idle', true],
    ])
  })
})
