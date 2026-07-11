<template>
  <div class="center">
    <vs-breadcrumb align="center" :items="items" />
    <vs-breadcrumb align="right" :items="items" />
  </div>
</template>

<script setup lang="ts">
const items = [{ title: 'Home' }, { title: 'Active', active: true }]
</script>

<style scoped lang="scss">
.center {
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
