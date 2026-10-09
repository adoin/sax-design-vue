<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(false)
const clicks = ref(0)
const name = ref('')
</script>

<template>
  <div class="drawer-demo">
    <s-button @click="visible = true">Customize all regions</s-button>
    <s-drawer
      v-model="visible"
      title="Custom settings"
      :body-style="{ padding: '24px' }"
    >
      <template #header="{ titleId, titleClass }"
        ><h3 :id="titleId" :class="titleClass">Custom heading</h3></template
      >
      <template #extra
        ><s-button size="small" type="flat" @click="clicks++"
          >Extra action</s-button
        ></template
      >
      <template #close-icon><s-icon name="cb:close" /></template>
      <s-input v-model="name" label="Name" placeholder="Enter a name" block />
      <p role="status">Extra action count: {{ clicks }}</p>
      <template #footer="{ close, closePending }"
        ><s-button :disabled="closePending" type="flat" @click="close()"
          >Cancel</s-button
        ><s-button :disabled="closePending" @click="close()"
          >Confirm</s-button
        ></template
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
