<template>
  <vs-button @click="active = true">Open prompt</vs-button>
  <vs-prompt
    v-model="active"
    title="Confirm action"
    text="Do you want to continue?"
    type="confirm"
    @accept="active = false"
    @cancel="active = false"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref(false)
</script>
