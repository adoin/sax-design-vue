import { defineComponent, nextTick, reactive } from 'vue'
import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import { useTableEdit } from '../src/composables/use-table-edit'
import type { TableEditContext, TableProps } from '../src/table'

it('isolates applying state between cancelled and replacement edit sessions', async () => {
  const row = { id: 1, name: 'A' }
  const props = reactive({
    data: [row],
    editConfig: true,
  })
  const context: TableEditContext = {
    row,
    rowKey: 1,
    rowIndex: 0,
    columnIndex: 0,
    columnKey: 'name',
    column: { field: 'name', editor: true },
    value: 'A',
    depth: 0,
    expanded: false,
    loading: false,
    toggleExpand: async () => {},
  }
  const requests: Array<(accepted: boolean) => void> = []
  let editing!: ReturnType<typeof useTableEdit>
  const wrapper = mount(
    defineComponent({
      setup() {
        editing = useTableEdit(
          props as unknown as TableProps,
          vi.fn(),
          (value) => value,
          {
            apply: () =>
              new Promise<boolean>((resolve) => requests.push(resolve)),
          },
        )
        return () => null
      },
    }),
  )
  editing.start(context)
  editing.setValue(context, 'B')
  const first = editing.commit()
  expect(editing.applying.value).toBe(true)
  editing.cancel()
  expect(editing.applying.value).toBe(false)
  editing.start(context)
  editing.setValue(context, 'C')
  const second = editing.commit()
  requests[0](true)
  expect(await first).toBe(false)
  expect(editing.applying.value).toBe(true)
  expect(editing.record()?.changes[0].value).toBe('C')
  requests[1](false)
  expect(await second).toBe(false)
  expect(editing.applying.value).toBe(false)
  props.data = [{ id: 1, name: 'external' }]
  await nextTick()
  expect(editing.record()).toBeNull()
  wrapper.unmount()
})
