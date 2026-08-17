<template>
  <s-breadcrumb :items="items" separator="chevron_right" />
</template>

<script lang="ts" setup>
const items = [
  {
    title: 'Workspace',
    url: '#workspace',
    children: [
      { title: 'Overview', url: '#overview' },
      {
        title: 'Library',
        url: '#library',
        children: [
          { title: 'Components', url: '#components' },
          { title: 'Patterns', url: '#patterns' },
        ],
      },
    ],
  },
  {
    title: 'Components',
    url: '#components',
    children: [
      { title: 'Navigation', url: '#navigation' },
      { title: 'Feedback', url: '#feedback' },
      { title: 'Data entry', url: '#data-entry' },
    ],
  },
  { title: 'Breadcrumb', active: true },
]
</script>
