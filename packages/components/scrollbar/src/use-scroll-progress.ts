import { watch } from 'vue'
import type { Ref } from 'vue'

type Axis = 'x' | 'y'
type ProgressProps = { readonly x?: number; readonly y?: number }
const clamp = (value: number) => Math.min(100, Math.max(0, value))

/** Synchronize actual scroll offsets without writing emitted progress back into the viewport. */
export function useScrollProgress(
  viewport: Ref<HTMLDivElement | undefined>,
  props: ProgressProps,
  emit: (event: 'update:x' | 'update:y', value: number) => void,
) {
  const reported: Partial<Record<Axis, number>> = {}
  const pending: Partial<Record<Axis, number>> = { x: props.x, y: props.y }
  const metrics = (element: HTMLDivElement, axis: Axis) => {
    const horizontal = axis === 'x'
    const extent = horizontal ? element.clientWidth : element.clientHeight
    const range = Math.max(
      0,
      (horizontal ? element.scrollWidth : element.scrollHeight) - extent,
    )
    const rtl = horizontal && getComputedStyle(element).direction === 'rtl'
    return { extent, range, sign: rtl ? -1 : 1 }
  }
  const sync = () => {
    const element = viewport.value
    if (!element) return
    for (const axis of ['x', 'y'] as const) {
      const { extent, range, sign } = metrics(element, axis)
      // A hidden/transitioning viewport has no meaningful percentage yet.
      if (!extent) {
        pending[axis] ??= reported[axis]
        continue
      }
      const target = pending[axis]
      if (target !== undefined && Number.isFinite(target)) {
        const offset = ((range * clamp(target)) / 100) * sign
        if (axis === 'x') element.scrollLeft = offset
        else element.scrollTop = offset
      }
      delete pending[axis]
      const offset =
        axis === 'x' ? element.scrollLeft * sign : element.scrollTop
      const progress = range > 0 ? clamp((offset / range) * 100) : 0
      const needsCorrection =
        target !== undefined && Number.isFinite(target) && target !== progress
      if (reported[axis] === progress && !needsCorrection) continue
      reported[axis] = progress
      emit(axis === 'x' ? 'update:x' : 'update:y', progress)
    }
  }

  watch(
    () => [props.x, props.y] as const,
    (values, previous) => {
      for (const [index, axis] of (['x', 'y'] as const).entries()) {
        const value = values[index]
        if (value === undefined) delete pending[axis]
        if (
          value === previous[index] ||
          value === undefined ||
          !Number.isFinite(value)
        )
          continue
        // A v-model echo must never cancel native smooth scrolling or snap fractional pixels.
        if (
          reported[axis] !== undefined &&
          Math.abs(value - reported[axis]!) < 0.000001
        )
          continue
        pending[axis] = value
      }
      sync()
    },
    { flush: 'post' },
  )

  return sync
}
