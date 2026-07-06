<template>
  <div class="play-container demo">
    <vs-chip>Default</vs-chip>
    <vs-chip color="primary">Primary</vs-chip>
    <vs-chip color="success" transparent>Transparent</vs-chip>
    <vs-chip v-if="visible" color="danger" closable @close="visible = false">
      Closable
    </vs-chip>
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
