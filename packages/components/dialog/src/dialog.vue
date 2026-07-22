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
        :style="{ zIndex }"
        @click="clickDialog.onClick"
        @mousedown="clickDialog.onMousedown"
        @mouseup="clickDialog.onMouseup"
      >
        <div :style="dialogStyles" :class="dialogKls">
          <div v-if="loading" :class="ns.e('loading')">
            <icon-loading />
          </div>

          <button v-if="showClose" :class="ns.e('close')" @click="close">
            <icon-close :hover="'x'" />
          </button>

          <div
            v-if="showHeader && ($slots.header || title)"
            :class="ns.e('header')"
          >
            <slot name="header"
              ><span :class="ns.e('title')">{{ title }}</span></slot
            >
          </div>

          <div
            :class="[
              ns.e('content'),
              { notFooter: !($slots.footer || showFooter) },
            ]"
          >
            <slot>
              <span v-if="useHtml" v-html="content" />
              <template v-else>{{ content }}</template>
            </slot>
          </div>

          <div v-if="$slots.footer || showFooter" :class="ns.e('footer')">
            <slot name="footer">
              <s-button
                v-if="showCancelButton"
                type="flat"
                @click="handleCancel"
              >
                {{ cancelButtonText }}
              </s-button>
              <s-button v-if="showConfirmButton" @click="handleConfirm">
                {{ confirmButtonText }}
              </s-button>
            </slot>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import SButton from '@vuesax-alpha/components/button'
import { IconClose, IconLoading } from '@vuesax-alpha/components/icon'
import {
  useModal,
  useNamespace,
  usePopperContainer,
  usePopperContainerId,
  useSameTarget,
} from '@vuesax-alpha/hooks'
import { dialogEmits, dialogProps } from './dialog'
import { useDialog } from './composables'
import { dialogDeprecated } from './deprecated'

defineOptions({
  name: 'SDialog',
})

const props = defineProps(dialogProps)
const emit = defineEmits(dialogEmits)

usePopperContainer()
const { selector } = usePopperContainerId()

const ns = useNamespace('dialog')

dialogDeprecated(props)

const {
  visible,
  zIndex,
  dialogKls,
  dialogStyles,
  close,
  afterEnter,
  afterLeave,
  beforeLeave,
  handleClose,
} = useDialog(props, emit)

useModal({ handleClose }, visible)

const clickDialog = useSameTarget(() => {
  if (props.maskClosable) handleClose()
})

const rootKls = computed(() => [
  ns.b(),
  ns.is('full-screen', props.fullScreen),
  ns.is('blur', props.overlayBlur),
  ns.is('mask', props.mask),
])

const showClose = computed(() => !props.notClose && props.showClose)
const handleCancel = () => {
  emit('cancel')
  if (props.cancelClosable) close()
}
const handleConfirm = () => {
  emit('confirm')
  if (props.confirmClosable) close()
}

defineExpose({
  /** @description whether the dialog is visible */
  visible,
  /** @description dialog close method */
  close,
  open: () => (visible.value = true),
})
</script>
