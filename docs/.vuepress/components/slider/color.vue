<template>
  <div class="center">
    <s-slider v-model="a" color="primary" />
    <s-slider v-model="b" color="success" />
    <s-slider v-model="c" color="danger" />
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
