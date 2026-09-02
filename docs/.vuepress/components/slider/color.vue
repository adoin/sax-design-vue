<template>
  <div class="center">
    <s-slider v-model="a" color="primary" variant="classic" />
    <s-slider v-model="b" color="success" variant="soft" />
    <s-slider v-model="c" :step="10" color="danger" variant="steps" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const a = ref(20)
const b = ref(40)
const c = ref(60)
</script>

<style scoped lang="scss">
.center {
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
