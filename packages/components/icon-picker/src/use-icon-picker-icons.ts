import { onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import { normalizeIconList, resolveIconPickerData } from './icon-picker'
import type { IconPickerApiOptions } from './icon-picker'

export function useIconPickerIcons(
  list: () => readonly string[],
  api: () => boolean | IconPickerApiOptions | undefined,
  loaded: (names: string[]) => void,
) {
  const icons = shallowRef(normalizeIconList(list()))
  const loading = shallowRef(false)
  const failed = shallowRef(false)
  let controller: AbortController | undefined
  let mounted = false
  const reload = async () => {
    controller?.abort()
    const current = new AbortController()
    controller = current
    const publish = () => {
      icons.value = normalizeIconList(list())
      loaded(icons.value)
    }
    publish()
    failed.value = false
    loading.value = false
    const missing = normalizeIconList(list(), false).filter(
      (name) => !resolveIconPickerData(name),
    )
    const configuration = api()
    if (configuration === false || !missing.length) return
    loading.value = true
    try {
      const { loadIconData } = await import('sax-design-vue-iconify/api')
      if (current.signal.aborted) return
      await loadIconData(missing, {
        ...(typeof configuration === 'object' ? configuration : {}),
        signal: current.signal,
      })
    } catch {
      if (!current.signal.aborted) failed.value = true
    } finally {
      if (mounted && controller === current && !current.signal.aborted) {
        loading.value = false
        publish()
      }
    }
  }
  onMounted(() => {
    mounted = true
    return reload()
  })
  watch(
    [list, api],
    () => {
      if (mounted) return reload()
    },
    { deep: true },
  )
  onBeforeUnmount(() => {
    mounted = false
    controller?.abort()
  })
  return { icons, loading, failed, reload }
}
