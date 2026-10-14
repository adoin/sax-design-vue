<script setup lang="ts">
import { ref } from 'vue'
const value = ref(3)
</script>
<template>
  <div class="number-examples">
    <s-input-number v-model="value" label="数量" />
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
