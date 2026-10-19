<script setup lang="ts">
import { ref } from 'vue'
import { SInput, STab, STabs } from 'sax-design-vue'
import type { TabValue } from 'sax-design-vue'
const active = ref('draft')
const items = ref([
  { id: 'draft', title: 'Draft', text: 'Keep this draft while sorting' },
  { id: 'review', title: 'Review', text: 'Ready for review' },
  { id: 'archive', title: 'Archive', text: 'Archived notes' },
])
function sort(order: TabValue[]) {
  const byId = new Map(items.value.map((item) => [item.id, item]))
  items.value = order.map((id) => byId.get(String(id))!)
}
const order = ref<TabValue[]>(['one', 'two', 'three'])
</script>

<template>
  <div style="width: 100%">
    <STabs v-model="active" sortable overflow="scroll" @sort="sort">
      <STab
        v-for="item in items"
        :key="item.id"
        :name="item.id"
        :label="item.title"
      >
        <SInput v-model="item.text" :aria-label="item.title" />
      </STab>
    </STabs>
    <p>Source array order: {{ items.map((item) => item.id).join(' → ') }}</p>
    <STabs v-model:order="order" sortable overflow="scroll">
      <STab name="one" label="One">First panel</STab>
      <STab name="two" label="Two">Second panel</STab>
      <STab name="three" label="Three">Third panel</STab>
    </STabs>
    <p>Optional order array: {{ order.join(' → ') }}</p>
  </div>
</template>
