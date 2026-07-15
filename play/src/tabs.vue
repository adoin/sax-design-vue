<template>
  <div class="play-container demo">
    <s-tabs v-model="active" color="primary">
      <s-tab label="Account">Account panel content.</s-tab>
      <s-tab label="Password">Password panel content.</s-tab>
      <s-tab label="Settings">Settings panel content.</s-tab>
    </s-tabs>
    <p class="hint">Active tab: {{ tabLabels[active] ?? active }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tabLabels = ['Account', 'Password', 'Settings']
const active = ref(0)
</script>

<style lang="scss" scoped>
.demo {
  gap: 12px;
}

.hint {
  margin: 0;
  color: rgba(0, 0, 0, 0.55);
  font-size: 0.9rem;
}
</style>
