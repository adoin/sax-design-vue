<template>
  <teleport :to="selector">
    <SvgDissolveFilter
      :filter-id="exitDissolve.filterId"
      :dissolved="exitDissolve.dissolved.value"
      :assemble-duration="0"
      region="surface"
      @settled="exitDissolve.settled"
    />
    <transition
      :name="ns.b()"
      @after-enter="afterEnter"
      @after-leave="afterLeave"
      @before-leave="beforeLeave"
    >
      <div
        v-if="visible"
        :class="rootKls"
        :style="{ zIndex, display: minimized ? 'none' : undefined }"
        @click="clickDialog.onClick"
        @mousedown="clickDialog.onMousedown"
        @mouseup="clickDialog.onMouseup"
      >
        <div
          ref="dialogElement"
          :style="dialogStyles"
          :class="dialogKls"
          role="dialog"
          :aria-modal="props.mask"
          :aria-label="
            String(
              props.title || props.minimizedLabel || t('vs.dialog.minimized'),
            )
          "
          tabindex="-1"
          :aria-busy="closePending || confirmPending || undefined"
          @keydown.tab="trapFocus"
        >
          <div v-if="loading" :class="ns.e('loading')">
            <icon-loading />
          </div>

          <button
            v-if="canMinimize"
            type="button"
            :class="ns.e('minimize')"
            :aria-label="t('vs.dialog.minimize')"
            :disabled="closePending"
            @click="minimize"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                d="M5 15h14"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
              />
            </svg>
          </button>
          <button
            v-if="showClose"
            type="button"
            :class="ns.e('close')"
            :aria-label="t('vs.common.close')"
            :disabled="closePending"
            :aria-busy="closePending || undefined"
            @click="close"
          >
            <icon-loading
              v-if="closeIndicatorShown"
              :active="closeLoadingActive"
              stop-behavior="corners"
              :size="18"
            />
            <icon-close v-else :size="18" />
          </button>

          <div
            v-if="props.showHeader && ($slots.header || title)"
            :class="ns.e('header')"
          >
            <slot name="header"
              ><span :class="ns.e('title')">{{ title }}</span></slot
            >
          </div>

          <div
            :class="[
              ns.e('content'),
              { notFooter: !($slots.footer || props.showFooter) },
            ]"
          >
            <slot>
              <span v-if="useHtml" v-html="content" />
              <template v-else>{{ content }}</template>
            </slot>
          </div>

          <div v-if="$slots.footer || props.showFooter" :class="ns.e('footer')">
            <slot
              name="footer"
              :confirm="handleConfirm"
              :cancel="handleCancel"
              :pending="confirmLoadingActive"
              :close-pending="closePending"
              :disabled="
                props.confirmDisabled ||
                props.loading ||
                closePending ||
                confirmPending
              "
            >
              <div :class="ns.e('actions')">
                <s-button
                  v-if="showCancelButton"
                  type="flat"
                  :disabled="closePending"
                  @click="handleCancel"
                >
                  {{ cancelButtonText || t('vs.dialog.cancel') }}
                </s-button>
                <s-button
                  v-if="showConfirmButton"
                  :loading="confirmLoadingActive"
                  :disabled="
                    props.confirmDisabled ||
                    props.loading ||
                    closePending ||
                    confirmPending
                  "
                  @click="handleConfirm"
                >
                  {{ confirmButtonText || t('vs.dialog.confirm') }}
                </s-button>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
  <teleport v-if="dockTarget && visible && minimized" :to="dockTarget">
    <div
      ref="dockElement"
      :class="[ns.e('minimized'), ns.is(props.shape)]"
      :style="{ zIndex }"
    >
      <button
        ref="restoreButton"
        type="button"
        :class="ns.e('restore')"
        :title="dockLabel"
        :aria-label="`${t('vs.dialog.restore')}: ${dockLabel}`"
        :disabled="closePending"
        @click="restore"
      >
        <span :class="ns.e('dock-indicator')" aria-hidden="true" />
        <span :class="ns.e('dock-title')">{{ dockLabel }}</span>
      </button>
      <button
        type="button"
        :class="ns.e('dock-close')"
        :aria-label="`${t('vs.dialog.close')}: ${dockLabel}`"
        :disabled="closePending"
        :aria-busy="closePending || undefined"
        @click="close"
      >
        <icon-loading
          v-if="closeIndicatorShown"
          :active="closeLoadingActive"
          stop-behavior="corners"
          :size="14"
        />
        <icon-close v-else :size="14" />
      </button>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue'
import SButton from '@vuesax-alpha/components/button'
import SvgDissolveFilter from '@vuesax-alpha/components/base/src/svg-dissolve-filter.vue'
import { IconClose, IconLoading } from '@vuesax-alpha/components/icon'
import {
  useGlobalComponentProps,
  useLocale,
  useModal,
  useNamespace,
  usePopperContainer,
  usePopperContainerId,
  useSameTarget,
  useZIndex,
} from '@vuesax-alpha/hooks'
import { provideLoadingCompletion } from '@vuesax-alpha/hooks/use-loading-completion'
import { acquireDialogDock, releaseDialogDock } from './dialog-dock'
import { dialogEmits, dialogProps } from './dialog'
import { useDialog } from './composables'
import { useDialogDissolve } from './composables/use-dialog-dissolve'
import { dialogDeprecated } from './deprecated'

defineOptions({
  name: 'SDialogSurface',
})

const rawProps = defineProps(dialogProps)
const props = useGlobalComponentProps('dialog', rawProps)
const emit = defineEmits(dialogEmits)

usePopperContainer()
const { selector } = usePopperContainerId()

const ns = useNamespace('dialog')
const { t } = useLocale()
const { nextZIndex } = useZIndex()

dialogDeprecated(props)

const waitForLoading = provideLoadingCompletion()
const exitDissolve = useDialogDissolve()
const cancelExitMotion = () => {
  exitDissolve.cancel()
  confirmVersion++
  cancelConfirmIndicator()
  confirmPending.value = false
  confirmLoadingActive.value = false
}
const finishExitLoading = async () => {
  confirmVersion++
  cancelConfirmIndicator()
  confirmLoadingActive.value = false
  await waitForLoading()
  if (visible.value && closePending.value && props.closeAnimation)
    await exitDissolve.play(
      minimized.value ? dockElement.value : dialogElement.value,
    )
}
const {
  visible,
  minimized,
  surfaceVisible,
  zIndex,
  dialogKls,
  dialogStyles,
  close,
  closePending,
  closeLoadingActive,
  closeIndicatorShown,
  open: openDialog,
  afterEnter,
  afterLeave,
  beforeLeave,
  handleClose,
} = useDialog(props, emit, {
  beforeExit: finishExitLoading,
  settled: waitForLoading,
  cancelExit: cancelExitMotion,
})

useModal({ handleClose }, surfaceVisible)
const dialogElement = useTemplateRef<HTMLElement>('dialogElement')
const dockElement = useTemplateRef<HTMLElement>('dockElement')
const restoreButton = useTemplateRef<HTMLButtonElement>('restoreButton')
const dockTarget = shallowRef<HTMLElement>()
const canMinimize = computed(() => props.minimizable ?? props.fullScreen)
const dockLabel = computed(() =>
  String(props.minimizedLabel || props.title || t('vs.dialog.minimized')),
)
let savedFocus: HTMLElement | null = null
let returnFocus: HTMLElement | null = null
const releaseDock = () => {
  if (!dockTarget.value) return
  releaseDialogDock()
  dockTarget.value = undefined
}
const trapFocus = (event: KeyboardEvent) => {
  const root = dialogElement.value
  if (!root) return
  const focusable = Array.from(
    root.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => element.getClientRects().length > 0)
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (!first) {
    event.preventDefault()
    root.focus()
    return
  }
  if (
    event.shiftKey &&
    (document.activeElement === first || document.activeElement === root)
  ) {
    event.preventDefault()
    last.focus()
  } else if (
    !event.shiftKey &&
    (document.activeElement === last || document.activeElement === root)
  ) {
    event.preventDefault()
    first.focus()
  }
}
const minimize = () => {
  if (
    !visible.value ||
    minimized.value ||
    !canMinimize.value ||
    closePending.value
  )
    return
  savedFocus =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
  dockTarget.value ??= acquireDialogDock(ns.e('dock'))
  dockTarget.value.style.zIndex = String(
    Math.max(Number(dockTarget.value.style.zIndex) || 0, zIndex.value),
  )
  minimized.value = true
  emit('minimize')
  nextTick(() => restoreButton.value?.focus())
}
const restore = () => {
  if (!visible.value || !minimized.value || closePending.value) return
  minimized.value = false
  zIndex.value = props.zIndex ?? nextZIndex()
  emit('restore')
  nextTick(() => {
    if (savedFocus?.isConnected && dialogElement.value?.contains(savedFocus))
      savedFocus.focus()
    else dialogElement.value?.focus()
    releaseDock()
  })
}
watch(visible, (value) => {
  if (value) {
    returnFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    nextTick(() => dialogElement.value?.focus())
  } else {
    minimized.value = false
    nextTick(() => {
      releaseDock()
      if (returnFocus?.isConnected) returnFocus.focus()
    })
  }
})
onBeforeUnmount(releaseDock)

const clickDialog = useSameTarget(() => {
  if (props.maskClosable) handleClose()
})

const rootKls = computed(() => [
  ns.b(),
  ns.is('full-screen', props.fullScreen),
  ns.is('blur', props.overlayBlur),
  ns.is('mask', props.mask),
  ns.is('minimizable', canMinimize.value),
  ns.is('instant-exit', !props.closeAnimation || exitDissolve.dissolved.value),
])

const showClose = computed(() => !props.notClose && props.showClose)
const handleCancel = () => {
  emit('cancel')
  if (props.cancelClosable) close()
}
const confirmPending = shallowRef(false)
const confirmLoadingActive = shallowRef(false)
let confirmVersion = 0
let confirmIndicatorFrame: number | undefined
const cancelConfirmIndicator = () => {
  if (confirmIndicatorFrame !== undefined)
    cancelAnimationFrame(confirmIndicatorFrame)
  confirmIndicatorFrame = undefined
}
watch(
  visible,
  (value) => {
    if (!value) {
      confirmVersion++
      cancelConfirmIndicator()
      confirmPending.value = false
      confirmLoadingActive.value = false
    }
  },
  { flush: 'sync' },
)
onBeforeUnmount(() => {
  confirmVersion++
  cancelConfirmIndicator()
})
const handleConfirm = async () => {
  if (
    !visible.value ||
    confirmPending.value ||
    props.confirmDisabled ||
    props.loading ||
    closePending.value
  )
    return
  const version = ++confirmVersion
  confirmPending.value = true
  if (props.beforeConfirm && typeof requestAnimationFrame === 'function') {
    confirmIndicatorFrame = requestAnimationFrame(() => {
      confirmIndicatorFrame = undefined
      if (version === confirmVersion && visible.value && confirmPending.value)
        confirmLoadingActive.value = true
    })
  }
  try {
    const accepted = await props.beforeConfirm?.()
    if (version !== confirmVersion || !visible.value) return
    cancelConfirmIndicator()
    confirmLoadingActive.value = false
    if (accepted !== false) emit('confirm')
    await waitForLoading()
    if (version !== confirmVersion || !visible.value || accepted === false)
      return
    if (props.confirmClosable) await close()
  } catch (error) {
    if (version === confirmVersion && visible.value) emit('confirmError', error)
  } finally {
    if (version === confirmVersion) {
      cancelConfirmIndicator()
      confirmLoadingActive.value = false
      await waitForLoading()
      if (version === confirmVersion) confirmPending.value = false
    }
  }
}

defineExpose({
  /** @description whether the dialog is visible */
  visible,
  minimized,
  closePending,
  minimize,
  restore,
  confirm: handleConfirm,
  /** @description dialog close method */
  close,
  open: () => {
    if (minimized.value) restore()
    else openDialog()
  },
})
</script>
