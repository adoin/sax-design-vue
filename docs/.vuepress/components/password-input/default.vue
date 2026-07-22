<template>
  <s-password-input v-model="password" clearable placeholder="Enter password" />
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const password = ref('sax-design-vue')
</script>
