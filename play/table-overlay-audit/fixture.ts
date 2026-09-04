import {
  createApp,
  defineComponent,
  h,
  nextTick,
  reactive,
  shallowRef,
} from 'vue'
import { SConfigProvider } from '../../packages/components/config-provider'
import { SButton } from '../../packages/components/button'
import { SInput } from '../../packages/components/input'
import { SSelect } from '../../packages/components/select'
import { STableGrid } from '../../packages/components/table-grid'
import {
  STable,
  createTableSvgChartAdapter,
} from '../../packages/components/table'
import '../../packages/theme-chalk/src/index.scss'
import '../../packages/theme-chalk/src/dark/css-vars.scss'
import type { TableColumn, TableExposes } from '../../packages/components/table'
import type { TableGridExposes } from '../../packages/components/table-grid'

const shape = shallowRef<'rounded' | 'square'>('rounded')
const loading = shallowRef(false)
const table = shallowRef<TableExposes>()
const grid = shallowRef<TableGridExposes>()
const gridMode = new URLSearchParams(location.search).has('grid')
const queryModel = reactive({ term: 'Alpha', status: 'open' })
const events = { queries: 0, actions: 0 }
let finishQuery: (() => void) | undefined
const rows = [
  { id: 1, name: 'Alpha', status: 'open', sales: 10 },
  { id: 2, name: 'Beta', status: 'done', sales: 20 },
]
const columns: TableColumn[] = [
  {
    field: 'name',
    title: 'Name',
    width: 180,
    fixed: 'left',
    editor: true,
    sortable: true,
    filters: [
      { label: 'Alpha', value: 'Alpha' },
      { label: 'Beta', value: 'Beta', disabled: true },
    ],
  },
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
            h(
              'div',
              { id: 'clip', style: gridMode ? { height: 'auto' } : undefined },
              [
                gridMode
                  ? h(STableGrid, {
                      ref: grid,
                      data: rows,
                      columns,
                      loading: loading.value,
                      queryConfig: {
                        model: queryModel,
                        items: [
                          {
                            field: 'term',
                            title: 'Term',
                            span: { xs: 24, sm: 12 },
                            itemRender: { name: 'SInput', component: SInput },
                          },
                          {
                            field: 'status',
                            title: 'Status',
                            span: { xs: 24, sm: 12 },
                            itemRender: {
                              name: 'SSelect',
                              component: SSelect,
                              options: [
                                { label: 'Open', value: 'open' },
                                { label: 'Done', value: 'done' },
                              ],
                            },
                          },
                        ],
                      },
                      toolbarConfig: {
                        title: 'Project records',
                        buttons: [
                          { code: 'add', text: 'Add' },
                          { code: 'delete', text: 'Delete', disabled: true },
                        ],
                      },
                      proxyConfig: {
                        autoLoad: false,
                        query: () => {
                          events.queries++
                          return new Promise<{
                            data: typeof rows
                            total: number
                          }>((resolve) => {
                            finishQuery = () =>
                              resolve({ data: rows, total: rows.length })
                          })
                        },
                      },
                      onToolbarClick: () => events.actions++,
                    })
                  : h(STable, {
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
              ],
            ),
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
  gridEvents: () => ({ ...events }),
  finishQuery: () => finishQuery?.(),
  unmount: () => app.unmount(),
}
declare global {
  interface Window {
    tableOverlayAudit: typeof audit
  }
}
window.tableOverlayAudit = audit
