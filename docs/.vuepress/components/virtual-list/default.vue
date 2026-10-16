<template>
  <div class="virtual-list-demo">
    <s-button size="small" @click="append">Append 20 rows</s-button>
    <s-virtual-list
      :items="items"
      :height="320"
      :estimate-size="64"
      :overscan="8"
      :item-key="(item) => item.id"
      class="virtual-list-demo__list"
    >
      <template #default="{ item, index }">
        <article
          class="virtual-list-demo__row"
          @click="item.expanded = !item.expanded"
        >
          <strong>#{{ index + 1 }} {{ item.title }}</strong>
          <p>{{ item.body }}</p>
          <p v-if="item.expanded" class="virtual-list-demo__detail">
            Expanded content changes this row height. TanStack measures it and
            keeps the scroll position stable.
          </p>
        </article>
      </template>
    </s-virtual-list>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type Row = { id: number; title: string; body: string; expanded: boolean }

const lines = [
  'Short dynamic row.',
  'This row has more copy, so its measured height differs from the estimate.',
  'Click any row to expand it. The visible range and following offsets update without rebuilding every DOM node.',
]

let nextId = 0
const createRows = (count: number): Row[] =>
  Array.from({ length: count }, () => ({
    id: nextId++,
    title: 'Dynamic virtual row',
    body: lines[nextId % lines.length],
    expanded: false,
  }))

const items = ref(createRows(200))
const append = () => items.value.push(...createRows(20))
</script>

<style scoped>
.virtual-list-demo {
  display: grid;
  gap: 12px;
}
.virtual-list-demo__list {
  border-radius: 14px;
  background: var(--sax-css-background);
  color: var(--sax-css-text);
  box-shadow: inset 0 2px 8px rgb(0 0 0 / 0.1);
}
.virtual-list-demo__row {
  padding: 12px 16px;
  box-shadow: inset 0 -2px 4px -4px
    color-mix(in srgb, var(--sax-css-primary) 25%, transparent);
  cursor: pointer;
}
.virtual-list-demo__row:hover {
  background: color-mix(in srgb, var(--sax-css-primary) 7%, transparent);
}
.virtual-list-demo__row p {
  margin: 6px 0 0;
  color: color-mix(in srgb, var(--sax-css-text) 72%, transparent);
  line-height: 1.55;
}
.virtual-list-demo__row .virtual-list-demo__detail {
  color: var(--sax-css-primary);
}
</style>
