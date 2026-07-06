<template>
  <vs-breadcrumb :items="items" color="primary" />
</template>

<script setup lang="ts">
const items = [
  { title: 'Home', url: '#' },
  { title: 'Docs', url: '#' },
  { title: 'Breadcrumb', active: true },
]
</script>
