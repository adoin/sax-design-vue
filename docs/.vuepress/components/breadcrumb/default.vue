<template>
  <vs-breadcrumb :items="items" />
</template>

<script setup lang="ts">
const items = [
  { title: 'Dashboard', url: 'dashboard' },
  { title: 'Link 1', url: 'link-1' },
  { title: 'Link 2', disabled: true },
  { title: 'Active', active: true },
]
</script>
