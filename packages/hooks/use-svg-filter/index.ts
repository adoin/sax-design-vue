import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  toValue,
  watch,
} from 'vue'
import { acquireSvgFilter, getSvgFilterId } from '@vuesax-alpha/utils'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { SvgFilterDefinition, SvgFilterLease } from '@vuesax-alpha/utils'

export interface UseSvgFilterOptions {
  document?: MaybeRefOrGetter<Document | undefined>
  scope?: MaybeRefOrGetter<string | undefined>
  cache?: boolean
}
export interface SvgFilterBinding {
  id: ComputedRef<string | undefined>
  ready: ComputedRef<boolean>
  url: ComputedRef<string | undefined>
  element: ComputedRef<SVGFilterElement | undefined>
}

/** Static definitions are shared; pass scope to isolate independent animation. */
export const useSvgFilter = (
  definition: MaybeRefOrGetter<SvgFilterDefinition | undefined>,
  options: UseSvgFilterOptions = {},
): SvgFilterBinding => {
  const lease = shallowRef<SvgFilterLease>()
  const retired = new Set<SvgFilterLease>()
  const mounted = shallowRef(false)
  const id = computed(() => {
    const graph = toValue(definition)
    return graph ? getSvgFilterId(graph, toValue(options.scope)) : undefined
  })
  const refresh = () => {
    if (!mounted.value) return
    const graph = toValue(definition)
    const next = graph
      ? acquireSvgFilter(graph, {
          document: toValue(options.document),
          scope: toValue(options.scope),
          cache: options.cache,
        })
      : undefined
    const previous = lease.value
    lease.value = next
    // Keep the previous definition until Vue has patched its URL consumers.
    if (previous) {
      retired.add(previous)
      nextTick(() => {
        if (retired.delete(previous)) previous.release()
      })
    }
  }
  watch([id, () => toValue(options.document)], refresh, { flush: 'post' })
  onMounted(() => {
    mounted.value = true
    refresh()
  })
  onBeforeUnmount(() => {
    mounted.value = false
    lease.value?.release()
    for (const previous of retired) previous.release()
    retired.clear()
  })
  return {
    id,
    ready: computed(() => !!lease.value?.attached),
    element: computed(() => lease.value?.element),
    url: computed(() => (lease.value?.attached ? lease.value.url : undefined)),
  }
}
