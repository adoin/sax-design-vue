<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
const loading = ref(true)
const input = ref('')
</script>

<template>
  <div class="drawer-demo">
    <s-button @click="visible = true">Open loading example</s-button>
    <s-drawer v-model="visible" title="Loading feedback" :loading="loading">
      <template #extra><s-switch v-model="loading">Loading</s-switch></template>
      <s-input v-model="input" label="Preserved input" block />
      <template #footer="{ close }"
        ><s-button @click="close()">Close</s-button></template
      >
    </s-drawer>
  </div>
</template>

<style scoped>
.drawer-demo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
</style>
