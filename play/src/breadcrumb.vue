<template>
  <div
    class="play-container demo"
    style="display: flex; flex-direction: column; align-items: flex-start; gap: 12px; width: 100%"
  >
    <p style="margin: 0; font-size: 0.85rem; color: rgba(0, 0, 0, 0.6)">
      Pick a color — the active crumb text updates live (same as Vuesax 3.x Color).
    </p>

    <div
      style="display: flex; flex-direction: row; align-items: center; gap: 16px; flex-wrap: wrap; width: 100%"
    >
      <input v-model="colorx" type="color" aria-label="Breadcrumb color" />
      <s-breadcrumb :color="colorx" :items="items" style="width: auto" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const colorx = ref('#3DC9B3')

const items = [
  { title: 'Dashboard', url: '#' },
  { title: 'Link 1', url: '#' },
  { title: 'Link 2', disabled: true },
  { title: 'Active', active: true },
]
</script>
