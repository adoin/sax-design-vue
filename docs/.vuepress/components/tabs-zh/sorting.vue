<script setup lang="ts">
import { ref } from 'vue'
import { SInput, STab, STabs } from 'sax-design-vue'
import type { TabValue } from 'sax-design-vue'
const active = ref('draft')
const items = ref([
  { id: 'draft', title: '草稿', text: '排序时保留这份草稿' },
  { id: 'review', title: '审核', text: '待审核内容' },
  { id: 'archive', title: '归档', text: '已归档记录' },
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
    <p>原始数组顺序：{{ items.map((item) => item.id).join(' → ') }}</p>
    <STabs v-model:order="order" sortable overflow="scroll">
      <STab name="one" label="第一项">第一个面板</STab>
      <STab name="two" label="第二项">第二个面板</STab>
      <STab name="three" label="第三项">第三个面板</STab>
    </STabs>
    <p>可选排序数组：{{ order.join(' → ') }}</p>
  </div>
</template>
