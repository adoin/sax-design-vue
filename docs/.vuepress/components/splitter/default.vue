<template>
  <s-splitter v-model="size" style="height: 220px">
    <template #first
      ><div class="panel first">Navigation<br />Drag divider</div></template
    >
    <template #second
      ><div class="panel">Workspace<br />{{ size.toFixed(0) }}%</div></template
    >
  </s-splitter>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const size = ref(34)
</script>

<style scoped>
.panel {
  height: 100%;
  padding: 20px;
  color: var(--s-text-color-primary);
  line-height: 1.8;
}
.first {
  background: var(--s-fill-color-light);
}
</style>
