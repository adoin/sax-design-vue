<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
const visible = ref(false)
const embedded = ref(false)
const surface = useTemplateRef<HTMLElement>('surface')
const name = ref('')
const notes = ref('')
</script>

<template>
  <div class="drawer-demo">
    <s-button @click="visible = true">Open without blocking the page</s-button>
    <s-drawer
      v-model="visible"
      title="Non-modal drawer"
      :mask="false"
      modal-penetrable
      :lock-scroll="false"
      :auto-focus="false"
      :width="320"
      ><p>The page remains interactive.</p></s-drawer
    >
    <div ref="surface" class="drawer-surface">
      <p>Container content</p>
      <s-input v-model="name" label="Name" block />
      <s-textarea v-model="notes" label="Notes" :rows="3" block />
      <s-button @click="embedded = true">Open inside this container</s-button>
      <s-drawer
        v-model="embedded"
        title="Contained drawer"
        :append-to="surface || 'body'"
        :lock-scroll="false"
        size="70%"
        ><p>Only this container is covered.</p></s-drawer
      >
    </div>
  </div>
</template>

<style scoped>
.drawer-demo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.drawer-surface {
  position: relative;
  display: grid;
  gap: 16px;
  width: 100%;
  padding: 20px;
  background: var(--sax-css-background);
  border-radius: 12px;
}
</style>
