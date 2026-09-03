<script setup lang="ts">
import { ref } from 'vue'
import { SButton } from 'sax-design-vue'

const count = ref(0)
</script>

<template>
  <SButton @click="count++">点击了 {{ count }} 次</SButton>
</template>
