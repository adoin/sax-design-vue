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
              <span :class="ns.e('title-accent')" :style="accentStyle" />
              <h3 :class="ns.e('title')">{{ title }}</h3>
            </div>
            <button
              v-if="type === 'alert'"
              :class="ns.e('close')"
              type="button"
              @click="handleClose"
            >
              <SIcon :icon="closeIcon" :icon-pack="iconPack" />
            </button>
          </header>

          <div :class="ns.e('content')">
            <slot>{{ text }}</slot>
          </div>

          <footer v-if="showFooter" :class="ns.e('footer')">
            <SButton
              :color="color"
              :type="resolveButtonType(buttonAccept)"
              :disabled="!canAccept"
              @click="handleAccept"
            >
              {{ acceptText }}
            </SButton>
            <SButton
              :type="resolveButtonType(buttonCancel)"
              @click="handleCancel"
            >
              {{ cancelText }}
            </SButton>
          </footer>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { SButton } from '@vuesax-alpha/components/button'
import { SIcon } from '@vuesax-alpha/components/icon'
import { getVsColor } from '@vuesax-alpha/utils'
import { promptEmits, promptProps } from './prompt'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'SPrompt',
})

const props = defineProps(promptProps)
const emit = defineEmits(promptEmits)

const ns = useNamespace('prompt')
const locked = ref(false)

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const resolveColor = (colorValue: string) => {
  const resolved = getVsColor(colorValue)
  if (!resolved) return undefined
  return resolved.startsWith('var(') ? resolved : `rgb(${resolved})`
}

const headerStyle = computed(
  (): CSSProperties => ({
    color: resolveColor(props.color),
  })
)

const accentStyle = computed(
  (): CSSProperties => ({
    background: resolveColor(props.color),
  })
)

const resolveButtonType = (type: string) =>
  type === 'filled' ? 'default' : type

const canAccept = computed(
  () => props.isValid === 'none' || props.isValid === true
)

const showFooter = computed(() => !props.buttonsHidden)

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
