<template>
  <s-popper
    ref="popperRef"
    v-model:visible="visible"
    :trigger="popperTrigger"
    :placement="popperPlacement"
    strategy="fixed"
    :animation="popperAnimation"
    :flip="{ padding: 12 }"
    :shift="{ padding: 12 }"
    :show-arrow="false"
    :disabled="disabled"
    :offset="8"
    :teleported="props.popupConfig?.transfer ?? true"
    :z-index="props.popupConfig?.zIndex"
    :popper-class="popperClass"
    :popper-style="popperStyle"
    @show="handleShow"
    @hide="handleHide"
  >
    <div
      :class="[
        ns.b(),
        ns.is('block', block),
        ns.is('date', props.type === 'date'),
        ns.is('month', props.type === 'month'),
        ns.is('quarter', props.type === 'quarter'),
        ns.is('year', props.type === 'year'),
        ns.is('week', props.type === 'week'),
        ns.is('range', isRange),
        ns.is('with-time', showTimePanel),
      ]"
    >
      <div v-if="isRange" :class="ns.e('range-input')">
        <s-input
          ref="rangeStartInputRef"
          :model-value="rangeStartText"
          :placeholder="startPlaceholder || t('vs.datepicker.startDate')"
          :disabled="disabled"
          :readonly="!editable || readonly"
          aria-label="Start date"
          icon-after
          @update:model-value="handleRangeInput('start', $event)"
          @focus="(e) => $emit('focus', e)"
          @blur="(e) => $emit('blur', e)"
        >
          <template #icon>
            <s-icon size="18"><calendar /></s-icon>
          </template>
        </s-input>
        <span :class="ns.e('range-separator')" aria-hidden="true">
          {{ rangeSeparator }}
        </span>
        <s-input
          ref="rangeEndInputRef"
          :model-value="rangeEndText"
          :placeholder="endPlaceholder || t('vs.datepicker.endDate')"
          :disabled="disabled"
          :readonly="!editable || readonly"
          :clearable="clearable && !disabled"
          aria-label="End date"
          icon-after
          @update:model-value="handleRangeInput('end', $event)"
          @clear="handleClear"
          @focus="(e) => $emit('focus', e)"
          @blur="(e) => $emit('blur', e)"
        >
          <template #icon>
            <s-icon size="18"><calendar /></s-icon>
          </template>
        </s-input>
      </div>

      <s-input
        v-else
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
        <div v-if="$slots.header" :class="ns.e('custom-header')">
          <slot name="header" />
        </div>
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

        <div
          :class="[
            ns.e('body'),
            ns.is('with-time', showTimePanel),
            ns.is('range', isRange),
            ns.is('range-mode', isDateTimeRange),
          ]"
        >
          <template v-if="isDateTimeRange">
            <div :class="ns.e('range-stage')">
              <div v-show="rangePickerMode === 'date'" :class="ns.e('panels')">
                <s-date-panel
                  :picker-type="panelType"
                  :model-value="leftValue"
                  :selected-dates="innerDates"
                  :range-start="rangeStart"
                  :range-end="rangeEnd"
                  :disabled-date="isDateDisabled"
                  :festival-method="festivalMethod"
                  :default-date="leftValue || defaultStartDate"
                  :start-day="startDay"
                  :select-day="selectDay"
                  @pick="handlePick"
                  @panel-change="handleLeftPanelChange"
                />
                <s-date-panel
                  :picker-type="panelType"
                  :model-value="rightValue"
                  :selected-dates="innerDates"
                  :range-start="rangeStart"
                  :range-end="rangeEnd"
                  :disabled-date="isDateDisabled"
                  :festival-method="festivalMethod"
                  :default-date="rightValue || defaultEndDate || rightPanelDate"
                  :start-day="startDay"
                  :select-day="selectDay"
                  @pick="handlePick"
                  @panel-change="handleRightPanelChange"
                />
              </div>

              <div
                v-show="rangePickerMode === 'time'"
                :class="ns.e('time-wrap')"
              >
                <div :class="ns.e('time-block')">
                  <span :class="ns.e('time-label')">{{
                    t('vs.datepicker.startTime')
                  }}</span>
                  <s-time-panel
                    :model-value="innerTime"
                    :disabled-date="isDateDisabled"
                    :time-config="timeConfig"
                    @update:model-value="updateStartTime"
                  />
                </div>
                <div :class="ns.e('time-block')">
                  <span :class="ns.e('time-label')">{{
                    t('vs.datepicker.endTime')
                  }}</span>
                  <s-time-panel
                    :model-value="innerEndTime"
                    :disabled-date="isDateDisabled"
                    :time-config="timeConfig"
                    @update:model-value="updateEndTime"
                  />
                </div>
              </div>
            </div>

            <div :class="ns.e('range-mode-controls')">
              <div :class="ns.e('range-mode-group')">
                <button
                  type="button"
                  :class="[
                    ns.e('range-mode-button'),
                    ns.is('active', rangePickerMode === 'date'),
                  ]"
                  @click="setRangePickerMode('date')"
                >
                  <s-icon size="15"><calendar /></s-icon>
                  <span>{{ rangeStartDateText }}</span>
                </button>
                <button
                  type="button"
                  :class="[
                    ns.e('range-mode-button'),
                    ns.is('active', rangePickerMode === 'time'),
                  ]"
                  @click="setRangePickerMode('time')"
                >
                  <s-icon size="15"><Clock /></s-icon>
                  <span>{{ rangeStartTimeText }}</span>
                </button>
              </div>
              <div :class="ns.e('range-mode-group')">
                <button
                  type="button"
                  :class="[
                    ns.e('range-mode-button'),
                    ns.is('active', rangePickerMode === 'date'),
                  ]"
                  @click="setRangePickerMode('date')"
                >
                  <s-icon size="15"><calendar /></s-icon>
                  <span>{{ rangeEndDateText }}</span>
                </button>
                <button
                  type="button"
                  :class="[
                    ns.e('range-mode-button'),
                    ns.is('active', rangePickerMode === 'time'),
                  ]"
                  @click="setRangePickerMode('time')"
                >
                  <s-icon size="15"><Clock /></s-icon>
                  <span>{{ rangeEndTimeText }}</span>
                </button>
              </div>
            </div>
          </template>

          <template v-else>
            <div :class="ns.e('panels')">
              <s-date-panel
                :picker-type="panelType"
                :model-value="leftValue"
                :selected-dates="innerDates"
                :range-start="rangeStart"
                :range-end="rangeEnd"
                :disabled-date="isDateDisabled"
                :festival-method="festivalMethod"
                :default-date="leftValue || defaultStartDate"
                :start-day="startDay"
                :select-day="selectDay"
                @pick="handlePick"
                @panel-change="handleLeftPanelChange"
              />
              <s-date-panel
                v-if="isRange"
                :picker-type="panelType"
                :model-value="rightValue"
                :selected-dates="innerDates"
                :range-start="rangeStart"
                :range-end="rangeEnd"
                :disabled-date="isDateDisabled"
                :festival-method="festivalMethod"
                :default-date="rightValue || defaultEndDate || rightPanelDate"
                :start-day="startDay"
                :select-day="selectDay"
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
                    :disabled-date="isDateDisabled"
                    :time-config="timeConfig"
                    @update:model-value="updateStartTime"
                  />
                </div>
                <div :class="ns.e('time-block')">
                  <span :class="ns.e('time-label')">{{
                    t('vs.datepicker.endTime')
                  }}</span>
                  <s-time-panel
                    :model-value="innerEndTime"
                    :disabled-date="isDateDisabled"
                    :time-config="timeConfig"
                    @update:model-value="updateEndTime"
                  />
                </div>
              </template>
              <s-time-panel
                v-else
                :model-value="innerTime"
                :disabled-date="isDateDisabled"
                :time-config="timeConfig"
                @update:model-value="updateStartTime"
              />
            </div>
          </template>
        </div>

        <div :class="ns.e('footer')">
          <s-button size="small" type="flat" @click="handleNow">
            {{ t('vs.datepicker.now') }}
          </s-button>
          <div :class="ns.e('footer-actions')">
            <s-button
              v-if="showClearButton"
              size="small"
              type="flat"
              @click="handleClear"
            >
              {{ t('vs.datepicker.clear') }}
            </s-button>
            <s-button
              v-if="
                showConfirmButton && (showTimePanel || isRange || isMultiple)
              "
              size="small"
              @click="confirmPick"
            >
              {{ t('vs.datepicker.confirm') }}
            </s-button>
          </div>
        </div>
        <div v-if="$slots.footer" :class="ns.e('custom-footer')">
          <slot name="footer" />
        </div>
      </div>
    </template>
  </s-popper>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { Calendar, Clock } from '@sax-design-vue/icons-vue'
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

const popperAnimation = computed(() => `${ns.b()}-fade`)
const visible = ref(false)
const popperRef = ref<PopperInstance>()
const inputRef = ref<InputInstance>()
const rangeStartInputRef = ref<InputInstance>()
const rangeEndInputRef = ref<InputInstance>()

const isRange = computed(() => isRangeType(props.type))
const isMultiple = computed(() => props.multiple && !isRange.value)
const shouldAutoClose = computed(() => props.autoClose || !isMultiple.value)
const showTimePanel = computed(() => hasTime(props.type))
const isDateTimeRange = computed(() => props.type === 'datetimerange')
const rangePickerMode = ref<'date' | 'time'>('date')
const popperPlacement = computed(() =>
  props.popupConfig?.placement === 'top' ? 'top-start' : 'bottom-start',
)
const popperTrigger = computed(() =>
  props.popupConfig?.trigger === 'manual' ? [] : 'click',
)
const popperStyle = computed(() => ({
  width: props.popupConfig?.width,
  height: props.popupConfig?.height,
}))
const popperClass = computed(() =>
  [ns.e('popper'), props.popupConfig?.className].filter(Boolean).join(' '),
)
const panelType = computed(() => {
  if (props.type === 'week') return 'week'
  if (props.type === 'month') return 'month'
  if (props.type === 'quarter') return 'quarter'
  if (props.type === 'year') return 'year'
  return 'date'
})

const displayFormat = computed(() => {
  const labelFormat = props.labelFormat ?? props.format
  if (labelFormat) return labelFormat
  if (showTimePanel.value && props.timeFormat) {
    return `YYYY-MM-DD ${props.timeFormat}`
  }
  return getDefaultFormat(props.type)
})

const getConfigValue = (
  value:
    | Date
    | string
    | number
    | [Date | string | number, Date | string | number]
    | undefined,
  index = 0,
) => (Array.isArray(value) ? value[index] : value)

const defaultStartDate = computed(() =>
  parseToDayjs(getConfigValue(props.defaultDate), props.valueFormat),
)
const defaultEndDate = computed(() =>
  parseToDayjs(getConfigValue(props.defaultDate, 1), props.valueFormat),
)
const minimumDate = computed(() =>
  parseToDayjs(props.minDate ?? props.startDate, props.valueFormat),
)
const maximumDate = computed(() =>
  parseToDayjs(props.maxDate ?? props.endDate, props.valueFormat),
)
const isDateDisabled = (date: Date) => {
  const value = dayjs(date)
  return (
    !!props.disabledDate?.(date) ||
    !!minimumDate.value?.isAfter(value, 'day') ||
    !!maximumDate.value?.isBefore(value, 'day')
  )
}

const innerDate = ref<dayjs.Dayjs | null>(null)
const innerEndDate = ref<dayjs.Dayjs | null>(null)
const innerDates = ref<dayjs.Dayjs[]>([])
const innerTime = ref<dayjs.Dayjs>(dayjs())
const innerEndTime = ref<dayjs.Dayjs>(dayjs())
const rangeStep = ref<0 | 1>(0)
const rightPanelDate = ref(dayjs().add(1, 'month'))

const updateStartTime = (value: dayjs.Dayjs) => {
  innerTime.value = value
}

const updateEndTime = (value: dayjs.Dayjs) => {
  innerEndTime.value = value
}

const leftValue = computed(() =>
  isRange.value ? innerDate.value : innerDate.value,
)
const rightValue = computed(() => innerEndDate.value)
const rangeStart = computed(() => (isRange.value ? innerDate.value : null))
const rangeEnd = computed(() => (isRange.value ? innerEndDate.value : null))

const inputPlaceholder = computed(() => {
  if (isRange.value)
    return props.startPlaceholder || t('vs.datepicker.startDate')
  return props.placeholder || t('vs.datepicker.selectDate')
})

const parseModel = () => {
  const defaultStartTime = parseToDayjs(getConfigValue(props.defaultTime))
  const defaultEndTime = parseToDayjs(getConfigValue(props.defaultTime, 1))

  if (isMultiple.value) {
    const value = Array.isArray(props.modelValue) ? props.modelValue : []
    innerDates.value = value
      .map((item) => parseToDayjs(item, props.valueFormat))
      .filter((item): item is dayjs.Dayjs => !!item?.isValid())
    innerDate.value = innerDates.value[0] || null
    innerEndDate.value = null
    return
  }

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
      innerTime.value = defaultStartTime || dayjs()
      innerEndTime.value = defaultEndTime || defaultStartTime || dayjs()
    }
    return
  }

  innerDate.value = parseToDayjs(
    props.modelValue as Date | string | number,
    props.valueFormat,
  )
  if (innerDate.value) innerTime.value = innerDate.value
  else innerTime.value = defaultStartTime || dayjs()
}

watch(() => props.modelValue, parseModel, { immediate: true })

const displayText = computed(() => {
  if (isMultiple.value) {
    return innerDates.value
      .map((value) => formatDisplay(value, displayFormat.value))
      .join(', ')
  }
  if (isRange.value) {
    const start = formatDisplay(innerDate.value, displayFormat.value)
    const end = formatDisplay(innerEndDate.value, displayFormat.value)
    if (!start && !end) return ''
    if (!end) return start
    return `${start}${props.separator}${end}`
  }
  return formatDisplay(innerDate.value, displayFormat.value)
})

const rangeStartText = computed(() =>
  formatDisplay(innerDate.value, displayFormat.value),
)
const rangeEndText = computed(() =>
  formatDisplay(innerEndDate.value, displayFormat.value),
)
const rangeSeparator = computed(() => props.separator.trim() || '-')
const rangeStartDateText = computed(
  () =>
    formatDisplay(innerDate.value, 'YYYY-MM-DD') ||
    t('vs.datepicker.startDate'),
)
const rangeEndDateText = computed(
  () =>
    formatDisplay(innerEndDate.value, 'YYYY-MM-DD') ||
    t('vs.datepicker.endDate'),
)
const rangeStartTimeText = computed(() => innerTime.value.format('HH:mm:ss'))
const rangeEndTimeText = computed(() => innerEndTime.value.format('HH:mm:ss'))

const emitValue = (value: DatePickerValue) => {
  emit(UPDATE_MODEL_EVENT, value)
  emit('change', value)
}

const buildOutput = (
  start: dayjs.Dayjs | null,
  end?: dayjs.Dayjs | null,
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

const buildMultipleOutput = (): DatePickerValue =>
  innerDates.value
    .map((value) => formatValue(value, displayFormat.value, props.valueFormat))
    .filter((value): value is Date | string => value !== null)

const isSamePickedValue = (left: dayjs.Dayjs, right: dayjs.Dayjs) => {
  if (props.type === 'week') return left.isSame(right, 'week')
  if (props.type === 'month') return left.isSame(right, 'month')
  if (props.type === 'quarter') {
    return (
      left.year() === right.year() &&
      Math.floor(left.month() / 3) === Math.floor(right.month() / 3)
    )
  }
  if (props.type === 'year') return left.isSame(right, 'year')
  return left.isSame(right, 'day')
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
  } else if (props.type === 'quarter') {
    picked = picked.month(Math.floor(picked.month() / 3) * 3).startOf('month')
  } else if (props.type === 'year') {
    picked = picked.startOf('year')
  } else if (props.type === 'week') {
    picked = picked.startOf('week')
  } else if (!showTimePanel.value) {
    picked = picked.startOf('day')
  }

  if (isMultiple.value) {
    const selectedIndex = innerDates.value.findIndex((value) =>
      isSamePickedValue(value, picked),
    )
    if (selectedIndex >= 0) {
      innerDates.value.splice(selectedIndex, 1)
    } else if (
      !props.limitCount ||
      innerDates.value.length < props.limitCount
    ) {
      innerDates.value.push(picked)
    }
    innerDate.value = innerDates.value[0] || null
    emitValue(buildMultipleOutput())
    return
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
    if (isDateTimeRange.value) rangePickerMode.value = 'time'

    if (!showTimePanel.value) {
      emitValue(buildOutput(start, end))
      if (shouldAutoClose.value) visible.value = false
    }
    rangeStep.value = 0
    return
  }

  innerDate.value = picked
  if (!showTimePanel.value) {
    emitValue(buildOutput(picked))
    if (shouldAutoClose.value) visible.value = false
  }
}

const confirmPick = () => {
  if (isMultiple.value) {
    emitValue(buildMultipleOutput())
    visible.value = false
    return
  }

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
    if (shouldAutoClose.value) visible.value = false
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
  if (isMultiple.value) {
    innerDates.value = [now]
    innerDate.value = now
    emitValue(buildMultipleOutput())
    return
  }
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
  innerDates.value = []
  rangeStep.value = 0
  emitValue(null)
  emit('clear')
}

const handleInput = (value: string | number | null | undefined) => {
  if (!props.editable) return
  const text = value == null ? '' : String(value)
  const parsed = parseToDayjs(text, displayFormat.value)
  if (parsed?.isValid()) {
    innerDate.value = parsed
    emitValue(buildOutput(parsed))
  }
}

const handleRangeInput = (
  part: 'start' | 'end',
  value: string | number | null | undefined,
) => {
  if (!props.editable) return

  const text = value == null ? '' : String(value).trim()
  if (!text) {
    if (part === 'start') innerDate.value = null
    else innerEndDate.value = null
    return
  }

  const parsed = parseToDayjs(text, displayFormat.value)
  if (!parsed?.isValid() || isDateDisabled(parsed.toDate())) return

  if (part === 'start') innerDate.value = parsed
  else innerEndDate.value = parsed

  if (innerDate.value && innerEndDate.value) {
    emitValue(buildOutput(innerDate.value, innerEndDate.value))
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
  rangePickerMode.value = 'date'
}

const handleHide = () => {
  parseModel()
}

const setRangePickerMode = (mode: 'date' | 'time') => {
  rangePickerMode.value = mode
}

const focus = () =>
  (isRange.value ? rangeStartInputRef : inputRef).value?.focus()
const blur = () => {
  rangeStartInputRef.value?.blur()
  rangeEndInputRef.value?.blur()
  inputRef.value?.blur()
}

const showPanel = async () => {
  visible.value = true
}

const hidePanel = async () => {
  visible.value = false
}

const updatePlacement = () => popperRef.value?.updatePopper()

defineExpose({ focus, blur, showPanel, hidePanel, updatePlacement })
</script>
