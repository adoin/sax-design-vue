import { nextTick, onBeforeUnmount, shallowRef, watch } from 'vue'
import type { Ref } from 'vue'
import type { AgentHistoryMessage } from '../../agent-editor/src/agent-shared/types'
import type { MessageScrollerLoadMore } from './message-scroller'

export const useMessageHistory = (
  viewport: Ref<HTMLElement | null>,
  props: {
    items?: AgentHistoryMessage[]
    loadMore?: MessageScrollerLoadMore
    hasMore: boolean
    loadThreshold: number
  },
  emit: {
    (event: 'update:items', value: AgentHistoryMessage[]): void
    (event: 'load-error', error: unknown): void
  },
) => {
  const loading = shallowRef(false)
  const failed = shallowRef(false)
  const exhausted = shallowRef(false)
  let controller: AbortController | undefined
  let version = 0
  let disposed = false
  const request = async () => {
    if (
      disposed ||
      loading.value ||
      !props.loadMore ||
      !props.hasMore ||
      exhausted.value ||
      !props.items
    )
      return
    const current = ++version
    const beforeCount = props.items.length
    controller = new AbortController()
    const signal = controller.signal
    loading.value = true
    failed.value = false
    try {
      const batch = await props.loadMore(signal)
      if (disposed || signal.aborted || current !== version) return
      if (!Array.isArray(batch))
        throw new TypeError('loadMore must return a message array')
      const seen = new Set(props.items.map((item) => item.id))
      const older = batch.filter((item) => {
        if (seen.has(item.id)) return false
        seen.add(item.id)
        return true
      })
      exhausted.value = batch.length === 0
      if (older.length) emit('update:items', [...older, ...props.items])
      await nextTick()
    } catch (error) {
      if (!disposed && !signal.aborted && current === version) {
        failed.value = true
        emit('load-error', error)
      }
    } finally {
      if (!disposed && current === version) {
        loading.value = false
        controller = undefined
        const el = viewport.value
        if (
          !failed.value &&
          props.items &&
          props.items.length > beforeCount &&
          el &&
          el.clientHeight > 0 &&
          el.scrollHeight <= el.clientHeight
        )
          maybeLoad()
      }
    }
  }
  const maybeLoad = () => {
    const el = viewport.value
    if (
      el &&
      el.clientHeight > 0 &&
      el.scrollTop <= Math.max(0, props.loadThreshold) &&
      !failed.value
    )
      request()
  }
  watch(
    () => props.loadMore,
    () => {
      version++
      controller?.abort()
      controller = undefined
      loading.value = false
      exhausted.value = false
      failed.value = false
    },
  )
  watch(
    () => props.hasMore,
    (value) => {
      if (value) exhausted.value = false
    },
  )
  onBeforeUnmount(() => {
    disposed = true
    version++
    controller?.abort()
  })
  return { loading, failed, exhausted, request, maybeLoad }
}
