import { defineComponent, h, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import zhCn from '@vuesax-alpha/locale/lang/zh-cn'
import { localeContextKey } from '@vuesax-alpha/hooks'
import Tab from '../src/tab.vue'
import Tabs from '../src/tabs.vue'
import {
  calculateTabsOverflowLayout,
  calculateVisibleTabUids,
} from '../src/tabs-overflow'
import type { ComponentMountingOptions } from '@vue/test-utils'

const PopperStub = defineComponent({
  name: 'SPopper',
  template: '<div class="popper-stub"><slot /><slot name="content" /></div>',
})

const mountTabs = (
  props: Record<string, unknown> = {},
  slots: NonNullable<ComponentMountingOptions<typeof Tabs>['slots']> = {},
  attachTo?: Element,
) =>
  mount(Tabs, {
    props,
    slots,
    attachTo,
    global: {
      stubs: {
        SIcon: { template: '<i class="icon-stub" />' },
        SPopper: PopperStub,
      },
    },
  })

const panes = () => [
  h(Tab, { label: 'Overview', name: 'overview' }, () => 'Overview panel'),
  h(Tab, { label: 'Files', name: 'files' }, () => 'Files panel'),
  h(
    Tab,
    { label: 'Settings', name: 'settings', disabled: true },
    () => 'Settings panel',
  ),
]

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('Tabs', () => {
  it('uses stable tab names and exposes accessible tab relationships', async () => {
    const wrapper = mountTabs({ modelValue: 'overview' }, { default: panes })
    await nextTick()

    const buttons = wrapper.findAll('[role="tab"]')
    expect(buttons).toHaveLength(3)
    expect(buttons[0].attributes('aria-selected')).toBe('true')
    expect(buttons[0].attributes('aria-controls')).toBeTruthy()
    expect(wrapper.findAll('[role="tabpanel"]')).toHaveLength(3)

    await buttons[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['files'])
    expect(wrapper.emitted('change')?.[0]?.[0]).toBe('files')
    expect(wrapper.emitted('tabClick')?.[0]?.[0]).toBe('files')

    await buttons[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
  })

  it('supports roving arrow-key navigation', async () => {
    const wrapper = mountTabs(
      { modelValue: 'overview' },
      { default: panes },
      document.body,
    )
    await nextTick()

    const buttons = wrapper.findAll<HTMLButtonElement>('[role="tab"]')
    buttons[0].element.focus()
    await buttons[0].trigger('keydown', { key: 'ArrowRight' })
    await flushPromises()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['files'])
    expect(document.activeElement).toBe(buttons[1].element)
    wrapper.unmount()
  })

  it('emits controlled add and remove requests in editable-card mode', async () => {
    const wrapper = mountTabs(
      { modelValue: 'overview', type: 'editable-card' },
      { default: panes },
    )
    await nextTick()

    await wrapper.get('[aria-label="Add tab"]').trigger('click')
    expect(wrapper.emitted('add')).toHaveLength(1)
    expect(wrapper.emitted('edit')?.[0]?.[1]).toBe('add')

    await wrapper.get('[aria-label="Close Overview"]').trigger('click')
    expect(wrapper.emitted('remove')?.[0]?.[0]).toBe('overview')
    expect(wrapper.emitted('edit')?.[1]).toEqual(['overview', 'remove'])
  })

  it('supports editing controls independently from the visual type', async () => {
    const wrapper = mountTabs(
      { modelValue: 'overview', type: 'connected-card', editable: true },
      { default: panes },
    )
    await nextTick()

    expect(wrapper.classes()).toContain('s-tabs--type-connected-card')
    await wrapper.get('[aria-label="Add tab"]').trigger('click')
    await wrapper.get('[aria-label="Close Overview"]').trigger('click')

    expect(wrapper.emitted('add')).toHaveLength(1)
    expect(wrapper.emitted('remove')?.[0]?.[0]).toBe('overview')
  })

  it('renders a tab label slot inside the navigation control', async () => {
    const wrapper = mountTabs(
      { modelValue: 'custom' },
      {
        default: () =>
          h(
            Tab,
            { label: 'Custom', name: 'custom' },
            {
              label: () => h('strong', { class: 'custom-label' }, 'Workspace'),
              default: () => 'Custom panel',
            },
          ),
      },
    )
    await nextTick()

    expect(wrapper.get('.custom-label').text()).toBe('Workspace')
  })

  it('lazily mounts panes on first activation and keeps visited panes', async () => {
    const wrapper = mountTabs(
      { modelValue: 'overview', renderMode: 'lazy' },
      { default: panes },
    )
    await nextTick()

    expect(wrapper.findAll('[role="tabpanel"]')).toHaveLength(1)
    expect(wrapper.text()).toContain('Overview panel')
    expect(wrapper.text()).not.toContain('Files panel')

    await wrapper.findAll('[role="tab"]')[1].trigger('click')
    await nextTick()

    expect(wrapper.findAll('[role="tabpanel"]')).toHaveLength(2)
    expect(wrapper.text()).toContain('Overview panel')
    expect(wrapper.text()).toContain('Files panel')
  })

  it.each([
    ['all', 3],
    ['lazy', 1],
    ['active-only', 1],
  ] as const)('mounts %s panes initially', async (renderMode, count) => {
    const wrapper = mountTabs(
      { modelValue: 'overview', renderMode, animated: false },
      { default: panes },
    )
    await nextTick()
    expect(wrapper.findAll('[role="tabpanel"]')).toHaveLength(count)
  })

  it('unmounts inactive pane subtrees and remounts them on return', async () => {
    const mounts = vi.fn()
    const unmounts = vi.fn()
    const PaneBody = defineComponent({
      props: { name: { type: String, required: true } },
      setup(props) {
        onMounted(() => mounts(props.name))
        onUnmounted(() => unmounts(props.name))
        return () => h('span', `${props.name} content`)
      },
    })
    const wrapper = mountTabs(
      { modelValue: 'first', renderMode: 'active-only', animated: false },
      {
        default: () =>
          ['first', 'second', 'third'].map((name) =>
            h(Tab, { name, label: name }, () => h(PaneBody, { name })),
          ),
      },
    )
    await nextTick()
    expect(wrapper.findAll('[role="tabpanel"]')).toHaveLength(1)
    expect(mounts.mock.calls).toEqual([['first']])

    await wrapper.findAll('[role="tab"]')[1].trigger('click')
    await nextTick()
    expect(wrapper.findAll('[role="tabpanel"]')).toHaveLength(1)
    expect(unmounts.mock.calls).toEqual([['first']])
    expect(mounts.mock.calls).toEqual([['first'], ['second']])

    await wrapper.findAll('[role="tab"]')[0].trigger('click')
    await nextTick()
    expect(wrapper.findAll('[role="tabpanel"]')).toHaveLength(1)
    expect(mounts.mock.calls).toEqual([['first'], ['second'], ['first']])
  })

  it('lets one pane override the parent mounting policy', async () => {
    const wrapper = mountTabs(
      { modelValue: 'first', renderMode: 'active-only', animated: false },
      {
        default: () => [
          h(
            Tab,
            { name: 'first', label: 'First', renderMode: 'all' },
            () => 'First panel',
          ),
          h(Tab, { name: 'second', label: 'Second' }, () => 'Second panel'),
        ],
      },
    )
    await nextTick()
    expect(wrapper.findAll('[role="tabpanel"]')).toHaveLength(1)

    await wrapper.findAll('[role="tab"]')[1].trigger('click')
    await nextTick()
    expect(wrapper.findAll('[role="tabpanel"]')).toHaveLength(2)
    expect(wrapper.text()).toContain('First panel')
    expect(wrapper.text()).toContain('Second panel')
  })

  it('keeps force-render compatible but prefers an explicit pane mode', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const legacy = mountTabs(
      { modelValue: 'second', renderMode: 'active-only', animated: false },
      {
        default: () => [
          h(
            Tab,
            { name: 'first', label: 'First', forceRender: true },
            () => 'First panel',
          ),
          h(Tab, { name: 'second', label: 'Second' }, () => 'Second panel'),
        ],
      },
    )
    await nextTick()
    expect(legacy.findAll('[role="tabpanel"]')).toHaveLength(2)

    const explicit = mountTabs(
      { modelValue: 'second', renderMode: 'active-only', animated: false },
      {
        default: () => [
          h(
            Tab,
            {
              name: 'first',
              label: 'First',
              forceRender: true,
              renderMode: 'active-only',
            },
            () => 'First panel',
          ),
          h(Tab, { name: 'second', label: 'Second' }, () => 'Second panel'),
        ],
      },
    )
    await nextTick()
    expect(explicit.findAll('[role="tabpanel"]')).toHaveLength(1)
    expect(warn).toHaveBeenCalled()
  })

  it('keeps legacy flags compatible while explicit render-mode wins', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const legacy = mountTabs(
      {
        modelValue: 'overview',
        lazy: true,
        destroyOnHide: true,
        animated: false,
      },
      { default: panes },
    )
    await nextTick()
    await legacy.findAll('[role="tab"]')[1].trigger('click')
    await nextTick()
    expect(legacy.findAll('[role="tabpanel"]')).toHaveLength(1)

    const explicit = mountTabs(
      {
        modelValue: 'overview',
        renderMode: 'lazy',
        destroyOnHide: true,
        animated: false,
      },
      { default: panes },
    )
    await nextTick()
    await explicit.findAll('[role="tab"]')[1].trigger('click')
    await nextTick()
    expect(explicit.findAll('[role="tabpanel"]')).toHaveLength(2)
    expect(warn).toHaveBeenCalled()
  })

  it('renders the connected-card appearance modifier', async () => {
    const wrapper = mountTabs(
      { modelValue: 'overview', type: 'connected-card' },
      { default: panes },
    )
    await nextTick()

    expect(wrapper.classes()).toContain('s-tabs--type-connected-card')
    expect(wrapper.get('[role="tab"]').attributes('aria-selected')).toBe('true')
  })

  it('uses the configured locale for built-in tab controls', async () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 0, type: 'editable-card' },
      slots: { default: () => h(Tab, { label: '首页' }, () => '内容') },
      global: {
        provide: { [localeContextKey as symbol]: ref(zhCn) },
        stubs: {
          SIcon: { template: '<i />' },
          SPopper: PopperStub,
        },
      },
    })
    await nextTick()

    expect(wrapper.get('[role="tablist"]').attributes('aria-label')).toBe(
      '标签页',
    )
    expect(wrapper.find('[aria-label="添加标签页"]').exists()).toBe(true)
    expect(wrapper.find('[aria-label="关闭首页"]').exists()).toBe(true)
  })
})

describe('Tabs overflow calculation', () => {
  const eightTabs = {
    uids: [1, 2, 3, 4, 5, 6, 7, 8],
    itemSizes: Array.from({ length: 8 }, () => 60),
    containerSize: 394,
    reservedSize: 0,
    moreSize: 64,
    gap: 6,
  }

  it('moves a contiguous ordered window to the active tab near the end', () => {
    expect(calculateTabsOverflowLayout({ ...eightTabs, activeUid: 8 })).toEqual(
      {
        visibleUids: [4, 5, 6, 7, 8],
        leadingHiddenUids: [1, 2, 3],
        trailingHiddenUids: [],
      },
    )
  })

  it('keeps overflow after the visible window near the start', () => {
    expect(calculateTabsOverflowLayout({ ...eightTabs, activeUid: 1 })).toEqual(
      {
        visibleUids: [1, 2, 3, 4, 5],
        leadingHiddenUids: [],
        trailingHiddenUids: [6, 7, 8],
      },
    )
  })

  it('can expose overflow on both sides without changing source order', () => {
    expect(
      calculateTabsOverflowLayout({
        ...eightTabs,
        containerSize: 350,
        activeUid: 4,
      }),
    ).toEqual({
      visibleUids: [3, 4, 5],
      leadingHiddenUids: [1, 2],
      trailingHiddenUids: [6, 7, 8],
    })
  })

  it('keeps every tab when the whole list fits', () => {
    expect(
      calculateVisibleTabUids({
        uids: [1, 2, 3],
        itemSizes: [60, 60, 60],
        containerSize: 240,
        reservedSize: 0,
        moreSize: 40,
        gap: 6,
        activeUid: 2,
      }),
    ).toEqual([1, 2, 3])
  })

  it('shows activation before shifting a controlled overflow window', async () => {
    vi.useFakeTimers()
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(
      function (this: HTMLElement) {
        if (this.dataset.tabsMeasureItem !== undefined) return 60
        if (this.dataset.tabsMeasureMore !== undefined) return 64
        return 0
      },
    )
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(
      function (this: HTMLElement) {
        return this.classList.contains('s-tabs__nav-wrap') ? 394 : 0
      },
    )

    const model = ref('customer')
    const labels = [
      'overview',
      'analysis',
      'orders',
      'customer',
      'automation',
      'integration',
      'billing',
      'members',
    ]
    const Host = defineComponent({
      setup: () => () =>
        h(
          Tabs,
          {
            modelValue: model.value,
            'onUpdate:modelValue': (value: unknown) => {
              model.value = String(value)
            },
          },
          () =>
            labels.map((label) =>
              h(Tab, { key: label, label, name: label }, () => label),
            ),
        ),
    })
    const wrapper = mount(Host, {
      global: {
        stubs: {
          SIcon: { template: '<i class="icon-stub" />' },
          SPopper: PopperStub,
        },
      },
    })
    await flushPromises()
    await vi.runOnlyPendingTimersAsync()
    await flushPromises()

    const visibleTabs = () =>
      wrapper.findAll(
        '.s-tabs__nav-list > .s-tabs__item:not(.s-tabs__nav-item-leave-active) [role="tab"]',
      )
    const visibleLabels = () => visibleTabs().map((tab) => tab.text())
    const automation = visibleTabs().find((tab) => tab.text() === 'automation')

    expect(automation).toBeTruthy()
    const labelsBeforeClick = visibleLabels()
    expect(labelsBeforeClick.length).toBeLessThan(labels.length)
    await automation!.trigger('click')
    await nextTick()

    expect(model.value).toBe('automation')
    expect(wrapper.get('.s-tabs').classes()).toContain('is-reflow-forward')
    expect(wrapper.get('[role="tab"][aria-selected="true"]').text()).toBe(
      'automation',
    )
    expect(visibleLabels()).toEqual(labelsBeforeClick)

    await vi.advanceTimersByTimeAsync(179)
    await flushPromises()
    expect(visibleLabels()).toEqual(labelsBeforeClick)

    await vi.advanceTimersByTimeAsync(1)
    await flushPromises()
    expect(visibleLabels()).not.toEqual(labelsBeforeClick)
    expect(visibleLabels()).toContain('automation')
  })
})
