<template>
  <teleport :to="selector">
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
            @click="close"
          >
            <icon-close :size="18" />
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
              :pending="confirmPending"
              :disabled="props.confirmDisabled || props.loading"
            >
              <div :class="ns.e('actions')">
                <s-button
                  v-if="showCancelButton"
                  type="flat"
                  @click="handleCancel"
                >
                  {{ cancelButtonText || t('vs.dialog.cancel') }}
                </s-button>
                <s-button
                  v-if="showConfirmButton"
                  :loading="confirmPending"
                  :disabled="props.confirmDisabled || props.loading"
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
    <div :class="[ns.e('minimized'), ns.is(props.shape)]" :style="{ zIndex }">
      <button
        ref="restoreButton"
        type="button"
        :class="ns.e('restore')"
        :title="dockLabel"
        :aria-label="`${t('vs.dialog.restore')}: ${dockLabel}`"
        @click="restore"
      >
        <span :class="ns.e('dock-indicator')" aria-hidden="true" />
        <span :class="ns.e('dock-title')">{{ dockLabel }}</span>
      </button>
      <button
        type="button"
        :class="ns.e('dock-close')"
        :aria-label="`${t('vs.dialog.close')}: ${dockLabel}`"
        @click="close"
      >
        <icon-close :size="14" />
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
import { acquireDialogDock, releaseDialogDock } from './dialog-dock'
import { dialogEmits, dialogProps } from './dialog'
import { useDialog } from './composables'
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

const {
  visible,
  minimized,
  surfaceVisible,
  zIndex,
  dialogKls,
  dialogStyles,
  close,
  afterEnter,
  afterLeave,
  beforeLeave,
  handleClose,
} = useDialog(props, emit)

useModal({ handleClose }, surfaceVisible)
const dialogElement = useTemplateRef<HTMLElement>('dialogElement')
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
  if (!visible.value || minimized.value || !canMinimize.value) return
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
  if (!visible.value || !minimized.value) return
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
])

const showClose = computed(() => !props.notClose && props.showClose)
const handleCancel = () => {
  emit('cancel')
  if (props.cancelClosable) close()
}
const confirmPending = shallowRef(false)
let confirmVersion = 0
watch(
  visible,
  (value) => {
    if (!value) {
      confirmVersion++
      confirmPending.value = false
    }
  },
  { flush: 'sync' },
)
onBeforeUnmount(() => {
  confirmVersion++
})
const handleConfirm = async () => {
  if (
    !visible.value ||
    confirmPending.value ||
    props.confirmDisabled ||
    props.loading
  )
    return
  const version = ++confirmVersion
  confirmPending.value = true
  try {
    const accepted = await props.beforeConfirm?.()
    if (version !== confirmVersion || !visible.value || accepted === false)
      return
    emit('confirm')
    if (props.confirmClosable) close()
  } catch (error) {
    if (version === confirmVersion && visible.value) emit('confirmError', error)
  } finally {
    if (version === confirmVersion) confirmPending.value = false
  }
}

defineExpose({
  /** @description whether the dialog is visible */
  visible,
  minimized,
  minimize,
  restore,
  confirm: handleConfirm,
  /** @description dialog close method */
  close,
  open: () => {
    if (minimized.value) restore()
    else visible.value = true
  },
})
</script>
