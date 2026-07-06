<template>
  <div class="play-container demo">
    <vs-tabs v-model="active" color="primary">
      <vs-tab label="Account">
        Account panel content.
      </vs-tab>
      <vs-tab label="Password">
        Password panel content.
      </vs-tab>
      <vs-tab label="Settings">
        Settings panel content.
      </vs-tab>
    </vs-tabs>
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
