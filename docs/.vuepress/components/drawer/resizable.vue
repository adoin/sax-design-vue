<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
const size = ref<string | number>(420)
const eventText = ref('')
const update = (event: { size: number }) => {
  eventText.value = `Current size: ${event.size}px`
}
</script>

<template>
  <div class="drawer-demo">
    <s-button @click="visible = true">Open resizable drawer</s-button>
    <s-drawer
      v-model="visible"
      v-model:size="size"
      title="Resizable drawer"
      resizable
      :min-size="260"
      max-size="80%"
      resize-label="Resize drawer"
      @resize="update"
    >
      <p>
        Drag the edge or focus it and use arrow keys. Shift increases the step;
        Home and End select the limits.
      </p>
      <p role="status">{{ eventText }}</p>
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
