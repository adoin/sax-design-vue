<template>
  <div style="display: flex">
    <s-button type="flat" @click="add">Add Item</s-button>
    <s-button type="flat" @click="onDelete">Delete Item</s-button>
  </div>
  <s-scrollbar max-height="400px">
    <p v-for="item in count" :key="item" class="scrollbar-demo-item">
      {{ item }}
    </p>
  </s-scrollbar>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const count = ref(3)

const add = () => {
  count.value++
}
const onDelete = () => {
  if (count.value > 0) {
    count.value--
  }
}
</script>

<style scoped>
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 12px;
  background: rgba(var(--sax-primary), 0.1);
  color: rgba(var(--sax-primary));
}
</style>
