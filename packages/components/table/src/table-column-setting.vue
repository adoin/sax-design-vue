<script setup lang="ts">
import { SCheckbox } from '@vuesax-alpha/components/checkbox'
import { SIcon } from '@vuesax-alpha/components/icon'
import { SSelect } from '@vuesax-alpha/components/select'
import { useId, useLocale, useNamespace } from '@vuesax-alpha/hooks'
import type {
  ManagedColumn,
  useTableColumnManager,
} from './composables/use-table-column-manager'

defineOptions({ name: 'TableColumnSetting' })

defineProps<{
  item: ManagedColumn
  manager: ReturnType<typeof useTableColumnManager>
  fixedOptions: Array<{ label: string; value: string }>
  disabled: boolean
  dragKey?: string
  dropTarget?: number
  dropPlacement: 'before' | 'inside' | 'after'
  nestedLayout?: boolean
}>()
const emit = defineEmits<{
  nestedVisibility: [visible: boolean]
  pointerdown: [event: PointerEvent, item: ManagedColumn]
  keydown: [event: KeyboardEvent, item: ManagedColumn]
}>()

const ns = useNamespace('table')
const id = useId()
const { t } = useLocale()
</script>

<template>
  <div
    :class="[
      ns.e('column-setting'),
      ns.is('group', item.group),
      ns.is('nested-layout', nestedLayout),
      ns.is('dragging', dragKey === item.key),
      ns.is(`drop-${dropPlacement}`, dropTarget === item.position),
    ]"
    :style="{ '--s-table-column-depth': `${item.depth * 14}px` }"
    :data-column-key="item.key"
    :data-column-position="item.position"
    :data-column-group="item.group || undefined"
  >
    <SCheckbox
      v-if="!item.group"
      :model-value="!item.hidden"
      :disabled="disabled"
      :label="item.title"
      :title="item.title"
      @update:model-value="manager.update(item.key, { hidden: !$event })"
    />
    <span v-else :class="ns.e('column-group-label')" :title="item.title">
      <span>{{ item.title }}</span>
      <span :class="ns.e('column-group-count')">
        {{ t('vs.table.columnChildren', { count: item.childCount }) }}
      </span>
    </span>
    <label :class="ns.e('column-setting-label')" :for="id">{{
      t('vs.table.pinColumn', { column: item.title })
    }}</label>
    <SSelect
      :id="id"
      :model-value="item.fixed || 'none'"
      :options="fixedOptions"
      :disabled="disabled"
      @visible-change="emit('nestedVisibility', $event)"
      @update:model-value="
        manager.update(item.key, {
          fixed: $event === 'left' || $event === 'right' ? $event : false,
        })
      "
    />
    <button
      type="button"
      :class="ns.e('column-drag-handle')"
      :disabled="disabled || manager.settingCount.value < 2"
      :aria-label="t('vs.table.dragColumn', { column: item.title })"
      :aria-pressed="dragKey === item.key"
      :title="t('vs.table.dragColumnHint')"
      @pointerdown="emit('pointerdown', $event, item)"
      @keydown="emit('keydown', $event, item)"
      @click.stop.prevent
    >
      <SIcon name="cb:draggable" aria-hidden="true" />
    </button>
  </div>
</template>
