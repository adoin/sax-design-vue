<script setup lang="ts">
import { shallowRef } from 'vue'

const value = shallowRef('Hover over or focus this input')
</script>

<template>
  <div class="center content-inputs">
    <s-input
      v-model="value"
      allow-clear
      placeholder="Type something to clear"
    />
  </div>
</template>
