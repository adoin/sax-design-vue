import { nextTick, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import type { ShallowRef } from 'vue'
import type { CheckboxIconAnimation } from '../checkbox'

type CustomIconElement = Readonly<ShallowRef<HTMLElement | null>>

type DrawableGeometry = SVGElement & {
  getTotalLength?: () => number
}

const geometrySelector = 'path, line, polyline, polygon, circle, ellipse, rect'

const isTransparentFill = (fill: string | null) =>
  fill === null || fill === '' || fill === 'none' || fill === 'transparent'

const isDrawableStroke = (element: SVGElement, svg: SVGSVGElement) => {
  const stroke = element.getAttribute('stroke') ?? svg.getAttribute('stroke')
  const fill = element.getAttribute('fill') ?? svg.getAttribute('fill')

  if (stroke && stroke !== 'none' && isTransparentFill(fill)) return true
  if (typeof window === 'undefined') return false

  const style = window.getComputedStyle(element)
  return style.stroke !== 'none' && isTransparentFill(style.fill)
}

const clearDrawableGeometry = (root: HTMLElement) => {
  root
    .querySelectorAll<HTMLElement>('[data-sax-checkbox-draw]')
    .forEach((element) => {
      delete element.dataset.saxCheckboxDraw
      element.style.removeProperty('--sax-checkbox-icon-path-length')
      element.style.removeProperty('--sax-checkbox-icon-path-delay')
    })
}

export const useCheckboxIconAnimation = (
  customIconElement: CustomIconElement,
  getRequestedAnimation: () => CheckboxIconAnimation,
) => {
  const resolvedIconAnimation = shallowRef<CheckboxIconAnimation>(
    getRequestedAnimation(),
  )
  let observer: MutationObserver | undefined
  let preparationId = 0

  const prepareIcon = async () => {
    const currentPreparationId = ++preparationId
    await nextTick()
    if (currentPreparationId !== preparationId) return

    const root = customIconElement.value
    const requestedAnimation = getRequestedAnimation()

    if (
      !root ||
      requestedAnimation === 'none' ||
      requestedAnimation === 'pop'
    ) {
      if (root) clearDrawableGeometry(root)
      resolvedIconAnimation.value = requestedAnimation
      return
    }

    clearDrawableGeometry(root)
    const svg = root.querySelector<SVGSVGElement>('svg')
    if (!svg) {
      resolvedIconAnimation.value = 'pop'
      return
    }

    const drawableElements = Array.from(
      svg.querySelectorAll<DrawableGeometry>(geometrySelector),
    ).filter((element) => isDrawableStroke(element, svg))

    let drawableIndex = 0
    for (const element of drawableElements) {
      if (typeof element.getTotalLength !== 'function') continue

      let length = 0
      try {
        length = element.getTotalLength()
      } catch {
        continue
      }
      if (!Number.isFinite(length) || length <= 0) continue

      element.dataset.saxCheckboxDraw = ''
      element.style.setProperty('--sax-checkbox-icon-path-length', `${length}`)
      element.style.setProperty(
        '--sax-checkbox-icon-path-delay',
        `${Math.min(drawableIndex * 0.035, 0.12)}s`,
      )
      drawableIndex += 1
    }

    resolvedIconAnimation.value = drawableIndex > 0 ? 'draw' : 'pop'
  }

  const scheduleIconPreparation = () => {
    prepareIcon().catch(() => {
      resolvedIconAnimation.value = 'pop'
    })
  }

  onMounted(() => {
    scheduleIconPreparation()

    if (typeof MutationObserver === 'undefined' || !customIconElement.value) {
      return
    }
    observer = new MutationObserver(() => {
      scheduleIconPreparation()
    })
    observer.observe(customIconElement.value, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['d', 'fill', 'stroke'],
    })
  })

  watch(getRequestedAnimation, () => {
    scheduleIconPreparation()
  })

  onBeforeUnmount(() => observer?.disconnect())

  return {
    resolvedIconAnimation,
  }
}
