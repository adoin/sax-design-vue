import { shallowRef } from 'vue'

// A single delegated popper serves every cell, including recycled virtual rows.
export function useTableOverflow() {
  const reference = shallowRef<HTMLElement>()
  const content = shallowRef('')
  const visible = shallowRef(false)
  let titleReference: HTMLElement | undefined
  const close = () => {
    visible.value = false
    titleReference?.removeAttribute('title')
    titleReference = undefined
  }
  const enter = (event: Event) => {
    const target =
      event.target instanceof Element
        ? event.target.closest<HTMLElement>('[data-table-overflow]')
        : null
    if (!target) return
    const truncated =
      target.scrollWidth > target.clientWidth + 1 ||
      target.scrollHeight > target.clientHeight + 1
    const text = target.textContent?.trim() ?? ''
    if (target.dataset.tableOverflow === 'title') {
      close()
      if (truncated) target.title = text
      else target.removeAttribute('title')
      titleReference = target
      return
    }
    if (target.dataset.tableOverflow !== 'tooltip' || !truncated || !text)
      return close()
    reference.value = target
    content.value = text
    visible.value = true
  }
  const leave = (event: MouseEvent | FocusEvent) => {
    if (
      event.relatedTarget instanceof Node &&
      (reference.value?.contains(event.relatedTarget) ||
        titleReference?.contains(event.relatedTarget))
    )
      return
    close()
  }
  return { reference, content, visible, enter, leave, close }
}
