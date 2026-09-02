<script setup lang="ts">
import { inject, onBeforeMount, onBeforeUnmount, useSlots, watch } from 'vue'
import { tableColumnRegistrationKey } from './table'
import type { TableColumn } from './table'

defineOptions({ name: 'STableColumn' })

const props = defineProps<TableColumn>()
const slots = useSlots()
const registration = inject(tableColumnRegistrationKey, null)
const registrationId = Symbol('tableColumn')

const createColumn = (): TableColumn => ({
  ...props,
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
