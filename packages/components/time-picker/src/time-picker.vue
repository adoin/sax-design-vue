<template>
  <s-popper
    v-model:visible="visible"
    trigger="click"
    placement="bottom-start"
    strategy="fixed"
    :flip="{ padding: 12 }"
    :shift="{ padding: 12 }"
    :fit="true"
    :show-arrow="false"
    :disabled="disabled || loading"
    :offset="4"
    :popper-class="[
      ns.e('popper'),
      ns.is('square', resolvedShape === 'square'),
    ]"
    :popper-style="themeStyle"
  >
    <div
      ref="triggerRef"
      :class="[
        ns.b(),
        ns.m(resolvedSize || 'default'),
        ns.is('block', block),
        ns.is(resolvedShape),
      ]"
      :style="themeStyle"
    >
      <s-input
        ref="inputRef"
        autocomplete="off"
        :model-value="displayText"
        :placeholder="inputPlaceholder"
        :label="label"
        :label-float="labelFloat"
        :color="color"
        :size="resolvedSize"
        :shape="resolvedShape"
        :disabled="disabled"
        :loading="loading"
        :readonly="!editable || readonly"
        :clearable="clearable && !disabled && !loading"
        :suffix-icon="loading ? undefined : 'cb:time'"
        @update:model-value="handleInput"
        @clear="handleClear"
        @focus="(e) => $emit('focus', e)"
        @blur="(e) => $emit('blur', e)"
      />
    </div>

    <template #content>
      <div :class="ns.e('dropdown')">
        <s-time-panel
          :model-value="innerValue"
          :disabled-date="disabledTime"
          :time-config="timeConfig"
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
import { computed, provide, ref, shallowRef, watch } from 'vue'
import dayjs from 'dayjs'
import SButton from '@vuesax-alpha/components/button'
import SInput from '@vuesax-alpha/components/input'
import SPopper from '@vuesax-alpha/components/popper'
import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import { inputInteractionContextKey } from '@vuesax-alpha/tokens'
import {
  useGlobalConfig,
  useLocale,
  useNamespace,
  useShape,
  useSize,
} from '@vuesax-alpha/hooks'
import {
  getTimeZoneNow,
  getVsColor,
  normalizeTimeZone,
} from '@vuesax-alpha/utils'
import STimePanel from '../../date-picker/src/time-panel.vue'
import { formatValue, parseToDayjs } from '../../date-picker/src/utils'
import { timePickerEmits, timePickerProps } from './time-picker'
import type { TimePickerValue } from './time-picker'
import type { InputInstance } from '@vuesax-alpha/components/input'

defineOptions({ name: 'STimePicker' })

const props = defineProps(timePickerProps)
const emit = defineEmits(timePickerEmits)

const ns = useNamespace('time-picker')
const resolvedShape = useShape()
const resolvedSize = useSize()
const { t } = useLocale()
const globalTimezone = useGlobalConfig('timezone')
const globalAutoApplyNow = useGlobalConfig('autoApplyNow')
const resolvedTimezone = computed(() =>
  normalizeTimeZone(props.timezone ?? globalTimezone.value),
)
const resolvedAutoApplyNow = computed(
  () => props.autoApplyNow ?? globalAutoApplyNow.value,
)

const themeStyle = computed(() =>
  ns.cssVar({
    color: getVsColor(props.color ?? 'primary'),
  }),
)

const visible = ref(false)
const triggerRef = shallowRef<HTMLElement>()
provide(inputInteractionContextKey, {
  active: computed(() => visible.value),
  triggerRef,
})
watch(
  () => props.loading,
  (loading) => {
    if (loading) {
      visible.value = false
      parseModel()
    }
  },
)
const inputRef = ref<InputInstance>()
const innerValue = ref<dayjs.Dayjs>(getTimeZoneNow(resolvedTimezone.value))

const inputPlaceholder = computed(
  () => props.placeholder || t('vs.datepicker.selectTime'),
)

const parseModel = () => {
  if (
    props.modelValue === null ||
    props.modelValue === undefined ||
    props.modelValue === ''
  ) {
    innerValue.value = getTimeZoneNow(resolvedTimezone.value)
    return
  }
  const parsed = parseToDayjs(
    props.modelValue,
    props.valueFormat ||
      (typeof props.modelValue === 'string' ? props.format : undefined),
    resolvedTimezone.value,
  )
  innerValue.value =
    parsed?.isValid() === true ? parsed : getTimeZoneNow(resolvedTimezone.value)
}

watch([() => props.modelValue, resolvedTimezone], parseModel, {
  immediate: true,
})

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
  return formatValue(
    date,
    props.format,
    props.valueFormat,
    resolvedTimezone.value,
  )
}

const disabledTime = (date: Date) => {
  const current =
    parseToDayjs(date, undefined, resolvedTimezone.value) ?? dayjs(date)
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
  if (props.disabled || props.loading) return
  innerValue.value = value
}

const confirmPick = () => {
  if (props.disabled || props.loading) return
  emitValue(buildOutput(innerValue.value))
  visible.value = false
}

const handleNow = () => {
  if (props.disabled || props.loading) return
  innerValue.value = getTimeZoneNow(resolvedTimezone.value)
  if (resolvedAutoApplyNow.value !== false) {
    emitValue(buildOutput(innerValue.value))
    visible.value = false
  }
}

const handleClear = () => {
  if (props.disabled || props.loading) return
  emitValue(null)
  emit('clear')
}

const handleInput = (value: string | number | null | undefined) => {
  if (!props.editable || props.disabled || props.loading) return
  const text = value == null ? '' : String(value)
  const parsed = parseToDayjs(text, props.format, resolvedTimezone.value)
  if (parsed?.isValid()) {
    innerValue.value = parsed
    emitValue(buildOutput(parsed))
  }
}

const focus = () => inputRef.value?.focus()
const blur = () => inputRef.value?.blur()

defineExpose({ focus, blur })
</script>
