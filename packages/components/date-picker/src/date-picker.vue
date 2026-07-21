<template>
  <s-popper
    ref="popperRef"
    v-model:visible="visible"
    trigger="click"
    placement="bottom-start"
    :fit="true"
    :show-arrow="false"
    :disabled="disabled"
    :offset="4"
    :popper-class="ns.e('popper')"
    @show="handleShow"
    @hide="handleHide"
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
          <s-icon size="18"><calendar /></s-icon>
        </template>
      </s-input>
    </div>

    <template #content>
      <div :class="ns.e('dropdown')">
        <div v-if="shortcuts.length" :class="ns.e('sidebar')">
          <button
            v-for="(item, index) in shortcuts"
            :key="index"
            type="button"
            :class="ns.e('shortcut')"
            @click="handleShortcut(item)"
          >
            {{ item.text }}
          </button>
        </div>

        <div :class="ns.e('panels')">
          <s-date-panel
            :picker-type="panelType"
            :model-value="leftValue"
            :range-start="rangeStart"
            :range-end="rangeEnd"
            :disabled-date="disabledDate"
            :default-date="leftValue"
            @pick="handlePick"
            @panel-change="handleLeftPanelChange"
          />
          <s-date-panel
            v-if="isRange"
            :picker-type="panelType"
            :model-value="rightValue"
            :range-start="rangeStart"
            :range-end="rangeEnd"
            :disabled-date="disabledDate"
            :default-date="rightPanelDate"
            @pick="handlePick"
            @panel-change="handleRightPanelChange"
          />
        </div>

        <div v-if="showTimePanel" :class="ns.e('time-wrap')">
          <template v-if="isRange">
            <div :class="ns.e('time-block')">
              <span :class="ns.e('time-label')">{{
                t('vs.datepicker.startTime')
              }}</span>
              <s-time-panel
                :model-value="innerTime"
                :disabled-date="disabledDate"
                @update:model-value="(val) => (innerTime = val)"
              />
            </div>
            <div :class="ns.e('time-block')">
              <span :class="ns.e('time-label')">{{
                t('vs.datepicker.endTime')
              }}</span>
              <s-time-panel
                :model-value="innerEndTime"
                :disabled-date="disabledDate"
                @update:model-value="(val) => (innerEndTime = val)"
              />
            </div>
          </template>
          <s-time-panel
            v-else
            :model-value="innerTime"
            :disabled-date="disabledDate"
            @update:model-value="(val) => (innerTime = val)"
          />
        </div>

        <div :class="ns.e('footer')">
          <s-button size="small" type="flat" @click="handleNow">
            {{ t('vs.datepicker.now') }}
          </s-button>
          <div :class="ns.e('footer-actions')">
            <s-button size="small" type="flat" @click="handleClear">
              {{ t('vs.datepicker.clear') }}
            </s-button>
            <s-button
              v-if="showTimePanel || isRange"
              size="small"
              @click="confirmPick"
            >
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
import { Calendar } from '@sax-design-vue/icons-vue'
import SButton from '@vuesax-alpha/components/button'
import SIcon from '@vuesax-alpha/components/icon'
import SInput from '@vuesax-alpha/components/input'
import SPopper from '@vuesax-alpha/components/popper'
import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import SDatePanel from './date-panel.vue'
import STimePanel from './time-panel.vue'
import { datePickerEmits, datePickerProps } from './date-picker'
import {
  formatDisplay,
  formatValue,
  getDefaultFormat,
  hasTime,
  isRangeType,
  parseToDayjs,
} from './utils'
import type { DatePickerValue, DateShortcut } from './utils'
import type { PopperInstance } from '@vuesax-alpha/components/popper'
import type { InputInstance } from '@vuesax-alpha/components/input'

defineOptions({ name: 'SDatePicker' })

const props = defineProps(datePickerProps)
const emit = defineEmits(datePickerEmits)

const ns = useNamespace('date-picker')
const { t } = useLocale()

const visible = ref(false)
const popperRef = ref<PopperInstance>()
const inputRef = ref<InputInstance>()

const isRange = computed(() => isRangeType(props.type))
const showTimePanel = computed(() => hasTime(props.type))
const panelType = computed(() => {
  if (props.type === 'week') return 'week'
  if (props.type === 'month') return 'month'
  if (props.type === 'year') return 'year'
  return 'date'
})

const displayFormat = computed(
  () => props.format || getDefaultFormat(props.type)
)

const innerDate = ref<dayjs.Dayjs | null>(null)
const innerEndDate = ref<dayjs.Dayjs | null>(null)
const innerTime = ref<dayjs.Dayjs>(dayjs())
const innerEndTime = ref<dayjs.Dayjs>(dayjs())
const rangeStep = ref<0 | 1>(0)
const rightPanelDate = ref(dayjs().add(1, 'month'))

const leftValue = computed(() =>
  isRange.value ? innerDate.value : innerDate.value
)
const rightValue = computed(() => innerEndDate.value)
const rangeStart = computed(() => innerDate.value)
const rangeEnd = computed(() => innerEndDate.value)

const inputPlaceholder = computed(() => {
  if (isRange.value)
    return props.startPlaceholder || t('vs.datepicker.startDate')
  return props.placeholder || t('vs.datepicker.selectDate')
})

const parseModel = () => {
  if (isRange.value) {
    const value = props.modelValue as [Date | string, Date | string] | undefined
    if (Array.isArray(value) && value.length === 2) {
      innerDate.value = parseToDayjs(value[0], props.valueFormat)
      innerEndDate.value = parseToDayjs(value[1], props.valueFormat)
      if (innerDate.value) innerTime.value = innerDate.value
      if (innerEndDate.value) {
        innerEndTime.value = innerEndDate.value
        rightPanelDate.value = innerEndDate.value.startOf('month')
      }
    } else {
      innerDate.value = null
      innerEndDate.value = null
    }
    return
  }

  innerDate.value = parseToDayjs(
    props.modelValue as Date | string | number,
    props.valueFormat
  )
  if (innerDate.value) innerTime.value = innerDate.value
}

watch(() => props.modelValue, parseModel, { immediate: true })

const displayText = computed(() => {
  if (isRange.value) {
    const start = formatDisplay(innerDate.value, displayFormat.value)
    const end = formatDisplay(innerEndDate.value, displayFormat.value)
    if (!start && !end) return ''
    if (!end) return start
    return `${start}${props.separator}${end}`
  }
  return formatDisplay(innerDate.value, displayFormat.value)
})

const emitValue = (value: DatePickerValue) => {
  emit(UPDATE_MODEL_EVENT, value)
  emit('change', value)
}

const buildOutput = (
  start: dayjs.Dayjs | null,
  end?: dayjs.Dayjs | null
): DatePickerValue => {
  if (isRange.value) {
    if (!start || !end) return null
    return [
      formatValue(start, displayFormat.value, props.valueFormat),
      formatValue(end, displayFormat.value, props.valueFormat),
    ] as DatePickerValue
  }
  if (!start) return null
  return formatValue(start, displayFormat.value, props.valueFormat)
}

const handlePick = (date: dayjs.Dayjs) => {
  let picked = date

  if (showTimePanel.value) {
    picked = date
      .hour(innerTime.value.hour())
      .minute(innerTime.value.minute())
      .second(innerTime.value.second())
  }

  if (props.type === 'month') {
    picked = picked.startOf('month')
  } else if (props.type === 'year') {
    picked = picked.startOf('year')
  } else if (props.type === 'week') {
    picked = picked.startOf('week')
  } else if (!showTimePanel.value) {
    picked = picked.startOf('day')
  }

  if (isRange.value) {
    if (rangeStep.value === 0) {
      innerDate.value = picked
      innerTime.value = picked
      innerEndDate.value = null
      rangeStep.value = 1
      return
    }

    let start = innerDate.value!
    let end = picked
    if (showTimePanel.value) {
      start = start
        .hour(innerTime.value.hour())
        .minute(innerTime.value.minute())
        .second(innerTime.value.second())
      end = end
        .hour(innerEndTime.value.hour())
        .minute(innerEndTime.value.minute())
        .second(innerEndTime.value.second())
    }
    if (end.isBefore(start)) {
      ;[start, end] = [end, start]
    }
    innerDate.value = start
    innerEndDate.value = end

    if (!showTimePanel.value) {
      emitValue(buildOutput(start, end))
      visible.value = false
    }
    rangeStep.value = 0
    return
  }

  innerDate.value = picked
  if (!showTimePanel.value) {
    emitValue(buildOutput(picked))
    visible.value = false
  }
}

const confirmPick = () => {
  if (isRange.value) {
    if (innerDate.value && innerEndDate.value) {
      let start = innerDate.value
      let end = innerEndDate.value
      if (showTimePanel.value) {
        start = start
          .hour(innerTime.value.hour())
          .minute(innerTime.value.minute())
          .second(innerTime.value.second())
        end = end
          .hour(innerEndTime.value.hour())
          .minute(innerEndTime.value.minute())
          .second(innerEndTime.value.second())
      }
      emitValue(buildOutput(start, end))
      visible.value = false
    }
    return
  }

  if (innerDate.value) {
    const value = showTimePanel.value
      ? innerDate.value
          .hour(innerTime.value.hour())
          .minute(innerTime.value.minute())
          .second(innerTime.value.second())
      : innerDate.value
    emitValue(buildOutput(value))
    visible.value = false
  }
}

const handleShortcut = (shortcut: DateShortcut) => {
  const value =
    typeof shortcut.value === 'function' ? shortcut.value() : shortcut.value

  if (Array.isArray(value)) {
    innerDate.value = dayjs(value[0])
    innerEndDate.value = dayjs(value[1])
    emitValue(buildOutput(innerDate.value, innerEndDate.value))
    visible.value = false
    return
  }

  const picked = dayjs(value)
  innerDate.value = picked
  emitValue(buildOutput(picked))
  visible.value = false
}

const handleNow = () => {
  const now = dayjs()
  innerDate.value = now
  innerTime.value = now
  innerEndTime.value = now
  if (!isRange.value && !showTimePanel.value) {
    emitValue(buildOutput(now))
    visible.value = false
  }
}

const handleClear = () => {
  innerDate.value = null
  innerEndDate.value = null
  rangeStep.value = 0
  emitValue(null)
  emit('clear')
}

const handleInput = (value: string | number | null | undefined) => {
  if (!props.editable) return
  const text = value == null ? '' : String(value)
  if (isRange.value) {
    const [start, end] = text.split(props.separator)
    innerDate.value = parseToDayjs(start?.trim(), displayFormat.value)
    innerEndDate.value = parseToDayjs(end?.trim(), displayFormat.value)
    if (innerDate.value && innerEndDate.value) {
      emitValue(buildOutput(innerDate.value, innerEndDate.value))
    }
    return
  }
  const parsed = parseToDayjs(text, displayFormat.value)
  if (parsed?.isValid()) {
    innerDate.value = parsed
    emitValue(buildOutput(parsed))
  }
}

const handleLeftPanelChange = (date: dayjs.Dayjs) => {
  if (isRange.value) {
    rightPanelDate.value = date.add(1, 'month')
  }
}

const handleRightPanelChange = (date: dayjs.Dayjs) => {
  rightPanelDate.value = date
}

const handleShow = () => {
  parseModel()
  rangeStep.value = 0
}

const handleHide = () => {
  parseModel()
}

const focus = () => inputRef.value?.focus()
const blur = () => inputRef.value?.blur()

defineExpose({ focus, blur })
</script>
