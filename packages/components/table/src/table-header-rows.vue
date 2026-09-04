<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { createTableHeaderLayout } from './composables/table-header-layout'
import type { TableHeaderEntry } from './composables/table-header-layout'
import type { TableRenderedColumnEntry, TableRenderedEntry } from './table'
import type { HeaderAncestor } from './composables/table-column-tree'

const props = defineProps<{
  entries: TableRenderedEntry[]
  depth: number
  pathFor: (entry: TableRenderedColumnEntry) => HeaderAncestor[]
}>()
const ns = useNamespace('table')
defineSlots<{ default(props: { entry: TableHeaderEntry }): unknown }>()
const layout = computed(() =>
  createTableHeaderLayout(props.entries, props.depth, props.pathFor),
)
</script>

<template>
  <div v-if="depth <= 1" :class="ns.e('data-header')" role="row">
    <template v-for="entry in entries" :key="entry.key">
      <div
        v-if="entry.kind === 'spacer'"
        :class="ns.e('data-column-spacer')"
        :style="{ flexBasis: `${entry.width}px` }"
        aria-hidden="true"
      />
      <slot v-else :entry="entry" />
    </template>
  </div>
  <div
    v-else
    :class="[ns.e('data-header'), ns.e('grouped-header')]"
    :style="{ gridTemplateColumns: layout.tracks }"
    role="rowgroup"
  >
    <div
      v-for="(row, index) in layout.rows"
      :key="index"
      :class="ns.e('header-row')"
      role="row"
      :aria-rowindex="index + 1"
    >
      <template v-for="entry in row" :key="entry.key">
        <slot :entry="entry" />
      </template>
    </div>
  </div>
</template>
