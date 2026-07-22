<template>
  <s-menu v-model="active" :options="items" :default-openeds="['docs']" />
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const active = ref('intro')
const items = [
  { key: 'home', label: 'Home', icon: 'home' },
  {
    key: 'docs',
    label: 'Documentation',
    icon: 'description',
    children: [
      { key: 'intro', label: 'Introduction' },
      { key: 'guide', label: 'Guide' },
    ],
  },
  { key: 'settings', label: 'Settings', icon: 'settings' },
]
</script>
