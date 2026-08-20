<script lang="ts" setup>
import { computed, useTemplateRef } from 'vue'
import {
  useColor,
  useId,
  useNamespace,
  useSvgIconAnimation,
  useVuesaxBaseComponent,
} from '@vuesax-alpha/hooks'
import { getVsColor } from '@vuesax-alpha/utils'
import { radioEmits, radioProps } from './radio'
import { useRadio } from './use-radio'

defineOptions({
  name: 'SRadio',
  inheritAttrs: false,
})

defineSlots<{
  default?(): unknown
  icon?(props: { checked: boolean }): unknown
}>()

const ns = useNamespace('radio')
const props = defineProps(radioProps)
const emit = defineEmits(radioEmits)
const uid = useId()

const { isDisabled, loading, model, checked, radioName } = useRadio(props, emit)
const customIconElement = useTemplateRef<HTMLElement>('customIcon')
const { resolvedIconAnimation } = useSvgIconAnimation(
  customIconElement,
  () => props.iconAnimation,
)

const color = useColor('primary')
const vsBaseClasses = useVuesaxBaseComponent(color)

const radioKls = computed(() => [
  vsBaseClasses,
  ns.b('wrapper'),
  ns.is('loading', loading.value),
  ns.is('disabled', isDisabled.value),
  ns.is('active', checked.value),
  ns.is('label-before', props.labelBefore),
])

const radioStyles = computed(() => [
  ns.cssVar({
    color: getVsColor(color.value),
  }),
])
</script>

<template>
  <label :class="radioKls" :style="radioStyles">
    <input
      v-bind="$attrs"
      :id="uid"
      v-model="model"
      :class="ns.e('original')"
      :value="value"
      type="radio"
      :disabled="isDisabled"
      :name="radioName"
      :aria-checked="checked"
      :aria-busy="loading || undefined"
    />

    <span :class="ns.b()" aria-hidden="true">
      <svg
        :class="ns.e('graphic')"
        viewBox="0 0 20 20"
        focusable="false"
        shape-rendering="geometricPrecision"
      >
        <circle :class="ns.e('surface')" cx="10" cy="10" r="9.5" />
        <circle
          v-if="!$slots.icon"
          :class="ns.e('dot')"
          cx="10"
          cy="10"
          r="4"
        />
      </svg>

      <span
        v-if="$slots.icon"
        ref="customIcon"
        :class="ns.e('custom-icon')"
        :data-animation="resolvedIconAnimation"
      >
        <slot name="icon" :checked="checked" />
      </span>
    </span>

    <span v-if="$slots.default || label !== ''" :class="ns.e('label')">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
