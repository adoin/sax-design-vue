<template>
  <div>
    <s-button @click="list?.scrollToIndex(0, 'start')">First item</s-button>
    <s-button @click="list?.scrollToIndex(9999, 'end')">Last item</s-button>
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
const items = Array.from({ length: 10000 }, (_, index) => ({
  id: index,
  title: `Record ${index + 1}`,
  subtitle:
    index % 5 === 0
      ? 'This record includes a longer description. Text wraps naturally and the list measures the actual row height, allowing short and detailed records to share the same scrollable list.'
      : 'Short description',
}))
</script>
