<template>
  <div :class="ns.b()">
    <slot />
    <s-virtual-list
      v-if="virtual"
      ref="virtualList"
      :items="items"
      :item-key="resolveKey"
      :height="virtualConfig.height ?? 320"
      :estimate-size="virtualConfig.estimateSize ?? 48"
      :overscan="virtualConfig.overscan ?? 5"
      :dynamic="virtualConfig.dynamic ?? true"
    >
      <template #default="{ item, index }">
        <slot name="item" :item="asItem(item)" :index="index">
          <s-list-item
            :title="titleOf(asItem(item))"
            :subtitle="subtitleOf(asItem(item))"
          />
        </slot>
      </template>
    </s-virtual-list>
    <template
      v-for="(item, index) in items"
      v-else
      :key="resolveKey(item, index)"
    >
      <slot name="item" :item="item" :index="index">
        <s-list-item :title="titleOf(item)" :subtitle="subtitleOf(item)" />
      </slot>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useTemplateRef } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import SVirtualList from '@vuesax-alpha/components/virtual-list'
import SListItem from './list-item.vue'
import { listProps } from './list'
import type { ListDataItem } from './list'

defineOptions({ name: 'SList' })
const props = defineProps(listProps)
defineSlots<{
  default(): unknown
  item(params: { item: ListDataItem; index: number }): unknown
}>()
const ns = useNamespace('list')
const virtualList =
  useTemplateRef<InstanceType<typeof SVirtualList>>('virtualList')
const asItem = (item: unknown) => item as ListDataItem
const resolveKey = (item: unknown, index: number) =>
  props.itemKey?.(asItem(item), index) ?? index
const titleOf = (item: ListDataItem) => String(item.title ?? item.label ?? '')
const subtitleOf = (item: ListDataItem) => String(item.subtitle ?? '')

defineExpose({
  /** Scroll to a data index when virtual rendering is enabled. */
  scrollToIndex: (
    index: number,
    align: 'auto' | 'start' | 'center' | 'end' = 'auto',
  ) => virtualList.value?.scrollToIndex(index, align),
  /** Remeasure the virtual viewport and mounted rows. */
  measure: () => virtualList.value?.measure(),
})
</script>
