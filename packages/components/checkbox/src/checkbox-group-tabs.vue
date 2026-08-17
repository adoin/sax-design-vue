<script lang="ts" setup>
import {
  computed,
  nextTick,
  shallowRef,
  toRaw,
  useTemplateRef,
  watch,
} from 'vue'
import { isEqual } from 'lodash-unified'
import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import { useId, useNamespace } from '@vuesax-alpha/hooks'
import SCheckbox from './checkbox.vue'
import SCheckboxGroup from './checkbox-group.vue'
import {
  flattenCheckboxGroupOptions,
  isCheckboxGroupSection,
} from './checkbox-group'
import {
  checkboxGroupTabsEmits,
  checkboxGroupTabsProps,
  normalizeCheckboxGroupTabValues,
} from './checkbox-group-tabs'
import type {
  CheckboxGroupOption,
  CheckboxGroupSection,
  CheckboxGroupValueType,
} from './checkbox-group'
import type {
  CheckboxGroupTab,
  CheckboxGroupTabValue,
  CheckboxGroupTabsModelValue,
} from './checkbox-group-tabs'
import type { CheckboxValueType } from './checkbox'

defineOptions({ name: 'SCheckboxGroupTabs' })

const props = defineProps(checkboxGroupTabsProps)
const emit = defineEmits(checkboxGroupTabsEmits)
const slots = defineSlots<{
  tab?(props: {
    tab: CheckboxGroupTab
    active: boolean
    checked: boolean
    indeterminate: boolean
    selectedCount: number
  }): unknown
  option?(props: { option: CheckboxGroupOption; checked: boolean }): unknown
  'group-label'?(props: {
    group: CheckboxGroupSection
    checked: boolean
    indeterminate: boolean
  }): unknown
  empty?(): unknown
}>()
const ns = useNamespace('checkbox-group-tabs')
const tabsId = useId()
const tabButtons = useTemplateRef<HTMLButtonElement[]>('tabButton')
const internalActiveKey = shallowRef<CheckboxGroupTabValue>()

const valueEquals = (left: unknown, right: unknown) =>
  isEqual(toRaw(left), toRaw(right))

const includesValue = (
  values: CheckboxGroupValueType,
  value: CheckboxValueType,
) => values.some((item) => valueEquals(item, value))

const getTabValues = (tab: CheckboxGroupTab) =>
  normalizeCheckboxGroupTabValues(props.modelValue[String(tab.value)])

const getEnabledOptions = (tab: CheckboxGroupTab) =>
  flattenCheckboxGroupOptions(tab.options).filter((option) => {
    const section = tab.options.find(
      (item) =>
        isCheckboxGroupSection(item) &&
        item.options.some((child) => valueEquals(child.value, option.value)),
    ) as CheckboxGroupSection | undefined

    return (
      !tab.disabled &&
      !section?.disabled &&
      !option.disabled &&
      !includesValue(tab.disabledValues || [], option.value)
    )
  })

const getTabState = (tab: CheckboxGroupTab) => {
  const options = getEnabledOptions(tab)
  const values = getTabValues(tab)
  const selectedCount = options.filter((option) =>
    includesValue(values, option.value),
  ).length

  return {
    checked: options.length > 0 && selectedCount === options.length,
    indeterminate: selectedCount > 0 && selectedCount < options.length,
    selectedCount,
  }
}

const activeTab = computed(() =>
  props.tabs.find((tab) => valueEquals(tab.value, internalActiveKey.value)),
)

const setActiveTab = (value: CheckboxGroupTabValue) => {
  const tab = props.tabs.find((item) => valueEquals(item.value, value))
  if (!tab || tab.disabled) return
  internalActiveKey.value = value
  emit('update:activeKey', value)
  emit('tabChange', value)
}

watch(
  [() => props.activeKey, () => props.tabs],
  ([activeKey, tabs]) => {
    const requestedTab = tabs.find(
      (tab) => !tab.disabled && valueEquals(tab.value, activeKey),
    )
    const currentTab = tabs.find(
      (tab) => !tab.disabled && valueEquals(tab.value, internalActiveKey.value),
    )
    internalActiveKey.value =
      requestedTab?.value ??
      currentTab?.value ??
      tabs.find((tab) => !tab.disabled)?.value
  },
  { immediate: true },
)

const updateModel = (
  next: CheckboxGroupTabsModelValue,
  activeKey: CheckboxGroupTabValue,
) => {
  emit(UPDATE_MODEL_EVENT, next)
  emit('change', next, activeKey)
}

const handleTabToggle = (tab: CheckboxGroupTab, checked: boolean) => {
  if (props.disabled || tab.disabled) return
  setActiveTab(tab.value)

  const current = getTabValues(tab)
  const enabledValues = getEnabledOptions(tab).map((option) => option.value)
  const preservedValues = current.filter(
    (value) => !enabledValues.some((item) => valueEquals(item, value)),
  )
  updateModel(
    {
      ...props.modelValue,
      [String(tab.value)]: checked
        ? [...preservedValues, ...enabledValues]
        : preservedValues,
    },
    tab.value,
  )
}

const handleGroupChange = (value: CheckboxGroupValueType) => {
  if (!activeTab.value) return
  updateModel(
    {
      ...props.modelValue,
      [String(activeTab.value.value)]: value,
    },
    activeTab.value.value,
  )
}

const handleTabKeydown = async (event: KeyboardEvent, index: number) => {
  const enabledIndices = props.tabs
    .map((tab, tabIndex) => (!tab.disabled ? tabIndex : -1))
    .filter((tabIndex) => tabIndex >= 0)
  const enabledPosition = enabledIndices.indexOf(index)
  if (enabledPosition < 0) return

  let nextPosition: number | undefined
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    nextPosition = (enabledPosition + 1) % enabledIndices.length
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    nextPosition =
      (enabledPosition - 1 + enabledIndices.length) % enabledIndices.length
  } else if (event.key === 'Home') {
    nextPosition = 0
  } else if (event.key === 'End') {
    nextPosition = enabledIndices.length - 1
  }

  if (nextPosition === undefined) return
  event.preventDefault()
  const nextIndex = enabledIndices[nextPosition]
  setActiveTab(props.tabs[nextIndex].value)
  await nextTick()
  tabButtons.value?.[nextIndex]?.focus()
}
</script>

<template>
  <div :class="[ns.b(), ns.is('disabled', disabled)]">
    <div :class="ns.e('list')" role="tablist">
      <div
        v-for="(tab, index) in tabs"
        :key="String(tab.value)"
        :class="[
          ns.e('tab'),
          ns.is('active', valueEquals(tab.value, internalActiveKey)),
          ns.is('disabled', disabled || tab.disabled),
        ]"
      >
        <s-checkbox
          :model-value="getTabState(tab).checked"
          :indeterminate="getTabState(tab).indeterminate"
          :disabled="
            disabled || tab.disabled || getEnabledOptions(tab).length === 0
          "
          :aria-label="tab.label"
          @update:model-value="handleTabToggle(tab, Boolean($event))"
        />
        <button
          :id="`${tabsId}-tab-${index}`"
          ref="tabButton"
          type="button"
          role="tab"
          :class="ns.e('tab-button')"
          :aria-controls="`${tabsId}-panel`"
          :aria-selected="valueEquals(tab.value, internalActiveKey)"
          :tabindex="valueEquals(tab.value, internalActiveKey) ? 0 : -1"
          :disabled="disabled || tab.disabled"
          @click="setActiveTab(tab.value)"
          @keydown="handleTabKeydown($event, index)"
        >
          <slot
            name="tab"
            :tab="tab"
            :active="valueEquals(tab.value, internalActiveKey)"
            :checked="getTabState(tab).checked"
            :indeterminate="getTabState(tab).indeterminate"
            :selected-count="getTabState(tab).selectedCount"
          >
            <span :class="ns.e('tab-label')">{{ tab.label }}</span>
            <span v-if="getTabState(tab).selectedCount" :class="ns.e('count')">
              {{ getTabState(tab).selectedCount }}
            </span>
          </slot>
        </button>
      </div>
    </div>

    <div
      v-if="activeTab"
      :id="`${tabsId}-panel`"
      :class="ns.e('panel')"
      role="tabpanel"
      :aria-labelledby="`${tabsId}-tab-${tabs.indexOf(activeTab)}`"
    >
      <s-checkbox-group
        :model-value="getTabValues(activeTab)"
        :options="activeTab.options"
        :columns="activeTab.columns || columns"
        :gap="gap"
        :disabled="disabled || activeTab.disabled"
        :disabled-values="activeTab.disabledValues"
        :disabled-group-values="activeTab.disabledGroupValues"
        @update:model-value="handleGroupChange"
      >
        <template v-if="slots.option" #option="scope">
          <slot name="option" v-bind="scope" />
        </template>
        <template v-if="slots['group-label']" #group-label="scope">
          <slot name="group-label" v-bind="scope" />
        </template>
      </s-checkbox-group>
    </div>

    <slot v-else name="empty" />
  </div>
</template>
