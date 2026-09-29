<template>
  <div class="list-virtual-example">
    <div class="list-virtual-example__actions">
      <s-button @click="list?.scrollToIndex(0, 'start')">First item</s-button>
      <s-button @click="list?.scrollToIndex(9999, 'end')">Last item</s-button>
    </div>
    <s-list
      ref="list"
      :items="items"
      :item-key="itemKey"
      virtual
      :virtual-config="{
        height: 320,
        estimateSize: 52,
        overscan: 6,
        dynamic: true,
      }"
    >
      <s-list-header title="10,000 records" />
      <template #item="{ item, index }">
        <s-list-item
          :title="String(item.title)"
          :subtitle="String(item.subtitle)"
        >
          <s-tag>{{ index + 1 }}</s-tag>
        </s-list-item>
      </template>
    </s-list>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ListInstance, ListItemKey } from 'sax-design-vue'

const list = ref<ListInstance>()
const itemKey: ListItemKey = (item) => Number(item.id)
const descriptions = [
  'Short description',
  'This week’s design resources include updated navigation, form, and data-display guidelines. Each module owner should review the copy, default states, and disabled states before the next review. Narrow side panels and mobile layouts also need to keep longer descriptions readable, allow natural text wrapping, and leave enough space for actions without clipping or overlapping the content.',
  'This record contains the complete delivery notes for the current project. The design team has prepared component guidelines, interaction details, and a shared resource directory. The development team should complete the integration for each module and review the result across themes, languages, and screen widths. Longer descriptions should remain readable and wrap naturally instead of forcing users to open a separate panel for every detail. Testing should cover empty data, loading, failed requests, missing permissions, and repeated actions, with clear feedback in each state. Before delivery, add usage examples, a summary of the changes, and the relevant verification notes. The final review should confirm that the design, implementation, and documentation describe the same behavior, so future maintainers can understand the background, current progress, and remaining work directly from this record.',
]
const items = Array.from({ length: 10000 }, (_, index) => ({
  id: index,
  title: `Record ${index + 1}`,
  subtitle: descriptions[index % descriptions.length],
}))
</script>

<style scoped>
.list-virtual-example {
  display: grid;
  gap: 20px;
  width: 100%;
  min-width: 0;
}
.list-virtual-example__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
</style>
