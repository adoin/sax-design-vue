<script setup lang="ts">
import { reactive } from 'vue'

const values = reactive({ small: '', default: '', large: '' })
</script>

<template>
  <div class="size-demo">
    <s-radio v-model="values.small" size="small" value="small">Small</s-radio>
    <s-radio v-model="values.default" value="default">Default</s-radio>
    <s-radio v-model="values.large" size="large" value="large">Large</s-radio>
  </div>
</template>

<style scoped>
.size-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
</style>
