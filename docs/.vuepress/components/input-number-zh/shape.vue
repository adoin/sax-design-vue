<script setup lang="ts">
import { ref } from 'vue'
const a = ref(3)
const b = ref(6)
</script>
<template>
  <div class="number-examples">
    <s-input-number v-model="a" shape="rounded" label="圆角" />
    <s-input-number v-model="b" shape="square" label="方角" />
  </div>
</template>
<style scoped>
.number-examples {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 32px;
  padding: 20px 0;
}
</style>
