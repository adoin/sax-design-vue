<script setup lang="ts">
import { reactive } from 'vue'

const values = reactive({ small: true, default: true, large: true })
</script>

<template>
  <div class="size-demo">
    <s-switch v-model="values.small" size="small" />
    <s-switch v-model="values.default" />
    <s-switch v-model="values.large" size="large" />
  </div>
</template>

<style scoped>
.size-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}
</style>
