<script setup lang="ts">
import { useNamespace } from '@vuesax-alpha/hooks'
import TableColumnSetting from './table-column-setting.vue'
import type {
  ManagedColumn,
  useTableColumnManager,
} from './composables/use-table-column-manager'

defineOptions({ name: 'TableColumnSettingBranch' })

interface ColumnSettingBranch {
  item: ManagedColumn
  children: ColumnSettingBranch[]
}

defineProps<{
  branch: ColumnSettingBranch
  manager: ReturnType<typeof useTableColumnManager>
  fixedOptions: Array<{ label: string; value: string }>
  disabled: boolean
  dragKey?: string
  dropTarget?: number
  dropPlacement: 'before' | 'inside' | 'after'
}>()
const emit = defineEmits<{
  nestedVisibility: [visible: boolean]
  pointerdown: [event: PointerEvent, item: ManagedColumn]
  keydown: [event: KeyboardEvent, item: ManagedColumn]
}>()

const ns = useNamespace('table')
const forwardNestedVisibility = (visible: boolean) =>
  emit('nestedVisibility', visible)
const forwardPointerdown = (event: PointerEvent, item: ManagedColumn) =>
  emit('pointerdown', event, item)
const forwardKeydown = (event: KeyboardEvent, item: ManagedColumn) =>
  emit('keydown', event, item)
</script>

<template>
  <div
    :class="[
      ns.e('column-setting-branch'),
      ns.is('group', branch.item.group),
      ns.is('nested', branch.item.depth > 0),
      ns.is(
        'drop-inside',
        branch.item.group &&
          dropTarget === branch.item.position &&
          dropPlacement === 'inside',
      ),
    ]"
    :style="{
      '--s-table-column-branch-offset': `${branch.item.depth * 14}px`,
    }"
  >
    <TableColumnSetting
      :item="branch.item"
      :manager="manager"
      :fixed-options="fixedOptions"
      :disabled="disabled"
      :drag-key="dragKey"
      :drop-target="dropTarget"
      :drop-placement="dropPlacement"
      nested-layout
      @nested-visibility="forwardNestedVisibility"
      @pointerdown="forwardPointerdown"
      @keydown="forwardKeydown"
    />
    <div v-if="branch.children.length" :class="ns.e('column-setting-children')">
      <TableColumnSettingBranch
        v-for="child in branch.children"
        :key="child.item.key"
        :branch="child"
        :manager="manager"
        :fixed-options="fixedOptions"
        :disabled="disabled"
        :drag-key="dragKey"
        :drop-target="dropTarget"
        :drop-placement="dropPlacement"
        @nested-visibility="forwardNestedVisibility"
        @pointerdown="forwardPointerdown"
        @keydown="forwardKeydown"
      />
    </div>
  </div>
</template>
