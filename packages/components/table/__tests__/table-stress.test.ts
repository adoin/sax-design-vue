import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import VirtualList from '../../virtual-list/src/virtual-list.vue'
import Table from '../src/table.vue'

describe('Table generated virtual source', () => {
  it('mounts a 100k by 100k logical grid with the real virtualizer', async () => {
    const wrapper = mount(Table, {
      props: {
        virtualSource: {
          rowCount: 100_000,
          columnCount: 100_000,
          row: (index: number) => ({ id: index + 1 }),
          rowKey: (index: number) => index + 1,
          column: (index: number) => ({
            key: `column-${index}`,
            title: `Column ${index + 1}`,
            width: 120,
          }),
          columnWidth: 120,
          fixedLeftCount: 2,
          fixedRightCount: 1,
        },
        virtualConfig: {
          height: 420,
          estimateSize: 38,
          overscan: 10,
          dynamic: true,
          horizontal: true,
          columnOverscan: 3,
        },
      },
    })

    await nextTick()

    expect(wrapper.find('[role="table"]').attributes('aria-rowcount')).toBe(
      '100001',
    )
    expect(wrapper.find('[role="table"]').attributes('aria-colcount')).toBe(
      '100000',
    )
    expect(wrapper.findAll('.s-table__data-head-cell').length).toBeLessThan(20)
    expect(wrapper.findAll('.s-table__data-row').length).toBeLessThan(40)
    expect(wrapper.findComponent(VirtualList).props('retainMaxSize')).toBe(true)
    expect(
      wrapper.find('.s-table__virtual-body').attributes('style'),
    ).toContain('--s-table-virtual-width: 100360px')
  })
})
