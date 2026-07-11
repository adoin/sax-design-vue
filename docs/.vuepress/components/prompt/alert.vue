<template>
  <vs-button @click="active = true">Alert</vs-button>
  <vs-prompt
    v-model="active"
    type="alert"
    title="Notice"
    text="Saved successfully."
    @accept="active = false"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref(false)
</script>
