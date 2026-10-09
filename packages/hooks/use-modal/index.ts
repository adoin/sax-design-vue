import { onScopeDispose, shallowReactive, watch } from 'vue'
import { useEventListener } from '@vueuse/core'
import { isClient } from '@vuesax-alpha/utils'
import { EVENT_CODE } from '@vuesax-alpha/constants'

import type { Ref } from 'vue'

type ModalInstance = {
  handleClose: () => void
}

const modalStack = shallowReactive<ModalInstance[]>([])

const closeModal = (e: KeyboardEvent) => {
  if (modalStack.length === 0) return
  if (e.code === EVENT_CODE.esc) {
    e.stopPropagation()
    const topModal = modalStack[modalStack.length - 1]
    topModal.handleClose()
  }
}

export const useModal = (instance: ModalInstance, visibleRef: Ref<boolean>) => {
  const remove = () => {
    const index = modalStack.indexOf(instance)
    if (index !== -1) modalStack.splice(index, 1)
  }
  watch(
    visibleRef,
    (val) => {
      remove()
      if (val) modalStack.push(instance)
    },
    { immediate: true, flush: 'sync' },
  )
  onScopeDispose(remove)
  return { isTopModal: () => modalStack[modalStack.length - 1] === instance }
}

if (isClient) useEventListener(document, 'keydown', closeModal)
