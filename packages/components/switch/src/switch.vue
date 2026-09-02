<script lang="ts" setup>
import { computed } from 'vue'
import {
  useColor,
  useNamespace,
  useShape,
  useVuesaxBaseComponent,
} from '@vuesax-alpha/hooks'
import { getVsColor } from '@vuesax-alpha/utils'
import { switchEmits, switchProps } from './switch'
import { useSwitch } from './use-switch'

defineOptions({
  name: 'SSwitch',
  inheritAttrs: false,
})

const props = defineProps(switchProps)
const emit = defineEmits(switchEmits)
const ns = useNamespace('switch')
const shape = useShape()
const color = useColor('primary')
const { isLoading, checked, isDisabled, isIndeterminate, handleChange } =
  useSwitch(props, emit)
const vsBaseClasses = useVuesaxBaseComponent(color)
const switchKls = computed(() => [
  vsBaseClasses,
  ns.b(),
  ns.is('loading', isLoading.value),
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
      :disabled="isDisabled"
      :indeterminate="isIndeterminate"
      :readonly="isDisabled"
      :aria-checked="isIndeterminate ? 'mixed' : undefined"
      :class="ns.e('input')"
      @change="handleChange"
    />
    <span :class="ns.e('track')" aria-hidden="true">
      <span :class="ns.e('circle')">
        <slot v-if="!isLoading" name="circle" />
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
