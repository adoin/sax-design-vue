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
const ease = (value: number) => 1 - (1 - value) ** 3

export const svgDissolveFrame = (progress: number) => {
  const p = clamp(progress)
  const erosion = clamp(p / 0.7)
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
export const useSvgDissolve = (
  dissolved: MaybeRefOrGetter<boolean>,
  filter: Readonly<Ref<SVGFilterElement | null>>,
  options: {
    assembleDuration?: number
    onSettled?: (dissolved: boolean) => void
  } = {},
) => {
  let progress = toValue(dissolved) ? 1 : 0
  const initial = svgDissolveFrame(progress)
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
    const frame = svgDissolveFrame(progress)
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
    options.onSettled?.(progress === 1)
  }
  const animate = () => {
    stop()
    if (
      !active ||
      !view ||
      media?.matches ||
      filter.value?.ownerDocument.hidden
    )
      return settle()
    const target = toValue(dissolved) ? 1 : 0
    const from = progress
    const distance = Math.abs(target - from)
    if (!distance) return options.onSettled?.(target === 1)
    const started = view.performance.now()
    // Focus feedback must start promptly; reassembly can settle more softly.
    const duration =
      (target === 1 ? 480 : (options.assembleDuration ?? 650)) * distance
    if (!duration) return settle()
    const tick = (now: number) => {
      const elapsed = clamp((now - started) / duration)
      progress = from + (target - from) * ease(elapsed)
      render()
      if (elapsed < 1) raf = view!.requestAnimationFrame(tick)
      else {
        raf = 0
        options.onSettled?.(target === 1)
      }
    }
    raf = view.requestAnimationFrame(tick)
  }
  const visibilityChanged = () => {
    if (filter.value?.ownerDocument.hidden) settle()
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
    element?.ownerDocument.addEventListener(
      'visibilitychange',
      visibilityChanged,
    )
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
    filter.value?.ownerDocument.removeEventListener(
      'visibilitychange',
      visibilityChanged,
    )
    view = null
    threshold = displacement = offset = alpha = null
  })
  return initial
}
