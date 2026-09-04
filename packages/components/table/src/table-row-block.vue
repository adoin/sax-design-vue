<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, shallowRef, watch } from 'vue'
import { SButton } from '@vuesax-alpha/components/button'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import type {
  TableDetails,
  TableRowDetailState,
} from './composables/use-table-details'
import type { TableDetailSlotParams, TableFlatRow } from './table'

const props = defineProps<{
  flatRow: TableFlatRow
  controller: TableDetails
  columnCount: number
  viewportWidth: number
  panelId: string
  ariaRowIndex?: number
  disabled: boolean
}>()
const emit = defineEmits<{ shrink: [] }>()
defineSlots<{
  default(params: { detail: TableRowDetailState }): unknown
  detail(params: TableDetailSlotParams): unknown
  loading(params: TableDetailSlotParams): unknown
  error(params: TableDetailSlotParams): unknown
}>()
const ns = useNamespace('table')
const { t } = useLocale()
const block = shallowRef<HTMLElement>()
const panel = shallowRef<HTMLElement>()
const shown = computed(() => props.controller.expanded(props.flatRow))
const params = computed<TableDetailSlotParams>(() => ({
  ...props.controller.paramsFor(props.flatRow),
  ...props.controller.stateFor(props.flatRow.key),
  reload: () => props.controller.ensure(props.flatRow, true),
  close: () => props.controller.toggle(props.flatRow, false),
}))
const detail = computed<TableRowDetailState>(() => ({
  enabled: props.controller.enabled.value,
  expanded: shown.value,
  disabled: props.disabled || !props.controller.allowed(props.flatRow),
  panelId: props.panelId,
  toggle: () => props.controller.toggle(props.flatRow),
}))
watch(
  () => [shown.value, props.flatRow.key, props.controller.revision.value],
  () => {
    if (shown.value) props.controller.ensure(props.flatRow)
  },
  { immediate: true },
)
watch(shown, (open, previous) => {
  if (open || !previous) return
  const restore = panel.value?.contains(document.activeElement)
  nextTick(() => {
    if (disposed) return
    if (restore) {
      const trigger = [
        ...(block.value?.querySelectorAll<HTMLButtonElement>(
          'button[aria-controls]',
        ) ?? []),
      ].find(
        (button) =>
          button.getAttribute('aria-controls') === props.panelId &&
          !button.disabled,
      )
      trigger?.focus()
    }
    emit('shrink')
  })
})
let previousHeight = 0
let observer: ResizeObserver | undefined
let disposed = false
const observePanel = (element?: HTMLElement) => {
  observer?.disconnect()
  previousHeight = 0
  if (!element || typeof ResizeObserver === 'undefined' || disposed) return
  observer ??= new ResizeObserver((entries) => {
    if (disposed) return
    const entry = entries.find((candidate) => candidate.target === panel.value)
    if (!entry) return
    const height =
      entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height
    if (previousHeight && height < previousHeight - 0.5) emit('shrink')
    previousHeight = height
  })
  observer.observe(element)
}
watch(panel, observePanel, { flush: 'post' })
onBeforeUnmount(() => {
  disposed = true
  observer?.disconnect()
})
</script>

<template>
  <slot v-if="!controller.enabled.value" :detail="detail" />
  <div v-else ref="block" :class="ns.e('row-block')" role="presentation">
    <slot :detail="detail" />
    <div
      v-if="shown"
      :class="ns.e('detail-row')"
      role="row"
      :aria-rowindex="ariaRowIndex"
    >
      <div
        :class="ns.e('detail-cell')"
        :style="{ width: viewportWidth ? `${viewportWidth}px` : '100%' }"
        role="cell"
        :aria-colspan="columnCount"
      >
        <div
          :id="panelId"
          ref="panel"
          :class="ns.e('detail-content')"
          role="region"
          :aria-label="t('vs.table.rowDetails', { row: flatRow.index + 1 })"
          :aria-busy="params.loading"
        >
          <slot v-if="params.loading" name="loading" v-bind="params">
            <span role="status">{{ t('vs.table.loadingDetails') }}</span>
          </slot>
          <slot v-else-if="params.error != null" name="error" v-bind="params">
            <div :class="ns.e('detail-error')" role="alert">
              <span>{{ t('vs.table.detailLoadFailed') }}</span>
              <SButton
                size="small"
                flat
                :disabled="disabled"
                @click="params.reload"
                >{{ t('vs.table.retryDetails') }}</SButton
              >
            </div>
          </slot>
          <slot v-else name="detail" v-bind="params">
            {{
              typeof params.data === 'string' || typeof params.data === 'number'
                ? params.data
                : ''
            }}
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
