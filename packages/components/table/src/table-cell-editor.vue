<script setup lang="ts">
import {
  computed,
  h,
  mergeProps,
  nextTick,
  onBeforeUnmount,
  shallowRef,
  watch,
} from 'vue'
import { SInput } from '@vuesax-alpha/components/input'
import { SSelect } from '@vuesax-alpha/components/select'
import { SDatePicker } from '@vuesax-alpha/components/date-picker'
import { SSwitch } from '@vuesax-alpha/components/switch'
import { useNamespace } from '@vuesax-alpha/hooks'
import RendererOutlet from './renderer-outlet'
import type { Component } from 'vue'
import type { TableEditing } from './composables/use-table-edit'
import type {
  TableEditContext,
  TableEditRenderer,
  TableEditSlotParams,
} from './table-edit'

const props = defineProps<{
  context: TableEditContext
  editing: TableEditing
  renderer?: TableEditRenderer
}>()
defineSlots<{ default(params: TableEditSlotParams): unknown }>()
const ns = useNamespace('table')
const root = shallowRef<HTMLElement>()
const config = computed(() =>
  typeof props.context.column.editor === 'object'
    ? props.context.column.editor
    : {},
)
const params = computed(() => props.editing.slotParams(props.context))
const modelValue = computed(() => props.editing.valueFor(props.context))
const popupVisible = shallowRef(false)
const control = shallowRef<{ hidePanel?: () => void }>()
const builtin = () => {
  const type = config.value.type ?? 'input'
  const components = {
    input: SInput,
    number: SInput,
    select: SSelect,
    date: SDatePicker,
    switch: SSwitch,
  }
  return h(
    components[type] as Component,
    mergeProps(
      {
        block: true,
        ...(['select', 'date'].includes(type)
          ? { label: props.context.column.title ?? props.context.column.field }
          : {}),
      },
      config.value.props ?? {},
      {
        ...(type === 'number' ? { type: 'number' } : {}),
        ...(type === 'select'
          ? {
              options:
                config.value.options ?? config.value.props?.options ?? [],
            }
          : {}),
        modelValue: modelValue.value,
        ref: control,
        'aria-label':
          config.value.props?.['aria-label'] ??
          props.context.column.title ??
          props.context.column.field,
        'onUpdate:modelValue': (value: unknown) =>
          params.value.setValue(
            type === 'number'
              ? value === '' || value == null
                ? null
                : Number(value)
              : value,
          ),
        ...(type === 'select'
          ? {
              onVisibleChange: (value: boolean) => {
                popupVisible.value = value
              },
            }
          : {}),
        ...(type === 'date'
          ? {
              onShow: () => {
                popupVisible.value = true
              },
              onHide: () => {
                popupVisible.value = false
              },
            }
          : {}),
      },
    ),
  )
}
let detach: (() => void) | undefined
let disposed = false
watch(
  () => [
    props.editing.active.value?.id,
    props.context.rowKey,
    props.context.columnKey,
  ],
  () => {
    detach?.()
    detach = props.editing.attach(props.context)
  },
  { immediate: true },
)
watch(
  () => [
    root.value,
    props.editing.active.value?.id,
    props.editing.active.value?.columnKey,
  ],
  () => {
    nextTick(() => {
      if (disposed || !root.value || !props.editing.consumeFocus(props.context))
        return
      const target =
        root.value.querySelector<HTMLElement>(
          'input:not(:disabled),textarea:not(:disabled),button:not(:disabled),[tabindex="0"]',
        ) ?? root.value
      target.focus({ preventScroll: true })
    })
  },
  { immediate: true, flush: 'post' },
)
const onCommitShortcut = (event: KeyboardEvent) => {
  if (
    event.isComposing ||
    event.keyCode === 229 ||
    event.key !== 'Enter' ||
    (!event.ctrlKey && !event.metaKey)
  )
    return
  event.preventDefault()
  event.stopPropagation()
  props.editing.commit('enter')
}
const onKeydown = (event: KeyboardEvent) => {
  if (event.isComposing || event.keyCode === 229 || event.defaultPrevented)
    return
  const popupOpen =
    popupVisible.value ||
    root.value?.querySelector('[aria-expanded="true"],.s-select.is-open')
  if (
    event.key === 'Escape' &&
    popupVisible.value &&
    config.value.type === 'date'
  ) {
    event.preventDefault()
    event.stopPropagation()
    control.value?.hidePanel?.()
    return
  }
  if (popupOpen && !event.ctrlKey && !event.metaKey) return
  if (
    event.key === 'Enter' &&
    !event.ctrlKey &&
    !event.metaKey &&
    (event.target as HTMLElement).closest(
      'button,[role="button"],[role="combobox"],[role="switch"]',
    )
  )
    return
  if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    props.editing.cancel('escape')
  } else if (
    event.key === 'Enter' &&
    (event.ctrlKey ||
      event.metaKey ||
      (!(event.target instanceof HTMLTextAreaElement) &&
        !['select', 'date', 'switch'].includes(config.value.type ?? 'input')))
  ) {
    event.preventDefault()
    event.stopPropagation()
    props.editing.commit('enter')
  }
}
onBeforeUnmount(() => {
  disposed = true
  detach?.()
  const cell = root.value?.closest<HTMLElement>('[role="cell"]')
  const restore = root.value?.contains(document.activeElement)
  nextTick(() => {
    if (restore && cell?.isConnected) cell.focus({ preventScroll: true })
  })
})
</script>

<template>
  <div
    ref="root"
    :class="ns.e('cell-editor')"
    tabindex="-1"
    @click.stop
    @dblclick.stop
    @keydown="onKeydown"
    @keydown.capture="onCommitShortcut"
    @focusin="editing.focus(context)"
  >
    <slot v-bind="params">
      <RendererOutlet v-if="renderer" :renderer="renderer" :params="params" />
      <component :is="builtin" v-else />
    </slot>
  </div>
</template>
