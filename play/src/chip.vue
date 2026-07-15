<template>
  <div class="play-container demo">
    <s-chip>Default</s-chip>
    <s-chip color="primary">Primary</s-chip>
    <s-chip color="success" transparent>Transparent</s-chip>
    <s-chip v-if="visible" color="danger" closable @close="visible = false">
      Closable
    </s-chip>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(true)
</script>

<style lang="scss" scoped>
.demo {
  flex-wrap: wrap;
  gap: 8px;
}
</style>
