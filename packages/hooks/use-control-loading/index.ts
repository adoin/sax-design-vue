import { shallowRef, toValue, watch } from 'vue'
import { registerLoadingCompletion } from '../use-loading-completion'
import type { MaybeRefOrGetter } from 'vue'

/** Keep a compact loader and its reserved actions until restoration finishes. */
export const useControlLoading = (
  active: MaybeRefOrGetter<boolean | undefined>,
  waitForRestoration?: () => Promise<void>,
) => {
  const loadingVisible = shallowRef(Boolean(toValue(active)))
  const finishLoading = () => {
    if (!toValue(active)) loadingVisible.value = false
  }
  // A composed picker has its own child scope. Keep its completion visible
  // to an enclosing Dialog scope instead of hiding the nested loaders.
  if (waitForRestoration) {
    registerLoadingCompletion({
      stopping: () => !toValue(active) && loadingVisible.value,
      restored: waitForRestoration,
    })
  }
  watch(
    () => Boolean(toValue(active)),
    async (loading, _previous, onCleanup) => {
      if (loading) {
        loadingVisible.value = true
        return
      }
      if (!waitForRestoration || !loadingVisible.value) return
      let cancelled = false
      onCleanup(() => {
        cancelled = true
      })
      await waitForRestoration()
      if (!cancelled) finishLoading()
    },
  )
  return { loadingVisible, finishLoading }
}
