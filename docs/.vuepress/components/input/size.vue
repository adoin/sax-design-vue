<script setup lang="ts">
import { reactive } from 'vue'

const values = reactive({ small: '', default: '', large: '' })
</script>

<template>
  <div class="input-size-demo">
    <s-input v-model="values.small" size="small" placeholder="Small" />
    <s-input v-model="values.default" placeholder="Default" />
    <s-input v-model="values.large" size="large" placeholder="Large" />
  </div>
</template>

<style scoped>
.input-size-demo {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 16px;
}
</style>
