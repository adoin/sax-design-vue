<template>
  <div
    class="play-container demo"
    style="display: flex; flex-direction: column; gap: 16px; align-items: stretch"
  >
    <s-progress
      :percent="percent"
      color="primary"
      style="flex-shrink: 0; width: 100%"
    />
    <s-progress
      :percent="percent"
      color="success"
      :height="8"
      style="flex-shrink: 0; width: 100%"
    />
    <s-progress
      indeterminate
      color="warn"
      :height="6"
      style="flex-shrink: 0; width: 100%"
    />
    <s-button style="align-self: flex-start" @click="updatePercent">
      Update {{ percent }}%
    </s-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const percent = ref(40)

const updatePercent = () => {
  if (percent.value >= 100) {
    percent.value = 0
  } else {
    percent.value = percent.value + 10
  }
}
</script>
