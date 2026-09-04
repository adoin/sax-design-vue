import {
  computed,
  createApp,
  defineComponent,
  h,
  nextTick,
  shallowRef,
  unref,
} from 'vue'
import { STable } from '../../packages/components/table'
import '../../packages/theme-chalk/src/index.scss'
import type { ComponentInternalInstance, Ref } from 'vue'
import type {
  TableExposes,
  TableVirtualConfig,
  TableVirtualSource,
} from '../../packages/components/table'

interface Settings {
  rows: number
  columns: number
  dynamic: boolean
  generated: boolean
}
const root = document.querySelector('#fixture')!
let app: ReturnType<typeof createApp> | undefined
let table: TableExposes | undefined
let instance: ComponentInternalInstance | undefined
let rowReads = 0
let columnReads = 0
let setLongContent: ((value: boolean) => void) | undefined
const frame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
const settle = async () => {
  await nextTick()
  await frame()
  await frame()
  await frame()
}
// Private cache inspection belongs only in this dev fixture, never the public API.
type Cache = { size: number }
interface VirtualState {
  sparseVirtualizer: {
    measuredSizeCache: Cache
    totalSize: number | Ref<number>
    physicalSize: number | Ref<number>
  }
  measuredSizeCache: Cache
  measuredElements: Cache
  measurementRefCallbacks: Cache
  pendingSparseMeasurements: Cache
}
const state = <T>(node: ComponentInternalInstance) =>
  (node as unknown as { setupState: T }).setupState
const caches = () => {
  if (!instance) throw new Error('Table inspection is unavailable')
  const tableState = state<{
    virtualListRef?: { $: ComponentInternalInstance }
  }>(instance)
  const virtualList = tableState.virtualListRef
  const virtualState = virtualList?.$ && state<VirtualState>(virtualList.$)
  if (!virtualState) throw new Error('VirtualList inspection is unavailable')
  const sparse = virtualState.sparseVirtualizer
  return {
    sparseRows: sparse.measuredSizeCache.size,
    ordinaryRows: virtualState.measuredSizeCache.size,
    measuredElements: virtualState.measuredElements.size,
    refCallbacks: virtualState.measurementRefCallbacks.size,
    pendingMeasurements: virtualState.pendingSparseMeasurements.size,
    logicalHeight: unref(sparse.totalSize),
    physicalHeight: unref(sparse.physicalSize),
  }
}
const inspect = () => ({
  rowReads,
  columnReads,
  rows: root.querySelectorAll('[data-table-row-index]').length,
  cells: root.querySelectorAll('.s-table__data-cell').length,
  headers: root.querySelectorAll('.s-table__data-head-cell').length,
  caches: caches(),
  scroll: (() => {
    const element = root.querySelector<HTMLElement>('.s-vl__window')!
    const rect = element.getBoundingClientRect()
    return {
      top: rect.top,
      bottom: rect.top + element.clientHeight,
      x: rect.x,
      width: rect.width,
      scrollTop: element.scrollTop,
      scrollHeight: element.scrollHeight,
    }
  })(),
  renderedRows: [
    ...root.querySelectorAll<HTMLElement>('[data-table-row-index]'),
  ].map((row) => ({
    index: Number(row.dataset.tableRowIndex),
    top: row.getBoundingClientRect().top,
    height: row.getBoundingClientRect().height,
    cells: [...row.querySelectorAll<HTMLElement>('.s-table__data-cell')].map(
      (cell) => {
        const rect = cell.getBoundingClientRect()
        return {
          column: Number(cell.dataset.columnIndex),
          top: rect.top,
          height: rect.height,
          left: rect.left,
          right: rect.right,
          fixed: cell.classList.contains('is-fixed-column'),
        }
      },
    ),
  })),
})
const unmount = async () => {
  app?.unmount()
  app = undefined
  table = undefined
  instance = undefined
  setLongContent = undefined
  await settle()
}
const mount = async (settings: Settings) => {
  await unmount()
  rowReads = 0
  columnReads = 0
  const started = performance.now()
  app = createApp(
    defineComponent({
      setup() {
        const longContent = shallowRef(false)
        setLongContent = (value) => {
          longContent.value = value
        }
        const column = (index: number) => {
          columnReads++
          return {
            key: String(index),
            field: `c${index}`,
            title: `Column ${index}`,
            width: 140,
            fixed:
              index === 0
                ? ('left' as const)
                : index === settings.columns - 1
                  ? ('right' as const)
                  : undefined,
          }
        }
        const row = (index: number, long: boolean) => {
          rowReads++
          return new Proxy(
            { id: index },
            {
              get(target, key) {
                if (typeof key === 'string' && /^c\d+$/.test(key)) {
                  const value = `Row ${index} / ${key}`
                  return long &&
                    index === settings.rows - 1 &&
                    key === `c${settings.columns - 2}`
                    ? `${value} `.repeat(24)
                    : value
                }
                return Reflect.get(target, key)
              },
            },
          )
        }
        const source = computed<TableVirtualSource>(() => {
          const long = longContent.value
          return {
            rowCount: settings.rows,
            columnCount: settings.columns,
            columnWidth: 140,
            fixedLeftCount: 1,
            fixedRightCount: 1,
            rowKey: (index) => index,
            row: (index) => row(index, long),
            column,
          }
        })
        const data = settings.generated
          ? []
          : Array.from({ length: settings.rows }, (_, index) =>
              row(index, false),
            )
        const columns = settings.generated
          ? []
          : Array.from({ length: settings.columns }, (_, index) =>
              column(index),
            )
        return () =>
          h(STable, {
            ref: (value: unknown) => {
              table = value as unknown as TableExposes
            },
            rowKey: 'id',
            data,
            columns,
            virtualSource: settings.generated ? source.value : undefined,
            virtualConfig: {
              enabled: true,
              horizontal: true,
              dynamic: settings.dynamic,
              height: 360,
              estimateSize: 44,
              overscan: 6,
              columnOverscan: 2,
            } satisfies TableVirtualConfig,
          })
      },
    }),
  )
  const vm = app.mount(root)
  instance = vm.$.subTree.component ?? undefined
  await settle()
  return { mountMs: performance.now() - started, ...inspect() }
}
Object.assign(window, {
  tableAudit: {
    mount,
    unmount,
    inspect,
    settle,
    jump: async (row: number, column: number) => {
      const started = performance.now()
      table!.scrollToRow(row, 'end')
      table!.scrollToColumn(column, 'end')
      await settle()
      return { jumpMs: performance.now() - started, ...inspect() }
    },
    content: async (long: boolean) => {
      setLongContent!(long)
      await settle()
      return inspect()
    },
    measure: async () => {
      table!.measure()
      await settle()
      return inspect()
    },
  },
})
