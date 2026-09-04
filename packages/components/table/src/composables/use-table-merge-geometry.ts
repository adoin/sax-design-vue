import { onBeforeUnmount, shallowRef, watch } from 'vue'
import type {
  TableMergeClip,
  TableMergeColumnBox,
  TableMergeRowBox,
} from './table-merge-geometry'
import type { TableMergeWindow } from '../table-merge'

export interface TableMergeAreaGeometry {
  rows: TableMergeRowBox[]
  columns: TableMergeColumnBox[]
  clip: TableMergeClip
  windows: TableMergeWindow[]
}
export interface TableMergeGeometry {
  body: TableMergeAreaGeometry
  footer: TableMergeAreaGeometry
}
interface GeometryOptions {
  enabled: () => boolean
  root: () => HTMLElement | undefined
  viewport: () => HTMLElement | undefined
  rowOffset: () => number
}

const emptyArea = (): TableMergeAreaGeometry => ({
  rows: [],
  columns: [],
  clip: { left: 0, right: 0, top: 0, bottom: 0 },
  windows: [],
})
const emptyGeometry = (): TableMergeGeometry => ({
  body: emptyArea(),
  footer: emptyArea(),
})

/** Query only mounted contiguous runs, never the gaps between distant fixed columns. */
export function tableMergeGeometryWindows(
  rows: readonly TableMergeRowBox[],
  columns: readonly TableMergeColumnBox[],
): TableMergeWindow[] {
  const rowRuns: { start: number; end: number }[] = []
  const columnRuns: { start: number; end: number; fixed?: string }[] = []
  for (const row of [...rows].sort((a, b) => a.index - b.index)) {
    const run = rowRuns[rowRuns.length - 1]
    if (run?.end === row.index) run.end++
    else rowRuns.push({ start: row.index, end: row.index + 1 })
  }
  for (const column of [...columns].sort((a, b) => a.position - b.position)) {
    const run = columnRuns[columnRuns.length - 1]
    if (run?.end === column.position && run.fixed === column.fixed) run.end++
    else
      columnRuns.push({
        start: column.position,
        end: column.position + 1,
        fixed: column.fixed,
      })
  }
  const windows: TableMergeWindow[] = []
  for (const row of rowRuns)
    for (const column of columnRuns)
      windows.push({
        rowStart: row.start,
        rowEnd: row.end,
        colStart: column.start,
        colEnd: column.end,
      })
  return windows
}

/** Measure physical cells, including compressed virtual windows and sticky columns. */
export function useTableMergeGeometry(options: GeometryOptions) {
  const geometry = shallowRef<TableMergeGeometry>(emptyGeometry())
  let root: HTMLElement | undefined
  let viewport: HTMLElement | undefined
  let resize: ResizeObserver | undefined
  let mutation: MutationObserver | undefined
  let observed = new Set<Element>()
  let frame: number | undefined
  let disposed = false
  const inLayer = (node: Node) =>
    (node instanceof Element ? node : node.parentElement)?.closest(
      '[data-table-merge-layer]',
    )
  const owns = (element: Element) =>
    element.closest('[role="table"]') === root && !inLayer(element)

  const read = () => {
    frame = undefined
    if (disposed || !root || !options.enabled()) return
    const origin = root.getBoundingClientRect()
    // DOMRect includes ancestor transforms. Convert back to the layer's CSS pixels.
    const scaleX = root.offsetWidth ? origin.width / root.offsetWidth || 1 : 1
    const scaleY = root.offsetHeight
      ? origin.height / root.offsetHeight || 1
      : 1
    const box = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect()
      return {
        left: (rect.left - origin.left) / scaleX + root!.scrollLeft,
        top: (rect.top - origin.top) / scaleY + root!.scrollTop,
        width: rect.width / scaleX,
        height: rect.height / scaleY,
      }
    }
    const visible = viewport ?? root
    const bounds = box(visible)
    const viewportClip: TableMergeClip = {
      left: bounds.left + visible.clientLeft,
      right: bounds.left + visible.clientLeft + visible.clientWidth,
      top: bounds.top + visible.clientTop,
      bottom: bounds.top + visible.clientTop + visible.clientHeight,
    }
    const targets = new Set<Element>([root, visible])
    const readArea = (area: 'body' | 'footer'): TableMergeAreaGeometry => {
      const elements = [
        ...root!.querySelectorAll<HTMLElement>(
          area === 'body' ? '[data-table-row-index]' : '[data-footer-row-key]',
        ),
      ].filter(owns)
      const rows = elements
        .map((element, index) => {
          targets.add(element)
          const rect = box(element)
          return {
            index:
              area === 'body'
                ? Number(element.dataset.tableRowIndex) + options.rowOffset()
                : Number(element.dataset.footerRowIndex ?? index),
            top: rect.top,
            height: rect.height,
          }
        })
        .filter((row) => Number.isSafeInteger(row.index) && row.height > 0)
      const cells = elements[0]
        ? [
            ...elements[0].querySelectorAll<HTMLElement>('[data-column-index]'),
          ].filter(owns)
        : []
      const columns = cells
        .map((cell): TableMergeColumnBox => {
          targets.add(cell)
          const rect = box(cell)
          return {
            position: Number(
              cell.dataset.columnPosition ??
                Number(cell.getAttribute('aria-colindex')) - 1,
            ),
            left: rect.left,
            width: rect.width,
            fixed: cell.classList.contains('is-fixed-left')
              ? 'left'
              : cell.classList.contains('is-fixed-right')
                ? 'right'
                : undefined,
          }
        })
        .filter(
          (column) =>
            Number.isSafeInteger(column.position) &&
            column.position >= 0 &&
            column.width > 0,
        )
      const clip =
        area === 'body'
          ? viewportClip
          : {
              ...viewportClip,
              top: rows.length ? Math.min(...rows.map((row) => row.top)) : 0,
              bottom: Math.max(...rows.map((row) => row.top + row.height), 0),
            }
      return {
        rows,
        columns,
        clip,
        windows: tableMergeGeometryWindows(rows, columns),
      }
    }
    const next = { body: readArea('body'), footer: readArea('footer') }
    for (const element of observed)
      if (!targets.has(element)) resize?.unobserve(element)
    for (const element of targets)
      if (!observed.has(element)) resize?.observe(element)
    observed = targets
    // Scroll and mutation notifications often describe the same frame.
    if (JSON.stringify(next) !== JSON.stringify(geometry.value))
      geometry.value = next
  }
  const measure = () => {
    if (!disposed && options.enabled() && frame === undefined)
      frame = requestAnimationFrame(read)
  }
  const disconnect = () => {
    if (frame !== undefined) cancelAnimationFrame(frame)
    frame = undefined
    resize?.disconnect()
    mutation?.disconnect()
    root?.removeEventListener('scroll', measure, true)
    // An ordinary table's scroll element is an ancestor of the layer root.
    if (viewport !== root)
      viewport?.removeEventListener('scroll', measure, true)
    observed.clear()
  }
  watch(
    () => [
      options.enabled(),
      options.root(),
      options.viewport(),
      options.rowOffset(),
    ],
    () => {
      disconnect()
      root = options.root()
      viewport = options.viewport()
      if (!options.enabled() || !root) {
        geometry.value = emptyGeometry()
        return
      }
      if (typeof ResizeObserver !== 'undefined')
        resize = new ResizeObserver(measure)
      mutation = new MutationObserver((records) => {
        if (
          records.some((record) => {
            if (inLayer(record.target)) return false
            if (record.type !== 'childList') return true
            return [...record.addedNodes, ...record.removedNodes].some(
              (node) => !inLayer(node),
            )
          })
        )
          measure()
      })
      mutation.observe(root, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
        attributeFilter: [
          'class',
          'style',
          'data-table-row-index',
          'data-column-index',
          'aria-colindex',
        ],
      })
      root.addEventListener('scroll', measure, true)
      if (viewport !== root) viewport?.addEventListener('scroll', measure, true)
      measure()
    },
    { immediate: true, flush: 'post' },
  )
  onBeforeUnmount(() => {
    disposed = true
    disconnect()
  })
  return { geometry, measure }
}
