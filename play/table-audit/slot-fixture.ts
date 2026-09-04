import {
  createApp,
  defineComponent,
  h,
  nextTick,
  reactive,
  shallowRef,
} from 'vue'
import { STableSelect } from '../../packages/components/table-select'
import { STableGrid } from '../../packages/components/table-grid'
import '../../packages/theme-chalk/src/index.scss'
import '../../packages/theme-chalk/src/dark/css-vars.scss'
import type { App, Slot } from 'vue'
import type { TableColumn } from '../../packages/components/table'

const rows = Array.from({ length: 1000 }, (_, id) => ({
  id,
  name: `Person ${id}`,
  status: 'Active',
}))
const columns: TableColumn[] = [
  {
    field: 'name',
    title: 'Person',
    width: 220,
    fixed: 'left',
    slots: { default: 'person', header: 'heading' },
  },
  { field: 'status', title: 'Status', width: 420 },
]
let app: App | undefined
let change: (stage: number) => void = () => {}
const settle = async () => {
  await nextTick()
  for (let i = 0; i < 4; i++) await new Promise(requestAnimationFrame)
}
const unmount = async () => {
  app?.unmount()
  app = undefined
  await settle()
}
const mount = async (mode: 'select' | 'grid', dark: boolean) => {
  await unmount()
  document.documentElement.classList.toggle('dark', dark)
  const stage = shallowRef(0)
  const model = reactive({ term: 'initial' })
  change = (next) => {
    stage.value = next
  }
  app = createApp(
    defineComponent({
      setup: () => () => {
        const current = stage.value
        const slots: Record<string, Slot> =
          current === 1 || current === 2
            ? {
                person: ({ value, rowIndex, columnIndex }) => [
                  h(
                    current === 1 ? 'b' : 'i',
                    {
                      class: 'audit-cell',
                      'data-row': rowIndex,
                      'data-column': columnIndex,
                    },
                    `${current}:${value}`,
                  ),
                ],
                ...(current === 1
                  ? {
                      heading: ({ column, columnIndex }) => [
                        h(
                          'b',
                          { class: 'audit-heading' },
                          `${column.title}:${columnIndex}`,
                        ),
                      ],
                    }
                  : {}),
              }
            : {}
        if (mode === 'select') {
          if (current === 1)
            Object.assign(slots, {
              prefix: () => h('b', { class: 'audit-prefix' }, 'P'),
              suffix: ({
                open,
                selectedRow,
              }: {
                open: boolean
                selectedRow: (typeof rows)[number]
              }) =>
                h('b', { class: 'audit-suffix' }, `${open}:${selectedRow.id}`),
              'popup-header': () =>
                h('span', { class: 'audit-popup-header' }, 'Records'),
            })
          return h(
            STableSelect,
            {
              data: rows,
              columns,
              modelValue: 0,
              labelKey: 'name',
              clearable: true,
              open: true,
              virtualConfig: { height: 180, dynamic: true, horizontal: true },
              popupConfig: { width: 680, maxWidth: 'calc(100vw - 48px)' },
              prefixConfig: current === 3 ? { icon: 'cb:user' } : undefined,
              suffixConfig:
                current === 3 ? { icon: 'cb:checkmark' } : undefined,
            },
            slots,
          )
        }
        if (current === 1)
          Object.assign(slots, {
            'query-term': ({ value }: { value: unknown }) =>
              h('b', { class: 'audit-query' }, String(value)),
            'query-actions': ({ busy }: { busy: boolean }) =>
              h('b', { class: 'audit-query-actions' }, String(busy)),
          })
        return h(
          STableGrid,
          {
            data: rows,
            columns,
            queryConfig: {
              model,
              items: [{ field: 'term', slots: { default: 'term' } }],
            },
            virtualConfig: { height: 180, dynamic: true, horizontal: true },
          },
          slots,
        )
      },
    }),
  )
  app.mount('#fixture')
  await settle()
}
const api = {
  mount,
  unmount,
  change: async (stage: number) => {
    change(stage)
    await settle()
  },
}
declare global {
  interface Window {
    tableSlotAudit: typeof api
  }
}
window.tableSlotAudit = api
