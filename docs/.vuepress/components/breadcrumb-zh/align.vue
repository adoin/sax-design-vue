<template>
  <div class="center breadcrumb-align-demo">
    <s-breadcrumb align="left" :items="items" />
    <s-breadcrumb align="center" :items="items" />
    <s-breadcrumb align="right" :items="items" />
  </div>
</template>

<script setup lang="ts">
const items = [
  { title: '工作台', url: 'dashboard' },
  { title: '一级页面', url: 'link-1' },
  { title: '不可用页面', disabled: true },
  { title: '当前位置', active: true },
]
</script>

<style scoped lang="scss">
.breadcrumb-align-demo {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
