<template>
  <teleport :to="appendTo" :disabled="!teleported">
    <transition
      :name="animation"
      @after-leave="onTransitionLeave"
      @before-enter="onBeforeEnter"
      @after-enter="onAfterShow"
      @before-leave="onBeforeLeave"
    >
      <div
        v-if="shouldRender"
        v-show="shouldShow"
        :id="popperId"
        ref="contentRef"
        :class="popperKls"
        :style="popperStyle"
        :data-popper-placement="placement"
        @mouseenter="handleContentEnter"
        @mouseleave="onContentLeave"
        @focusin="restoreOpaqueFromFocus"
      >
        <button
          v-if="showCloseButton"
          type="button"
          :class="ns.e('close')"
          :aria-label="t('vs.common.close')"
          @click="onClose"
        >
          <IconClose hover="less" />
        </button>
        <template v-if="!destroyed">
          <template v-if="content">
            <template v-if="rawContent">
              <div v-html="content" />
            </template>
            <template v-else>
              {{ content }}
            </template>
          </template>

          <template v-else>
            <slot />
          </template>
        </template>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  ref,
  unref,
  watch,
} from 'vue'
import { onClickOutside, unrefElement } from '@vueuse/core'
import { IconClose } from '@vuesax-alpha/components/icon'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { popperContextKey } from '@vuesax-alpha/tokens'
import { composeEventHandlers } from '@vuesax-alpha/utils'
import { popperContentEmits, popperContentProps } from './content'

defineOptions({
  name: 'SPopper',
})

const ns = useNamespace('popper')
const { t } = useLocale()

const {
  contentRef,
  controlled,
  open,
  trigger,
  updatePopper,
  onOpen,
  onClose,
  onShow,
  onHide,
  onBeforeShow,
  onBeforeHide,
} = inject(popperContextKey, undefined)!

const props = defineProps(popperContentProps)
const emit = defineEmits(popperContentEmits)

const destroyed = ref(false)

const persistentRef = computed(() => {
  // For testing, we would always want the content to be rendered
  // to the DOM, so we need to return true here.
  if (process.env.NODE_ENV === 'test') {
    return true
  }
  return props.persistent
})

const shouldRender = computed(() => {
  return unref(persistentRef) ? true : unref(open)
})

const shouldShow = computed(() => {
  return props.disabled ? false : unref(open)
})

const showCloseButton = computed(
  () => props.showClose ?? !props.closeOnClickOutside,
)

const popperKls = computed(() => [
  ns.b(),
  ns.is('not-arrow', !props.showArrow),
  ns.is('closeable', showCloseButton.value),
  ns.is('translucent', props.translucent),
  props.popperClass,
])

const togglePopperAlive = () => {
  updatePopper(false)
}

const stopWhenControlled = () => {
  if (unref(controlled)) return true
}

const restoreOpaque = () => {
  if (props.translucent) emit('update:translucent', false)
}

const restoreOpaqueFromFocus = (event: FocusEvent) => {
  const target = event.target
  if (target instanceof Element && target.closest('button, [role="button"]'))
    return
  const from = event.relatedTarget
  if (from instanceof Node && contentRef.value?.contains(from)) return
  restoreOpaque()
}

const onContentEnter = composeEventHandlers(stopWhenControlled, () => {
  if (props.interactivity && unref(trigger) === 'hover') {
    onOpen()
  }
})

const handleContentEnter = (event: MouseEvent) => {
  restoreOpaque()
  onContentEnter(event)
}

const onContentLeave = composeEventHandlers(stopWhenControlled, () => {
  if (unref(trigger) === 'hover') {
    onClose()
  }
})

const onTransitionLeave = () => {
  onHide()
}

const onBeforeEnter = () => {
  updatePopper()
  onBeforeShow?.()
}

const onBeforeLeave = () => {
  onBeforeHide?.()
}

let stopHandle: (() => void) | undefined

const onAfterShow = () => {
  onShow()
}

const startClickOutside = () => {
  stopHandle?.()
  if (!props.closeOnClickOutside) return
  stopHandle = onClickOutside(
    computed(() => {
      return unrefElement(contentRef)
    }),
    () => {
      if (unref(controlled)) return
      const $trigger = unref(trigger)
      if ($trigger !== 'hover') {
        onClose()
      }
    },
    { ignore: computed(() => props.outsideClickIgnore) },
  )
}

onMounted(() => {
  watch(() => props.visible, togglePopperAlive, { immediate: true })
})

watch(
  () => unref(open),
  (val) => {
    if (val) startClickOutside()
    else stopHandle?.()
  },
  {
    flush: 'post',
    immediate: true,
  },
)

watch(
  () => props.content,
  () => {
    updatePopper()
  },
)

onBeforeUnmount(() => {
  destroyed.value = true
})
</script>
