<template>
  <div class="demo-rate center">
    <s-rate v-model="value" size="large" />
    <s-rate v-model="value" />
    <s-rate v-model="value" size="small" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref(2)
</script>

<style scoped lang="scss">
.demo-rate {
  display: flex;
  flex-direction: column;
}
</style>
