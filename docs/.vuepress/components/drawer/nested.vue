<script setup lang="ts">
import { ref } from 'vue'
const outer = ref(false)
const inner = ref(false)
const push = ref(true)
</script>

<template>
  <div class="drawer-demo">
    <s-checkbox v-model="push">Push the parent drawer</s-checkbox>
    <s-button @click="outer = true">Open parent drawer</s-button>
    <s-drawer
      v-model="outer"
      title="Parent drawer"
      :width="520"
      :push="push ? { distance: 120 } : false"
    >
      <s-button @click="inner = true">Open child drawer</s-button>
      <s-drawer v-model="inner" title="Child drawer" :width="340">
        <p>Escape and overlay clicks affect the top drawer.</p>
        <template #footer="{ close }"
          ><s-button @click="close()">Close child</s-button></template
        >
      </s-drawer>
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
