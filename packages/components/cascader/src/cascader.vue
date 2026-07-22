<template>
  <div ref="rootRef" :class="[ns.b(), ns.is('disabled', disabled)]">
    <div
      :class="[ns.e('trigger'), ns.is('open', open)]"
      role="combobox"
      :tabindex="disabled ? -1 : 0"
      :aria-disabled="disabled"
      :aria-expanded="open"
      aria-haspopup="listbox"
      @click="toggle"
      @keydown.enter.prevent="toggle"
      @keydown.space.prevent="toggle"
    >
      <span :class="[ns.e('value'), ns.is('placeholder', !displayLabel)]">
        {{ displayLabel || placeholder }}
      </span>
      <button
        v-if="clearable && modelValue.length"
        :class="ns.e('clear')"
        type="button"
        aria-label="Clear selection"
        @click.stop="clear"
      >
        <SIcon icon="close" icon-pack="material-icons" />
      </button>
      <SIcon v-else icon="arrow_drop_down" icon-pack="material-icons" />
    </div>
    <div v-if="open" :class="ns.e('panel')" role="listbox">
      <ul v-for="(menu, level) in menus" :key="level" :class="ns.e('menu')">
        <li
          v-for="option in menu"
          :key="String(option.value)"
          :class="[
            ns.e('option'),
            ns.is('active', activePath[level] === option.value),
            ns.is('selected', modelValue[level] === option.value),
            ns.is('disabled', option.disabled),
          ]"
          role="option"
          :aria-selected="modelValue[level] === option.value"
          @click="selectOption(option, level)"
        >
          <span>{{ option.label }}</span>
          <SIcon
            v-if="option.children?.length"
            icon="chevron_right"
            icon-pack="material-icons"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { useNamespace } from '@vuesax-alpha/hooks'
import { cascaderEmits, cascaderProps } from './cascader'
import type { CascaderOption, CascaderValue } from './cascader'

defineOptions({ name: 'SCascader' })

const props = defineProps(cascaderProps)
const emit = defineEmits(cascaderEmits)
const ns = useNamespace('cascader')
const rootRef = ref<HTMLElement>()
const open = ref(false)
const activePath = ref<CascaderValue[]>([])

const optionPath = (values: CascaderValue[]) => {
  const result: CascaderOption[] = []
  let options = props.options
  values.forEach((value) => {
    const option = options.find((item) => item.value === value)
    if (!option) return
    result.push(option)
    options = option.children || []
  })
  return result
}
const displayLabel = computed(() =>
  optionPath(props.modelValue)
    .map((option) => option.label)
    .join(props.separator),
)
const menus = computed(() => {
  const result: CascaderOption[][] = []
  let options = props.options
  result.push(options)
  activePath.value.forEach((value) => {
    const selected = options.find((option) => option.value === value)
    if (!selected?.children?.length) return
    options = selected.children
    result.push(options)
  })
  return result
})
const syncActivePath = () => {
  activePath.value = [...props.modelValue]
}
const toggle = () => {
  if (props.disabled) return
  open.value = !open.value
  if (open.value) syncActivePath()
}
const selectOption = (option: CascaderOption, level: number) => {
  if (option.disabled) return
  const nextPath = [...activePath.value.slice(0, level), option.value]
  activePath.value = nextPath
  if (option.children?.length && !props.checkStrictly) return
  emit('update:modelValue', nextPath)
  emit('change', nextPath, option)
  if (!option.children?.length || props.checkStrictly) open.value = false
}
const clear = () => {
  activePath.value = []
  emit('update:modelValue', [])
}
const handlePointerDown = (event: PointerEvent) => {
  if (rootRef.value && !rootRef.value.contains(event.target as Node))
    open.value = false
}

watch(() => props.modelValue, syncActivePath, { immediate: true, deep: true })
onMounted(() => document.addEventListener('pointerdown', handlePointerDown))
onBeforeUnmount(() =>
  document.removeEventListener('pointerdown', handlePointerDown),
)
</script>
