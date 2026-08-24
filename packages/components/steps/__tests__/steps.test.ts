import { h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import zhCn from '@vuesax-alpha/locale/lang/zh-cn'
import { localeContextKey } from '@vuesax-alpha/hooks'
import Steps from '../src/steps.vue'

import type { StepItem, StepStatus } from '../src/steps'

const items: StepItem[] = [
  { key: 'account', title: 'Account' },
  { key: 'profile', title: 'Profile' },
  { key: 'ready', title: 'Ready' },
]

describe('Steps', () => {
  it('renders the focus rail and derives progress states', () => {
    const wrapper = mount(Steps, {
      props: { active: 1, items },
    })

    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        's-steps--horizontal',
        's-steps--rail',
        's-steps--default',
        'is-responsive',
      ]),
    )
    expect(wrapper.findAll('.s-steps__item')[0].classes()).toContain(
      's-steps__item--finish',
    )
    expect(wrapper.findAll('.s-steps__item')[1].classes()).toContain(
      's-steps__item--process',
    )
    expect(wrapper.findAll('.s-steps__item')[2].classes()).toContain(
      's-steps__item--wait',
    )
    expect(wrapper.findAll('button')[1].attributes('aria-current')).toBe('step')
    const activeMain = wrapper.findAll('.s-steps__main')[1]
    expect(activeMain.element.children[0].classList).toContain('s-steps__title')
    expect(activeMain.get('.s-steps__status').text()).toContain('2 / 3')
    expect(wrapper.getComponent({ name: 'SIcon' }).props('name')).toBe(
      'cb:checkmark',
    )
  })

  it('uses vertical orientation for timelines and renders active context', () => {
    const wrapper = mount(Steps, {
      props: { active: 1, items, variant: 'timeline' },
      slots: {
        content: ({ item }: { item: StepItem }) =>
          h('span', { class: 'custom-context' }, item.title),
        actions: () => h('button', { class: 'custom-action' }, 'Continue'),
      },
    })

    expect(wrapper.classes()).toContain('s-steps--vertical')
    expect(wrapper.classes()).toContain('s-steps--timeline')
    expect(wrapper.attributes('aria-orientation')).toBe('vertical')
    expect(wrapper.findAll('.s-steps__context')).toHaveLength(1)
    expect(wrapper.get('.custom-context').text()).toBe('Profile')
    expect(wrapper.get('.custom-action').text()).toBe('Continue')
  })

  it('emits controlled active updates and ignores disabled items', async () => {
    const wrapper = mount(Steps, {
      props: {
        active: 0,
        items: [...items.slice(0, 2), { ...items[2], disabled: true }],
      },
    })
    const buttons = wrapper.findAll('button')

    await buttons[1].trigger('click')
    expect(wrapper.emitted('click')?.[0]).toEqual([1, items[1]])
    expect(wrapper.emitted('update:active')?.[0]).toEqual([1])
    expect(wrapper.emitted('change')?.[0]).toEqual([1, items[1]])

    await buttons[2].trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
    expect(buttons[2].attributes('disabled')).toBeDefined()
  })

  it('supports roving keyboard focus without activating a step', async () => {
    const wrapper = mount(Steps, {
      attachTo: document.body,
      props: { active: 0, items },
    })
    const buttons = wrapper.findAll('button')

    ;(buttons[0].element as HTMLButtonElement).focus()
    await buttons[0].trigger('keydown', { key: 'ArrowRight' })
    await nextTick()

    expect(document.activeElement).toBe(buttons[1].element)
    expect(wrapper.emitted('update:active')).toBeUndefined()
    wrapper.unmount()
  })

  it('exposes full item slot state for tile-like layouts', () => {
    const wrapper = mount(Steps, {
      props: {
        active: 1,
        items,
        simple: true,
        statusLabels: { finish: 'Completed', process: 'In progress' },
      },
      slots: {
        item: ({
          item,
          status,
          statusLabel,
        }: {
          item: StepItem
          status: StepStatus
          statusLabel: string
        }) =>
          h('span', { class: `custom-item custom-item--${status}` }, [
            item.title,
            statusLabel,
          ]),
      },
    })

    expect(wrapper.classes()).toContain('is-custom-item')
    expect(wrapper.classes()).toContain('is-simple')
    expect(wrapper.find('.s-steps__marker').exists()).toBe(false)
    expect(wrapper.find('.custom-item--finish').text()).toContain('Completed')
    expect(wrapper.find('.custom-item--process').text()).toContain(
      'In progress',
    )
  })

  it('renders all explicit semantic states', () => {
    const statuses: StepStatus[] = [
      'wait',
      'process',
      'finish',
      'success',
      'error',
      'loading',
      'disabled',
    ]
    const wrapper = mount(Steps, {
      props: {
        items: statuses.map((status) => ({ title: status, status })),
      },
    })

    for (const status of statuses) {
      expect(wrapper.find(`.s-steps__item--${status}`).exists()).toBe(true)
    }
    expect(
      wrapper
        .find('.s-steps__item--loading')
        .findComponent({ name: 'SIcon' })
        .props('rolling'),
    ).toBe(1.1)
  })

  it('uses the configured locale for built-in status labels', () => {
    const wrapper = mount(Steps, {
      props: { active: 1, items },
      global: {
        provide: {
          [localeContextKey as symbol]: ref(zhCn),
        },
      },
    })

    expect(wrapper.attributes('aria-label')).toBe('步骤')
    expect(
      wrapper
        .findAll('.s-steps__status')
        .map((status) => status.text().replace(/\s+/g, ' ')),
    ).toEqual(['已完成', '进行中 · 2 / 3', '等待中'])
  })
})
