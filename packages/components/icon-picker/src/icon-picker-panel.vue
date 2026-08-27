<script lang="ts" setup>
import { computed, nextTick, shallowRef, toRef, useTemplateRef } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { normalizeIconList } from './icon-picker'
import type { Language } from '@vuesax-alpha/locale'

const props = defineProps<{
  iconList: readonly string[]
  modelValue: string
  color: string
  locale?: Language
  showName: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  confirm: [value: string]
}>()

const ns = useNamespace('icon-picker')
const { t } = useLocale(toRef(props, 'locale'))
const searchRef = useTemplateRef<HTMLInputElement>('searchRef')
const gridRef = useTemplateRef<HTMLElement>('gridRef')
const optionRefs = useTemplateRef<HTMLButtonElement[]>('optionRef')
const query = shallowRef('')
const icons = computed(() => normalizeIconList(props.iconList))
const filteredIcons = computed(() => {
  const normalized = query.value.trim().toLowerCase()
  return normalized
    ? icons.value.filter((icon) => icon.toLowerCase().includes(normalized))
    : icons.value
})
const resultText = computed(() =>
  t('vs.iconPicker.resultCount', { count: filteredIcons.value.length }),
)

const iconName = (icon: string) => icon.slice(icon.indexOf(':') + 1)
const focusSearch = () => nextTick(() => searchRef.value?.focus())

const focusOption = (index: number) => {
  const lastIndex = filteredIcons.value.length - 1
  optionRefs.value?.[Math.min(Math.max(index, 0), lastIndex)]?.focus()
}

const focusFirstOption = () => {
  const selectedIndex = filteredIcons.value.indexOf(props.modelValue)
  focusOption(Math.max(0, selectedIndex))
}

const handleOptionKeydown = (event: KeyboardEvent, index: number) => {
  const columns = gridRef.value
    ? getComputedStyle(gridRef.value).gridTemplateColumns.split(' ').length
    : 5
  const actions: Partial<Record<string, () => void>> = {
    ArrowRight: () => focusOption(index + 1),
    ArrowLeft: () => focusOption(index - 1),
    ArrowDown: () => focusOption(index + columns),
    ArrowUp: () => focusOption(index - columns),
    Home: () => focusOption(0),
    End: () => focusOption(filteredIcons.value.length - 1),
  }
  const action = actions[event.key]
  if (!action) return
  event.preventDefault()
  action()
}

defineExpose({ focusSearch })
</script>

<template>
  <section :class="ns.e('catalog')">
    <div :class="ns.e('search-wrap')">
      <SIcon name="cb:search" />
      <input
        ref="searchRef"
        v-model="query"
        :class="ns.e('search')"
        type="search"
        :aria-label="t('vs.iconPicker.search')"
        :placeholder="t('vs.iconPicker.search')"
        autocomplete="off"
        @keydown.down.prevent="focusFirstOption"
      />
      <button
        v-if="query"
        :class="ns.e('search-clear')"
        type="button"
        :aria-label="t('vs.iconPicker.clearSearch')"
        @click="query = ''"
      >
        <SIcon name="cb:close" />
      </button>
    </div>

    <div :class="ns.e('meta')" aria-live="polite">
      <span>{{ resultText }}</span>
      <code v-if="modelValue">{{ modelValue }}</code>
    </div>

    <div
      v-if="filteredIcons.length"
      ref="gridRef"
      :class="[ns.e('grid'), ns.is('icon-only', !showName)]"
      role="listbox"
      :aria-label="t('vs.iconPicker.options')"
    >
      <button
        v-for="(icon, index) in filteredIcons"
        :key="icon"
        ref="optionRef"
        v-memo="[icon, icon === modelValue, showName, color]"
        :class="[ns.e('item'), ns.is('active', icon === modelValue)]"
        type="button"
        role="option"
        :title="icon"
        :aria-label="icon"
        :aria-selected="icon === modelValue"
        @click="emit('update:modelValue', icon)"
        @dblclick="emit('confirm', icon)"
        @keydown="handleOptionKeydown($event, index)"
      >
        <span :class="ns.e('item-icon')">
          <SIcon :name="icon" :color="color" />
          <span v-if="icon === modelValue" :class="ns.e('check')">
            <SIcon name="cb:checkmark" size="9" />
          </span>
        </span>
        <span v-if="showName" :class="ns.e('item-name')">
          {{ iconName(icon) }}
        </span>
      </button>
    </div>

    <div v-else :class="ns.e('empty')" role="status">
      <span :class="ns.e('empty-icon')">
        <SIcon name="cb:search-locate" />
      </span>
      <strong>{{ t('vs.iconPicker.empty') }}</strong>
      <span>{{ t('vs.iconPicker.emptyHint') }}</span>
    </div>
  </section>
</template>
