<template>
  <div
    class="play-container demo"
    style="display: flex; flex-direction: column; align-items: flex-start; gap: 20px; width: 100%"
  >
    <s-breadcrumb style="width: 100%" :items="defaultItems" />

    <div
      style="display: flex; flex-direction: column; align-items: flex-start; gap: 12px; width: 100%"
    >
      <input v-model="colorx" type="color" />
      <s-breadcrumb style="width: 100%" :color="colorx" :items="defaultItems" />
    </div>

    <s-breadcrumb
      style="width: 100%"
      separator="chevron_right"
      :items="shortItems"
    />

    <s-breadcrumb style="width: 100%" align="center">
      <s-breadcrumb-item to="#">Home</s-breadcrumb-item>
      <s-breadcrumb-item to="#">Library</s-breadcrumb-item>
      <s-breadcrumb-item active>Infos</s-breadcrumb-item>
    </s-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const colorx = ref('#3DC9B3')

const defaultItems = [
  { title: 'Dashboard', url: '#' },
  { title: 'Link 1', url: '#' },
  { title: 'Link 2', disabled: true },
  { title: 'Active', active: true },
]

const shortItems = [
  { title: 'Dashboard', url: '#' },
  { title: 'Active', active: true },
]
</script>
