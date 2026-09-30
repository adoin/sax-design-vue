import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useTimeoutFn } from '@vueuse/core'
import {
  useColor,
  useLocale,
  useLockscreen,
  useNamespace,
  useShape,
  useVuesaxBaseComponent,
  useZIndex,
} from '@vuesax-alpha/hooks'
import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import { getVsColor, isClient } from '@vuesax-alpha/utils'
import { SNotification } from '@vuesax-alpha/components/notification'
import type { DialogEmitFn, DialogProps } from '../dialog'

export const useDialog = (props: DialogProps, emit: DialogEmitFn) => {
  const rebound = ref(false)
  const visible = ref(false)
  const minimized = ref(false)
  const surfaceVisible = computed(() => visible.value && !minimized.value)
  const closed = ref(false)
  const ns = useNamespace('dialog')
  const shape = useShape()
  const { nextZIndex } = useZIndex()
  const { t } = useLocale()
  const closePending = ref(false)
  let closeTask: Promise<boolean> | undefined
  let closeVersion = 0
  let disposed = false
  const invalidateClose = () => {
    closeVersion++
    closeTask = undefined
    closePending.value = false
  }
  const vsBaseClasses = useVuesaxBaseComponent(useColor())

  const zIndex = ref(props.zIndex ?? nextZIndex())

  const readReboundDuration = () => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue('--sax-motion-duration-slow')
      .trim()
    const duration = Number.parseFloat(value)
    if (!Number.isFinite(duration)) return 400
    return value.endsWith('ms') ? duration : duration * 1000
  }

  const afterEnter = () => {
    emit('opened')
  }

  const beforeLeave = () => {
    emit('close')
  }

  const afterLeave = () => {
    emit('closed')
    emit(UPDATE_MODEL_EVENT, false)
  }

  const doOpen = () => {
    if (!isClient) return
    visible.value = true
  }

  const doClose = () => {
    visible.value = false
  }

  const open = () => {
    invalidateClose()
    doOpen()
  }

  const close = () => {
    if (disposed || !visible.value) return Promise.resolve(false)
    if (closeTask) return closeTask
    const guard = props.beforeClose
    if (!guard) {
      closed.value = true
      doClose()
      return Promise.resolve(true)
    }
    const version = ++closeVersion
    closePending.value = true
    // Assign the shared task before invoking user code to prevent reentry.
    closeTask = Promise.resolve().then(async () => {
      try {
        const approval = guard()
        if (!approval || typeof approval.then !== 'function')
          throw new Error(t('vs.dialog.closeBlockedMessage'))
        await approval
        if (disposed || version !== closeVersion || !visible.value) return false
        closed.value = true
        doClose()
        return true
      } catch (reason) {
        if (disposed || version !== closeVersion || !visible.value) return false
        const message =
          typeof reason === 'string'
            ? reason
            : reason &&
                typeof reason === 'object' &&
                'message' in reason &&
                typeof reason.message === 'string'
              ? reason.message
              : ''
        emit('closeError', reason)
        SNotification({
          title: t('vs.dialog.closeBlocked'),
          content: message.trim() || t('vs.dialog.closeBlockedMessage'),
          dangerousHtmlString: false,
          color: 'warn',
          position: 'top-right',
          duration: 3500,
          zIndex: nextZIndex(),
          shape: shape.value === 'square' ? 'square' : '',
        })
        // Keep a rejected controlled close in sync with the visible surface.
        if (!props.modelValue) emit(UPDATE_MODEL_EVENT, true)
        return false
      } finally {
        if (version === closeVersion) {
          closeTask = undefined
          closePending.value = false
        }
      }
    })
    return closeTask
  }

  onBeforeUnmount(() => {
    disposed = true
    invalidateClose()
  })

  const handleClose = () => {
    if (props.preventClose) {
      rebound.value = true
      useTimeoutFn(() => (rebound.value = false), readReboundDuration())

      return
    }
    close()
  }

  useLockscreen(computed(() => surfaceVisible.value && props.lockScroll))

  watch(
    () => props.modelValue,
    (val: boolean) => {
      if (val) {
        closed.value = false
        rebound.value = true

        open()
        zIndex.value = props.zIndex ?? nextZIndex()

        nextTick(() => {
          emit('open')
        })
      } else {
        rebound.value = false
        if (visible.value) {
          close()
        }
      }
    },
  )

  const dialogKls = computed(() => [
    ns.b('original'),
    vsBaseClasses,
    ns.m(shape.value),
    {
      [ns.m('rebound')]: rebound.value,
      [ns.m('not-padding')]: props.notPadding,
      [ns.m('auto-width')]: props.autoWidth,
      [ns.m('scroll')]: props.scroll,
      [ns.m('loading')]: props.loading,
      [ns.m('not-center')]: props.notCenter,
    },
  ])

  const dialogStyles = computed(() => ({
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
    height:
      typeof props.height === 'number' ? `${props.height}px` : props.height,
    minWidth:
      typeof props.minWidth === 'number'
        ? `${props.minWidth}px`
        : props.minWidth,
    minHeight:
      typeof props.minHeight === 'number'
        ? `${props.minHeight}px`
        : props.minHeight,
    marginTop: typeof props.top === 'number' ? `${props.top}px` : props.top,
    ...ns.cssVar({
      color: getVsColor(props.color),
    }),
  }))

  onMounted(() => {
    if (props.modelValue) {
      visible.value = true
      open()
    }
  })

  return {
    afterEnter,
    afterLeave,
    beforeLeave,
    handleClose,
    close,
    closePending,
    open,
    doClose,
    zIndex,
    closed,
    visible,
    minimized,
    surfaceVisible,
    dialogKls,
    dialogStyles,
  }
}
