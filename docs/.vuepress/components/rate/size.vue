<script setup lang="ts">
import { reactive } from 'vue'

const values = reactive({ large: 2, default: 2, small: 2 })
</script>

<template>
  <div class="demo-rate center">
    <s-rate v-model="values.large" size="large" />
    <s-rate v-model="values.default" />
    <s-rate v-model="values.small" size="small" />
  </div>
</template>

<style scoped lang="scss">
.demo-rate {
  display: flex;
  flex-direction: column;
}
</style>
