import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import RadioGroup from '../src/radio-group.vue'

const wrappers: { unmount(): void }[] = []
const animations: {
  cancel: ReturnType<typeof vi.fn>
  onfinish: (() => void) | null
}[] = []
const animate = vi.fn(() => {
  const animation = { cancel: vi.fn(), onfinish: null }
  animations.push(animation)
  return animation
})
const originalAnimate = Object.getOwnPropertyDescriptor(
  SVGElement.prototype,
  'animate',
)
let reduced = false
const rect = (x: number, width: number) => ({
  x,
  y: 0,
  left: x,
  top: 0,
  right: x + width,
  bottom: width,
  width,
  height: width,
  toJSON: () => ({}),
})

beforeEach(() => {
  reduced = false
  vi.stubGlobal('matchMedia', () => ({
    matches: reduced,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
  Object.defineProperty(SVGElement.prototype, 'animate', {
    configurable: true,
    value: animate,
  })
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(
    function (this: Element) {
      const value = this.closest('label')?.querySelector('input')?.value
      const x = Math.max(0, ['a', 'b', 'c', 'd'].indexOf(value ?? '')) * 100
      return rect(x, this.tagName.toLowerCase() === 'circle' ? 8 : 20)
    },
  )
})

afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
  animations.length = 0
  animate.mockClear()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  if (originalAnimate)
    Object.defineProperty(SVGElement.prototype, 'animate', originalAnimate)
  else Reflect.deleteProperty(SVGElement.prototype, 'animate')
})

const setup = (type: 'default' | 'button', extra = {}) => {
  const wrapper = mount(RadioGroup, {
    props: {
      type,
      modelValue: 'a',
      options: [
        { label: 'A', value: 'a' },
        { label: 'B', value: 'b' },
      ],
      ...extra,
    },
  })
  wrappers.push(wrapper)
  return wrapper
}

describe('grouped radio dot motion', () => {
  it('visits enabled intermediate options in reverse order and skips disabled ones', async () => {
    const wrapper = setup('button', {
      direction: 'horizontal',
      modelValue: 'd',
      options: ['a', 'b', 'c', 'd'].map((value) => ({
        label: value,
        value,
        disabled: value === 'b',
      })),
    })
    await wrapper.setProps({ modelValue: 'a' })
    await nextTick()
    const frames = (animate.mock.calls as unknown as [Keyframe[]][])[0][0]
    expect(frames).toHaveLength(17)
    expect(frames[0].transform).toBe('translate(300px, 0px) scale(1)')
    expect(frames[8].transform).toBe('translate(200px, 0px) scale(0.88)')
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it.each(['default', 'button'] as const)(
    'hops through intermediate %s options without selecting them',
    async (type) => {
      const wrapper = setup(type, {
        direction: 'horizontal',
        options: ['a', 'b', 'c', 'd'].map((value) => ({ label: value, value })),
      })
      await wrapper.findAll('input')[3].setValue(true)
      await wrapper.setProps({ modelValue: 'd' })
      await nextTick()
      const frames = (animate.mock.calls as unknown as [Keyframe[]][])[0][0]
      expect(frames).toHaveLength(25)
      expect(frames[8].transform).toBe('translate(-200px, 0px) scale(0.88)')
      expect(frames[16].transform).toBe('translate(-100px, 0px) scale(0.88)')
      expect(frames[24].transform).toBe('translate(0, 0) scale(1)')
      expect(wrapper.emitted('change')).toEqual([['d']])
      expect(
        wrapper.findAll('input').map((input) => input.element.checked),
      ).toEqual([false, false, false, true])
    },
  )

  it('travels directly in vertical mode and cancels when direction changes', async () => {
    const wrapper = setup('button', {
      direction: 'vertical',
      options: ['a', 'b', 'c', 'd'].map((value) => ({ label: value, value })),
    })
    await wrapper.setProps({ modelValue: 'd' })
    await nextTick()
    expect(
      (animate.mock.calls as unknown as [Keyframe[]][])[0][0],
    ).toHaveLength(9)
    const flight = animations[0]
    await wrapper.setProps({ direction: 'horizontal' })
    expect(flight.cancel).toHaveBeenCalledOnce()
    expect(wrapper.classes()).toContain('is-horizontal')
    expect(wrapper.findAll('[data-radio-dot-moving]')).toHaveLength(0)
  })

  it.each(['default', 'button'] as const)(
    'moves the %s dot only after the controlled value is accepted',
    async (type) => {
      const wrapper = setup(type)
      expect(animate).not.toHaveBeenCalled()
      await wrapper.findAll('input')[1].setValue(true)
      expect(animate).not.toHaveBeenCalled()
      await wrapper.setProps({ modelValue: 'b' })
      await nextTick()
      expect(animate).toHaveBeenCalledTimes(1)
      const frames = (animate.mock.calls as unknown as [Keyframe[]][])[0][0]
      expect(frames[0].transform).toBe('translate(-100px, 0px) scale(1)')
      expect(frames.at(-1)?.transform).toBe('translate(0, 0) scale(1)')
      expect(wrapper.findAll('[data-radio-dot-moving]')).toHaveLength(2)
      animations[0].onfinish?.()
      expect(wrapper.findAll('[data-radio-dot-moving]')).toHaveLength(0)
    },
  )

  it('cancels an interrupted flight and cleans up on unmount', async () => {
    const wrapper = setup('button')
    await wrapper.setProps({ modelValue: 'b' })
    await nextTick()
    const first = animations[0]
    await wrapper.setProps({ modelValue: 'a' })
    await nextTick()
    expect(first.cancel).toHaveBeenCalledOnce()
    expect(animate).toHaveBeenCalledTimes(2)
    const last = animations[1]
    wrapper.unmount()
    wrappers.splice(wrappers.indexOf(wrapper), 1)
    expect(last.cancel).toHaveBeenCalledOnce()
  })

  it.each([{ animated: false }, { disabled: true }])(
    'keeps selection instantaneous with %o',
    async (extra) => {
      const wrapper = setup('button', extra)
      await wrapper.setProps({ modelValue: 'b' })
      await nextTick()
      expect(animate).not.toHaveBeenCalled()
      expect(wrapper.findAll('input')[1].element.checked).toBe(true)
    },
  )

  it('respects reduced motion', async () => {
    reduced = true
    const wrapper = setup('default')
    await wrapper.setProps({ modelValue: 'b' })
    await nextTick()
    expect(animate).not.toHaveBeenCalled()
  })
})
