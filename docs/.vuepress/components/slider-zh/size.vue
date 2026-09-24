<script setup lang="ts">
import { reactive } from 'vue'

const values = reactive({ small: 30, default: 50, large: 70 })
</script>

<template>
  <div class="size-demo">
    <s-slider v-model="values.small" size="small" />
    <s-slider v-model="values.default" />
    <s-slider v-model="values.large" size="large" />
  </div>
</template>

<style scoped>
.size-demo {
  display: grid;
  gap: 12px;
}
</style>
