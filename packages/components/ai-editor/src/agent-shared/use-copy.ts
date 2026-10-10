import { onBeforeUnmount, shallowRef } from 'vue'

export const useAgentCopy = (
  text: () => string,
  onCopy: () => void,
  onError: (error: unknown) => void,
) => {
  const copied = shallowRef(false)
  let timer: ReturnType<typeof setTimeout> | undefined
  let active = true
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text())
      if (!active) return
      copied.value = true
      onCopy()
      clearTimeout(timer)
      timer = setTimeout(() => {
        copied.value = false
      }, 1600)
    } catch (error) {
      if (active) onError(error)
    }
  }
  onBeforeUnmount(() => {
    active = false
    clearTimeout(timer)
  })
  return { copied, copy }
}
