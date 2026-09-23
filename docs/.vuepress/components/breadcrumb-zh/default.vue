<template>
  <s-breadcrumb :items="items" />
</template>

<script setup lang="ts">
const items = [
  { title: '工作台', url: 'dashboard' },
  { title: '一级页面', url: 'link-1' },
  { title: '不可用页面', disabled: true },
  { title: '当前位置', active: true },
]
</script>
