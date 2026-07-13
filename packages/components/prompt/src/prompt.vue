<template>
  <teleport to="body">
    <transition name="dialog-t">
      <div
        v-if="visible"
        :class="[ns.b(), ns.m(color), ns.is('locked', locked)]"
      >
        <div :class="ns.e('overlay')" @click="handleOverlayClick" />
        <div :class="ns.e('dialog')">
          <header :class="ns.e('header')" :style="headerStyle">
            <div :class="ns.e('title-wrap')">
              <span :class="ns.e('title-accent')" />
              <h3 :class="ns.e('title')">{{ title }}</h3>
            </div>
            <button
              v-if="type === 'alert'"
              :class="ns.e('close')"
              type="button"
              @click="handleClose"
            >
              <VsIcon :icon="closeIcon" :icon-pack="iconPack" />
            </button>
          </header>

          <div :class="ns.e('content')">
            <slot>{{ text }}</slot>
          </div>

          <footer v-if="showFooter" :class="ns.e('footer')">
            <VsButton
              :color="color"
              :type="buttonAccept"
              :disabled="!canAccept"
              @click="handleAccept"
            >
              {{ acceptText }}
            </VsButton>
            <VsButton :type="buttonCancel" @click="handleCancel">
              {{ cancelText }}
            </VsButton>
          </footer>

          <footer v-else-if="type === 'alert'" :class="ns.e('footer')">
            <VsButton :color="color" :type="buttonAccept" @click="handleAccept">
              {{ acceptText }}
            </VsButton>
          </footer>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { VsButton } from '@vuesax-alpha/components/button'
import { VsIcon } from '@vuesax-alpha/components/icon'
import { getVsColor } from '@vuesax-alpha/utils'
import { promptEmits, promptProps } from './prompt'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'VsPrompt',
})

const props = defineProps(promptProps)
const emit = defineEmits(promptEmits)

const ns = useNamespace('prompt')
const locked = ref(false)

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const headerStyle = computed(
  (): CSSProperties => ({
    color: getVsColor(props.color) || undefined,
  })
)

const canAccept = computed(
  () => props.isValid === 'none' || props.isValid === true
)

const showFooter = computed(
  () => !props.buttonsHidden && props.type === 'confirm'
)

const rebound = () => {
  locked.value = true
  window.setTimeout(() => {
    locked.value = false
  }, 300)
}

const handleAccept = () => {
  if (!canAccept.value) return
  visible.value = false
  emit('accept')
}

const handleCancel = () => {
  visible.value = false
  emit('cancel')
}

const handleClose = () => {
  visible.value = false
  emit('close')
}

const handleOverlayClick = () => {
  if (props.type === 'alert') {
    handleClose()
    return
  }
  rebound()
}
</script>
