<script setup lang="ts">
import { reactive } from 'vue'

const values = reactive({ small: '', default: '', large: '' })
</script>

<template>
  <div class="input-size-demo">
    <s-input v-model="values.small" size="small" placeholder="小号" />
    <s-input v-model="values.default" placeholder="默认" />
    <s-input v-model="values.large" size="large" placeholder="大号" />
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
