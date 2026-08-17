<template>
  <div class="anchor-demo-hierarchy">
    <s-anchor :items="items" :target-offset="104" />
  </div>
</template>

<script lang="ts" setup>
const items = [
  { href: '#anchor-secondary', title: 'Secondary link' },
  {
    href: '#anchor-container',
    title: 'Advanced usage',
    children: [
      { href: '#anchor-container', title: 'Scroll container' },
      { href: '#api', title: 'API' },
    ],
  },
]
</script>

<style scoped>
.anchor-demo-hierarchy {
  min-height: 218px;
  padding: 18px;
}
</style>
