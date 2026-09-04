import { createApp, defineComponent, h, nextTick, shallowRef } from 'vue'
import { SConfigProvider } from '../../packages/components/config-provider'
import { SButton } from '../../packages/components/button'
import {
  STable,
  createTableSvgChartAdapter,
} from '../../packages/components/table'
import '../../packages/theme-chalk/src/index.scss'
import '../../packages/theme-chalk/src/dark/css-vars.scss'
import type { TableColumn, TableExposes } from '../../packages/components/table'

const shape = shallowRef<'rounded' | 'square'>('rounded')
const loading = shallowRef(false)
const table = shallowRef<TableExposes>()
const rows = [
  { id: 1, name: 'Alpha', status: 'open', sales: 10 },
  { id: 2, name: 'Beta', status: 'done', sales: 20 },
]
const columns: TableColumn[] = [
  { field: 'name', title: 'Name', width: 180, fixed: 'left', editor: true },
  {
    field: 'status',
    title: 'Status',
    width: 180,
    editor: {
      type: 'select',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Done', value: 'done' },
      ],
    },
  },
  { field: 'sales', title: 'Sales', width: 180, editor: { type: 'number' } },
]
const chartConfig = { adapter: createTableSvgChartAdapter() }
const app = createApp(
  defineComponent({
    setup: () => () =>
      h(
        SConfigProvider,
        { shape: shape.value },
        {
          default: () => [
            h(
              SButton,
              { id: 'outside', size: 'small' },
              () => 'Outside action',
            ),
            h('div', { id: 'clip' }, [
              h(STable, {
                ref: table,
                data: rows,
                columns,
                loading: loading.value,
                columnManagerConfig: true,
                findConfig: true,
                chartConfig,
                editConfig: { mode: 'row' },
                contextMenuConfig: {
                  body: [
                    { value: 'copy', label: 'Copy' },
                    { value: 'delete', label: 'Delete', disabled: true },
                  ],
                },
              }),
            ]),
          ],
        },
      ),
  }),
)
app.mount('#fixture')
const audit = {
  async configure(options: {
    shape: 'rounded' | 'square'
    dark: boolean
    loading?: boolean
  }) {
    shape.value = options.shape
    loading.value = options.loading ?? false
    document.documentElement.classList.toggle('dark', options.dark)
    await nextTick()
  },
  openFind: () => table.value!.openFind(),
  closeFind: () => table.value!.closeFind(),
  edit: () => table.value!.startEdit(0, 'status'),
  cancelEdit: () => table.value!.cancelEdit(),
  openChart: () =>
    table.value!.openChart({
      category: 'name',
      series: [{ column: 'sales' }],
      scope: 'filtered',
    }),
  closeChart: () => table.value!.closeChart(),
  unmount: () => app.unmount(),
}
declare global {
  interface Window {
    tableOverlayAudit: typeof audit
  }
}
window.tableOverlayAudit = audit
