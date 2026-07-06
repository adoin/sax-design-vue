<template>
  <div class="play-container demo">
    <vs-breadcrumb :items="items" color="primary" />
    <vs-breadcrumb separator=">">
      <vs-breadcrumb-item to="#">Home</vs-breadcrumb-item>
      <vs-breadcrumb-item to="#">Library</vs-breadcrumb-item>
      <vs-breadcrumb-item active>Data</vs-breadcrumb-item>
    </vs-breadcrumb>
  </div>
</template>

<script setup lang="ts">
const items = [
  { title: 'Home', url: '#' },
  { title: 'Components', url: '#' },
  { title: 'Breadcrumb', active: true },
]
</script>

<style lang="scss" scoped>
.demo {
  flex-direction: column;
  align-items: stretch;
  gap: 24px;
  width: min(520px, 90vw);
}
</style>
