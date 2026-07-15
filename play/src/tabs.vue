<template>
  <div class="play-container demo">
    <s-tabs v-model="active" color="primary">
      <s-tab label="Account">
        Account panel content.
      </s-tab>
      <s-tab label="Password">
        Password panel content.
      </s-tab>
      <s-tab label="Settings">
        Settings panel content.
      </s-tab>
    </s-tabs>
    <p class="hint">Active: {{ active }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const active = ref('Account')
</script>

<style lang="scss" scoped>
.demo {
  flex-direction: column;
  width: min(560px, 90vw);
}
.hint {
  margin: 12px 0 0;
  color: rgba(0, 0, 0, 0.55);
}
</style>
