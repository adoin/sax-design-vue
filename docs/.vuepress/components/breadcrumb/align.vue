<template>
  <div class="center breadcrumb-align-demo">
    <vs-breadcrumb align="left" :items="items" />
    <vs-breadcrumb align="center" :items="items" />
    <vs-breadcrumb align="right" :items="items" />
  </div>
</template>

<script setup lang="ts">
const items = [
  { title: 'Dashboard', url: 'dashboard' },
  { title: 'Link 1', url: 'link-1' },
  { title: 'Link 2', disabled: true },
  { title: 'Active', active: true },
]
</script>

<style scoped lang="scss">
.breadcrumb-align-demo {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
