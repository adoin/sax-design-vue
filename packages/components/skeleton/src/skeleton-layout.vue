<script setup lang="ts">
import { computed } from 'vue'
import { normalizeSkeletonRows, skeletonItemStyle } from './skeleton-layout'
import type { SkeletonRow } from './skeleton'
defineOptions({ name: 'SSkeletonLayout' })
const props = defineProps<{ rows: SkeletonRow[] }>()
const normalizedRows = computed(() => normalizeSkeletonRows(props.rows))
</script>
<template>
  <div class="s-skeleton__layout">
    <div
      v-for="(row, rowIndex) in normalizedRows"
      :key="rowIndex"
      class="s-skeleton__row"
      :style="row.style"
    >
      <template v-for="(item, itemIndex) in row.items" :key="itemIndex">
        <s-skeleton-layout
          v-if="item.type === 'group'"
          :rows="item.rows"
          :style="skeletonItemStyle(item)"
        />
        <span
          v-else
          :class="['s-skeleton__element', `s-skeleton__element--${item.type}`]"
          :style="skeletonItemStyle(item)"
        />
      </template>
    </div>
  </div>
</template>
