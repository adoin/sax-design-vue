<script setup lang="ts">
import { ref } from 'vue'
const rounded = ref(false)
const square = ref(false)
</script>

<template>
  <div class="drawer-demo">
    <s-button @click="rounded = true">Rounded drawer</s-button>
    <s-button @click="square = true">Square drawer</s-button>
    <s-drawer v-model="rounded" title="Rounded drawer" shape="rounded"
      ><p>Rounded exposed corners.</p></s-drawer
    >
    <s-drawer v-model="square" title="Square drawer" shape="square"
      ><p>Square panel geometry.</p></s-drawer
    >
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
