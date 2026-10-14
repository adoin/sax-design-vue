<script setup lang="ts">
import { ref } from 'vue'
const a = ref(3)
const b = ref(6)
const c = ref(9)
</script>
<template>
  <div class="number-examples">
    <s-input-number v-model="a" disabled label="Disabled" />
    <s-input-number v-model="b" readonly label="Readonly" />
    <s-input-number v-model="c" :controls="false" label="No controls" />
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
