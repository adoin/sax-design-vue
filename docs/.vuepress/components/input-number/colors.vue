<script setup lang="ts">
import { ref } from 'vue'
const a = ref(3)
const b = ref(6)
const c = ref(9)
</script>
<template>
  <div class="number-examples">
    <s-input-number v-model="a" label="Theme color" />
    <s-input-number
      v-model="b"
      color="primary"
      background="light"
      label="Light surface"
    />
    <s-input-number
      v-model="c"
      color="#ffffff"
      background="#334155"
      label="Custom colors"
    />
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
