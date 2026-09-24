<script setup lang="ts">
import { reactive } from 'vue'

const values = reactive({ small: '', default: '', large: '' })
</script>

<template>
  <div class="size-demo">
    <s-control-group size="small"
      ><s-input v-model="values.small" placeholder="Small" /><s-button
        >Go</s-button
      ></s-control-group
    >
    <s-control-group
      ><s-input v-model="values.default" placeholder="Default" /><s-button
        >Go</s-button
      ></s-control-group
    >
    <s-control-group size="large"
      ><s-input v-model="values.large" placeholder="Large" /><s-button
        >Go</s-button
      ></s-control-group
    >
  </div>
</template>

<style scoped>
.size-demo {
  display: grid;
  gap: 12px;
}
</style>
