<template>
  <div :class="[ns.b(), themeColorClass, ns.is('empty', !modelValue.length)]">
    <slot />

    <input
      v-model="newChip"
      :class="ns.e('input')"
      type="text"
      :placeholder="modelValue.length ? undefined : placeholder"
      @keydown.enter.prevent="addItem"
    />

    <button :class="ns.e('remove-all')" type="button" @click="removeAll">
      <SIcon :icon="removeIcon" :icon-pack="iconPack" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { SIcon } from '@vuesax-alpha/components/icon'
import { normalizeVsColor } from '@vuesax-alpha/utils'
import { chipsEmits, chipsProps } from './chips'

defineOptions({
  name: 'SChips',
})

const props = defineProps(chipsProps)
const emit = defineEmits(chipsEmits)

const ns = useNamespace('chips')
const newChip = ref('')

const themeColorClass = computed(() => {
  const color = normalizeVsColor(props.color)
  return color ? ns.m(color) : ''
})

const addItem = () => {
  const value = newChip.value.trim()
  if (!value) return
  emit('update:modelValue', [...props.modelValue, value])
  newChip.value = ''
}

const removeAll = () => {
  emit('update:modelValue', [])
}
</script>
