<template>
  <div ref="rootRef" :class="[ns.b(), ns.is('disabled', disabled)]">
    <div
      :class="[ns.e('trigger'), ns.is('open', open)]"
      role="combobox"
      :tabindex="disabled ? -1 : 0"
      :aria-expanded="open"
      aria-haspopup="listbox"
      @click="toggle"
      @keydown.enter.prevent="toggle"
      @keydown.space.prevent="toggle"
      @keydown.esc.prevent="open = false"
    >
      <SIcon v-if="modelValue" :name="modelValue" />
      <span :class="[ns.e('value'), ns.is('placeholder', !modelValue)]">{{
        modelValue || placeholder || t('vs.iconPicker.placeholder')
      }}</span>
      <button
        v-if="clearable && modelValue"
        :class="ns.e('clear')"
        type="button"
        :aria-label="t('vs.iconPicker.clear')"
        @click.stop="clear"
      >
        <SIcon name="cb:close" />
      </button>
      <SIcon v-else name="cb:chevron-down" />
    </div>
    <div v-if="open" :class="ns.e('panel')" role="listbox">
      <input
        v-if="searchable"
        v-model="query"
        :class="ns.e('search')"
        type="search"
        :placeholder="t('vs.iconPicker.search')"
        autofocus
      />
      <div :class="ns.e('grid')">
        <button
          v-for="icon in filteredIcons"
          :key="icon"
          :class="[ns.e('item'), ns.is('active', icon === modelValue)]"
          type="button"
          :title="icon"
          :aria-label="icon"
          @click="select(icon)"
        >
          <SIcon :name="icon" />
        </button>
      </div>
      <div v-if="!filteredIcons.length" :class="ns.e('empty')">
        {{ t('vs.iconPicker.empty') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { iconPickerEmits, iconPickerProps } from './icon-picker'

defineOptions({ name: 'SIconPicker' })

const props = defineProps(iconPickerProps)
const emit = defineEmits(iconPickerEmits)
const ns = useNamespace('icon-picker')
const { t } = useLocale()
const rootRef = ref<HTMLElement>()
const open = ref(false)
const query = ref('')
const filteredIcons = computed(() => {
  const normalized = query.value.trim().toLowerCase()
  return normalized
    ? props.iconList.filter((icon) => icon.toLowerCase().includes(normalized))
    : props.iconList
})
const toggle = () => {
  if (!props.disabled) open.value = !open.value
}
const select = (icon: string) => {
  emit('update:modelValue', icon)
  emit('change', icon)
  open.value = false
}
const clear = () => {
  emit('update:modelValue', '')
  emit('clear')
}
const onPointerDown = (event: PointerEvent) => {
  if (rootRef.value && !rootRef.value.contains(event.target as Node))
    open.value = false
}

watch(open, (value) => {
  if (!value) query.value = ''
})
onMounted(() => document.addEventListener('pointerdown', onPointerDown))
onBeforeUnmount(() =>
  document.removeEventListener('pointerdown', onPointerDown),
)
</script>
