<script setup lang="ts">
import { ref } from 'vue'
import { SButton } from 'sax-design-vue'

const count = ref(0)
</script>

<template>
  <SButton @click="count++">Clicked {{ count }} times</SButton>
</template>
