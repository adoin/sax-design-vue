<script lang="ts" setup>
import { computed } from 'vue'
import {
  useColor,
  useNamespace,
  useVuesaxBaseComponent,
} from '@vuesax-alpha/hooks'
import {
  IconCheck,
  IconClose,
  IconLoading,
} from '@vuesax-alpha/components/icon'
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
const color = useColor('primary')
const { isLoading, checked, isDisabled, handleChange } = useSwitch(props, emit)
const effectiveVariant = computed(() => (props.icon ? 'icon' : props.variant))
const vsBaseClasses = useVuesaxBaseComponent(color)
const switchKls = computed(() => [
  vsBaseClasses,
  ns.b(),
  ns.is('loading', isLoading.value),
  ns.is(props.shape),
  ns.is('indeterminate', props.indeterminate),
  ns.is(effectiveVariant.value),
  ns.is('checked', checked.value),
  ns.is('disabled', isDisabled.value),
])
const switchStyles = computed(() => [
  ns.cssVar({
    color: getVsColor(color.value),
  }),
])

defineExpose({ checked })
</script>

<template>
  <label :class="switchKls" :style="switchStyles">
    <input
      v-bind="$attrs"
      type="checkbox"
      :checked="checked"
      :disabled="isDisabled"
      :readonly="isDisabled"
      :class="ns.e('input')"
      @change="handleChange"
    />
    <span :class="ns.e('track')" aria-hidden="true">
      <span :class="ns.e('circle')">
        <slot name="circle">
          <icon-loading v-if="isLoading" />
          <template v-else-if="effectiveVariant === 'icon'">
            <icon-check v-if="checked" active />
            <icon-close v-else />
          </template>
        </slot>
      </span>
      <span :class="[ns.e('text'), ns.is(checked ? 'on' : 'off')]">
        <slot v-if="checked && $slots.on" name="on" />
        <slot v-else-if="!checked && $slots.off" name="off" />
        <slot v-else-if="$slots.default" />
        <template v-else-if="effectiveVariant === 'text'">
          {{ checked ? activeText : inactiveText }}
        </template>
      </span>
    </span>
  </label>
</template>
