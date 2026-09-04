<script setup lang="ts">
import {
  getCurrentInstance,
  inject,
  onBeforeMount,
  onBeforeUnmount,
  useSlots,
  watch,
} from 'vue'
import { tableColumnRegistrationKey } from './table'
import type { TableColumn, TableColumnOptions } from './table'

defineOptions({ name: 'STableColumn' })

const props = withDefaults(defineProps<TableColumnOptions>(), {
  resizable: undefined,
})
const instance = getCurrentInstance()
const slots = useSlots()
const registration = inject(tableColumnRegistrationKey, null)
const registrationId = Symbol('tableColumn')

const createColumn = (): TableColumn => ({
  ...props,
  key: instance?.vnode.key == null ? undefined : String(instance.vnode.key),
  cell: slots.default ? (params) => slots.default?.(params) : props.cell,
  header: slots.header ? (params) => slots.header?.(params) : props.header,
})

onBeforeMount(() => registration?.register(registrationId, createColumn()))

watch(props, () => registration?.update(registrationId, createColumn()), {
  deep: true,
})

onBeforeUnmount(() => registration?.unregister(registrationId))
</script>

<template>
  <slot v-if="false" />
</template>
