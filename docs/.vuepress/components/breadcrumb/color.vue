<template>
  <div class="center breadcrumb-color-demo">
    <input v-model="colorx" type="color" />
    <vs-breadcrumb :color="colorx" :items="items" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const colorx = ref('#3DC9B3')
const items = [
  { title: 'Dashboard', url: 'dashboard' },
  { title: 'Link 1', url: 'link-1' },
  { title: 'Link 2', disabled: true },
  { title: 'Active', active: true },
]
</script>

<style scoped lang="scss">
.breadcrumb-color-demo {
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
}
</style>
