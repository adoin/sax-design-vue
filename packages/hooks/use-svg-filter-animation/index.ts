import {
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  toValue,
  watch,
} from 'vue'
import type { MaybeRefOrGetter, Ref } from 'vue'
import type { SvgFilterAnimationModule } from '@vuesax-alpha/utils'
const clamp = (value: number) => Math.max(0, Math.min(1, value))
const ease = (value: number) => 1 - (1 - value) ** 3
/** Each caller owns its filter nodes and timeline; no shared mutable graph. */
export const useSvgFilterAnimation = (
  module: SvgFilterAnimationModule,
  targetProgress: MaybeRefOrGetter<number>,
  filter: Readonly<Ref<SVGFilterElement | null>>,
  options: {
    duration?: MaybeRefOrGetter<number>
    reverseDuration?: number
    onSettled?: (progress: number) => void
    initialProgress?: number
    animateOnMount?: boolean
  } = {},
) => {
  let progress = clamp(options.initialProgress ?? toValue(targetProgress))
  const initial = module.frame(progress)
  let view: Window | null = null
  let owner: Document | undefined
  let media: MediaQueryList | undefined
  let active = false
  let raf = 0
  let bindings: { element: Element; attribute: string; channel: string }[] = []
  const stop = () => {
    if (raf) view?.cancelAnimationFrame(raf)
    raf = 0
  }
  const render = () => {
    const frame = module.frame(progress)
    for (const binding of bindings)
      binding.element.setAttribute(
        binding.attribute,
        String(frame[binding.channel]),
      )
  }
  const settle = () => {
    stop()
    progress = clamp(toValue(targetProgress))
    render()
    options.onSettled?.(progress)
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
    const target = clamp(toValue(targetProgress))
    const from = progress
    const distance = Math.abs(target - from)
    if (!distance) return options.onSettled?.(target)
    const started = view.performance.now()
    // Focus feedback must start promptly; reassembly can settle more softly.
    const requestedDuration =
      target > from
        ? toValue(options.duration ?? module.duration ?? 480)
        : (options.reverseDuration ??
          module.reverseDuration ??
          module.duration ??
          650)
    const duration =
      (Number.isFinite(requestedDuration)
        ? Math.max(0, requestedDuration)
        : target > from
          ? 480
          : 650) * distance
    if (!duration) return settle()
    const tick = (now: number) => {
      const elapsed = clamp((now - started) / duration)
      progress = from + (target - from) * (module.easing ?? ease)(elapsed)
      render()
      if (elapsed < 1) raf = view!.requestAnimationFrame(tick)
      else {
        raf = 0
        options.onSettled?.(target)
      }
    }
    raf = view.requestAnimationFrame(tick)
  }
  const visibilityChanged = () => {
    if (filter.value?.ownerDocument.hidden) settle()
  }
  watch(() => toValue(targetProgress), animate, { flush: 'post' })
  onMounted(() => {
    const element = filter.value
    owner = element?.ownerDocument
    view = element?.ownerDocument.defaultView ?? null
    bindings = module.bindings.map((binding) => {
      let node: Element | undefined = element ?? undefined
      for (const index of binding.path) node = node?.children[index]
      if (!node)
        throw new Error(`Missing SVG animation node: ${binding.channel}`)
      return { ...binding, element: node }
    })
    media = view?.matchMedia?.('(prefers-reduced-motion: reduce)')
    media?.addEventListener('change', settle)
    element?.ownerDocument.addEventListener(
      'visibilitychange',
      visibilityChanged,
    )
    active = true
    if (options.animateOnMount) {
      render()
      animate()
    } else settle()
  })
  onDeactivated(() => {
    active = false
    settle()
  })
  onActivated(() => {
    if (active) return
    active = true
    settle()
  })
  onBeforeUnmount(() => {
    active = false
    stop()
    media?.removeEventListener('change', settle)
    owner?.removeEventListener('visibilitychange', visibilityChanged)
    view = null
    bindings = []
  })
  return initial
}
