<template>
  <div class="prompt-demo">
    <vs-button @click="active = true">Alert</vs-button>
    <vs-prompt
      v-model="active"
      type="alert"
      title="Notice"
      text="Saved successfully."
      @accept="active = false"
      @close="active = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const active = ref(false)
</script>

<style scoped lang="scss">
.prompt-demo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
