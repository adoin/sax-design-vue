import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Text from '../src/text.vue'

describe('Text', () => {
  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('uses lineClamp 1 for single-line truncation', () => {
    const wrapper = mount(Text, {
      props: { content: 'One line', lineClamp: 1 },
    })

    expect(wrapper.classes()).toContain('is-ellipsis')
    expect(wrapper.classes()).not.toContain('is-clamp')
    expect(wrapper.attributes('title')).toBe('One line')
  })

  it('uses lineClamp values above 1 for multi-line truncation', () => {
    const wrapper = mount(Text, {
      props: { content: 'Two lines', lineClamp: 2 },
    })

    expect(wrapper.classes()).toContain('is-clamp')
    expect(wrapper.attributes('style')).toContain('-webkit-line-clamp: 2')
  })

  it('does not truncate when lineClamp is false', () => {
    const wrapper = mount(Text, {
      props: { content: 'Full text', lineClamp: false },
    })

    expect(wrapper.classes()).not.toContain('is-ellipsis')
    expect(wrapper.classes()).not.toContain('is-clamp')
    expect(wrapper.attributes('title')).toBeUndefined()
  })

  it('keeps the default effect inert and exposes shimmer as an opt-in class', async () => {
    const wrapper = mount(Text, {
      props: { content: 'Generating response' },
    })

    expect(wrapper.props('effect')).toBe('default')
    expect(wrapper.classes()).not.toContain('is-shimmer')
    expect(wrapper.text()).toBe('Generating response')

    await wrapper.setProps({ effect: 'shimmer', status: 'primary' })
    expect(wrapper.classes()).toContain('is-shimmer')
    expect(wrapper.classes()).toContain('s-text--primary')
    expect(wrapper.text()).toBe('Generating response')
  })

  it.each(['rainbow', 'neon', 'shadow'] as const)(
    'exposes the %s text effect without changing its accessible text',
    (effect) => {
      const wrapper = mount(Text, {
        props: { content: 'Visual text', effect },
      })

      expect(wrapper.classes()).toContain(`is-${effect}`)
      expect(wrapper.text()).toBe('Visual text')
      expect(wrapper.attributes('data-text')).toBe(
        effect === 'shadow' ? 'Visual text' : undefined,
      )
    },
  )

  it('types content character by character and removes the caret on finish', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Text, {
      props: { content: '你好', effect: 'typing' },
    })
    await nextTick()

    expect(wrapper.text()).toBe('')
    expect(wrapper.find('.s-text__typing-caret').exists()).toBe(true)
    expect(wrapper.attributes('aria-label')).toBe('你好')
    expect(wrapper.attributes('aria-busy')).toBe('true')

    vi.advanceTimersByTime(40)
    await nextTick()
    expect(wrapper.text()).toBe('你')

    vi.advanceTimersByTime(40)
    await nextTick()
    expect(wrapper.text()).toBe('你好')
    expect(wrapper.find('.s-text__typing-caret').exists()).toBe(false)
    expect(wrapper.attributes('aria-busy')).toBeUndefined()
  })

  it('shows the full text immediately when reduced motion is preferred', async () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }))
    const wrapper = mount(Text, {
      props: { content: 'Accessible text', effect: 'typing' },
    })

    await nextTick()
    expect(wrapper.text()).toBe('Accessible text')
    expect(wrapper.find('.s-text__typing-caret').exists()).toBe(false)
  })

  it('cancels the previous typing run when content changes', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Text, {
      props: { content: 'Old', effect: 'typing' },
    })
    await nextTick()

    await wrapper.setProps({ content: 'New' })
    await nextTick()
    vi.advanceTimersByTime(120)
    await nextTick()

    expect(wrapper.text()).toBe('New')
    expect(vi.getTimerCount()).toBe(0)
  })
})
