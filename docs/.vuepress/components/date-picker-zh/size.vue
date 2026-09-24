<script setup lang="ts">
import { reactive } from 'vue'

const values = reactive({ small: '', default: '', large: '' })
</script>

<template>
  <div class="size-demo">
    <s-date-picker v-model="values.small" size="small" placeholder="小号" />
    <s-date-picker v-model="values.default" placeholder="默认" />
    <s-date-picker v-model="values.large" size="large" placeholder="大号" />
  </div>
</template>

<style scoped>
.size-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(180px, 100%), 1fr));
  gap: 12px;
  align-items: center;
}
</style>
