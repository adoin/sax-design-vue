<template>
  <div :class="[ns.b(), ns.m(color), ns.is('empty', !modelValue.length)]">
    <slot />

    <input
      v-model="newChip"
      :class="ns.e('input')"
      type="text"
      :placeholder="modelValue.length ? undefined : placeholder"
      @keydown.enter.prevent="addItem"
    />

    <button
      v-if="modelValue.length"
      :class="ns.e('remove-all')"
      type="button"
      @click="removeAll"
    >
      <VsIcon :icon="removeIcon" :icon-pack="iconPack" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { VsIcon } from '@vuesax-alpha/components/icon'
import { chipsEmits, chipsProps } from './chips'

defineOptions({
  name: 'VsChips',
})

const props = defineProps(chipsProps)
const emit = defineEmits(chipsEmits)

const ns = useNamespace('chips')
const newChip = ref('')

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
