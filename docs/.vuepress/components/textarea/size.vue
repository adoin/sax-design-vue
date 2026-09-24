<script setup lang="ts">
import { reactive } from 'vue'

const values = reactive({ small: '', default: '', large: '' })
</script>

<template>
  <div class="size-demo">
    <s-textarea v-model="values.small" size="small" placeholder="Small" />
    <s-textarea v-model="values.default" placeholder="Default" />
    <s-textarea v-model="values.large" size="large" placeholder="Large" />
  </div>
</template>

<style scoped>
.size-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(180px, 100%), 1fr));
  gap: 12px;
  align-items: start;
}
</style>
