<script setup lang="ts">
import {
  getCurrentInstance,
  inject,
  onBeforeMount,
  onBeforeUnmount,
  provide,
  shallowRef,
  useSlots,
  watch,
} from 'vue'
import { tableColumnRegistrationKey } from './table'
import type { TableColumn, TableColumnOptions } from './table'

defineOptions({ name: 'STableColumn' })

const props = withDefaults(defineProps<TableColumnOptions>(), {
  resizable: undefined,
  fixed: undefined,
})
const instance = getCurrentInstance()
const slots = useSlots()
const registration = inject(tableColumnRegistrationKey, null)
const registrationId = Symbol('tableColumn')
const children = shallowRef<Array<{ id: symbol; column: TableColumn }>>([])

provide(tableColumnRegistrationKey, {
  register: (id, column) => {
    children.value = [...children.value, { id, column }]
  },
  update: (id, column) => {
    children.value = children.value.map((child) =>
      child.id === id ? { id, column } : child,
    )
  },
  unregister: (id) => {
    children.value = children.value.filter((child) => child.id !== id)
  },
})

const createColumn = (): TableColumn => ({
  ...props,
  children: slots.columns
    ? children.value.map((child) => child.column)
    : props.children,
  key: instance?.vnode.key == null ? undefined : String(instance.vnode.key),
  cell: slots.default ? (params) => slots.default?.(params) : props.cell,
  header: slots.header ? (params) => slots.header?.(params) : props.header,
})

onBeforeMount(() => registration?.register(registrationId, createColumn()))

watch(props, () => registration?.update(registrationId, createColumn()), {
  deep: true,
})
watch(children, () => registration?.update(registrationId, createColumn()))

onBeforeUnmount(() => registration?.unregister(registrationId))
</script>

<template>
  <slot name="columns" />
</template>
