<template>
  <div
    class="play-container demo"
    style="
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 8px;
      align-items: flex-start;
    "
  >
    <s-tag>Default</s-tag>
    <s-tag color="primary">Primary</s-tag>
    <s-tag color="success" transparent>Transparent</s-tag>
    <s-tag v-if="visible" color="danger" closable @close="visible = false">
      Closable
    </s-tag>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(true)
</script>
