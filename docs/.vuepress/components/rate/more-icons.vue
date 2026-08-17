<template>
  <div class="center">
    <s-rate
      v-model="value"
      :icons="icons"
      void-icon="bxs:heart"
      :colors="['#409eff', '#67c23a', '#FF9900']"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref(3)
const icons = [
  'bxs:heart',
  'bxs:heart',
  'bxs:heart',
]
</script>
