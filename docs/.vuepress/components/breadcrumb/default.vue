<template>
  <vs-breadcrumb :items="items" />
</template>

<script setup lang="ts">
const items = [
  { title: 'Home', url: '/' },
  { title: 'Components', url: '/components/' },
  { title: 'Breadcrumb', active: true },
]
</script>
