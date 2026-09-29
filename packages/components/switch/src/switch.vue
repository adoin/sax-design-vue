<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import {
  useColor,
  useNamespace,
  useShape,
  useSize,
  useVuesaxBaseComponent,
} from '@vuesax-alpha/hooks'
import { getVsColor } from '@vuesax-alpha/utils'
import { SLogoLoading } from '@vuesax-alpha/components/icon'
import { switchEmits, switchProps } from './switch'
import { useSwitch } from './use-switch'
import type { LogoLoadingPhase } from '@vuesax-alpha/components/icon'

defineOptions({
  name: 'SSwitch',
  inheritAttrs: false,
})

const props = defineProps(switchProps)
const emit = defineEmits(switchEmits)
const ns = useNamespace('switch')
const shape = useShape()
const size = useSize()
const color = useColor('primary')
const { isLoading, checked, isDisabled, isIndeterminate, handleChange } =
  useSwitch(props, emit)
const loadingVisible = ref(isLoading.value)
const loadingExiting = ref(false)
watch(isLoading, (active) => {
  if (active) {
    loadingVisible.value = true
    loadingExiting.value = false
  }
})
const handleLoadingPhase = (phase: LogoLoadingPhase) => {
  loadingExiting.value = phase === 'stopping'
}
const finishLoading = () => {
  if (isLoading.value) return
  loadingVisible.value = false
  loadingExiting.value = false
}
const interactionDisabled = computed(
  () => isDisabled.value || loadingVisible.value,
)
const onChange = () => {
  if (!interactionDisabled.value) handleChange()
}
const vsBaseClasses = useVuesaxBaseComponent(color)
const switchKls = computed(() => [
  vsBaseClasses,
  ns.b(),
  ns.m(size.value || 'default'),
  ns.is('loading', loadingVisible.value),
  ns.is('loading-visual', loadingVisible.value),
  ns.is('loading-exiting', loadingExiting.value),
  ns.is(shape.value),
  ns.is('indeterminate', isIndeterminate.value),
  ns.is(props.variant),
  ns.is('checked', checked.value),
  ns.is('disabled', props.disabled),
])
const switchStyles = computed(() => [
  ns.cssVar({
    color: getVsColor(color.value),
  }),
])

defineExpose({ checked, isIndeterminate })
</script>

<template>
  <label :class="switchKls" :style="switchStyles">
    <input
      v-bind="$attrs"
      type="checkbox"
      :checked="checked"
      :disabled="interactionDisabled"
      :indeterminate="isIndeterminate"
      :readonly="interactionDisabled"
      :aria-busy="loadingVisible"
      :aria-checked="isIndeterminate ? 'mixed' : undefined"
      :class="ns.e('input')"
      @change="onChange"
    />
    <span :class="ns.e('track')" aria-hidden="true">
      <span :class="ns.e('circle')">
        <SLogoLoading
          v-if="loadingVisible"
          :active="isLoading"
          :shape="shape"
          size="150%"
          stop-behavior="corners"
          @phase-change="handleLoadingPhase"
          @restored="finishLoading"
        />
        <span :class="ns.e('circle-content')"><slot name="circle" /></span>
      </span>
      <span :class="ns.e('text')">
        <span :class="[ns.e('label'), ns.is('on'), ns.is('visible', checked)]">
          <slot v-if="$slots.on" name="on" />
          <slot v-else-if="$slots.default" />
          <template v-else-if="variant === 'text'">{{ activeText }}</template>
        </span>
        <span
          :class="[ns.e('label'), ns.is('off'), ns.is('visible', !checked)]"
        >
          <slot v-if="$slots.off" name="off" />
          <slot v-else-if="$slots.default" />
          <template v-else-if="variant === 'text'">{{ inactiveText }}</template>
        </span>
      </span>
    </span>
  </label>
</template>
