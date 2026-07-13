<template>
  <div class="play-container demo">
    <vs-breadcrumb :items="defaultItems" />
    <vs-breadcrumb :color="colorx" :items="defaultItems" />
    <input v-model="colorx" type="color" />
    <vs-breadcrumb separator="chevron_right" :items="shortItems" />
    <vs-breadcrumb>
      <li>
        <a href="#" title="Home">Home</a>
        <span class="vs-breadcrum--separator">/</span>
      </li>
      <li aria-current="page" class="active">Infos</li>
    </vs-breadcrumb>
    <vs-breadcrumb align="center" :items="shortItems" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const colorx = ref('#3DC9B3')

const defaultItems = [
  { title: 'Dashboard', url: 'dashboard' },
  { title: 'Link 1', url: 'link-1' },
  { title: 'Link 2', disabled: true },
  { title: 'Active', active: true },
]

const shortItems = [
  { title: 'Dashboard', url: 'dashboard' },
  { title: 'Active', active: true },
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
