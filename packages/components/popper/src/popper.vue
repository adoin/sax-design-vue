<template>
  <popper-trigger
    :disabled="disabled || !referenceVisible"
    :trigger="trigger"
    :virtual-ref="virtualRef"
    :virtual-triggering="virtualTriggering"
    :on-mouseenter="onMouseenter"
    :on-mouseleave="onMouseleave"
    :on-click="onClick"
    :on-keydown="onKeydown"
    :on-focus="onFocus"
    :on-blur="onBlur"
    :on-contextmenu="onContextmenu"
  >
    <slot />
  </popper-trigger>

  <popper-content
    :animation="animation"
    :popper-id="popperId"
    :append-to="appendTo"
    :teleported="teleported"
    :persistent="persistent"
    :placement="popperPlacement"
    :content="content"
    :interactivity="interactivity"
    :popper-class="popperClass"
    :popper-style="[popperStyle, floatingStyles, { zIndex }]"
    :disabled="disabled || !referenceVisible"
    :visible="visible"
    :show-arrow="showArrow"
    @blur="onBlur"
    @close="onClose"
  >
    <slot name="content" />
  </popper-content>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onDeactivated,
  provide,
  reactive,
  readonly,
  ref,
  toRef,
  unref,
  watch,
} from 'vue'
import { isBoolean, isEmpty } from '@vuesax-alpha/utils'
import {
  useDelayedToggle,
  useId,
  usePopperContainer,
  usePopperContainerId,
  useZIndex,
} from '@vuesax-alpha/hooks'
import { popperContextKey } from '@vuesax-alpha/tokens'
import {
  arrow as arrowMiddleware,
  flip as flipMiddleware,
  offset as offsetMiddleware,
  shift as shiftMiddleware,
  useFloating,
} from '@vuesax-alpha/hooks/use-floating/vue'
import { popperEmits, popperProps, usePopperModelToggle } from './popper'
import popperContent from './content.vue'
import popperTrigger from './trigger.vue'
import type { Ref } from 'vue'
import type {
  Middleware,
  ReferenceElement,
} from '@vuesax-alpha/hooks/use-floating/vue'

defineOptions({
  name: 'SPopper',
  inheritAttrs: false,
})

usePopperContainer()

const { selector, id } = usePopperContainerId()

const appendTo = computed(() => props.appendTo || selector.value)

const props = defineProps(popperProps)
const emit = defineEmits(popperEmits)

const { currentZIndex, nextZIndex } = useZIndex()

const zIndex = computed(() => props.zIndex ?? currentZIndex.value)
const popperId = useId()

const triggerRef = ref<ReferenceElement>()
const contentRef = ref<HTMLElement>()
const arrowRef = ref<HTMLElement>()

const open = ref(false)
const referenceVisible = ref(true)
const toggleReason = ref<Event>()

const { show, hide, hasUpdateHandler } = usePopperModelToggle({
  indicator: open,
  toggleReason,
  processBeforeClosing: props.processBeforeClose,
  shouldProceed: props.processBeforeOpen,
})

const { onOpen, onClose } = useDelayedToggle({
  showAfter: toRef(props, 'showAfter'),
  hideAfter: toRef(props, 'hideAfter'),
  autoClose: toRef(props, 'autoClose'),
  open: show,
  close: hide,
})

const {
  update,
  placement: popperPlacement,
  floatingStyles,
} = useFloating(triggerRef, contentRef, {
  open,
  middleware: ref([
    !isEmpty(props.offset) && offsetMiddleware(props.offset),
    !isEmpty(props.flip) &&
      flipMiddleware(isBoolean(props.flip) ? undefined : props.flip),
    !isEmpty(props.shift) &&
      shiftMiddleware(isBoolean(props.shift) ? undefined : props.shift),
    arrowMiddleware({
      element: arrowRef,
    }),
  ]) as Ref<Middleware[]>,
  placement: computed(() => props.placement),
  strategy: computed(() => props.strategy),
  transform: false,
  fit: computed(() => props.fit),
})

const controlled = computed(
  () => isBoolean(props.visible) && !hasUpdateHandler.value,
)

const updatePopper = (shouldUpdateZIndex = true) => {
  update()
  if (shouldUpdateZIndex && props.zIndex === undefined) nextZIndex()
}

const onBlur = () => {
  if (!props.virtualTriggering) {
    onClose()
  }
}

const isFocusInsideContent = () => {
  return !!contentRef.value?.contains(document.activeElement)
}

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled && open.value) {
      open.value = false
    }
  },
)

onDeactivated(() => open.value && hide())

let referenceObserver: IntersectionObserver | undefined

const observeReference = (reference?: ReferenceElement) => {
  referenceObserver?.disconnect()
  referenceObserver = undefined

  if (
    typeof HTMLElement === 'undefined' ||
    !(reference instanceof HTMLElement)
  ) {
    referenceVisible.value = true
    return
  }

  referenceObserver = new IntersectionObserver(
    ([entry]) => {
      const style = window.getComputedStyle(reference)
      const visible =
        entry.isIntersecting &&
        style.display !== 'none' &&
        style.visibility !== 'hidden'

      referenceVisible.value = visible
      if (!visible && open.value) onClose()
    },
    { threshold: 0 },
  )
  referenceObserver.observe(reference)
}

watch(triggerRef, observeReference, { flush: 'post', immediate: true })

onBeforeUnmount(() => referenceObserver?.disconnect())

provide(popperContextKey, {
  contentRef,
  triggerRef,
  arrowRef,
  referenceRef: triggerRef,

  controlled,
  id,
  open: readonly(open),
  trigger: toRef(props, 'trigger'),
  onOpen,
  onClose,
  onToggle: (event?: Event) => {
    if (unref(open)) {
      onClose(event)
    } else {
      onOpen(event)
    }
  },
  onShow: () => {
    emit('show', toggleReason.value)
  },
  onHide: () => {
    emit('hide', toggleReason.value)
  },
  onBeforeShow: () => {
    emit('before-show', toggleReason.value)
  },
  onBeforeHide: () => {
    emit('before-hide', toggleReason.value)
  },
  updatePopper,
})

defineExpose(
  reactive({
    /**
     * @description popper component instance
     */
    triggerRef,
    /**
     * @description tooltip-content component instance
     */
    contentRef,
    /**
     * @description validate current focus event is trigger inside tooltip-content
     */
    isFocusInsideContent,
    /**
     * @description update popper component instance
     */
    updatePopper,
    /**
     * @description expose onOpen function to mange tooltip open state
     */
    onOpen,
    /**
     * @description expose onOpen function to mange tooltip open state
     */
    onClose,
    /**
     * @description expose hide function
     */
    hide,
    /**
     * @description expose current poppper placement
     */
    popperPlacement,
  }),
)
</script>
