<template>
  <s-textarea
    v-model="textarea"
    v-model:counter-danger="counterDanger"
    counter="20"
    label="Counter: 20"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const textarea = ref('')
const counterDanger = ref(false)
</script>
