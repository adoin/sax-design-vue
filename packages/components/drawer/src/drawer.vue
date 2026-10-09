<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  shallowReactive,
  shallowRef,
  useAttrs,
  useTemplateRef,
  watch,
} from 'vue'
import { SFocusTrap } from '@vuesax-alpha/components/focus-trap'
import {
  useControlLoading,
  useGlobalComponentProps,
  useId,
  useLocale,
  useLockscreen,
  useModal,
  useNamespace,
  useShape,
  useZIndex,
  zIndexContextKey,
} from '@vuesax-alpha/hooks'
import {
  provideLoadingCompletion,
  registerLoadingCompletion,
} from '@vuesax-alpha/hooks/use-loading-completion'
import { drawerEmits, drawerProps } from './drawer'
import { drawerContextKey } from './context'
import DrawerContent from './drawer-content.vue'
import { useDrawerLifecycle } from './composables/use-drawer-lifecycle'
import { useDrawerResize } from './composables/use-drawer-resize'
import type { CSSProperties } from 'vue'
import type { DrawerPlacement, DrawerSlotScope } from './drawer'

defineOptions({ name: 'SDrawer', inheritAttrs: false })
const rawProps = defineProps(drawerProps)
const props = useGlobalComponentProps('drawer', rawProps)
const emit = defineEmits(drawerEmits)
const slots = defineSlots<{
  default?(scope: DrawerSlotScope): unknown
  header?(scope: DrawerSlotScope): unknown
  title?(scope: DrawerSlotScope): unknown
  extra?(scope: DrawerSlotScope): unknown
  footer?(scope: DrawerSlotScope): unknown
  'close-icon'?(scope: DrawerSlotScope): unknown
  closeIcon?(scope: DrawerSlotScope): unknown
  loading?(scope: DrawerSlotScope): unknown
  mask?(scope: DrawerSlotScope): unknown
  resizer?(scope: DrawerSlotScope): unknown
}>()
const attrs = useAttrs()
const forwardedSlots = () => {
  const forwarded = { ...slots }
  if (!forwarded['close-icon'] && forwarded.closeIcon)
    forwarded['close-icon'] = forwarded.closeIcon
  delete forwarded.closeIcon
  return forwarded
}
const owner = getCurrentInstance()!
const ns = useNamespace('drawer')
const { t } = useLocale()
const shape = useShape()
const id = useId().value
const titleId = `${id}-title`
const panel = useTemplateRef<HTMLElement>('panel')
const root = useTemplateRef<HTMLElement>('root')
const mounted = shallowRef(false)
const parent = inject(drawerContextKey, undefined)
const children = shallowReactive(new Set<string>())
const requested = computed(() => props.open ?? props.modelValue)
const wanted = computed(
  () => requested.value && (parent?.visible.value ?? true),
)
const placement = computed<DrawerPlacement>(() =>
  props.direction
    ? ({ ltr: 'left', rtl: 'right', ttb: 'top', btt: 'bottom' } as const)[
        props.direction
      ]
    : props.placement,
)
const { nextZIndex } = useZIndex()
const automaticZIndex = shallowRef(2001)
const zIndex = computed(() => props.zIndex ?? automaticZIndex.value)
provide(zIndexContextKey, zIndex)
const waitForLoading = provideLoadingCompletion()
const { loadingVisible } = useControlLoading(
  () => props.loading,
  waitForLoading,
)
let trigger: HTMLElement | undefined
let focusHandled = false
let focusReleased = false
const lifecycle = useDrawerLifecycle(
  props,
  wanted,
  emit,
  waitForLoading,
  () => {
    automaticZIndex.value = nextZIndex()
    trigger =
      (panel.value?.ownerDocument.activeElement as HTMLElement | undefined) ??
      (typeof document !== 'undefined'
        ? (document.activeElement as HTMLElement)
        : undefined)
    focusHandled = false
    focusReleased = false
  },
  nextZIndex,
  () => parent?.visible.value ?? true,
)
const { visible, present, rendered, closePending, guardActive, guardShown } =
  lifecycle
registerLoadingCompletion({
  stopping: () => guardShown.value && !guardActive.value,
  restored: waitForLoading,
})
provide(drawerContextKey, {
  visible,
  setChild: (key, open) => {
    if (open) children.add(key)
    else children.delete(key)
  },
})
watch(visible, (value) => parent?.setChild(id, value), { immediate: true })
watch(
  () => parent?.visible.value,
  (value) => {
    if (value === false && requested.value) {
      emit('update:modelValue', false)
      emit('update:open', false)
    }
  },
)
onBeforeUnmount(() => {
  parent?.setChild(id, false)
  if (present.value && isTopModal()) {
    present.value = false
    onReleased(new Event('close-auto-focus', { cancelable: true }))
  }
})
onMounted(() => {
  mounted.value = true
})
const modalPresence = computed(() => present.value && mounted.value)
const { isTopModal } = useModal(
  {
    handleClose: () => {
      if (props.closeOnPressEscape ?? props.keyboard) lifecycle.close('escape')
    },
  },
  modalPresence,
)
useLockscreen(computed(() => modalPresence.value && props.lockScroll))
const hasMask = computed(() => props.modal ?? props.mask)
const penetrable = computed(() => !hasMask.value && props.modalPenetrable)
const trapEnabled = computed(
  () =>
    (props.trapFocus ?? !penetrable.value) &&
    modalPresence.value &&
    visible.value &&
    isTopModal(),
)
const showClose = computed(() => props.closable ?? props.showClose)
const container = computed(() => {
  const value = props.appendTo ?? props.getContainer ?? 'body'
  return typeof value === 'function' ? value() : value
})
const teleported = computed(
  () => container.value !== false && (props.appendToBody ?? props.teleported),
)
const target = computed(() =>
  container.value === false ? 'body' : container.value,
)
const fixed = computed(
  () =>
    teleported.value &&
    (target.value === 'body' ||
      (typeof document !== 'undefined' && target.value === document.body)),
)
const resize = useDrawerResize(
  props,
  placement,
  panel,
  root,
  computed(() => visible.value && !closePending.value && isTopModal()),
  emit,
)
const { size, resizing, horizontal } = resize
const dimension = computed<CSSProperties>(() => ({
  [horizontal.value ? 'width' : 'height']:
    typeof size.value === 'number' ? `${size.value}px` : size.value,
}))
const pushed = computed(() => !!props.push && children.size > 0)
const pushStyle = computed<CSSProperties>(() => {
  if (!pushed.value) return {}
  const distance =
    typeof props.push === 'object' ? (props.push.distance ?? 180) : 180
  const value = typeof distance === 'number' ? `${distance}px` : distance
  const negative = ['right', 'bottom'].includes(placement.value)
  return {
    transform: `translate${horizontal.value ? 'X' : 'Y'}(${negative ? `calc(-1 * ${value})` : value})`,
  }
})
const scope = computed<DrawerSlotScope>(() => ({
  close: lifecycle.close,
  open: present.value,
  closePending: closePending.value,
  loading: props.loading,
  titleId,
  titleClass: ns.e('title'),
  placement: placement.value,
  size: size.value,
  resizing: resizing.value,
}))
const label = computed(
  () =>
    props.ariaLabel ||
    (attrs['aria-label'] as string) ||
    (typeof props.title === 'string' ? props.title : '') ||
    t('vs.drawer.title'),
)
const onMask = (event: MouseEvent) => {
  let allowed = props.closeOnClickModal ?? props.maskClosable
  if (props.beforeClose) {
    const declared = owner.vnode.props ?? {}
    const value =
      'closeOnClickModal' in declared
        ? declared.closeOnClickModal
        : 'close-on-click-modal' in declared
          ? declared['close-on-click-modal']
          : 'maskClosable' in declared
            ? declared.maskClosable
            : declared['mask-closable']
    allowed = value === true || value === ''
  }
  if (allowed && isTopModal()) lifecycle.close('mask', event)
}
const onTrapped = (event: Event) => {
  if (focusHandled) {
    event.preventDefault()
    return
  }
  focusHandled = true
  if (!(props.autofocus ?? props.autoFocus)) event.preventDefault()
  emit('openAutoFocus', event)
}
const onReleased = (event: Event) => {
  event.preventDefault()
  // Losing the top layer to a child is a pause, not a Drawer close.
  if (present.value) return
  if (focusReleased) return
  focusReleased = true
  const released = new Event('close-auto-focus', { cancelable: true })
  emit('closeAutoFocus', released)
  if (
    !released.defaultPrevented &&
    props.restoreFocus &&
    trigger?.isConnected &&
    !trigger.closest('[inert]')
  )
    trigger.focus({ preventScroll: true })
}
const focus = () => panel.value?.focus({ preventScroll: true })
const afterEnter = () => {
  lifecycle.afterEnter()
  if (visible.value && !trapEnabled.value && !focusHandled) {
    const event = new Event('open-auto-focus', { cancelable: true })
    focusHandled = true
    if (!(props.autofocus ?? props.autoFocus)) event.preventDefault()
    emit('openAutoFocus', event)
    if (!event.defaultPrevented) focus()
  }
}
const afterLeave = () => {
  lifecycle.afterLeave()
  nextTick(() => {
    if (!present.value && !focusReleased)
      onReleased(new Event('close-auto-focus', { cancelable: true }))
  })
}
defineExpose({
  open: lifecycle.open,
  handleOpen: lifecycle.open,
  close: lifecycle.close,
  handleClose: lifecycle.close,
  focus,
  visible,
  size,
  resizing,
})
</script>

<template>
  <Teleport v-if="mounted || !teleported" :disabled="!teleported" :to="target">
    <div
      v-if="rendered || props.forceRender"
      v-show="present"
      ref="root"
      :class="[
        ns.e('root'),
        props.rootClassName,
        ns.is('inline', !fixed),
        ns.is('penetrable', penetrable),
        ns.is('closing', !visible),
      ]"
      :style="[{ zIndex }, props.rootStyle]"
      :aria-hidden="!present || undefined"
      @click.self="!hasMask && !penetrable && onMask($event)"
    >
      <Transition name="s-drawer-mask" appear>
        <div
          v-if="visible && hasMask"
          :class="[ns.e('mask'), props.modalClass, props.classNames?.mask]"
          :style="[props.maskStyle, props.styles?.mask]"
          aria-hidden="true"
          @click="onMask"
        >
          <slot name="mask" v-bind="scope" />
        </div>
      </Transition>
      <SFocusTrap
        :trapped="trapEnabled"
        :focus-trap-el="panel || undefined"
        focus-start-el="container"
        loop
        @focus-after-trapped="onTrapped"
        @focus-after-released="onReleased"
      >
        <Transition
          :name="`s-drawer-${placement}`"
          appear
          @after-enter="afterEnter"
          @after-leave="afterLeave"
        >
          <div
            v-show="visible"
            :class="[
              ns.e('wrapper'),
              ns.m(placement),
              props.classNames?.wrapper,
            ]"
            :style="[
              dimension,
              props.contentWrapperStyle,
              props.styles?.wrapper,
            ]"
          >
            <aside
              ref="panel"
              v-bind="attrs"
              :class="[
                ns.b(),
                ns.m(placement),
                ns.is(shape),
                ns.is('pushed', pushed),
                ns.is('resizing', resizing),
                ns.is('headerless', !props.withHeader && showClose),
              ]"
              :style="[pushStyle, attrs.style as CSSProperties]"
              role="dialog"
              :aria-modal="!penetrable || undefined"
              :aria-label="label"
              :aria-labelledby="
                (attrs['aria-labelledby'] as string) ||
                (props.withHeader &&
                (props.title || slots.header || slots.title)
                  ? titleId
                  : undefined)
              "
              :aria-busy="closePending || loadingVisible || undefined"
              tabindex="-1"
              :inert="!present || undefined"
              @keydown.capture="!visible && $event.preventDefault()"
            >
              <DrawerContent
                :options="props"
                :scope="scope"
                :show-close="showClose"
                :loading-visible="loadingVisible"
                :guard-active="guardActive"
                :guard-shown="guardShown"
                :shape="shape"
                @close="lifecycle.close('button', $event)"
              >
                <template
                  v-for="(_, name) in forwardedSlots()"
                  #[name]="slotScope"
                  ><slot
                    :name="
                      name === 'close-icon' && !slots['close-icon']
                        ? 'closeIcon'
                        : name
                    "
                    v-bind="slotScope"
                /></template>
              </DrawerContent>
              <button
                v-if="props.resizable"
                type="button"
                role="separator"
                :class="[ns.e('resizer'), ns.em('resizer', placement)]"
                :disabled="closePending || !visible"
                :aria-label="props.resizeLabel || t('vs.drawer.resize')"
                :aria-orientation="horizontal ? 'vertical' : 'horizontal'"
                :aria-valuenow="resize.actualSize.value || undefined"
                :aria-valuemin="resize.minimum.value"
                :aria-valuemax="resize.maximum.value || undefined"
                @pointerdown="resize.start"
                @keydown="resize.keydown"
              >
                <slot name="resizer" v-bind="scope" />
              </button>
            </aside>
          </div>
        </Transition>
      </SFocusTrap>
    </div>
  </Teleport>
</template>
