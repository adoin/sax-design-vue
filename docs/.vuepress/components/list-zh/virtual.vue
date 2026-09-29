<template>
  <div class="list-virtual-example">
    <div class="list-virtual-example__actions">
      <s-button @click="list?.scrollToIndex(0, 'start')">回到首项</s-button>
      <s-button @click="list?.scrollToIndex(9999, 'end')">定位末项</s-button>
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
      <s-list-header title="10,000 条记录" />
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
  title: `记录 ${index + 1}`,
  subtitle:
    index % 5 === 0
      ? '这条记录包含较长的详细说明。内容自动换行，列表会测量实际高度，让不同长度的记录可以在同一列表中滚动展示。'
      : '简短说明',
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
