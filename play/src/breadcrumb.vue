<template>
  <div class="play-container demo">
    <s-breadcrumb :items="defaultItems" />
    <s-breadcrumb :color="colorx" :items="defaultItems" />
    <label class="color-field">
      Accent color
      <input v-model="colorx" type="color" />
    </label>
    <s-breadcrumb separator="chevron_right" :items="shortItems" />
    <s-breadcrumb align="center">
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

<style lang="scss" scoped>
.demo {
  gap: 20px;
}

.color-field {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  color: rgba(0, 0, 0, 0.65);
}
</style>
