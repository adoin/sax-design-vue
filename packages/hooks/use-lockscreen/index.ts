import { computed, isRef, onScopeDispose, watch } from 'vue'
import {
  addClass,
  getScrollBarWidth,
  getStyle,
  hasClass,
  isClient,
  removeClass,
  throwError,
} from '@vuesax-alpha/utils'
import { useNamespace } from '../use-namespace'

import type { Ref } from 'vue'

const locks = new Map<
  string,
  {
    count: number
    width: string
    adjusted: boolean
    owned: boolean
    timer?: ReturnType<typeof setTimeout>
  }
>()

/**
 * Hook that monitoring the ref value to lock or unlock the screen.
 * When the trigger became true, it assumes modal is now opened and vice versa.
 * @param trigger {Ref<boolean>}
 */
export const useLockscreen = (trigger: Ref<boolean>) => {
  if (!isRef(trigger)) {
    throwError(
      '[useLockscreen]',
      'You need to pass a ref param to this function',
    )
  }

  const ns = useNamespace('popup')

  const hiddenCls = computed(() => ns.bm('parent', 'hidden'))

  if (!isClient) return
  let acquired = false
  let acquiredKey = ''
  const release = () => {
    if (!acquired) return
    acquired = false
    const key = acquiredKey
    const state = locks.get(key)
    if (!state || --state.count > 0) return
    state.timer = setTimeout(() => {
      if (state.count > 0) return
      if (state.owned) removeClass(document.body, key)
      if (state.adjusted) document.body.style.width = state.width
      locks.delete(key)
    }, 200)
  }
  watch(
    trigger,
    (active) => {
      if (!active) {
        release()
        return
      }
      if (acquired) return
      acquired = true
      const key = hiddenCls.value
      acquiredKey = key
      const existing = locks.get(key)
      if (existing) {
        clearTimeout(existing.timer)
        existing.count++
        return
      }
      const owned = !hasClass(document.body, key)
      const width = document.body.style.width
      const scrollBarWidth = getScrollBarWidth(ns.namespace.value)
      const overflow =
        document.documentElement.clientHeight < document.body.scrollHeight ||
        getStyle(document.body, 'overflowY') === 'scroll'
      const adjusted = owned && scrollBarWidth > 0 && overflow
      if (adjusted)
        document.body.style.width = `calc(100% - ${scrollBarWidth}px)`
      locks.set(key, { count: 1, width, adjusted, owned })
      addClass(document.body, key)
    },
    { immediate: true, flush: 'sync' },
  )
  onScopeDispose(release)
}
