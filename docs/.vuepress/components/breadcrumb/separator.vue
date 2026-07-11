<template>
  <vs-breadcrumb separator=">" :items="items" />
</template>

<script setup lang="ts">
const items = [
  { title: 'Home' },
  { title: 'Docs' },
  { title: 'Breadcrumb', active: true },
]
</script>
