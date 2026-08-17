<script lang="ts" setup>
import { computed, nextTick, toRaw } from 'vue'
import { isEqual } from 'lodash-unified'
import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import { useNamespace } from '@vuesax-alpha/hooks'
import SCheckbox from './checkbox.vue'
import CheckboxGroupProvider from './checkbox-group-provider.vue'
import {
  checkboxGroupEmits,
  checkboxGroupProps,
  isCheckboxGroupSection,
} from './checkbox-group'
import type {
  CheckboxGroupItem,
  CheckboxGroupOption,
  CheckboxGroupSection,
  CheckboxGroupValueType,
} from './checkbox-group'
import type { CheckboxValueType } from './checkbox'

defineOptions({ name: 'SCheckboxGroup' })

const props = defineProps(checkboxGroupProps)
const emit = defineEmits(checkboxGroupEmits)
const slots = defineSlots<{
  default?(): unknown
  option?(props: { option: CheckboxGroupOption; checked: boolean }): unknown
  'group-label'?(props: {
    group: CheckboxGroupSection
    checked: boolean
    indeterminate: boolean
  }): unknown
  empty?(): unknown
}>()
const ns = useNamespace('checkbox-group')

const dataOptions = computed(() => props.options as CheckboxGroupItem[])
const flatOptions = computed(() =>
  dataOptions.value.filter(
    (item): item is CheckboxGroupOption => !isCheckboxGroupSection(item),
  ),
)
const sections = computed(() =>
  dataOptions.value.filter(isCheckboxGroupSection),
)
const gapValue = computed(() =>
  typeof props.gap === 'number' ? `${props.gap}px` : props.gap,
)
const groupStyles = computed(() => ({
  '--sax-checkbox-group-columns': Math.max(1, props.columns),
  '--sax-checkbox-group-gap': gapValue.value,
}))

const includesValue = (
  values: CheckboxGroupValueType,
  value: CheckboxValueType,
) => values.map(toRaw).some((item) => isEqual(item, toRaw(value)))

const isOptionDisabled = (
  option: CheckboxGroupOption,
  section?: CheckboxGroupSection,
) =>
  props.disabled ||
  section?.disabled ||
  option.disabled ||
  includesValue(props.disabledValues, option.value)

function getEnabledOptions(section: CheckboxGroupSection) {
  return section.options.filter((option) => !isOptionDisabled(option, section))
}

const isGroupControlDisabled = (section: CheckboxGroupSection) =>
  props.disabled ||
  section.disabled ||
  includesValue(props.disabledGroupValues, section.value) ||
  getEnabledOptions(section).length === 0

const isOptionChecked = (option: CheckboxGroupOption) =>
  includesValue(props.modelValue, option.value)

const getSectionState = (section: CheckboxGroupSection) => {
  const options = getEnabledOptions(section)
  const selectedCount = options.filter(isOptionChecked).length

  return {
    checked: options.length > 0 && selectedCount === options.length,
    indeterminate: selectedCount > 0 && selectedCount < options.length,
  }
}

const changeEvent = async (value: CheckboxGroupValueType) => {
  emit(UPDATE_MODEL_EVENT, value)
  await nextTick()
  emit('change', value)
}

const canCommit = (value: CheckboxGroupValueType) => {
  if (props.min !== undefined && value.length < props.min) return false
  if (props.max !== undefined && value.length > props.max) return false
  return true
}

const commit = (value: CheckboxGroupValueType) => {
  if (canCommit(value)) changeEvent(value)
}

const handleOptionToggle = (
  option: CheckboxGroupOption,
  checked: boolean,
  section?: CheckboxGroupSection,
) => {
  if (isOptionDisabled(option, section)) return

  const next = props.modelValue.filter(
    (value) => !isEqual(toRaw(value), toRaw(option.value)),
  )
  if (checked) next.push(option.value)
  commit(next)
}

const handleSectionToggle = (
  section: CheckboxGroupSection,
  checked: boolean,
) => {
  if (isGroupControlDisabled(section)) return

  const enabledValues = getEnabledOptions(section).map((option) => option.value)
  const next = props.modelValue.filter(
    (value) =>
      !enabledValues.some((item) => isEqual(toRaw(item), toRaw(value))),
  )
  if (checked) next.push(...enabledValues)
  commit(next)
}
</script>

<template>
  <div
    :class="[
      ns.b(),
      ns.is('disabled', disabled),
      ns.is('data-driven', dataOptions.length > 0),
    ]"
    :style="groupStyles"
  >
    <template v-if="dataOptions.length">
      <div v-if="flatOptions.length" :class="ns.e('options')">
        <div
          v-for="(option, optionIndex) in flatOptions"
          :key="`${option.label}-${optionIndex}`"
          :class="ns.e('option')"
        >
          <s-checkbox
            :model-value="isOptionChecked(option)"
            :disabled="isOptionDisabled(option)"
            @update:model-value="handleOptionToggle(option, Boolean($event))"
          >
            <slot
              name="option"
              :option="option"
              :checked="isOptionChecked(option)"
            >
              <span :class="ns.e('option-label')">{{ option.label }}</span>
              <small v-if="option.description" :class="ns.e('description')">
                {{ option.description }}
              </small>
            </slot>
          </s-checkbox>
        </div>
      </div>

      <section
        v-for="(section, sectionIndex) in sections"
        :key="`${section.label}-${sectionIndex}`"
        :class="ns.e('section')"
      >
        <div :class="ns.e('section-header')">
          <s-checkbox
            :model-value="getSectionState(section).checked"
            :indeterminate="getSectionState(section).indeterminate"
            :disabled="isGroupControlDisabled(section)"
            @update:model-value="handleSectionToggle(section, Boolean($event))"
          >
            <slot
              name="group-label"
              :group="section"
              :checked="getSectionState(section).checked"
              :indeterminate="getSectionState(section).indeterminate"
            >
              <span :class="ns.e('section-label')">{{ section.label }}</span>
            </slot>
          </s-checkbox>
        </div>
        <div
          :class="ns.e('options')"
          :style="{
            '--sax-checkbox-group-columns': Math.max(
              1,
              section.columns || columns,
            ),
          }"
        >
          <div
            v-for="(option, optionIndex) in section.options"
            :key="`${option.label}-${optionIndex}`"
            :class="ns.e('option')"
          >
            <s-checkbox
              :model-value="isOptionChecked(option)"
              :disabled="isOptionDisabled(option, section)"
              @update:model-value="
                handleOptionToggle(option, Boolean($event), section)
              "
            >
              <slot
                name="option"
                :option="option"
                :checked="isOptionChecked(option)"
              >
                <span :class="ns.e('option-label')">{{ option.label }}</span>
                <small v-if="option.description" :class="ns.e('description')">
                  {{ option.description }}
                </small>
              </slot>
            </s-checkbox>
          </div>
        </div>
      </section>
    </template>

    <checkbox-group-provider
      v-else-if="slots.default"
      :model-value="modelValue"
      :disabled="disabled"
      :min="min"
      :max="max"
      @change="changeEvent"
    >
      <slot />
    </checkbox-group-provider>

    <slot v-else name="empty" />
  </div>
</template>
