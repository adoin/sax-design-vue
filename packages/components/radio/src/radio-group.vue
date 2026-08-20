<script lang="ts" setup>
import { computed } from 'vue'
import { SRadioButton } from '@vuesax-alpha/components/radio-button'
import { useId, useNamespace } from '@vuesax-alpha/hooks'
import SRadio from './radio.vue'
import RadioGroupProvider from './radio-group-provider.vue'
import { radioGroupEmits, radioGroupProps } from './radio-group'
import type { RadioOption, RadioValue } from './radio-group'

defineOptions({ name: 'SRadioGroup' })

const props = defineProps(radioGroupProps)
const emit = defineEmits(radioGroupEmits)
const slots = defineSlots<{
  default?(): unknown
  option?(props: { option: RadioOption; checked: boolean }): unknown
  empty?(): unknown
}>()

const ns = useNamespace('radio-group')
const groupId = useId()
const groupName = computed(() => props.name || `${groupId.value}-option`)
const gapValue = computed(() =>
  typeof props.gap === 'number' ? `${props.gap}px` : props.gap,
)
const groupStyles = computed(() => ({
  '--sax-radio-group-columns': Math.max(1, props.columns),
  '--sax-radio-group-gap': gapValue.value,
}))

const isOptionDisabled = (option: RadioOption) =>
  props.disabled ||
  option.disabled ||
  props.disabledValues.includes(option.value)

const isOptionChecked = (option: RadioOption) =>
  props.modelValue === option.value

const update = (value: RadioValue) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <div
    :class="[
      ns.b(),
      ns.m(props.type),
      ns.is('disabled', props.disabled),
      ns.is('data-driven', props.options.length > 0),
    ]"
    :style="groupStyles"
    role="radiogroup"
  >
    <radio-group-provider
      :model-value="props.modelValue"
      :disabled="props.disabled"
      :name="groupName"
      @change="update"
    >
      <template v-if="props.options.length">
        <template v-if="props.type === 'button'">
          <s-radio-button
            v-for="item in props.options"
            :key="String(item.value)"
            :value="item.value"
            :label="item.label"
            :description="item.description"
            :disabled="isOptionDisabled(item)"
          />
        </template>

        <div
          v-for="item in props.options"
          v-else
          :key="String(item.value)"
          :class="ns.e('option')"
        >
          <s-radio :value="item.value" :disabled="isOptionDisabled(item)">
            <slot name="option" :option="item" :checked="isOptionChecked(item)">
              <span :class="ns.e('option-label')">{{ item.label }}</span>
              <small v-if="item.description" :class="ns.e('description')">
                {{ item.description }}
              </small>
            </slot>
          </s-radio>
        </div>
      </template>

      <slot v-else-if="slots.default" />
      <slot v-else name="empty" />
    </radio-group-provider>
  </div>
</template>
