import {
  nextTick,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  shallowRef,
  toValue,
  watch,
} from 'vue'
import { SNotification } from '@vuesax-alpha/components/notification'
import { useLocale } from '@vuesax-alpha/hooks'
import type { MaybeRefOrGetter } from 'vue'
import type { DrawerCloseReason, DrawerEmitsFn, DrawerProps } from '../drawer'

export const useDrawerLifecycle = (
  props: DrawerProps,
  wanted: MaybeRefOrGetter<boolean>,
  emit: DrawerEmitsFn,
  waitForLoading: () => Promise<void>,
  beforeOpening: () => void,
  nextZIndex: () => number,
  ancestorOpen: () => boolean = () => true,
) => {
  const { t } = useLocale()
  const visible = shallowRef(false)
  const present = shallowRef(false)
  const rendered = shallowRef(props.forceRender)
  const closePending = shallowRef(false)
  const guardActive = shallowRef(false)
  const guardShown = shallowRef(false)
  let timer: ReturnType<typeof setTimeout> | undefined
  let guardFrame: number | undefined
  let task: Promise<boolean> | undefined
  let cancelApproval: (() => void) | undefined
  let version = 0
  let alive = true
  let mounted = false
  let suspended = false
  let approvedClose = false
  let restoringModel = false
  let closingScheduled = false
  const clearTimer = () => {
    if (timer !== undefined) clearTimeout(timer)
    timer = undefined
  }
  const clearFrame = () => {
    if (guardFrame !== undefined) cancelAnimationFrame(guardFrame)
    guardFrame = undefined
  }
  const invalidate = () => {
    version++
    cancelApproval?.()
    cancelApproval = undefined
    task = undefined
    clearFrame()
    closePending.value = guardActive.value = guardShown.value = false
  }
  const sync = () => {
    clearTimer()
    if (!mounted || suspended) return
    const open = toValue(wanted)
    closingScheduled = !open && visible.value
    invalidate()
    const apply = () => {
      timer = undefined
      if (!alive || suspended || open !== toValue(wanted)) return
      if (open && !visible.value) {
        beforeOpening()
        rendered.value = present.value = true
        emit('beforeOpen')
        visible.value = true
      } else if (!open && visible.value) {
        emit('beforeClose')
        visible.value = false
        closingScheduled = false
      }
    }
    const delay =
      !open && !ancestorOpen()
        ? 0
        : Math.max(0, Number(open ? props.openDelay : props.closeDelay) || 0)
    if (delay) timer = setTimeout(apply, delay)
    else apply()
  }
  watch(
    () => toValue(wanted),
    (open) => {
      if (open && restoringModel) {
        restoringModel = false
        return
      }
      if (
        !open &&
        visible.value &&
        props.beforeClose &&
        !approvedClose &&
        ancestorOpen()
      ) {
        close('api')
        return
      }
      approvedClose = false
      sync()
    },
  )
  watch(
    () => props.forceRender,
    (force) => {
      if (force) rendered.value = true
    },
  )
  const afterEnter = () => {
    if (!visible.value) return
    emit('open')
    emit('opened')
    emit('afterOpenChange', true)
  }
  const afterLeave = () => {
    if (visible.value) return
    present.value = false
    emit('close')
    emit('closed')
    emit('afterOpenChange', false)
    if (props.destroyOnClose && !props.forceRender) rendered.value = false
  }
  const emitModel = (open: boolean) => {
    emit('update:modelValue', open)
    emit('update:open', open)
  }
  const open = () => {
    invalidate()
    emitModel(true)
  }
  const close = (
    reason: DrawerCloseReason = 'api',
    event?: Event,
  ): Promise<boolean> => {
    if (!alive || !visible.value) return Promise.resolve(false)
    if (closingScheduled) return Promise.resolve(true)
    if (task) return task
    const current = ++version
    closePending.value = true
    guardActive.value = !!props.beforeClose
    if (props.beforeClose && typeof requestAnimationFrame === 'function') {
      guardFrame = requestAnimationFrame(() => {
        guardFrame = undefined
        if (alive && current === version && guardActive.value)
          guardShown.value = true
      })
    }
    const cancelled = new Promise<boolean>((resolve) => {
      cancelApproval = () => resolve(false)
    })
    let accepted = false
    task = Promise.resolve().then(async () => {
      try {
        const guard = props.beforeClose
        if (guard) {
          let complete: (value: boolean) => void = () => {}
          let called = false
          const byCallback = new Promise<boolean>((resolve) => {
            complete = resolve
          })
          const done = (cancel = false) => {
            called = true
            complete(!cancel)
          }
          const result =
            guard.length > 0
              ? guard(done, reason)
              : (guard as () => Promise<void | boolean>)()
          let approval: Promise<boolean>
          if (result && typeof result.then === 'function')
            approval = result.then((value) => value !== false)
          else if (called || guard.length > 0) approval = byCallback
          else throw new Error(t('vs.drawer.closeBlockedMessage'))
          if (!(await Promise.race([approval, cancelled]))) return false
        }
        if (!alive || current !== version || !visible.value) return false
        clearFrame()
        guardActive.value = false
        await waitForLoading()
        if (!alive || current !== version || !visible.value) return false
        accepted = true
        approvedClose = true
        emitModel(false)
        // A controlled false request already changed the source, so no second
        // watcher notification will arrive after approval.
        if (!toValue(wanted)) {
          approvedClose = false
          sync()
        }
        return true
      } catch (error) {
        if (!alive || current !== version) return false
        emit('closeError', error, reason)
        const message =
          typeof error === 'string'
            ? error
            : error instanceof Error
              ? error.message
              : t('vs.drawer.closeBlockedMessage')
        SNotification({
          content: message,
          color: 'warn',
          position: 'top-right',
          duration: 3500,
          zIndex: nextZIndex(),
          dangerousHtmlString: false,
        })
        return false
      } finally {
        if (alive && current === version) {
          clearFrame()
          guardActive.value = false
          await waitForLoading()
          if (alive && current === version) {
            if (!accepted && !toValue(wanted) && ancestorOpen()) {
              restoringModel = true
              emitModel(true)
            }
            closePending.value = guardShown.value = false
            task = undefined
            cancelApproval = undefined
          }
        }
      }
    })
    emit('closeRequest', reason, event)
    return task
  }
  onMounted(() => {
    mounted = true
    sync()
  })
  onDeactivated(() => {
    suspended = true
    clearTimer()
    invalidate()
    visible.value = present.value = false
  })
  onActivated(() => {
    if (suspended) {
      suspended = false
      nextTick(sync)
    }
  })
  onBeforeUnmount(() => {
    alive = false
    clearTimer()
    invalidate()
  })
  return {
    visible,
    present,
    rendered,
    closePending,
    guardActive,
    guardShown,
    afterEnter,
    afterLeave,
    open,
    close,
  }
}
