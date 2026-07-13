<template>
  <div class="center breadcrumb-separator-demo">
    <vs-breadcrumb separator="•" :items="items" />
    <vs-breadcrumb separator="-" :items="items" />
    <vs-breadcrumb separator="|" :items="items" />
    <vs-breadcrumb separator="chevron_right" :items="items" />
  </div>
</template>

<script setup lang="ts">
const items = [
  { title: 'Dashboard', url: 'dashboard' },
  { title: 'Link 1', url: 'link-1' },
  { title: 'Active', active: true },
]
</script>

<style scoped lang="scss">
.breadcrumb-separator-demo {
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
}
</style>
