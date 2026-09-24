<script setup lang="ts">
import { reactive } from 'vue'

const values = reactive({ small: '123', default: '123', large: '123' })
</script>

<template>
  <div class="size-demo">
    <s-verification-code v-model="values.small" size="small" :length="3" />
    <s-verification-code v-model="values.default" :length="3" />
    <s-verification-code v-model="values.large" size="large" :length="3" />
  </div>
</template>

<style scoped>
.size-demo {
  display: grid;
  gap: 12px;
}
</style>
