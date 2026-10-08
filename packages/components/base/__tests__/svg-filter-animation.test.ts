import { mount } from '@vue/test-utils'
import { afterEach, expect, it, vi } from 'vitest'
import {
  defineSvgFilterAnimation,
  svgFilterAnimations,
} from '@vuesax-alpha/utils'
import SvgFilterAnimation from '../src/svg-filter-animation.vue'

afterEach(() => vi.restoreAllMocks())
it('plays a separately declared blur module through the common timeline', async () => {
  let callback: FrameRequestCallback | undefined
  vi.spyOn(window.performance, 'now').mockReturnValue(0)
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((frame) => {
    callback = frame
    return 1
  })
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
  const module = defineSvgFilterAnimation({
    name: 'component-blur-test',
    duration: 100,
    definition: {
      key: 'component-blur-test',
      nodes: [{ tag: 'feGaussianBlur', attrs: { stdDeviation: 0 } }],
    },
    bindings: [{ path: [0], attribute: 'stdDeviation', channel: 'blur' }],
    frame: (progress) => ({ blur: progress * 8 }),
  })
  svgFilterAnimations.add(module)
  const first = mount(SvgFilterAnimation, {
    props: { animation: module.name, filterId: 'blur-first', progress: 0 },
  })
  const second = mount(SvgFilterAnimation, {
    props: { animation: module.name, filterId: 'blur-second', progress: 0 },
  })
  try {
    expect(first.find('filter').exists()).toBe(false)
    expect(second.find('filter').exists()).toBe(false)
    await first.setProps({ progress: 1 })
    expect(first.get('filter').element.namespaceURI).toBe(
      'http://www.w3.org/2000/svg',
    )
    callback?.(50)
    expect(
      Number(first.get('feGaussianBlur').attributes('stdDeviation')),
    ).toBeGreaterThan(0)
    expect(second.find('filter').exists()).toBe(false)
    callback?.(100)
    await Promise.resolve()
    expect(first.find('filter').exists()).toBe(false)
    expect(first.emitted('settled')?.at(-1)).toEqual([1])
  } finally {
    first.unmount()
    second.unmount()
  }
})
