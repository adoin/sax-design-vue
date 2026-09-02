<template>
  <div :class="[ns.b(), themeColorClass]" role="list">
    <STag
      v-for="(item, index) in modelValue"
      :key="getItemKey(item, index)"
      role="listitem"
      :text="getItemLabel(item)"
      :color="color"
      :closable="closable"
      :close-icon="removeIcon"
      @close="removeItem(item, index)"
    />

    <STag
      v-if="isCreating"
      v-model:text="draftLabel"
      role="listitem"
      editable
      edit-autofocus
      :color="color"
      :edit-placeholder="placeholder"
      @edit-confirm="addItem"
      @edit-cancel="cancelCreate"
    />
    <span
      v-else-if="addable"
      :class="ns.e('add')"
      role="button"
      tabindex="0"
      :aria-label="addAriaLabel"
      @click="startCreate"
      @keydown.enter.prevent="startCreate"
      @keydown.space.prevent="startCreate"
    >
      <SIcon :name="addIcon" />
    </span>
  </div>
</template>

<script lang="ts" setup>
import { computed, shallowRef } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { SIcon } from '@vuesax-alpha/components/icon'
import { normalizeVsColor } from '@vuesax-alpha/utils'
import STag from './tag.vue'
import { tagGroupEmits, tagGroupProps } from './tag-group'
import type { TagGroupItem } from './tag-group'

defineOptions({ name: 'STagGroup' })

const props = defineProps(tagGroupProps)
const emit = defineEmits(tagGroupEmits)

const ns = useNamespace('tag-group')
const isCreating = shallowRef(false)
const draftLabel = shallowRef('')
const themeColorClass = computed(() => {
  const color = normalizeVsColor(props.color)
  return color ? ns.m(color) : ''
})

const isObjectItem = (item: TagGroupItem): item is Record<string, unknown> =>
  typeof item === 'object' && item !== null

const getItemLabel = (item: TagGroupItem) => {
  if (!isObjectItem(item)) return String(item)
  return String(item[props.labelKey] ?? '')
}

const getItemKey = (item: TagGroupItem, index: number) => {
  if (!isObjectItem(item)) return `${typeof item}-${item}`
  return String(item[props.valueKey] ?? `${getItemLabel(item)}-${index}`)
}

const startCreate = () => {
  draftLabel.value = ''
  isCreating.value = true
}

const cancelCreate = () => {
  draftLabel.value = ''
  isCreating.value = false
}

const addItem = (label: string) => {
  const value = label.trim()
  if (!value) return

  const item = props.createItem ? props.createItem(value) : value
  emit('update:modelValue', [...props.modelValue, item])
  emit('add', item)
  cancelCreate()
}

const removeItem = (item: TagGroupItem, index: number) => {
  emit(
    'update:modelValue',
    props.modelValue.filter((_, itemIndex) => itemIndex !== index),
  )
  emit('remove', item, index)
}
</script>
