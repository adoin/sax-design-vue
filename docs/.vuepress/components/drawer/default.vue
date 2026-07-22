<template>
  <s-button @click="visible = true">Open drawer</s-button>
  <s-drawer v-model="visible" title="Workspace settings">
    Keep focused settings close to the task.
    <template #footer
      ><s-button size="small" @click="visible = false">Done</s-button></template
    >
  </s-drawer>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const visible = ref(false)
</script>
