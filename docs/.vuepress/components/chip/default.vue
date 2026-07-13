<template>
  <div class="center" style="flex-direction: row; flex-wrap: wrap; gap: 8px">
    <vs-chip>Basic Chip</vs-chip>
    <vs-chip v-if="showClosable" closable @close="showClosable = false"
      >Closable</vs-chip
    >
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const showClosable = ref(true)
</script>
