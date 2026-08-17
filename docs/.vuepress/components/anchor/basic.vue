<template>
  <div class="anchor-demo-basic">
    <s-anchor :items="items" :target-offset="104" />
  </div>
</template>

<script lang="ts" setup>
const items = [
  { href: '#anchor-hierarchy', title: 'Hierarchy' },
  { href: '#anchor-horizontal', title: 'Horizontal' },
  { href: '#anchor-container', title: 'Scroll container' },
]
</script>

<style scoped>
.anchor-demo-basic {
  min-height: 190px;
  padding: 18px;
}
</style>
