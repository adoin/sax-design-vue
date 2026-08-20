<script lang="ts" setup>
import { computed, nextTick, shallowRef, useTemplateRef, watch } from 'vue'
import { UPDATE_MODEL_EVENT } from '@vuesax-alpha/constants'
import { useId, useNamespace } from '@vuesax-alpha/hooks'
import SRadioGroup from './radio-group.vue'
import { radioGroupTabsEmits, radioGroupTabsProps } from './radio-group-tabs'
import type { RadioOption, RadioValue } from './radio-group'
import type {
  RadioGroupTab,
  RadioGroupTabValue,
  RadioGroupTabsModelValue,
} from './radio-group-tabs'

defineOptions({ name: 'SRadioGroupTabs' })

const props = defineProps(radioGroupTabsProps)
const emit = defineEmits(radioGroupTabsEmits)
const slots = defineSlots<{
  tab?(props: {
    tab: RadioGroupTab
    active: boolean
    selected: boolean
    selectedOption?: RadioOption
  }): unknown
  option?(props: { option: RadioOption; checked: boolean }): unknown
  empty?(): unknown
}>()

const ns = useNamespace('radio-group-tabs')
const tabsId = useId()
const tabButtons = useTemplateRef<HTMLButtonElement[]>('tabButton')
const internalActiveKey = shallowRef<RadioGroupTabValue>()

const activeTab = computed(() =>
  props.tabs.find((tab) => tab.value === internalActiveKey.value),
)

const getTabValue = (tab: RadioGroupTab) =>
  props.modelValue[String(tab.value)] ?? ''

const getSelectedOption = (tab: RadioGroupTab) =>
  tab.options.find((option) => option.value === getTabValue(tab))

const setActiveTab = (value: RadioGroupTabValue) => {
  const tab = props.tabs.find((item) => item.value === value)
  if (props.disabled || !tab || tab.disabled) return

  internalActiveKey.value = value
  emit('update:activeKey', value)
  emit('tabChange', value)
}

watch(
  [() => props.activeKey, () => props.tabs],
  ([activeKey, tabs]) => {
    const requestedTab = tabs.find(
      (tab) => !tab.disabled && tab.value === activeKey,
    )
    const currentTab = tabs.find(
      (tab) => !tab.disabled && tab.value === internalActiveKey.value,
    )

    internalActiveKey.value =
      requestedTab?.value ??
      currentTab?.value ??
      tabs.find((tab) => !tab.disabled)?.value
  },
  { immediate: true },
)

const handleGroupChange = (value: RadioValue) => {
  if (!activeTab.value || props.disabled || activeTab.value.disabled) return

  const next: RadioGroupTabsModelValue = {
    ...props.modelValue,
    [String(activeTab.value.value)]: value,
  }
  emit(UPDATE_MODEL_EVENT, next)
  emit('change', next, activeTab.value.value)
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
    <div :class="ns.e('list')" role="tablist" aria-orientation="horizontal">
      <button
        v-for="(tab, index) in tabs"
        :id="`${tabsId}-tab-${index}`"
        :key="String(tab.value)"
        ref="tabButton"
        type="button"
        role="tab"
        :class="[
          ns.e('tab'),
          ns.is('active', tab.value === internalActiveKey),
          ns.is('disabled', disabled || tab.disabled),
        ]"
        :aria-controls="`${tabsId}-panel`"
        :aria-selected="tab.value === internalActiveKey"
        :tabindex="tab.value === internalActiveKey ? 0 : -1"
        :disabled="disabled || tab.disabled"
        @click="setActiveTab(tab.value)"
        @keydown="handleTabKeydown($event, index)"
      >
        <slot
          name="tab"
          :tab="tab"
          :active="tab.value === internalActiveKey"
          :selected="Boolean(getSelectedOption(tab))"
          :selected-option="getSelectedOption(tab)"
        >
          <span :class="ns.e('tab-label')">{{ tab.label }}</span>
          <span v-if="getSelectedOption(tab)" :class="ns.e('value')">
            {{ getSelectedOption(tab)?.label }}
          </span>
        </slot>
      </button>
    </div>

    <div
      v-if="activeTab"
      :id="`${tabsId}-panel`"
      :key="String(activeTab.value)"
      :class="ns.e('panel')"
      role="tabpanel"
      :aria-labelledby="`${tabsId}-tab-${tabs.indexOf(activeTab)}`"
    >
      <s-radio-group
        :model-value="getTabValue(activeTab)"
        :options="activeTab.options"
        :columns="activeTab.columns || columns"
        :gap="gap"
        :disabled="disabled || activeTab.disabled"
        :disabled-values="activeTab.disabledValues"
        :name="`${tabsId}-${String(activeTab.value)}`"
        @update:model-value="handleGroupChange"
      >
        <template v-if="slots.option" #option="scope">
          <slot name="option" v-bind="scope" />
        </template>
      </s-radio-group>
    </div>

    <slot v-else name="empty" />
  </div>
</template>
