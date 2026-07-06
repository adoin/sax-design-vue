<template>
  <div>
    <vs-button @click="open = true">Open</vs-button>
    <vs-prompt v-model="open" title="Confirm" text="Continue?" type="confirm" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
</script>
