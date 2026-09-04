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
import { cloneDeep, isEqual } from 'lodash-unified'
import { tableColumnRegistrationKey } from './table'
import type { TableColumn, TableColumnOptions } from './table'

defineOptions({ name: 'STableColumn' })

const props = withDefaults(defineProps<TableColumnOptions>(), {
  resizable: undefined,
  fixed: undefined,
  showFooterOverflow: undefined,
  editor: undefined,
})
const instance = getCurrentInstance()
const slots = useSlots()
const registration = inject(tableColumnRegistrationKey, null)
const registrationId = Symbol('tableColumn')
const children = shallowRef<Array<{ id: symbol; column: TableColumn }>>([])
const callbacks = new Map<string, (...args: unknown[]) => unknown>()
const callbackMarker = () => undefined
const forwardedProps = (): TableColumnOptions => {
  const result: Record<string, unknown> = { ...props }
  for (const key of Object.keys(result)) {
    if (typeof result[key] !== 'function') continue
    if (!callbacks.has(key))
      callbacks.set(key, function (this: unknown, ...args: unknown[]) {
        const value = props[key as keyof TableColumnOptions]
        return typeof value === 'function'
          ? Reflect.apply(value, this, args)
          : undefined
      })
    result[key] = callbacks.get(key)
  }
  return result as TableColumnOptions
}
const propSnapshot = () => {
  const snapshot: Record<string, unknown> = cloneDeep(props)
  // Inline callbacks may change identity on every parent render. Stable forwarders
  // above read the current callback reactively without re-registering the column.
  for (const key of Object.keys(snapshot))
    if (typeof snapshot[key] === 'function') snapshot[key] = callbackMarker
  return snapshot
}

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
  ...forwardedProps(),
  children: slots.columns
    ? children.value.map((child) => child.column)
    : props.children,
  key: instance?.vnode.key == null ? undefined : String(instance.vnode.key),
  ...(slots.default ? { cell: (params) => slots.default?.(params) } : {}),
  ...(slots.header ? { header: (params) => slots.header?.(params) } : {}),
  ...(slots.footer ? { footer: (params) => slots.footer?.(params) } : {}),
  ...(slots.edit ? { edit: (params) => slots.edit?.(params) } : {}),
})

onBeforeMount(() => registration?.register(registrationId, createColumn()))

// Inline object props are recreated when the parent table renders its slot.
// Re-register only semantic changes, including mutations inside rule objects.
watch(propSnapshot, (current, previous) => {
  if (!isEqual(current, previous))
    registration?.update(registrationId, createColumn())
})
watch(children, () => registration?.update(registrationId, createColumn()))

onBeforeUnmount(() => registration?.unregister(registrationId))
</script>

<template>
  <slot name="columns" />
</template>
