<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { layoutTableMergeBoxes } from './composables/table-merge-geometry'
import type { TableMergeBox } from './composables/table-merge-geometry'
import type { TableMergeIndex } from './composables/table-merge-regions'
import type { TableMergeGeometry } from './composables/use-table-merge-geometry'

const props = defineProps<{
  geometry: TableMergeGeometry
  body: TableMergeIndex
  footer: TableMergeIndex
  bodyHost?: HTMLElement | null
  rangeSelected?: (surface: TableMergeSurface) => boolean
}>()
export interface TableMergeSurface extends TableMergeBox {
  area: 'body' | 'footer'
}
defineSlots<{ cell(params: { surface: TableMergeSurface }): unknown }>()
const emit = defineEmits<{
  continuationClick: [surface: TableMergeSurface, event: MouseEvent]
  continuationDblclick: [surface: TableMergeSurface, event: MouseEvent]
  continuationContextmenu: [surface: TableMergeSurface, event: MouseEvent]
}>()
const ns = useNamespace('table')
const surfaces = computed<TableMergeSurface[]>(() => {
  const result: TableMergeSurface[] = []
  for (const area of ['body', 'footer'] as const) {
    const { rows, columns, clip } = props.geometry[area]
    for (const box of layoutTableMergeBoxes(props[area], rows, columns, clip))
      result.push({ ...box, area })
  }
  return result
})
</script>

<template>
  <div :class="ns.e('merge-layer')" data-table-merge-layer role="presentation">
    <Teleport
      v-for="surface in surfaces"
      :key="`${surface.area}:${surface.primary ? `${surface.region.key}:owner` : surface.key}`"
      :to="bodyHost ?? 'body'"
      :disabled="!bodyHost || surface.area === 'footer'"
    >
      <div
        data-table-merge-layer
        :class="[
          ns.e('merge-fragment'),
          ns.is('footer-merge', surface.area === 'footer'),
          ns.is('range-cell', rangeSelected?.(surface)),
        ]"
        :style="{
          left: `${surface.left + (bodyHost && surface.area === 'body' ? bodyHost.scrollLeft - geometry.body.clip.left : 0)}px`,
          top: `${surface.top + (bodyHost && surface.area === 'body' ? bodyHost.scrollTop - geometry.body.clip.top : 0)}px`,
          width: `${surface.width}px`,
          height: `${surface.height}px`,
        }"
        :data-merge-region="surface.region.key"
        :data-merge-primary="surface.primary || undefined"
        :data-merge-row-start="surface.rowStart"
        :data-merge-col-start="surface.colStart"
        :aria-hidden="surface.primary ? undefined : true"
        role="presentation"
        @click="!surface.primary && emit('continuationClick', surface, $event)"
        @dblclick="
          !surface.primary && emit('continuationDblclick', surface, $event)
        "
        @contextmenu="
          !surface.primary && emit('continuationContextmenu', surface, $event)
        "
      >
        <!-- Only one owner renders controls; pane continuations never duplicate focus targets. -->
        <slot v-if="surface.primary" name="cell" :surface="surface" />
      </div>
    </Teleport>
  </div>
</template>
