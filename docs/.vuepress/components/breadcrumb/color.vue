<template>
  <div class="center breadcrumb-color-demo">
    <input v-model="colorx" type="color" />
    <s-breadcrumb :color="colorx" :items="items" />
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
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  width: 100%;
}
</style>
