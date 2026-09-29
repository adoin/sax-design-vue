import { h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import List from '../src/list.vue'
import ListItem from '../src/list-item.vue'
import VirtualList from '../../virtual-list/src/virtual-list.vue'

const settle = async () => {
  await nextTick()
  await Promise.resolve()
  await nextTick()
}

describe('List data and virtual rendering', () => {
  afterEach(() => vi.restoreAllMocks())

  it('preserves manual default-slot content', () => {
    const wrapper = mount(List, {
      slots: { default: () => h(ListItem, { title: 'Manual' }) },
    })
    expect(wrapper.text()).toContain('Manual')
    expect(wrapper.find('.s-vl').exists()).toBe(false)
    wrapper.unmount()
  })

  it('renders data and custom slots without virtualization', () => {
    const items = [
      { id: 'a', title: 'Alpha', subtitle: 'Details' },
      { id: 'b', label: 'Beta' },
    ]
    const wrapper = mount(List, { props: { items } })
    expect(wrapper.findAll('.s-list__item')).toHaveLength(2)
    expect(wrapper.text()).toContain('AlphaDetailsBeta')
    wrapper.unmount()
    const custom = mount(List, {
      props: { items },
      slots: { item: ({ item, index }) => h('p', `${index}:${item.id}`) },
    })
    expect(custom.findAll('p').map((row) => row.text())).toEqual(['0:a', '1:b'])
    custom.unmount()
  })

  it('windows 10000 data rows and forwards index navigation', async () => {
    const items = Array.from({ length: 10000 }, (_, id) => ({
      id,
      title: `Row ${id}`,
    }))
    const wrapper = mount(List, {
      props: {
        items,
        virtual: true,
        itemKey: (item) => Number(item.id),
        virtualConfig: {
          height: 200,
          estimateSize: 40,
          overscan: 3,
          dynamic: false,
        },
      },
      slots: { default: () => h('header', 'Records') },
    })
    await settle()
    const element = wrapper.get<HTMLElement>('.s-vl__window').element
    Object.defineProperty(element, 'clientHeight', { value: 200 })
    wrapper.vm.measure()
    wrapper.vm.scrollToIndex(9999, 'end')
    await settle()
    expect(element.scrollTop).toBe(400000 - 200)
    expect(wrapper.text()).toContain('Row 9999')
    expect(wrapper.findAll('.s-list__item').length).toBeLessThan(20)
    expect(wrapper.get('header').element.closest('.s-vl')).toBeNull()
    await wrapper.setProps({ items: items.slice(0, 3) })
    wrapper.vm.scrollToIndex(0)
    await settle()
    expect(wrapper.findAll('.s-list__item')).toHaveLength(3)
    wrapper.unmount()
  })

  it('measures variable-height custom rows through the shared virtual list', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
        return { height: Number(this.dataset.index) % 2 ? 80 : 40 } as DOMRect
      },
    )
    const wrapper = mount(List, {
      props: {
        virtual: true,
        items: Array.from({ length: 400 }, (_, id) => ({ id })),
      },
      slots: { item: ({ item }) => h('article', String(item.id)) },
    })
    await settle()
    expect(wrapper.getComponent(VirtualList).props('dynamic')).toBe(true)
    const rows = wrapper.findAll('.s-vl__item')
    expect(rows[1].attributes('style')).toContain('--s-vl-item-start: 40px')
    expect(rows[2].attributes('style')).toContain('--s-vl-item-start: 120px')
    expect(rows.length).toBeLessThan(30)
    wrapper.unmount()
  })
})
