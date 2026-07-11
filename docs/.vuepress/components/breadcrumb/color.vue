<template>
  <vs-breadcrumb color="success" :items="items" />
</template>

<script setup lang="ts">
const items = [{ title: 'Home' }, { title: 'Active', active: true }]
</script>
