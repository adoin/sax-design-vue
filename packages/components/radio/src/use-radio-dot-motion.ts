import { nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import { radioDotKeyframes } from './radio-dot-keyframes'
import type { Ref } from 'vue'
import type { RadioValue } from './radio-group'

interface MotionOptions {
  modelValue: RadioValue
  animated: boolean
  disabled: boolean
  direction?: 'horizontal' | 'vertical'
}

/** Animate only a group's accepted selection; native inputs retain all semantics. */
export function useRadioDotMotion(
  root: Readonly<Ref<HTMLElement | null>>,
  options: MotionOptions,
) {
  let animation: Animation | undefined
  let owners: HTMLElement[] = []
  let revision = 0
  let reduced: MediaQueryList | undefined

  const stop = () => {
    if (animation) {
      animation.onfinish = null
      animation.cancel()
      animation = undefined
    }
    owners.forEach((owner) => {
      delete owner.dataset.radioDotMoving
    })
    owners = []
  }
  const cancel = () => {
    revision++
    stop()
  }
  const activeDot = () => {
    const dots = root.value?.querySelectorAll<SVGCircleElement>(
      '.s-radio-wrapper.is-active .s-radio__dot, .s-radio-button.is-active .s-radio-button__dot',
    )
    return Array.from(dots ?? []).find(
      (dot) => dot.closest('[role="radiogroup"]') === root.value,
    )
  }
  const ownerOf = (dot: Element) =>
    dot.closest<HTMLElement>('.s-radio-wrapper, .s-radio-button')!

  watch(
    () => options.modelValue,
    async () => {
      const previous = activeDot()
      const from = previous?.getBoundingClientRect()
      cancel()
      const current = revision
      if (
        !options.animated ||
        options.disabled ||
        reduced?.matches ||
        !previous ||
        !from?.width ||
        ownerOf(previous).classList.contains('is-disabled')
      )
        return

      owners = [ownerOf(previous)]
      owners[0].dataset.radioDotMoving = ''
      await nextTick()
      if (current !== revision) return
      const dot = activeDot()
      if (!dot || dot === previous || typeof dot.animate !== 'function') {
        stop()
        return
      }
      const owner = ownerOf(dot)
      if (owner.classList.contains('is-disabled')) {
        stop()
        return
      }
      owner.dataset.radioDotMoving = ''
      owners.push(owner)
      const to = dot.getBoundingClientRect()
      const svg = dot.ownerSVGElement?.getBoundingClientRect()
      if (!to.width || !svg?.width || !svg.height) {
        stop()
        return
      }
      const dx =
        ((from.x + from.width / 2 - to.x - to.width / 2) * 20) / svg.width
      const dy =
        ((from.y + from.height / 2 - to.y - to.height / 2) * 20) / svg.height
      if (Math.hypot(dx, dy) < 1) {
        stop()
        return
      }
      const style = getComputedStyle(root.value!)
      const time = style.getPropertyValue('--sax-motion-duration-medium').trim()
      const duration = time
        ? Number.parseFloat(time) * (time.endsWith('ms') ? 1 : 1000)
        : 350
      const fill = getComputedStyle(dot).fill
      const flight =
        style.getPropertyValue('--sax-radio-dot-flight-color').trim() || fill
      const horizontal = options.direction
        ? options.direction === 'horizontal'
        : Math.abs(dx) > Math.abs(dy)
      const points = [{ x: dx, y: dy }]
      if (horizontal) {
        const dots = Array.from(
          root.value!.querySelectorAll<SVGCircleElement>(
            '.s-radio__dot, .s-radio-button__dot',
          ),
        ).filter(
          (candidate) =>
            candidate.closest('[role="radiogroup"]') === root.value &&
            !ownerOf(candidate).classList.contains('is-disabled') &&
            candidate.getBoundingClientRect().width > 0,
        )
        const centers = dots.map((candidate) => {
          const rect = candidate.getBoundingClientRect()
          return {
            x:
              ((rect.x + rect.width / 2 - to.x - to.width / 2) * 20) /
              svg.width,
            y:
              ((rect.y + rect.height / 2 - to.y - to.height / 2) * 20) /
              svg.height,
          }
        })
        let start = -1
        let nearest = Infinity
        centers.forEach((point, index) => {
          const distance = Math.hypot(point.x - dx, point.y - dy)
          if (distance < nearest) {
            start = index
            nearest = distance
          }
        })
        const end = dots.indexOf(dot)
        const step = end > start ? 1 : -1
        if (start >= 0 && end >= 0 && start !== end) {
          for (let index = start + step; index !== end; index += step)
            points.push(centers[index])
        }
      }
      points.push({ x: 0, y: 0 })
      const baseDuration = Number.isFinite(duration) ? duration : 350
      const hops = points.length - 1
      animation = dot.animate(
        radioDotKeyframes(points, fill, flight, horizontal),
        {
          duration:
            hops === 1
              ? baseDuration
              : Math.min(baseDuration * 1.6, baseDuration * 0.55 * hops),
          easing: horizontal ? 'linear' : 'cubic-bezier(0.22, 1, 0.36, 1)',
        },
      )
      animation.onfinish = stop
    },
  )
  watch(() => [options.animated, options.disabled, options.direction], cancel, {
    flush: 'sync',
  })
  onMounted(() => {
    reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    reduced?.addEventListener('change', cancel)
    root.value?.addEventListener('scroll', cancel, true)
    window.addEventListener('resize', cancel)
  })
  onBeforeUnmount(() => {
    cancel()
    window.removeEventListener('resize', cancel)
    reduced?.removeEventListener('change', cancel)
    root.value?.removeEventListener('scroll', cancel, true)
  })
}
