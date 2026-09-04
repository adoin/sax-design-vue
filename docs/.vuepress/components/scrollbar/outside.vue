<script setup lang="ts">
import { ref } from 'vue'

const count = ref(8)
const wide = ref(true)
const autoHide = ref(false)
</script>

<template>
  <div class="outside-scroll-demo">
    <div class="outside-scroll-controls">
      <s-button size="small" type="flat" @click="count++">Add item</s-button>
      <s-button size="small" type="flat" :disabled="count <= 1" @click="count--"
        >Remove item</s-button
      >
      <s-checkbox v-model="wide">Wide content</s-checkbox>
      <s-checkbox v-model="autoHide">Show on hover</s-checkbox>
    </div>
    <s-scrollbar
      placement="outside"
      max-height="280px"
      :gap="8"
      :always="!autoHide"
    >
      <div class="outside-scroll-content" :class="{ 'is-wide': wide }">
        <div v-for="item in count" :key="item" class="outside-scroll-row">
          <span>Project {{ item }}</span>
          <span>Content stays separate from the outside scroll tracks</span>
        </div>
      </div>
    </s-scrollbar>
  </div>
</template>

<style scoped>
.outside-scroll-demo {
  width: 100%;
  min-width: 0;
}
.outside-scroll-controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}
.outside-scroll-content {
  display: grid;
  gap: 8px;
  min-width: 100%;
}
.outside-scroll-content.is-wide {
  width: 1120px;
}
.outside-scroll-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 52px;
  padding: 12px 16px;
  border-radius: 10px;
  background: hsl(var(--sax-primary) / 0.07);
  color: hsl(var(--sax-primary));
}
</style>
