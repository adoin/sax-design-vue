<template>
  <div class="anchor-demo-horizontal">
    <s-anchor direction="horizontal" :items="items" :target-offset="104" />
  </div>
</template>

<script lang="ts" setup>
const items = [
  { href: '#anchor-default', title: 'Default' },
  { href: '#anchor-hierarchy', title: 'Hierarchy' },
  { href: '#anchor-container', title: 'Container' },
]
</script>

<style scoped>
.anchor-demo-horizontal {
  min-height: 112px;
  padding: 18px;
}
</style>
