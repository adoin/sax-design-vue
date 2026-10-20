import { defineComponent, h, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import zhCn from '@vuesax-alpha/locale/lang/zh-cn'
import { localeContextKey, provideGlobalConfig } from '@vuesax-alpha/hooks'
import ConfigProvider from '../../config-provider/src/config-provider'

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

const pointer = async (element: Element, type: string, x = 0, y = 0) => {
  const event = new MouseEvent(type, {
    button: 0,
    clientX: x,
    clientY: y,
    bubbles: true,
    cancelable: true,
  })
  Object.defineProperty(event, 'pointerId', { value: 1 })
  element.dispatchEvent(event)
  await nextTick()
}
const originalElementFromPoint = document.elementFromPoint

afterEach(() => {
  if (!originalElementFromPoint)
    Reflect.deleteProperty(document, 'elementFromPoint')
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('Tabs', () => {
  it('toggles the indicator and selects physical edges', async () => {
    const wrapper = mountTabs({ indicatorPosition: 'top' }, { default: panes })
    await flushPromises()
    expect(wrapper.get('.s-tabs__indicator').attributes('style')).toContain(
      'top: 2px',
    )
    await wrapper.setProps({ showIndicator: false })
    expect(wrapper.find('.s-tabs__indicator').exists()).toBe(false)
    await wrapper.setProps({ showIndicator: true, indicatorPosition: 'bottom' })
    expect(wrapper.get('.s-tabs__indicator').attributes('style')).toContain(
      'bottom: 2px',
    )
    await wrapper.setProps({ position: 'left', indicatorPosition: 'left' })
    expect(wrapper.get('.s-tabs__indicator').attributes('style')).toContain(
      'left: 2px',
    )
    await wrapper.setProps({ indicatorPosition: 'right' })
    expect(wrapper.get('.s-tabs__indicator').attributes('style')).toContain(
      'right: 2px',
    )
    await wrapper.setProps({ position: 'right', indicatorPosition: 'top' })
    expect(wrapper.get('.s-tabs__indicator').attributes('style')).toContain(
      'left: 2px',
    )
    await wrapper.setProps({ position: 'bottom', indicatorPosition: undefined })
    expect(wrapper.get('.s-tabs__indicator').attributes('style')).toContain(
      'top: 2px',
    )
    await wrapper.setProps({ type: 'pill' })
    expect(wrapper.find('.s-tabs__indicator').exists()).toBe(false)
    wrapper.unmount()
  })
  it('merges reactive nested defaults and honors explicit props', async () => {
    const defaults = ref({
      showIndicator: false,
      indicatorPosition: 'top' as const,
    })
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(ConfigProvider, { tabs: defaults.value }, () => [
            h(Tabs, {}, { default: panes }),
            h(ConfigProvider, { tabs: { showIndicator: true } }, () =>
              h(Tabs, {}, { default: panes }),
            ),
            h(
              Tabs,
              { showIndicator: true, indicatorPosition: 'bottom' },
              { default: panes },
            ),
          ]),
      }),
    )
    await flushPromises()
    const tabs = wrapper.findAllComponents(Tabs)
    expect(tabs[0].find('.s-tabs__indicator').exists()).toBe(false)
    expect(tabs[1].get('.s-tabs__indicator').attributes('style')).toContain(
      'top: 2px',
    )
    expect(tabs[2].get('.s-tabs__indicator').attributes('style')).toContain(
      'bottom: 2px',
    )
    defaults.value = { ...defaults.value, showIndicator: true }
    await nextTick()
    expect(tabs[0].find('.s-tabs__indicator').exists()).toBe(true)
    wrapper.unmount()
  })
  it('inherits installation defaults', async () => {
    const wrapper = mount(Tabs, {
      slots: { default: panes },
      global: {
        plugins: [
          {
            install(app) {
              provideGlobalConfig({ tabs: { showIndicator: false } }, app)
            },
          },
        ],
      },
    })
    await flushPromises()
    expect(wrapper.find('.s-tabs__indicator').exists()).toBe(false)
    wrapper.unmount()
  })

  it('ignores small moves and cancels captured pointer sorting with Escape', async () => {
    const wrapper = mountTabs(
      { sortable: true, modelValue: 'overview' },
      { default: panes },
    )
    await flushPromises()
    const buttons = wrapper.findAll('[role="tab"]')
    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: vi.fn(() => buttons[1].element),
    })
    await pointer(buttons[0].element, 'pointerdown', 10, 10)
    await pointer(buttons[0].element, 'pointerup', 12, 10)
    expect(wrapper.emitted('sort')).toBeUndefined()
    await pointer(buttons[0].element, 'pointerdown', 10, 10)
    await pointer(buttons[0].element, 'pointermove', 200, 10)
    await buttons[0].trigger('keydown', { key: 'Escape' })
    await pointer(buttons[0].element, 'pointerup', 200, 10)
    expect(wrapper.emitted('sort')).toBeUndefined()
    expect(wrapper.find('.is-dragging').exists()).toBe(false)
    wrapper.unmount()
  })
  it('sorts by dragging without changing selection or remounting pane content', async () => {
    const wrapper = mountTabs(
      { sortable: true, modelValue: 'a', overflow: 'scroll' },
      {
        default: () =>
          ['a', 'b', 'c'].map((name) =>
            h(Tab, { name, key: name, label: name }, () =>
              h('input', { value: name }),
            ),
          ),
      },
    )
    await flushPromises()
    const original = wrapper.findAll('input').map((input) => input.element)
    const buttons = wrapper.findAll('[role="tab"]')
    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: vi.fn(() => buttons[2].element),
    })
    await pointer(buttons[0].element, 'pointerdown', 10, 10)
    await pointer(buttons[0].element, 'pointermove', 200, 10)
    await pointer(buttons[0].element, 'pointerup', 200, 10)
    await flushPromises()
    expect(wrapper.findAll('[role="tab"]').map((tab) => tab.text())).toEqual([
      'b',
      'c',
      'a',
    ])
    expect(wrapper.emitted('sort')?.[0]).toEqual([
      ['b', 'c', 'a'],
      { value: 'a', oldIndex: 0, newIndex: 2 },
    ])
    expect(wrapper.emitted('update:order')?.[0]).toEqual([['b', 'c', 'a']])
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.findAll('input').map((input) => input.element)).toEqual(
      original,
    )
    expect(wrapper.get('[aria-selected="true"]').text()).toBe('a')
    wrapper.unmount()
  })
  it('honors controlled order, omits unknown/duplicate values, and skips disabled sort targets', async () => {
    const wrapper = mountTabs(
      {
        sortable: true,
        order: ['files', 'files', 'missing'],
        modelValue: 'overview',
      },
      { default: panes },
    )
    await flushPromises()
    expect(wrapper.findAll('[role="tab"]').map((tab) => tab.text())).toEqual([
      'Files',
      'Overview',
      'Settings',
    ])
    await wrapper
      .findAll('[role="tab"]')[1]
      .trigger('keydown', { key: 'ArrowLeft', altKey: true, shiftKey: true })
    expect(wrapper.emitted('sort')?.[0]?.[0]).toEqual([
      'overview',
      'files',
      'settings',
    ])
    // Controlled props remain authoritative until the consumer updates them.
    expect(wrapper.findAll('[role="tab"]')[0].text()).toBe('Files')
    await wrapper.setProps({
      order: ['overview', 'files', 'settings'],
      sortable: false,
    })
    await pointer(wrapper.findAll('[role="tab"]')[0].element, 'pointerdown')
    await pointer(wrapper.findAll('[role="tab"]')[0].element, 'pointerup', 200)
    expect(wrapper.emitted('sort')).toHaveLength(1)
    wrapper.unmount()
  })
  it('lets event-only consumers reorder their source, including later external changes', async () => {
    const order = ref(['a', 'b', 'c'])
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(
            Tabs,
            {
              sortable: true,
              modelValue: 'b',
              onSort: (next: (string | number)[]) => {
                order.value = next.map(String)
              },
            },
            () =>
              order.value.map((name) =>
                h(Tab, { name, key: name, label: name }, () =>
                  h('input', { value: name }),
                ),
              ),
          ),
      }),
    )
    await flushPromises()
    const input = wrapper.findAll('input')[1].element
    await wrapper
      .findAll('[role="tab"]')[1]
      .trigger('keydown', { key: 'ArrowRight', altKey: true, shiftKey: true })
    await flushPromises()
    expect(order.value).toEqual(['a', 'c', 'b'])
    expect(wrapper.findAll('[role="tab"]').map((tab) => tab.text())).toEqual(
      order.value,
    )
    expect(wrapper.get('[aria-selected="true"]').text()).toBe('b')
    expect(wrapper.findAll('input')[2].element).toBe(input)
    order.value = ['c', 'b', 'a']
    await flushPromises()
    expect(wrapper.findAll('[role="tab"]').map((tab) => tab.text())).toEqual(
      order.value,
    )
    wrapper.unmount()
  })
  it('places the line from layout geometry during the initial tab animation', async () => {
    vi.spyOn(HTMLElement.prototype, 'offsetParent', 'get').mockImplementation(
      function (this: HTMLElement) {
        if (
          this.classList.contains('s-tabs__item') ||
          this.classList.contains('s-tabs__nav-list') ||
          this.classList.contains('s-tabs__nav')
        )
          return this.parentElement
        return null
      },
    )
    vi.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockImplementation(
      function (this: HTMLElement) {
        if (this.classList.contains('s-tabs__nav-list')) return 5
        return this.classList.contains('s-tabs__item') &&
          this.previousElementSibling
          ? 80
          : 0
      },
    )
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(
      function (this: HTMLElement) {
        return this.classList.contains('s-tabs__item') ? 74 : 0
      },
    )
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
        const transformed = this.classList.contains('s-tabs__item')
        return {
          left: transformed ? 20 : 0,
          width: transformed ? 71 : 0,
        } as DOMRect
      },
    )

    const wrapper = mountTabs({ modelValue: 'overview' }, { default: panes })
    await flushPromises()

    expect(wrapper.get('.s-tabs__indicator').attributes('style')).toContain(
      'width: 74px; transform: translate3d(5px, 0, 0)',
    )

    await wrapper.findAll('[role="tab"]')[1].trigger('click')
    await flushPromises()
    expect(wrapper.get('.s-tabs__indicator').attributes('style')).toContain(
      'width: 74px; transform: translate3d(85px, 0, 0)',
    )

    await wrapper.findAll('[role="tab"]')[0].trigger('click')
    await flushPromises()
    expect(wrapper.get('.s-tabs__indicator').attributes('style')).toContain(
      'width: 74px; transform: translate3d(5px, 0, 0)',
    )
  })

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

describe('Tabs label-extra slots', () => {
  it('retains the default label and badge and keeps a suffix action outside the tab button', async () => {
    const count = ref(2)
    const wrapper = mountTabs(
      { modelValue: 'first', animated: false },
      {
        default: () => [
          h(Tab, { name: 'first', label: 'First' }, () => 'First content'),
          h(
            Tab,
            { name: 'second', label: 'Campaigns', badge: 7 },
            {
              default: () => 'Campaign content',
              'label-extra': ({
                active,
                value,
              }: {
                active: boolean
                value: string | number
              }) =>
                h(
                  'button',
                  {
                    class: 'clear-selection',
                    type: 'button',
                    onClick: () => {
                      count.value = 0
                    },
                  },
                  `${value}:${active}:${count.value}`,
                ),
            },
          ),
        ],
      },
    )
    await nextTick()
    const row = wrapper.findAll('.s-tabs__item')[1]
    expect(row.get('.s-tabs__label').text()).toBe('Campaigns')
    expect(row.get('.s-tabs__badge').text()).toBe('7')
    expect(row.get('.clear-selection').text()).toBe('second:false:2')
    expect(row.get('[role="tab"]').find('.clear-selection').exists()).toBe(
      false,
    )
    expect(
      wrapper.get('.s-tabs__measure').find('.clear-selection').exists(),
    ).toBe(false)
    await row.get('.clear-selection').trigger('click')
    expect(row.get('.clear-selection').text()).toBe('second:false:0')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('tab-click')).toBeUndefined()
    wrapper.unmount()
  })
  it('provides a shared suffix slot with pane, active and value', async () => {
    const wrapper = mountTabs(
      { modelValue: 'one', animated: false },
      {
        default: () => h(Tab, { name: 'one', label: 'One' }, () => 'Content'),
        'label-extra': ({ pane, active, value }) =>
          h(
            'span',
            { class: 'shared-extra' },
            `${pane.label}:${active}:${value}`,
          ),
      },
    )
    await nextTick()
    expect(wrapper.get('.shared-extra').text()).toBe('One:true:one')
    wrapper.unmount()
  })
  it('isolates interactive suffix events while preserving child behavior and native defaults', async () => {
    const ancestor = vi.fn()
    const childClick = vi.fn()
    const wrapper = mount(
      () =>
        h(
          'div',
          {
            onClick: ancestor,
            onKeydown: ancestor,
            onInput: ancestor,
            onChange: ancestor,
            onContextmenu: ancestor,
            onPointerdown: ancestor,
          },
          [
            h(Tabs, { modelValue: 'one', animated: false }, () =>
              h(
                Tab,
                { name: 'one', label: 'One' },
                {
                  default: () => 'Content',
                  'label-extra': () =>
                    h('input', {
                      class: 'arbitrary-control',
                      onClick: childClick,
                    }),
                },
              ),
            ),
          ],
        ),
      { global: { stubs: { SPopper: PopperStub } } },
    )
    await nextTick()
    const input = wrapper.get('.arbitrary-control')
    await input.trigger('click')
    await input.trigger('keydown', { key: 'ArrowRight' })
    await input.trigger('input')
    await input.trigger('change')
    await input.trigger('contextmenu')
    await input.trigger('pointerdown')
    expect(childClick).toHaveBeenCalledTimes(1)
    expect(ancestor).not.toHaveBeenCalled()
    const event = new Event('click', { bubbles: true, cancelable: true })
    input.element.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
    wrapper.unmount()
  })
})
