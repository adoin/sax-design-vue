<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { createTableHierarchyGuides } from './table-hierarchy'
import type { TableHierarchyState } from './table-hierarchy'

const props = defineProps<{ state: TableHierarchyState }>()
const ns = useNamespace('table')
const guides = computed(() => createTableHierarchyGuides(props.state))
</script>

<template>
  <span :class="ns.e('hierarchy-guides')" aria-hidden="true">
    <span
      v-for="(guide, index) in guides"
      :key="`${guide.depth}:${index}`"
      :class="[
        ns.e('hierarchy-guide'),
        ns.is('from-middle', guide.fromMiddle),
        ns.is('to-middle', guide.toMiddle),
        ns.is('branch', guide.branch),
      ]"
      :style="{
        insetInlineStart: `${state.origin + guide.depth * state.indent}px`,
      }"
    />
  </span>
</template>
