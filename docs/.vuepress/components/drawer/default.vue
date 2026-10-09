<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
</script>

<template>
  <div class="drawer-demo">
    <s-button @click="visible = true">Open drawer</s-button>
    <s-drawer v-model="visible" title="Workspace settings">
      <p>Keep focused settings close to the task.</p>
      <template #footer="{ close }"
        ><s-button @click="close()">Done</s-button></template
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
