<template>
  <s-popper
    v-model:visible="visible"
    trigger="click"
    placement="bottom-start"
    :fit="true"
    :show-arrow="false"
    :disabled="disabled"
    :offset="4"
    :popper-class="ns.e('popper')"
  >
    <div :class="[ns.b(), ns.is('block', block)]" @mousedown.prevent>
      <s-input
        ref="inputRef"
        :model-value="displayText"
        :placeholder="inputPlaceholder"
        :disabled="disabled"
        :readonly="!editable || readonly"
        :clearable="clearable && !disabled"
        icon-after
        @update:model-value="handleInput"
        @clear="handleClear"
        @focus="(e) => $emit('focus', e)"
        @blur="(e) => $emit('blur', e)"
      >
        <template #icon>
          <s-icon size="18"><clock /></s-icon>
        </template>
      </s-input>
    </div>

    <template #content>
      <div :class="ns.e('dropdown')">
        <s-time-panel
          :model-value="innerValue"
          :disabled-date="disabledTime"
          @update:model-value="handlePick"
        />
        <div :class="ns.e('footer')">
          <s-button size="small" type="flat" @click="handleNow">
            {{ t('vs.datepicker.now') }}
          </s-button>
          <div :class="ns.e('footer-actions')">
            <s-button size="small" type="flat" @click="handleClear">
              {{ t('vs.datepicker.clear') }}
            </s-button>
            <s-button size="small" @click="confirmPick">
              {{ t('vs.datepicker.confirm') }}
            </s-button>
          </div>
        </div>
      </div>
    </template>
  </s-popper>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import { Clock } from '@sax-design-vue/icons-vue'
import SButton from '@vuesax-alpha/components/button'
import SIcon from '@vuesax-alpha/components/icon'
import SInput from '@vuesax-alpha/components/input'
import SPopper from '@vuesax-alpha/components/popper'
import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import STimePanel from '../../date-picker/src/time-panel.vue'
import { timePickerEmits, timePickerProps } from './time-picker'
import type { TimePickerValue } from './time-picker'
import type { InputInstance } from '@vuesax-alpha/components/input'

dayjs.extend(customParseFormat)

defineOptions({ name: 'STimePicker' })

const props = defineProps(timePickerProps)
const emit = defineEmits(timePickerEmits)

const ns = useNamespace('time-picker')
const { t } = useLocale()

const visible = ref(false)
const inputRef = ref<InputInstance>()
const innerValue = ref<dayjs.Dayjs>(dayjs())

const inputPlaceholder = computed(
  () => props.placeholder || t('vs.datepicker.selectTime')
)

const parseModel = () => {
  if (
    props.modelValue === null ||
    props.modelValue === undefined ||
    props.modelValue === ''
  ) {
    innerValue.value = dayjs()
    return
  }
  if (props.modelValue instanceof Date) {
    innerValue.value = dayjs(props.modelValue)
    return
  }
  if (typeof props.modelValue === 'number') {
    innerValue.value = dayjs(props.modelValue)
    return
  }
  const parsed = props.valueFormat
    ? dayjs(props.modelValue, props.valueFormat, true)
    : dayjs(props.modelValue, props.format, true)
  innerValue.value = parsed.isValid() ? parsed : dayjs()
}

watch(() => props.modelValue, parseModel, { immediate: true })

const displayText = computed(() => {
  if (
    props.modelValue === null ||
    props.modelValue === undefined ||
    props.modelValue === ''
  ) {
    return ''
  }
  const date = innerValue.value
  return date.isValid() ? date.format(props.format) : ''
})

const emitValue = (value: TimePickerValue) => {
  emit(UPDATE_MODEL_EVENT, value)
  emit('change', value)
}

const buildOutput = (date: dayjs.Dayjs): TimePickerValue => {
  if (props.valueFormat) return date.format(props.valueFormat)
  return date.toDate()
}

const disabledTime = (date: Date) => {
  const current = dayjs(date)
  const hour = current.hour()
  const minute = current.minute()
  const second = current.second()

  if (props.disabledHours?.('start').includes(hour)) return true
  if (props.disabledMinutes?.(hour, 'start').includes(minute)) return true
  if (props.disabledSeconds?.(hour, minute, 'start').includes(second)) {
    return true
  }
  return false
}

const handlePick = (value: dayjs.Dayjs) => {
  innerValue.value = value
}

const confirmPick = () => {
  emitValue(buildOutput(innerValue.value))
  visible.value = false
}

const handleNow = () => {
  innerValue.value = dayjs()
  emitValue(buildOutput(innerValue.value))
  visible.value = false
}

const handleClear = () => {
  emitValue(null)
  emit('clear')
}

const handleInput = (value: string | number | null | undefined) => {
  if (!props.editable) return
  const text = value == null ? '' : String(value)
  const parsed = dayjs(text, props.format, true)
  if (parsed.isValid()) {
    innerValue.value = parsed
    emitValue(buildOutput(parsed))
  }
}

const focus = () => inputRef.value?.focus()
const blur = () => inputRef.value?.blur()

defineExpose({ focus, blur })
</script>
