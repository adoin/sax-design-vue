<template>
  <div class="center" style="flex-direction: row; flex-wrap: wrap; gap: 8px">
    <vs-chip>Basic Chip</vs-chip>
    <vs-chip v-model="showClosable" closable>Closable</vs-chip>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const showClosable = ref(true)
</script>
