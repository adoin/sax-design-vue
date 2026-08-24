<script lang="ts" setup>
import { ref } from 'vue'

const active = ref('guides')
const items = [
  { key: 'home', label: 'Home' },
  {
    key: 'resources',
    label: 'Resources',
    icon: 'cb:document',
    description: 'Guides, examples, and community',
    children: [
      {
        key: 'guides',
        label: 'Guides',
        icon: 'cb:bookmark',
        description: 'Start building with practical guides',
      },
      {
        key: 'community',
        label: 'Community',
        icon: 'cb:group',
        description: 'Learn from other Sax builders',
        children: [
          {
            key: 'showcase',
            label: 'Showcase',
            description: 'Explore community projects',
          },
          {
            key: 'discussions',
            label: 'Discussions',
            description: 'Ask questions and share ideas',
          },
        ],
      },
    ],
  },
  { key: 'pricing', label: 'Pricing' },
]
</script>

<template>
  <s-menu
    v-model="active"
    :options="items"
    mode="horizontal"
    trigger="hover"
    variant="plain"
  />
</template>
