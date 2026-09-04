import { onBeforeUnmount, shallowRef, watch } from 'vue'
import type { TableMergeIndex } from './table-merge-regions'

type Area = 'body' | 'footer'
interface HeightOptions {
  root: () => HTMLElement | undefined
  enabled: () => boolean
  index: (area: Area) => TableMergeIndex
  columnCount: () => number
  shrink: () => void
}
interface Size {
  height: number
  content: string
}

/** Allocate intrinsic merged content across its logical rows without expanding the range. */
export function useTableMergeHeights(options: HeightOptions) {
  const sizes = shallowRef(new Map<string, Size>())
  const dirty = new Set<string>()
  let root: HTMLElement | undefined
  let resize: ResizeObserver | undefined
  let mutation: MutationObserver | undefined
  let observed = new Set<Element>()
  let frame: number | undefined
  let disposed = false
  const read = () => {
    frame = undefined
    if (!root || disposed || !options.enabled()) return
    const next = new Map(sizes.value)
    const targets = new Set<Element>()
    let changed = false
    let shrank = false
    const rootRect = root.getBoundingClientRect()
    const scale = root.offsetHeight
      ? rootRect.height / root.offsetHeight || 1
      : 1
    for (const fragment of root.querySelectorAll<HTMLElement>(
      '[data-merge-primary]',
    )) {
      if (fragment.closest('[role="table"]') !== root) continue
      const cell = fragment.querySelector<HTMLElement>('[role="cell"]')
      if (!cell) continue
      targets.add(cell)
      const style = getComputedStyle(cell)
      const children = [...cell.children].filter(
        (child): child is HTMLElement =>
          child instanceof HTMLElement &&
          getComputedStyle(child).display !== 'none' &&
          !['absolute', 'fixed'].includes(getComputedStyle(child).position),
      )
      const heights = children.map((child) => {
        targets.add(child)
        const childStyle = getComputedStyle(child)
        return (
          child.getBoundingClientRect().height / scale +
          (Number.parseFloat(childStyle.marginTop) || 0) +
          (Number.parseFloat(childStyle.marginBottom) || 0)
        )
      })
      const content =
        style.flexDirection === 'column'
          ? heights.reduce((sum, height) => sum + height, 0) +
            Math.max(0, heights.length - 1) *
              (Number.parseFloat(style.rowGap) || 0)
          : Math.max(0, ...heights)
      const height = Math.ceil(
        content +
          (Number.parseFloat(style.paddingTop) || 0) +
          (Number.parseFloat(style.paddingBottom) || 0),
      )
      const area: Area = fragment.classList.contains('is-footer-merge')
        ? 'footer'
        : 'body'
      const key = `${area}:${fragment.dataset.mergeRegion}`
      const old = next.get(key)
      const contentKey = JSON.stringify([
        cell.textContent,
        [
          ...cell.querySelectorAll<
            | HTMLInputElement
            | HTMLTextAreaElement
            | HTMLSelectElement
            | HTMLImageElement
          >('input,textarea,select,img'),
        ].map((element) =>
          element instanceof HTMLImageElement
            ? ['img', element.currentSrc || element.src]
            : [element.tagName, element.value],
        ),
      ])
      // A different visible pane can be narrower. Retain its largest requirement
      // until the real data/column layout is invalidated by the table.
      const retained =
        old && old.content === contentKey && !dirty.has(key)
          ? Math.max(old.height, height)
          : height
      dirty.delete(key)
      if (!old || old.height !== retained || old.content !== contentKey) {
        next.set(key, { height: retained, content: contentKey })
        changed = true
        shrank ||= Boolean(old && retained < old.height)
      }
    }
    for (const target of observed)
      if (!targets.has(target)) resize?.unobserve(target)
    for (const target of targets)
      if (!observed.has(target)) resize?.observe(target)
    observed = targets
    if (changed) sizes.value = next
    if (shrank) options.shrink()
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
    observed.clear()
  }
  const clear = () => {
    const hadSizes = sizes.value.size > 0
    if (hadSizes) sizes.value = new Map()
    dirty.clear()
    measure()
    return hadSizes
  }
  watch(
    () => [options.root(), options.enabled()],
    () => {
      disconnect()
      root = options.root()
      if (!root || !options.enabled()) {
        clear()
        return
      }
      if (typeof ResizeObserver !== 'undefined')
        resize = new ResizeObserver(measure)
      mutation = new MutationObserver((records) => {
        for (const record of records) {
          const element =
            record.target instanceof Element
              ? record.target
              : record.target.parentElement
          const fragment = element?.closest<HTMLElement>('[data-merge-primary]')
          const cell = element?.closest('[role="cell"]')
          // Fragment geometry changes on every scroll. Only content changes
          // invalidate its retained natural height, including in-place row edits.
          if (
            !fragment ||
            !cell ||
            !fragment.contains(cell) ||
            (record.type === 'attributes' && element === cell) ||
            fragment.closest('[role="table"]') !== root
          )
            continue
          const area = fragment.classList.contains('is-footer-merge')
            ? 'footer'
            : 'body'
          dirty.add(`${area}:${fragment.dataset.mergeRegion}`)
        }
        measure()
      })
      mutation.observe(root, {
        childList: true,
        characterData: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style'],
      })
      measure()
    },
    { immediate: true, flush: 'post' },
  )
  onBeforeUnmount(() => {
    disposed = true
    disconnect()
  })
  const minimum = (area: Area, row: number) => {
    if (!options.enabled() || !sizes.value.size) return undefined
    let height = 44
    for (const region of options.index(area).query({
      rowStart: row,
      rowEnd: row + 1,
      colStart: 0,
      colEnd: options.columnCount(),
    })) {
      const natural = sizes.value.get(`${area}:${region.key}`)?.height ?? 0
      height = Math.max(height, Math.ceil(natural / region.rowspan))
    }
    return height > 44 ? height : undefined
  }
  return { minimum, clear }
}
