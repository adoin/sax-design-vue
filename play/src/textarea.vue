<template>
  <div class="play-container demo">
    <s-textarea
      v-model="text"
      counter="20"
      label="Counter: 20"
      v-model:counter-danger="counterDanger"
      width="100%"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const text = ref('')
const counterDanger = ref(false)
</script>

<style lang="scss" scoped>
.demo {
  gap: 12px;
}
</style>
