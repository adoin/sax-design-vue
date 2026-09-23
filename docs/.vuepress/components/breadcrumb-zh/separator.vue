<template>
  <div class="center breadcrumb-separator-demo">
    <s-breadcrumb separator="•" :items="items" />
    <s-breadcrumb separator="-" :items="items" />
    <s-breadcrumb separator="|" :items="items" />
    <s-breadcrumb separator="chevron_right" :items="items" />
  </div>
</template>

<script setup lang="ts">
const items = [
  { title: '工作台', url: 'dashboard' },
  { title: '一级页面', url: 'link-1' },
  { title: '当前位置', active: true },
]
</script>

<style scoped lang="scss">
.breadcrumb-separator-demo {
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
}
</style>
