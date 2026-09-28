<template>
  <div :class="checkboxKls" :style="checkboxStyles">
    <div :class="ns.e('input')">
      <input
        v-bind="$attrs"
        :id="checkboxId"
        v-model="model"
        :value="value"
        :name="name"
        :disabled="isDisabled || loading"
        :aria-busy="loading || undefined"
        :indeterminate="indeterminate"
        :aria-checked="indeterminate ? 'mixed' : isChecked"
        :class="ns.e('original')"
        type="checkbox"
        @change="handleChange"
      />
      <div :class="ns.em('input', 'mask')">
        <icon-loading
          v-if="loadingVisible"
          shape="square"
          stop-behavior="corners"
          :active="loading"
          @phase-change="handleLoadingPhase"
          @restored="finishLoading"
        />
        <svg
          v-if="!$slots.icon && indeterminate"
          :class="ns.e('indeterminate')"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <rect x="5" y="5" width="10" height="10" rx="1.5" />
        </svg>
        <icon-check
          v-else-if="!$slots.icon"
          :active="isChecked"
          :indeterminate="indeterminate"
        />
        <span
          v-else
          ref="customIcon"
          :class="ns.e('custom-icon')"
          :data-animation="resolvedIconAnimation"
        >
          <slot
            name="icon"
            :checked="isChecked"
            :indeterminate="indeterminate"
          />
        </span>
      </div>
    </div>
    <label
      v-if="hasOwnLabel"
      :for="checkboxId"
      :class="[ns.e('label'), ns.is('line-through', lineThrough)]"
    >
      <slot />
      <template v-if="!$slots.default">{{ label }}</template>
    </label>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, useSlots, useTemplateRef, watch } from 'vue'
import {
  useColor,
  useId,
  useNamespace,
  useSize,
  useVuesaxBaseComponent,
} from '@vuesax-alpha/hooks'
import { getVsColor } from '@vuesax-alpha/utils'
import { IconCheck, IconLoading } from '@vuesax-alpha/components/icon'
import { checkboxEmits, checkboxProps } from './checkbox'
import { useCheckbox, useCheckboxIconAnimation } from './composables'
import type { LogoLoadingPhase } from '@vuesax-alpha/components/icon'

defineOptions({
  name: 'SCheckbox',
  inheritAttrs: false,
})

const props = defineProps(checkboxProps)
const slots = useSlots()
const emit = defineEmits(checkboxEmits)
const ns = useNamespace('checkbox')
const size = useSize()
const loadingVisible = ref(props.loading)
const loadingExiting = ref(false)
watch(
  () => props.loading,
  (loading) => {
    if (loading) {
      loadingVisible.value = true
      loadingExiting.value = false
    }
  },
)
const handleLoadingPhase = (phase: LogoLoadingPhase) => {
  loadingExiting.value = phase === 'stopping'
}
const finishLoading = () => {
  if (props.loading) return
  loadingVisible.value = false
  loadingExiting.value = false
}

const checkboxId = props.id ?? useId()

const { isChecked, isDisabled, model, hasOwnLabel, handleChange } = useCheckbox(
  props,
  emit,
  slots,
)
const customIconElement = useTemplateRef<HTMLElement>('customIcon')
const { resolvedIconAnimation } = useCheckboxIconAnimation(
  customIconElement,
  () => props.iconAnimation,
)
const vsBaseClasses = useVuesaxBaseComponent(useColor())
const checkboxKls = computed(() => [
  ns.b(),
  ns.m(size.value || 'default'),
  vsBaseClasses,
  ns.is('disabled', isDisabled.value),
  ns.is('checked', isChecked.value && !props.indeterminate),
  ns.is('indeterminate', props.indeterminate),
  ns.is('label-before', props.labelBefore),
  ns.is('loading', props.loading),
  ns.is('loading-visual', loadingVisible.value && !loadingExiting.value),
  ns.is('loading-exiting', loadingExiting.value),
])

const checkboxStyles = computed(() => [
  ns.cssVar({
    color: getVsColor(props.color),
  }),
])
</script>
