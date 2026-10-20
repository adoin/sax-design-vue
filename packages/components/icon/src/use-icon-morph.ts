import { computed, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import type { ComputedRef } from 'vue'
import type {
  IconMorphDetail,
  IconMorphOptions,
  MorphPlan,
} from './morph/types'
import type { SaxIconData } from './icon'

const canonicalAttributes = {
  viewBox: '0 0 24 24',
  width: '1em',
  height: '1em',
}

export const useIconMorph = (
  data: ComputedRef<SaxIconData | undefined>,
  configuration: () => boolean | IconMorphOptions,
  notify: (event: 'morphStart' | 'morphEnd', detail: IconMorphDetail) => void,
) => {
  const rendered = shallowRef(data.value)
  const active = shallowRef(false)
  let frame = 0
  let generation = 0
  let mounted = false
  let media: MediaQueryList | undefined
  const cancel = () => {
    generation++
    if (frame) cancelAnimationFrame(frame)
    frame = 0
    active.value = false
  }
  const reset = () => {
    cancel()
    rendered.value = data.value
  }
  onMounted(() => {
    mounted = true
    media = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    media?.addEventListener('change', reset)
  })
  onBeforeUnmount(() => {
    mounted = false
    cancel()
    media?.removeEventListener('change', reset)
  })
  watch(
    () => {
      const options = configuration()
      const settings = typeof options === 'object' ? options : {}
      return JSON.stringify([
        Boolean(options),
        'svg-morpheus',
        settings.duration ?? 360,
        settings.spring ?? 'snappy',
      ])
    },
    reset,
    { flush: 'sync' },
  )
  watch(
    data,
    async (target) => {
      const source = rendered.value
      cancel()
      const options = configuration()
      if (
        !mounted ||
        !options ||
        !source ||
        !target ||
        media?.matches ||
        (source.body === target.body &&
          JSON.stringify(source.attributes) ===
            JSON.stringify(target.attributes))
      ) {
        rendered.value = target
        return
      }
      const settings = typeof options === 'object' ? options : {}
      const duration = settings.duration ?? 360
      if (!Number.isFinite(duration) || duration <= 0) {
        rendered.value = target
        return
      }
      const engine = 'svg-morpheus' as const
      const ticket = generation
      try {
        // DOM-only parsing and the external engine never execute during SSR.
        const { readMorphShapes } = await import('./morph/svg')
        const from = readMorphShapes(source),
          to = readMorphShapes(target)
        const { createMorpheusPlan, springProgress } =
          await import('./morph/svg-morpheus')
        const plan: MorphPlan = createMorpheusPlan(from, to)
        const progress = (t: number) =>
          springProgress(t, settings.spring ?? 'snappy')
        if (!mounted || ticket !== generation) return
        const started = performance.now()
        active.value = true
        notify('morphStart', { engine, elapsed: 0 })
        if (!mounted || ticket !== generation) return
        // Flush a real frame-zero shape before scheduling the first animation frame.
        rendered.value = {
          attributes: canonicalAttributes,
          body: plan.frame(0),
        }
        let settledFrames = 0
        let canonical = false
        const tick = (now: number) => {
          if (!mounted || ticket !== generation) return
          const time = Math.min((now - started) / duration, 1)
          if (time >= 1) {
            frame = 0
            active.value = false
            rendered.value = target
            notify('morphEnd', { engine, elapsed: now - started })
          } else {
            const value = progress(time)
            if (!canonical) {
              const velocity =
                (progress(Math.min(1, time + 0.001)) -
                  progress(Math.max(0, time - 0.001))) /
                0.002
              settledFrames =
                time > 0.15 &&
                Math.abs(1 - value) < 0.001 &&
                Math.abs(velocity) < 0.02
                  ? settledFrames + 1
                  : 0
              canonical = settledFrames >= 2
            }
            // Restore exact artwork once the spring settles, rather than leaving
            // an approximate contour on screen until the duration budget expires.
            // Completion timing is unchanged; crossing 1 during a bounce is not settling.
            rendered.value = canonical
              ? target
              : {
                  attributes: canonicalAttributes,
                  body: plan.frame(value),
                }
            frame = requestAnimationFrame(tick)
          }
        }
        frame = requestAnimationFrame(tick)
      } catch {
        // Unsupported paint/geometry or a failed lazy chunk retains the exact SVG.
        if (mounted && ticket === generation) {
          active.value = false
          rendered.value = target
        }
      }
    },
    { flush: 'sync' },
  )
  return { rendered, active, enabled: computed(() => Boolean(configuration())) }
}
