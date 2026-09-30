import {
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  toValue,
  watch,
} from 'vue'
import type { MaybeRefOrGetter, Ref } from 'vue'

const clamp = (value: number) => Math.max(0, Math.min(1, value))
const ease = (value: number) =>
  value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2

export const placeholderDissolveFrame = (progress: number) => {
  const p = clamp(progress)
  const erosion = clamp((p - 0.08) / 0.78)
  const scatter = clamp((p - 0.28) / 0.72) ** 2
  return {
    slope: 8 + erosion * 18,
    intercept: 1 - erosion * 14,
    scale: scatter * 26,
    dx: scatter * 12,
    dy: -scatter * 3.5,
    alpha: p === 1 ? 0 : p < 0.88 ? 1 : 1 - clamp((p - 0.88) / 0.12),
  }
}

/** Each caller owns its filter nodes and timeline; no shared mutable graph. */
export const usePlaceholderDissolve = (
  dissolved: MaybeRefOrGetter<boolean>,
  filter: Readonly<Ref<SVGFilterElement | null>>,
) => {
  let progress = toValue(dissolved) ? 1 : 0
  const initial = placeholderDissolveFrame(progress)
  let view: Window | null = null
  let media: MediaQueryList | undefined
  let active = false
  let raf = 0
  let threshold: Element | null = null
  let displacement: Element | null = null
  let offset: Element | null = null
  let alpha: Element | null = null
  const stop = () => {
    if (raf) view?.cancelAnimationFrame(raf)
    raf = 0
  }
  const render = () => {
    const frame = placeholderDissolveFrame(progress)
    threshold?.setAttribute('slope', String(frame.slope))
    threshold?.setAttribute('intercept', String(frame.intercept))
    displacement?.setAttribute('scale', String(frame.scale))
    offset?.setAttribute('dx', String(frame.dx))
    offset?.setAttribute('dy', String(frame.dy))
    alpha?.setAttribute('slope', String(frame.alpha))
  }
  const settle = () => {
    stop()
    progress = toValue(dissolved) ? 1 : 0
    render()
  }
  const animate = () => {
    stop()
    if (!active || !view || media?.matches) return settle()
    const target = toValue(dissolved) ? 1 : 0
    const from = progress
    const distance = Math.abs(target - from)
    if (!distance) return
    const started = view.performance.now()
    const duration = 950 * distance
    const tick = (now: number) => {
      const elapsed = clamp((now - started) / duration)
      progress = from + (target - from) * ease(elapsed)
      render()
      if (elapsed < 1) raf = view!.requestAnimationFrame(tick)
      else raf = 0
    }
    raf = view.requestAnimationFrame(tick)
  }
  watch(() => toValue(dissolved), animate, { flush: 'post' })
  onMounted(() => {
    const element = filter.value
    view = element?.ownerDocument.defaultView ?? null
    threshold = element?.querySelector('[data-dissolve-threshold]') ?? null
    displacement = element?.querySelector('feDisplacementMap') ?? null
    offset = element?.querySelector('feOffset') ?? null
    alpha = element?.querySelector('[data-dissolve-alpha]') ?? null
    media = view?.matchMedia?.('(prefers-reduced-motion: reduce)')
    media?.addEventListener('change', settle)
    active = true
    settle()
  })
  onDeactivated(() => {
    active = false
    settle()
  })
  onActivated(() => {
    active = true
    settle()
  })
  onBeforeUnmount(() => {
    active = false
    stop()
    media?.removeEventListener('change', settle)
    view = null
    threshold = displacement = offset = alpha = null
  })
  return initial
}
