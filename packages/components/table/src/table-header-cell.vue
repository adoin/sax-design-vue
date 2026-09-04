<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { SButton } from '@vuesax-alpha/components/button'
import { SCheckbox } from '@vuesax-alpha/components/checkbox'
import { SIcon } from '@vuesax-alpha/components/icon'
import { SPopper } from '@vuesax-alpha/components/popper'
import { useLocale, useNamespace, useShape } from '@vuesax-alpha/hooks'
import { tableOverflowMode } from './data-utils'
import type {
  TableColumn,
  TableFilterSlotParams,
  TableFilterValue,
  TableOverflow,
  TableSortOrder,
} from './table'

const props = defineProps<{
  column: TableColumn
  group?: boolean
  disabled?: boolean
  order?: TableSortOrder
  sortPriority?: number
  filterValues: TableFilterValue[]
  overflow?: TableOverflow
  allSelected: boolean
  indeterminate: boolean
  selectAllDisabled: boolean
  showSelectAll: boolean
}>()
const emit = defineEmits<{
  sort: [order: TableSortOrder]
  filter: [values: TableFilterValue[]]
  selectAll: [checked: boolean]
}>()
defineSlots<{
  default(): unknown
  filter?(params: TableFilterSlotParams): unknown
}>()
const ns = useNamespace('table')
const shape = useShape()
const { t } = useLocale()
const open = shallowRef(false)
const draft = shallowRef<TableFilterValue[]>([])
const trigger = shallowRef<HTMLButtonElement>()
const panel = shallowRef<HTMLElement>()
const focusPanel = () => {
  const first = panel.value?.querySelector<HTMLElement>(
    'input:not(:disabled), button:not(:disabled), [tabindex="0"]',
  )
  ;(first ?? panel.value)?.focus()
}
const mode = computed(() =>
  tableOverflowMode(props.column.showHeaderOverflow ?? props.overflow),
)
const hasFilter = computed(
  () =>
    !props.group && Boolean(props.column.filters || props.column.slots?.filter),
)
const setValues = (values: TableFilterValue[]) => {
  draft.value =
    props.column.filterMultiple === false ? values.slice(-1) : [...values]
}
const close = () => {
  open.value = false
}
const closeAndFocus = () => {
  close()
  if (!props.disabled) trigger.value?.focus()
}
const apply = () => {
  if (props.disabled) return
  emit('filter', [...draft.value])
  close()
  trigger.value?.focus()
}
const reset = () => {
  if (props.disabled) return
  draft.value = []
  emit('filter', [])
  close()
  trigger.value?.focus()
}
const toggleOption = (value: TableFilterValue, checked: boolean) =>
  setValues(
    checked
      ? [...draft.value, value]
      : draft.value.filter((item) => item !== value),
  )
watch(open, (value) => {
  if (value) draft.value = [...props.filterValues]
})
watch(
  () => props.disabled,
  (value) => {
    if (value) close()
  },
)
const sortDirections: TableSortOrder[] = ['asc', 'desc']
const sortLabel = (direction: TableSortOrder) =>
  `${props.column.title ?? props.column.field ?? ''}: ${t(
    direction === 'asc' ? 'vs.table.sortAscending' : 'vs.table.sortDescending',
  )}`
</script>

<template>
  <div :class="ns.e('header-content')">
    <span
      v-if="!group && column.type === 'checkbox' && showSelectAll"
      :class="ns.e('selection-control')"
    >
      <SCheckbox
        :model-value="allSelected"
        :indeterminate="indeterminate"
        :disabled="selectAllDisabled"
        :aria-label="t('vs.table.selectAll')"
        @update:model-value="emit('selectAll', Boolean($event))"
      />
    </span>
    <span
      v-else
      :class="[ns.e('header-label'), ns.is('ellipsis', Boolean(mode))]"
      :data-table-overflow="mode"
      :tabindex="mode === 'tooltip' ? 0 : undefined"
      ><slot
    /></span>
    <span v-if="!group && column.sortable" :class="ns.e('sort-controls')">
      <span :class="ns.e('sort-buttons')">
        <button
          v-for="direction in sortDirections"
          :key="direction"
          type="button"
          :class="[ns.e('sort-button'), ns.is('active', order === direction)]"
          :aria-label="sortLabel(direction)"
          :aria-pressed="order === direction"
          :disabled="disabled"
          :title="
            order === direction ? t('vs.table.clearSort') : sortLabel(direction)
          "
          @click="emit('sort', direction)"
        >
          <SIcon
            :name="direction === 'asc' ? 'cb:caret-up' : 'cb:caret-down'"
            aria-hidden="true"
          />
        </button>
      </span>
      <small v-if="order && sortPriority" :class="ns.e('sort-priority')">{{
        sortPriority
      }}</small>
    </span>
    <SPopper
      v-if="hasFilter"
      v-model:visible="open"
      trigger="click"
      :disabled="disabled"
      placement="bottom-end"
      :show-arrow="false"
      :offset="8"
      :shift="{ padding: 8, crossAxis: true }"
      :popper-class="[
        ns.e('filter-panel'),
        ns.is('square', shape === 'square'),
      ]"
      @show="focusPanel"
    >
      <button
        ref="trigger"
        type="button"
        :disabled="disabled"
        :class="[
          ns.e('header-action'),
          ns.is('active', filterValues.length > 0),
        ]"
        :aria-label="`${t('vs.table.filter')}: ${column.title ?? column.field ?? ''}`"
        :aria-expanded="open"
        aria-haspopup="dialog"
      >
        <SIcon name="cb:filter" />
      </button>
      <template #content>
        <div
          ref="panel"
          tabindex="-1"
          role="dialog"
          :aria-label="`${t('vs.table.filter')}: ${column.title ?? column.field ?? ''}`"
          @keydown.esc.stop.prevent="closeAndFocus"
        >
          <div :class="ns.e('filter-title')">
            {{ column.title ?? column.field }}
          </div>
          <slot
            name="filter"
            :column="column"
            :values="draft"
            :set-values="setValues"
            :apply="apply"
            :reset="reset"
            :close="close"
          >
            <div :class="ns.e('filter-options')">
              <SCheckbox
                v-for="(option, index) in column.filters"
                :key="index"
                :model-value="draft.includes(option.value)"
                :disabled="disabled || option.disabled"
                :label="option.label"
                @update:model-value="
                  toggleOption(option.value, Boolean($event))
                "
              />
            </div>
          </slot>
          <div :class="ns.e('filter-actions')">
            <SButton
              size="mini"
              type="flat"
              :disabled="disabled"
              @click="reset"
              >{{ t('vs.table.resetFilter') }}</SButton
            >
            <SButton size="mini" :disabled="disabled" @click="apply">{{
              t('vs.table.confirmFilter')
            }}</SButton>
          </div>
        </div>
      </template>
    </SPopper>
  </div>
</template>
