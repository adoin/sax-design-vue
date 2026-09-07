import { onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import { useClipboard } from '@vueuse/core'

import type { ComputedRef, Ref } from 'vue'

const copyableCodeSelector = '.content__default code, .con-api code'
const excludedAncestorSelector = [
  'pre',
  'a',
  'button',
  '[role="button"]',
  '[contenteditable="true"]',
  '[data-no-inline-code-copy]',
  '.example',
  '.slotcode',
  '.api-code',
  '.code-dialog',
  '.example-playground-dialog',
  '.live-example-preview',
].join(', ')

interface UseInlineCodeCopyOptions {
  copyLabel: ComputedRef<string>
  copiedLabel: ComputedRef<string>
}

const inlineCodeText = (element: HTMLElement) =>
  element.textContent?.trim() ?? ''

export const useInlineCodeCopy = (
  root: Ref<HTMLElement | undefined>,
  { copyLabel, copiedLabel }: UseInlineCodeCopyOptions,
) => {
  const copied = shallowRef(false)
  const { copy } = useClipboard({ legacy: true })
  let copiedElement: HTMLElement | undefined
  let resetTimer: ReturnType<typeof setTimeout> | undefined
  let observer: MutationObserver | undefined
  let activeRoot: HTMLElement | undefined
  let stopRootWatch: (() => void) | undefined

  const updateAccessibleLabel = (element: HTMLElement, label: string) => {
    const text = inlineCodeText(element)
    element.setAttribute('aria-label', text ? `${label}: ${text}` : label)
    element.title = label
  }

  const isCopyable = (element: HTMLElement) => {
    const container = element.closest('.content__default, .con-api')
    return (
      Boolean(container) &&
      !element.closest(excludedAncestorSelector) &&
      Boolean(inlineCodeText(element))
    )
  }

  const decorateCode = (element: HTMLElement) => {
    if (!isCopyable(element)) return

    element.classList.add('docs-inline-code-copy')
    element.setAttribute('role', 'button')
    element.tabIndex = 0
    updateAccessibleLabel(element, copyLabel.value)
  }

  const decorateWithin = (container: ParentNode) => {
    if (container instanceof HTMLElement && container.matches('code'))
      decorateCode(container)

    container
      .querySelectorAll<HTMLElement>(copyableCodeSelector)
      .forEach(decorateCode)
  }

  const resetCopiedState = () => {
    copied.value = false
    if (!copiedElement) return

    copiedElement.classList.remove('is-copied')
    updateAccessibleLabel(copiedElement, copyLabel.value)
    copiedElement = undefined
  }

  const showCopiedState = (element: HTMLElement) => {
    if (resetTimer) clearTimeout(resetTimer)
    if (copiedElement && copiedElement !== element)
      copiedElement.classList.remove('is-copied')

    copiedElement = element
    copied.value = true
    element.classList.add('is-copied')
    updateAccessibleLabel(element, copiedLabel.value)
    resetTimer = setTimeout(resetCopiedState, 1600)
  }

  const copyCode = async (element: HTMLElement) => {
    const text = inlineCodeText(element)
    if (!text) return

    try {
      await copy(text)
      showCopiedState(element)
    } catch {
      // Keep the document usable when clipboard access is unavailable.
    }
  }

  const findCopyTarget = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return
    const element = target.closest<HTMLElement>('code.docs-inline-code-copy')
    if (!element || !root.value?.contains(element)) return
    return element
  }

  const handleClick = (event: MouseEvent) => {
    const element = findCopyTarget(event.target)
    if (element) copyCode(element).catch(() => undefined)
  }

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    const element = findCopyTarget(event.target)
    if (!element) return

    event.preventDefault()
    copyCode(element).catch(() => undefined)
  }

  const refreshLabels = () => {
    root.value
      ?.querySelectorAll<HTMLElement>('code.docs-inline-code-copy')
      .forEach((element) =>
        updateAccessibleLabel(
          element,
          element === copiedElement ? copiedLabel.value : copyLabel.value,
        ),
      )
  }

  const stopListening = () => {
    observer?.disconnect()
    observer = undefined
    activeRoot?.removeEventListener('click', handleClick)
    activeRoot?.removeEventListener('keydown', handleKeydown)
    activeRoot = undefined
  }

  const startListening = (page?: HTMLElement) => {
    stopListening()
    if (!page) return

    activeRoot = page
    decorateWithin(page)
    page.addEventListener('click', handleClick)
    page.addEventListener('keydown', handleKeydown)

    observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) decorateWithin(node)
        })
      })
    })
    observer.observe(page, { childList: true, subtree: true })
  }

  onMounted(() => {
    stopRootWatch = watch(root, startListening, {
      immediate: true,
      flush: 'post',
    })
  })

  watch([copyLabel, copiedLabel], refreshLabels)

  onBeforeUnmount(() => {
    if (resetTimer) clearTimeout(resetTimer)
    stopRootWatch?.()
    stopListening()
  })

  return { copied }
}
