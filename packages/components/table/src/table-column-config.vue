<script setup lang="ts">
import { computed, inject, onBeforeUnmount, watch } from 'vue'
import { useSize } from '@vuesax-alpha/hooks'
import TableColumnManager from './table-column-manager.vue'
import { tableColumnConfigRuntimeKey } from './table-column-config-context'
import type { ComponentSize } from '@vuesax-alpha/constants'

defineOptions({ name: 'STableColumnConfig' })

const props = defineProps<{
  /** Optional localStorage key for this table's column state. */
  storageKey?: string
  disabled?: boolean
  size?: ComponentSize
}>()
const inheritedSize = useSize()

const runtime = inject(tableColumnConfigRuntimeKey)
if (!runtime)
  throw new Error('STableColumnConfig must be rendered inside STable')

const storageOwner = Symbol('tableColumnConfig')
watch(
  () => props.storageKey,
  (key) => runtime.manager.setStorageKey(storageOwner, key),
  { immediate: true },
)
onBeforeUnmount(() => runtime.manager.setStorageKey(storageOwner))

const resolvedDisabled = computed(
  () => runtime.disabled.value || props.disabled === true,
)
</script>

<template>
  <TableColumnManager
    :manager="runtime.manager"
    :disabled="resolvedDisabled"
    :size="inheritedSize || 'default'"
  />
</template>
